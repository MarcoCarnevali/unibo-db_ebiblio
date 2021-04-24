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

app.get('/getBiblios', (req, res) => {
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
        console.error(err)
        console.log(rows)
        if (err)
            return res.status(500).send({ error: err });
        return res.status(200).send({ result: rows });
    });
})

app.get('/logout', function (req, res) {
    res.clearCookie("ebiblio_email");
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
    connection.query(`SELECT * FROM LIBRO JOIN EBOOK ON (LIBRO.Codice = EBOOK.Codice) WHERE Biblioteca="${req.params.id}";`, (err, rows) => {
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
            return res.status(500).send({ error: err });

        return res.status(200).send({ result: "Signup successful" });
    });
});

app.post('/login', (req, res) => {
    const { tipo, mail, psw } = req.body;
    connection.query(`CALL Autenticazione("${tipo}", "${mail}", "${psw}", @a);`, (err, rows) => {

        if (err)
            return res.status(500).send({ error: err });
        else if (!rows[0][0]) 
            return res.status(406).send({ error: "wrong user"});
        
        res.cookie('ebiblio_email', mail, { maxAge: 900000, httpOnly: false });
        return res.status(200).send({ result: rows[0][0] });
    });
});

app.post('/user/booking/book', (req, res) => {
    const { bookId, email } = req.body;
    connection.query(`CALL PrestitoCartaceo("${bookId}", "${email}");`, (err, rows) => {
        console.error(err);
        if (err)
            return res.status(500).send({ error: err.mesasge });
        return res.status(200).send({ result: "Done" });
    });
});