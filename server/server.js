const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const mysql = require("mysql");

const app = express();
const host = 'localhost';
const port = 8123;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'rootroot',
    database: 'db_ebiblio'
});


app.use(cookieParser());
app.use(express.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Origin, Cache-Control, X-Requested-With, Set-Cookie");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.listen(port, () => {
    console.log(`Ebiblio app listening at http://${host}:${port}`)
});

app.get('/libraries', (req, res) => {
    connection.query('CALL VisualBiblioteche();', (err, rows) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        return res.status(200).send({ result: rows[0] });
    });
})

app.get('/library/:id', (req, res) => {
    connection.query(`CALL VisualBiblioteca("${req.params.id}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows[0][0] });
    });
})

app.get('/library/gallery/:id', (req, res) => {
    connection.query(`SELECT * FROM FOTO WHERE (NomeBib="${req.params.id}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows });
    });
})

app.get('/library/phones/:id', (req, res) => {
    connection.query(`SELECT NumTel FROM TELEFONO WHERE (NomeBiblioteca="${req.params.id}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows });
    });
})

app.get('/logout', function (req, res) {
    res.clearCookie("ebiblio_email");
    res.clearCookie("ebiblio_userType");
    return res.status(200).send({ result: "Done" });
});

app.get('/library/:id/books', function (req, res) {
    connection.query(`SELECT * FROM LIBRO JOIN CARTACEO ON (LIBRO.Codice = CARTACEO.Codice) WHERE Biblioteca="${req.params.id}";`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows });
    });
});

app.get('/library/:id/ebooks', function (req, res) {
    connection.query(`CALL VisualEbookBib("${req.params.id}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows[0] });
    });
});

app.get('/ebook/:id', function (req, res) {
    connection.query(`CALL VisualEbook("${req.params.id}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows[0] });
    });
});

app.get('/book/:id', function (req, res) {
    connection.query(`SELECT * FROM LIBRO JOIN CARTACEO ON (LIBRO.Codice = CARTACEO.Codice) WHERE LIBRO.Codice="${req.params.id}";`, (err, rows) => {
        console.error(err)
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows });
    });
});

app.get('/library/perks/:id', (req, res) => {
    connection.query(`SELECT * FROM POSTI_LETTURA WHERE NomeBiblioteca="${req.params.id}";`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows });
    });
});

app.get('/bookings', (req, res) => {
    connection.query(`call VisualPrenotazioniCartei();`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows[0] });
    });
});

app.post('/signup', (req, res) => {
    const { mail, psw, SessoUt, NomeUt, CognomeUt, TelUt, DataNascitaUt, LuogoNascitaUt, ProfessioneUt, TrasportoUt, type } = req.body;
    var query = `CALL RegistrazioneUtente("${mail}", "${psw}", "${SessoUt}", "${NomeUt}", "${CognomeUt}", "${TelUt}", "${DataNascitaUt}", "${LuogoNascitaUt}", "${ProfessioneUt}");`
    if (type === 'volunteer') {
        query = `CALL RegistrazioneVolontario("${mail}", "${psw}", "${NomeUt}", "${CognomeUt}", "${TelUt}", "${DataNascitaUt}", "${LuogoNascitaUt}", "${TrasportoUt}");`
    }
    connection.query(query, (err, rows) => {
        if (err && err.code === 'ER_DUP_ENTRY')
            return res.status(409).send({ error: "Email already exist" });
        else if (err)
            return res.status(500).send({ error: err.message });

        return res.status(200).send({ result: "Signup successful" });
    });
});

app.post('/login', (req, res) => {
    const { tipo, mail, psw } = req.body;
    connection.query(`CALL Autenticazione("${tipo}", "${mail}", "${psw}");`, (err, rows) => {
        console.error(rows)
        if (err)
            return res.status(500).send({ error: err });
        else if (!rows[0][0])
            return res.status(406).send({ error: "wrong user" });

        const hour = 3600000;
        res.cookie('ebiblio_email', mail, { maxAge: hour * 24, httpOnly: false, encode: String });
        res.cookie('ebiblio_userType', tipo, { maxAge: hour * 24, httpOnly: false, encode: String });
        return res.status(200).send({ result: rows[0][0] });
    });
});

app.post('/user/booking/book', (req, res) => {
    const { bookId, email } = req.body;
    connection.query(`CALL PrestitoCartaceo("${bookId}", "${email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});

app.get('/bookings/deliver/:id', (req, res) => {
    const { type, note, email } = req.query;
    connection.query(`CALL InsertConsegna(${req.params.id}, "${type}", "${note}", "${email}");`, (err, rows) => {
        console.error("ERR: ", err);
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});

app.get('/library/:id/seats', (req, res) => {
    const { date, startTime, endTime } = req.query;
    connection.query(`CALL PostiDisponibili("${startTime}", "${endTime}", "${req.params.id}", "${date}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows[0] });
    });
});

app.get('/library/:id/seatsList', (req, res) => {
    connection.query(`CALL VisualPrenotazioniPosti("${req.params.id}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows[0] });
    });
});


app.post('/library/:id/seat/:seatId/book', (req, res) => {
    const { date, startTime, endTime, email } = req.body;
    connection.query(`CALL PrenotazionePosto("${date}", "${startTime}", "${endTime}", "${req.params.seatId}", "${req.params.id}", "${email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});

app.post('/library/:id/books/:bookId/modify', (req, res) => {
    const { title, year, edition, lendStatus, pages, shelf, conservationStatus, dimension, nAccess, link, genre, authors } = req.body;
    connection.query(`CALL UpdateLibro("${req.params.bookId}", "${req.params.id}", "${title || ""}", ${year || 0}, "${edition || ""}", "${genre || ""}","${lendStatus || ""}", ${pages || 0}, ${shelf || 0}, "${conservationStatus || ""}", "${dimension || ""}", ${nAccess || 0}, "${link || ""}", "${authors}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});

app.post('/library/:id/books/:bookId/delete', (req, res) => {
    connection.query(`CALL DeleteLibro("${req.params.bookId}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});

app.post('/library/:id/books/add', (req, res) => {
    const { title, year, edition, type, lendStatus, pages, shelf, conservationStatus, dimension, link, genre, authors } = req.body;
    console.log(req.body);
    connection.query(`CALL InsertLibro("${title}", ${year}, "${edition}", "${req.params.id}", "${genre}", ${type}, "${lendStatus}", ${pages || 0}, ${shelf}, "${conservationStatus}", "${dimension}", "${link}", "${authors}");`, (err, rows) => {
        console.error(err);
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});


app.post('/user/:email/message', (req, res) => {
    const { title, text, adminEmail } = req.body;
    connection.query(`CALL InsertMessaggio("${title}", "${text}", "${adminEmail}", "${req.params.email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});

app.post('/user/:email/flag', (req, res) => {
    const { text, adminEmail } = req.body;
    connection.query(`CALL InsertSegnalazione("${text}", "${adminEmail}", "${req.params.email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});

app.post('/user/:email/approve', (req, res) => {
    connection.query(`CALL AssoluzioneUtente("${req.params.email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: "Done" });
    });
});

app.get('/user/:email/seats', (req, res) => {
    connection.query(`CALL VisualPostiUt("${req.params.email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows[0] });
    });
});

app.get('/user/:email/delivered', (req, res) => {
    connection.query(`CALL VisualConsegne("${req.params.email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows[0] });
    });
});

app.get('/user/:email/lended', (req, res) => {
    connection.query(`CALL PrestitiUtente("${req.params.email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows[0] });
    });
});

app.get('/admin/:email/getLibrary', (req, res) => {
    connection.query(`CALL BibliotecaAmministratore("${req.params.email}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows[0] });
    });
});

app.get('/book/:id/getAuthors', (req, res) => {
    connection.query(`CALL VisualAutori("${req.params.id}");`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows[0] });
    });
});

app.get('/user/:id/getMessages', (req, res) => {
    connection.query(`SELECT * FROM MESSAGGIO WHERE EmailUti = "${req.params.id}";`, (err, rows) => {
        console.error(err)
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows });
    });
});

app.get('/user/:id/getFlags', (req, res) => {
    connection.query(`SELECT * FROM SEGNALAZIONE WHERE EmailUti = "${req.params.id}";`, (err, rows) => {
        if (err)
            return res.status(500).send({ error: err.message });
        return res.status(200).send({ result: rows });
    });
});


