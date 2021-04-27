DROP DATABASE IF EXISTS db_ebiblio;
CREATE DATABASE IF NOT EXISTS db_ebiblio;

#DDL: COSTRUZIONE TABELLE
USE db_ebiblio;
create table BIBLIOTECA(
Nome varchar(40) PRIMARY KEY,
Indirizzo varchar(50) NOT NULL,
Email varchar(40) UNIQUE,
Sito varchar(40) UNIQUE,
NoteStoriche varchar(300),
Lat float(11,7) NOT NULL,
Lon float(11,7) NOT NULL 
) ENGINE=InnoDB; 
create table TELEFONO(
NumTel varchar(15),
NomeBiblioteca varchar(40),
PRIMARY KEY(NumTel, NomeBiblioteca),
FOREIGN KEY (NomeBiblioteca) REFERENCES BIBLIOTECA(Nome)
								ON DELETE CASCADE
                                ON UPDATE CASCADE
) ENGINE=InnoDB;
create table FOTO(
NomeFoto varchar(40),
NomeBib varchar(40),
PRIMARY KEY(NomeFoto, NomeBib),
FOREIGN KEY (NomeBib) REFERENCES BIBLIOTECA(Nome)
								ON DELETE CASCADE
                                ON UPDATE CASCADE
) ENGINE=InnoDB;
create table LIBRO(
Codice int AUTO_INCREMENT PRIMARY KEY,
Titolo varchar(50),
Anno smallint,
Edizione varchar(30),
Biblioteca varchar(40),
Genere varchar(30),
FOREIGN KEY (Biblioteca) REFERENCES BIBLIOTECA(Nome)
							ON DELETE CASCADE
							ON UPDATE CASCADE
) ENGINE=InnoDB;
create table CARTACEO(
Codice int PRIMARY KEY,
StatoPrestito varchar(11) CHECK(StatoPrestito="Disponibile" OR StatoPrestito="Prenotato" OR StatoPrestito="Consegnato"),
Pagine smallint,
Scaffale smallint,
StatoConservazione varchar(9) CHECK(StatoConservazione="Ottimo" OR StatoConservazione="Buono" OR StatoConservazione="Non Buono" OR StatoConservazione="Scadente"),
FOREIGN KEY (Codice) REFERENCES LIBRO(Codice)
							ON DELETE CASCADE
							ON UPDATE CASCADE
) ENGINE=InnoDB;
create table EBOOK(
Codice int PRIMARY KEY ,
Dimensione varchar(10),
NumeroAccessi int DEFAULT 0,
Link varchar(2100),
FOREIGN KEY (Codice) REFERENCES LIBRO(Codice)
						ON DELETE CASCADE
						ON UPDATE CASCADE
) ENGINE=InnoDB;
create table AUTORE(
CodAutore int AUTO_INCREMENT PRIMARY KEY,
Nome varchar(20) NOT NULL,
Cognome varchar(30) NOT NULL
) ENGINE=InnoDB;
create table AMMINISTRATORE(
Email varchar(30) PRIMARY KEY,
Pass varchar(20) NOT NULL,
Nome varchar(20), 
Cognome varchar(30),
Tel varchar(15),
DataNascita date,
LuogoNascita varchar(20),
Qualifica varchar(10),
Responsabile varchar(40),
FOREIGN KEY (Responsabile) REFERENCES BIBLIOTECA(Nome)
								ON DELETE CASCADE
								ON UPDATE CASCADE
) ENGINE=InnoDB;
create table UTILIZZATORE(
Email varchar(30) PRIMARY KEY,
Pass varchar(20) NOT NULL,
Sesso char(1) CHECK(Sesso="M" OR Sesso="F"),
Nome varchar(20), 
Cognome varchar(30),
Tel varchar(15),
DataNascita date,
LuogoNascita varchar(20),
StatoAccount varchar(7) DEFAULT "Attivo"  CHECK(StatoAccount="Attivo" OR StatoAccount="Sospeso"), 
DataCreazioneAccount date,
Professione varchar(20)
) ENGINE=InnoDB;
create table VOLONTARIO(
Email varchar(30) PRIMARY KEY,
Pass varchar(20) NOT NULL,
Nome varchar(20), 
Cognome varchar(30),
Tel varchar(15),
DataNascita date,
LuogoNascita varchar(20),
Trasporto varchar(15)
) ENGINE=InnoDB;
create table LISTA_AUTORI(
CodiceAutore int,
CodiceLibro int,
FOREIGN KEY (CodiceAutore) REFERENCES AUTORE(CodAutore)
								ON DELETE CASCADE
								ON UPDATE CASCADE,
FOREIGN KEY (CodiceLibro) REFERENCES LIBRO(Codice)
								ON DELETE CASCADE
								ON UPDATE CASCADE,
PRIMARY KEY(CodiceAutore, CodiceLibro)
) ENGINE=InnoDB;
create table STORICO_EBOOK(
CodEbook int,
EmailUtente varchar(30),
Giorno date NOT NULL, 
Ora time NOT NULL,
PRIMARY KEY(CodEbook, EmailUtente, Giorno, Ora),
FOREIGN KEY (CodEbook) REFERENCES EBOOK(Codice)
							ON DELETE CASCADE
							ON UPDATE CASCADE,
FOREIGN KEY (EmailUtente) REFERENCES UTILIZZATORE(Email)
								ON DELETE CASCADE
								ON UPDATE CASCADE
) ENGINE=InnoDB;
create table POSTI_LETTURA(
Num int NOT NULL,
NomeBiblioteca varchar(40),
Presa boolean,
Ethernet boolean,
PRIMARY KEY(Num, NomeBiblioteca),
FOREIGN KEY (NomeBiblioteca) REFERENCES BIBLIOTECA(Nome)
								ON DELETE CASCADE
								ON UPDATE CASCADE
) ENGINE=InnoDB;
create table PRESTITO(
Cod int AUTO_INCREMENT PRIMARY KEY,
DataAvvio date,
DataFine date,
CodLibro int,
EmailUtilizzatore varchar(30),
FOREIGN KEY (CodLibro) REFERENCES CARTACEO(Codice)
							ON DELETE CASCADE
							ON UPDATE CASCADE,
FOREIGN KEY (EmailUtilizzatore) REFERENCES UTILIZZATORE(Email)
								ON DELETE CASCADE
								ON UPDATE CASCADE
) ENGINE=InnoDB;
create table CONSEGNA(
CodPrestito int,
Tipo varchar(12) CHECK(Tipo="Restituzione" OR Tipo="Affidamento"),
Note varchar(200),
Giorno date NOT NULL,
EmailVol varchar(30),
PRIMARY KEY(CodPrestito, Tipo),
FOREIGN KEY (CodPrestito) REFERENCES PRESTITO(Cod)
								ON DELETE CASCADE
								ON UPDATE CASCADE,
FOREIGN KEY (EmailVol) REFERENCES VOLONTARIO(Email)
								ON DELETE CASCADE
								ON UPDATE CASCADE
) ENGINE=InnoDB;
create table PRENOTAZIONE(
IdPren int AUTO_INCREMENT PRIMARY KEY,
Giorno date,
OraInizio time,
OraFine time,
NumPosto int,
Biblioteca varchar(40),
EmailUtilizzatore varchar(30),
FOREIGN KEY (NumPosto) REFERENCES POSTI_LETTURA(Num)
								ON DELETE CASCADE
								ON UPDATE CASCADE,
FOREIGN KEY (Biblioteca) REFERENCES BIBLIOTECA(Nome)
								ON DELETE CASCADE
								ON UPDATE CASCADE,
FOREIGN KEY (EmailUtilizzatore) REFERENCES UTILIZZATORE(Email)
								ON DELETE CASCADE
								ON UPDATE CASCADE
) ENGINE=InnoDB;
create table MESSAGGIO(
IdMess int AUTO_INCREMENT PRIMARY KEY,
Giorno date,
Testo varchar(300),
Titolo varchar(30),
EmailAmm varchar(30),
EmailUti varchar(30),
FOREIGN KEY (EmailAmm) REFERENCES AMMINISTRATORE(Email)
								ON DELETE CASCADE
								ON UPDATE CASCADE,
FOREIGN KEY (EmailUti) REFERENCES UTILIZZATORE(Email)
							ON DELETE CASCADE
							ON UPDATE CASCADE
) ENGINE=InnoDB;
create table SEGNALAZIONE(
IdSegn int AUTO_INCREMENT PRIMARY KEY,
Giorno date,
Testo varchar(300),
EmailAmm varchar(30),
EmailUti varchar(30),
FOREIGN KEY (EmailAmm) REFERENCES AMMINISTRATORE(Email)
								ON DELETE CASCADE
								ON UPDATE CASCADE,
FOREIGN KEY (EmailUti) REFERENCES UTILIZZATORE(Email)
							ON DELETE CASCADE
							ON UPDATE CASCADE
) ENGINE=InnoDB;


#POPOLAMENTO DB
INSERT INTO BIBLIOTECA(Nome, Indirizzo, Email, Sito, NoteStoriche, Lat, Lon)
VALUES  ("Biblioteca Universitaria","Via Zamboni 33","bub.info@unibo.it","www.bub.unibo.it","Nel 1742 questo primo nucleo della Biblioteca si arricchì di manoscritti e opere a stampa","44.496952311102845","11.352406741622467"),
		("Biblioteca Nicola Matteucci","Strada Maggiore 45","sps.bibliotecamatteucci@unibo.it","https://dsps.unibo.it/it/biblioteca","Il primissimo nucleo bibliografico dell’attuale biblioteca viene costituito con la nascita nel 1964 della Facoltà di Scienze Politiche che vede tra i suoi fondatori il politologo Nicola Matteucci.","44.49152049033292","11.354048728911785"),
		("Biblioteca Giurica Antonio Cicu","Via Zamboni 27","abis.bibliotecacicu@unibo.it","http://giuridica.sba.unibo.it/","La biblioteca della SP.I.S.A. fu voluta dal Professor Fabio Roversi Monaco (Rettore dell’Università di Bologna dal 1985 al 2000 e attualmente Rettore Emerito).","44.49676694031628","11.351733584733914"),
        ("Biblioteca economica Walter Bigiavi","Via delle Belle Arti 33","info.bigiavi@unibo.it","http://bigiavi.sba.unibo.it/","La Biblioteca di Discipline economico-aziendali “Walter Bigiavi” nasce dall’unione della Biblioteca di Discipline economiche “Walter Bigiavi” con le biblioteche dei dipartimenti di Scienze aziendali e di Scienze economiche,","44.49790902645268","11.35191257124072"),
        ("Biblioteca di discipline umanistiche","Via Zamboni 36","bdu.lettere@unibo.it","http://bdu.sba.unibo.it/","La Biblioteca di Discipline Umanistiche nasce nel 1926 come biblioteca di Facoltà di Lettere e Filosofia da un primo nucleo di pubblicazioni donate da Giovanni Pascoli nel 1909 e contenente anche opere di Giosuè Carducci.","44.496876287221966","11.351636955898286");
        
INSERT INTO TELEFONO (NomeBiblioteca, NumTel)
VALUES  ("Biblioteca Universitaria","0512088300"),
        ("Biblioteca Universitaria","0512088385"),
        ("Biblioteca Nicola Matteucci","0512092532"),
        ("Biblioteca Nicola Matteucci","0512092533"),
        ("Biblioteca Nicola Matteucci","0512092534"),
        ("Biblioteca Giurica Antonio Cicu","0512099626"),
        ("Biblioteca Giurica Antonio Cicu","0512099629"),
        ("Biblioteca Giurica Antonio Cicu","0512086037"),
        ("Biblioteca economica Walter Bigiavi","0512098280"),
        ("Biblioteca economica Walter Bigiavi","0512098285"),
        ("Biblioteca di discipline umanistiche","0512098310");

INSERT INTO FOTO (NomeFoto, NomeBib)
VALUES  ("universitaria1.jpeg","Biblioteca Universitaria"),
		("universitaria2.jpeg","Biblioteca Universitaria"),
		("universitaria3.jpeg","Biblioteca Universitaria"),
		("universitaria4.jpeg","Biblioteca Universitaria"),
        ("matteucci1.jpeg","Biblioteca Nicola Matteucci"),
        ("matteucci2.jpeg","Biblioteca Nicola Matteucci"),
        ("matteucci3.jpeg","Biblioteca Nicola Matteucci"),
        ("matteucci4.jpeg","Biblioteca Nicola Matteucci"),
        ("cicu1.jpeg","Biblioteca Giurica Antonio Cicu"),
        ("cicu2.jpeg","Biblioteca Giurica Antonio Cicu"),
        ("cicu3.jpeg","Biblioteca Giurica Antonio Cicu"),
        ("cicu4.jpeg","Biblioteca Giurica Antonio Cicu"),
        ("bigiavi1.jpeg","Biblioteca economica Walter Bigiavi"),
        ("bigiavi2.jpeg","Biblioteca economica Walter Bigiavi"),
        ("bigiavi3.jpeg","Biblioteca economica Walter Bigiavi"),
        ("bigiavi4.jpeg","Biblioteca economica Walter Bigiavi"),
        ("umanistiche1.jpeg","Biblioteca di discipline umanistiche"),
        ("umanistiche2.jpeg","Biblioteca di discipline umanistiche"),
        ("umanistiche3.jpeg","Biblioteca di discipline umanistiche"),
        ("umanistiche4.jpeg","Biblioteca di discipline umanistiche");

INSERT INTO UTILIZZATORE (Email, Pass, Sesso,DataNascita ,StatoAccount, Professione)
VALUES  ("gino@gmail.com","1234","M","1985-04-03","Attivo","Studente"),
		("marco@gmail.com","pass1234","M","1967-06-12","Attivo","Professore"),
        ("franco@gmail.com","0001234","M","1985-04-05","Attivo","Studente"),
        ("tiziano@gmail.com","passwordsupersicura","M","1960-05-10","Sospeso","Professore"),
        ("mauro@gmail.com","psw1234","M","1991-03-01","Attivo","Tirocinante"),
        ("vanessa@gmail.com","1234","F","1992-03-02","Attivo","Professore"),
        ("melissa@gmail.com","psw1234","F","1993-03-03","Attivo","Assistente"),
        ("giovanna@gmail.com","pswww1234","F","1994-03-04","Attivo","Assistente"),
        ("carla@gmail.com","sdcsd1234","F","1995-03-05","Attivo","Studente"),
        ("piero@gmail.com","sdfsf1234","M","1996-03-06","Attivo","Studente"),
        ("luigi@gmail.com","cscs1234","M","1997-03-07","Attivo","Studente"),
        ("matteo@gmail.com","cscs1234c","M","1998-03-08","Attivo","Studente"),
        ("michele@gmail.com","cscds1234","M","1999-03-09","Attivo","Studente");

INSERT INTO POSTI_LETTURA(Num, NomeBiblioteca, Presa, Ethernet) 
VALUES	("1","Biblioteca Universitaria",true, false),
		("2","Biblioteca Universitaria",true, false),
        ("3","Biblioteca Universitaria",true, false),
        ("1","Biblioteca Nicola Matteucci",true, false),
		("2","Biblioteca Nicola Matteucci",true, false),
        ("3","Biblioteca Nicola Matteucci",true, false),
        ("1","Biblioteca Giurica Antonio Cicu",true, false),
		("2","Biblioteca Giurica Antonio Cicu",true, false),
        ("3","Biblioteca Giurica Antonio Cicu",true, false),
        ("1","Biblioteca economica Walter Bigiavi",true, false),
		("2","Biblioteca economica Walter Bigiavi",true, false),
        ("3","Biblioteca economica Walter Bigiavi",true, false),
        ("1","Biblioteca di discipline umanistiche",true, false),
		("2","Biblioteca di discipline umanistiche",true, false),
        ("3","Biblioteca di discipline umanistiche",true, false);

INSERT INTO LIBRO(Titolo, Anno, Edizione, Biblioteca, Genere) 
VALUES	("Divina Commedia-Completo","1814","Originale","Biblioteca Universitaria", "Classico"),
		("Divina Commedia-Paradiso","2015","Petrini","Biblioteca Universitaria", "Classico"),
        ("Divina Commedia-Inferno","2015","Petrini","Biblioteca Universitaria", "Classico"),
        ("Divina Commedia-Purgatorio","2015","Petrini","Biblioteca Universitaria", "Classico"),
        ("Il deserto dei tartari","1940","RCS","Biblioteca Universitaria", "Romanzo"),
        ("Il deserto dei tartari","2012","Feltrinelli","Biblioteca Nicola Matteucci", "Romanzo"),
        ("Il nome della Rosa","1980","Bompiani","Biblioteca Nicola Matteucci", "Romanzo"),
        ("Il nome della Rosa","2002","Repubblica","Biblioteca Nicola Matteucci", "Romanzo"),
        ("Prima Lezione di diritto","2006","Laterza","Biblioteca Giurica Antonio Cicu", "Diritto"),
        ("Fondamenti della scienza giuridica","2005","Giappichelli","Biblioteca Giurica Antonio Cicu", "Diritto"),
        ("Argomenti di teoria del diritto","2016","Faralli","Biblioteca Giurica Antonio Cicu", "Diritto"),
        ("Elogio del diritto","2019","Nave di Teseo","Biblioteca Giurica Antonio Cicu", "Diritto"),
        ("Il mistero del processo","1994","Adelphi","Biblioteca Giurica Antonio Cicu", "Diritto"),
        ("Sistemi giuridici comparati","1996","Utet","Biblioteca Giurica Antonio Cicu", "Diritto"),
        ("Il metodo Warren Buffet","1994","Hoepli","Biblioteca economica Walter Bigiavi", "Economico"),
        ("Microeconomia","2014","Piras","Biblioteca economica Walter Bigiavi", "Economico"),
        ("Macroeconomia","2010","Il Mulino","Biblioteca economica Walter Bigiavi", "Economico"),
        ("Pachidermi e pappagalli","2019","Feltinelli","Biblioteca economica Walter Bigiavi", "Economico"),
        ("Storia economica","2006","Franco Angeli","Biblioteca economica Walter Bigiavi", "Economico"),
        ("Corso di economia aziendale","2005","Il  Mulino","Biblioteca economica Walter Bigiavi", "Economico"),
        ("L'alchimista","2017","La nave di Teseo","Biblioteca di discipline umanistiche", "Romanzo"),
        ("Manifesto della psicologia","2012","Mastopaolo","Biblioteca di discipline umanistiche", "Psicologia"),
        ("Nella quiete e nella gratitudine","2007","Accademia Edizioni","Biblioteca di discipline umanistiche", "Romanzo"),
        ("Il mito del denaro","2009","Magi","Biblioteca di discipline umanistiche", "Economico"),
        ("Tutto è relazione","2019","Crisalide","Biblioteca di discipline umanistiche", "Psicologia");
        
INSERT INTO AUTORE(Nome, Cognome)
VALUES  ("Dante","Alighieri"),    
		("Dino","Buzzati"),
        ("Umberto","Eco"),   
        ("Paolo","Grossi"),   
        ("Luigi","Garofalo"),   
        ("Carla","Faralli"),
        ("Massimo","Cacciari"),   
        ("Natalino","Irti"),
        ("Salvatore","Satta"),
        ("Antonio","Gambaro"),
        ("Rodolfo","Sacco"),
        ("Robert","Hagstrom"),
        ("Frank","Robert"),
        ("Edward","Cartwright"),
        ("Romano","Piras"),
        ("Oliver","Blanchard"),
        ("Carlo","Cottarelli"),
        ("Ennio","De Simone"),
        ("Giuseppe","Airoldi"),
        ("Giorgio","Brunetti"),
        ("Vittorio","Coda"),
        ("Paulo","Coelho"),
        ("Mario","Mastropaolo"),
        ("Hellinger","Bert"),
        ("Claudio","Widmann"),
        ("Fabrizio","Rossi");

INSERT INTO LISTA_AUTORI(CodiceAutore, CodiceLibro)
VALUES  ("1","1"),    
		("1","2"),
        ("1","3"),   
        ("1","4"),   
        ("2","5"),   
        ("2","6"),
        ("3","7"),   
        ("3","8"),
        ("4","9"),
        ("5","10"),
        ("6","11"),
        ("7","12"),
        ("8","12"),
        ("9","13"),
        ("10","14"),
        ("11","14"),
        ("12","15"),
        ("13","16"),
        ("14","16"),
        ("15","16"),
        ("16","17"),
        ("17","18"),
        ("18","19"),
        ("19","20"),
        ("20","20"),
        ("21","20"),
        ("22","21"),
        ("23","22"),
        ("24","23"),
        ("25","24"),
        ("26","25");


INSERT INTO CARTACEO(Codice,StatoPrestito, Pagine, Scaffale, StatoConservazione) 
VALUES	("1","Consegnato","1500","15","Non Buono"),
		("2","Consegnato","190","5","Buono"),
		("6","Consegnato","100","6","Ottimo"),
		("8","Disponibile","300","7","Scadente"),
		("9","Disponibile","300","7","Ottimo"),
        ("10","Consegnato","300","7","Ottimo"),
		("13","Prenotato","300","7","Ottimo"),
        ("15","Prenotato","1000","7","Ottimo"),
        ("16","Disponibile","800","7","Scadente"),
        ("19","Disponibile","550","7","Non Buono"),
        ("22","Disponibile","1200","7","Ottimo"),
        ("23","Disponibile","300","7","Scadente"),
		("24","Disponibile","600","7","Ottimo");

INSERT INTO EBOOK(Codice, Dimensione, NumeroAccessi ,Link)
VALUES  ("3","54MB","0","WWW.GOOGLESCHOLAR.IT"),
		("4","5MB","23","www.librionline.it"),
        ("5","10MB","4","www.librionline.it"),
        ("7","300MB","4","www.librionline.it"),
        ("11","200MB","2","www.onlinebooks.com"),
        ("12","500MB","1","WWW.GOOGLESCHOLAR.IT"),
        ("14","50KB","0","www.onlinebooks.com"),
        ("17","25MB","0","www.librionline.it"),
        ("18","700MB","0","WWW.GOOGLESCHOLAR.IT"),
        ("20","100MB","43","WWW.GOOGLESCHOLAR.IT"),
        ("21","2MB","27","www.librionline.it"),
		("25","540MB","0","www.onlinebooks.com");
		
        
INSERT INTO VOLONTARIO(Email, Pass, Nome, Cognome, Tel, DataNascita, LuogoNascita, Trasporto)
VALUES  ("tiziano@me.it","aaaaa","Tiziano","Bruno","32323342","1998-01-01","Palermo","bici"),
		("fabio@me.it","aaaaa","Fabio","Cigna","31232345","2000-01-01","Ferrara","bus"),
        ("pippo@me.it","aaaaa","Pippo","Baudo","322622616","1968-01-02","Milano","auto");

INSERT INTO PRESTITO(DataAvvio, DataFine, CodLibro, EmailUtilizzatore)
VALUES  ("2021-01-01","2021-05-01","2","gino@gmail.com"),
		("2021-01-01","2021-03-01","6","marco@gmail.com"),
        ("2021-01-02","2021-04-01","1","gino@gmail.com"),
        ("2021-01-02","2021-04-01","10","franco@gmail.com"),
        ("2021-04-02","2021-04-17","15","tiziano@gmail.com"),
		("2021-05-02","2021-05-17","13","franco@gmail.com");

INSERT INTO CONSEGNA(CodPrestito, Tipo, Note, Giorno, EmailVol)
VALUES  ("1","Affidamento","werervrev","2021-01-01","tiziano@me.it"),
		("2","Affidamento","verervre","2021-02-01","fabio@me.it"),
        ("3","Affidamento","xxxxxxxxxxxxxxxx","2021-02-25","pippo@me.it"),
        ("4","Affidamento","xxxxxxxxxxxxxxxx","2021-03-08","pippo@me.it");

INSERT INTO PRENOTAZIONE(Giorno, OraInizio, OraFine, NumPosto, Biblioteca, EmailUtilizzatore) 
VALUES  ("2021-03-09","09:00","11:00","1","Biblioteca Universitaria","gino@gmail.com"),
		("2021-03-09","11:00","12:00","1","Biblioteca Universitaria","marco@gmail.com"),
		("2021-03-08","12:00","15:00","2","Biblioteca Universitaria","franco@gmail.com"),
		("2021-03-08","17:00","19:00","2","Biblioteca Universitaria","tiziano@gmail.com"),
		("2021-02-20","09:00","13:00","1","Biblioteca Nicola Matteucci","marco@gmail.com"),
        ("2021-02-21","09:00","13:00","2","Biblioteca Nicola Matteucci","gino@gmail.com"),
        ("2021-02-21","14:00","18:00","2","Biblioteca Nicola Matteucci","gino@gmail.com"),
        ("2021-02-21","10:00","14:00","1","Biblioteca Giurica Antonio Cicu","franco@gmail.com"),
        ("2021-01-05","10:00","15:00","2","Biblioteca Giurica Antonio Cicu","tiziano@gmail.com"),
        ("2021-01-08","13:00","16:00","1","Biblioteca economica Walter Bigiavi","mauro@gmail.com"),
        ("2021-01-08","13:00","16:00","3","Biblioteca economica Walter Bigiavi","tiziano@gmail.com"),
        ("2021-01-26","13:00","20:00","2","Biblioteca economica Walter Bigiavi","gino@gmail.com"),
        ("2021-01-08","13:00","20:00","1","Biblioteca di discipline umanistiche","marco@gmail.com"),
        ("2021-01-18","15:00","19:00","2","Biblioteca di discipline umanistiche","tiziano@gmail.com");

INSERT INTO AMMINISTRATORE(Email, Pass, Nome, Cognome, Tel, DataNascita, LuogoNascita, Qualifica, Responsabile)
VALUES  ("alice@gmail.com","pass123","Alice","Fumagalli","3334541216","1960-03-02","Milano","Stagista","Biblioteca Universitaria"),
		("francesca@gmail.com","pswrd","Francesca","Di Bella","328659654","1980-05-23","Napoli","Sistemista","Biblioteca Nicola Matteucci"),
		("luca@gmail.com","password","Luca","Bruno","3904567589","1995-08-03","Carpi","Direttore","Biblioteca Giurica Antonio Cicu"),
		("mario@gmail.com","03081998","Mario","Rossi","3293842987","1997-05-30","Roma","Sistemisa","Biblioteca economica Walter Bigiavi"),
        ("elvira@gmail.com","123456789","Elvira","Morello","1978-10-26","1966-03-05","Palermo","Sistemista","Biblioteca di discipline umanistiche");


#OPERAZIONI SUI DATI (da implementare attraverso stored procedure)
##TUTTI GLI UTENTI
# Autenticazione alla piattaforma
# Tipo 0 = Utilizzatore,			Tipo 1 = Volontario
DELIMITER $$
CREATE PROCEDURE Autenticazione(IN tipo bool,  IN mail varchar(30), IN psw varchar(20))
BEGIN
	IF (tipo=0) THEN 
		SELECT StatoAccount as Stato
		FROM UTILIZZATORE
		WHERE (Email=mail AND Pass=psw);
    ELSEIF (tipo=1) THEN 
		SELECT *
        FROM VOLONTARIO
        WHERE (Email=mail AND Pass=psw);
	ELSE 
		SELECT *
        FROM AMMINISTRATORE
        WHERE (Email=mail AND Pass=psw);
    END IF;
END $$
DELIMITER ;

# Visualizzazioni biblioteche presenti
DELIMITER $$
CREATE PROCEDURE VisualBiblioteche()
BEGIN
	SELECT Nome, Indirizzo, NomeFoto
	FROM BIBLIOTECA JOIN FOTO ON (Nome=NomeBib)
	WHERE NomeFoto LIKE "%1.jpeg";
END $$
DELIMITER ;

# Visualizzazioni foto biblioteca
DELIMITER $$
CREATE PROCEDURE FotoBib(IN BibliotecaScelta varchar(40))
BEGIN
	SELECT NomeFoto
	FROM FOTO
	WHERE NomeBib = BibliotecaScelta;
END $$
DELIMITER ;

# Visualizzazione biblioteca
DELIMITER $$
CREATE PROCEDURE VisualBiblioteca(IN NomeBiblioteca varchar(40))
BEGIN
	SELECT *
    FROM BIBLIOTECA
    WHERE Nome=NomeBiblioteca;
END $$
DELIMITER ;


# Visualizzazione dei posti lettura presenti in ogni biblioteca
DELIMITER $$
CREATE PROCEDURE VisualPosti()
BEGIN
	SELECT * FROM POSTI_LETTURA;
END $$
DELIMITER ; 

# Visualizzazione dei libri disponibili in tutte le biblioteche
DELIMITER $$
CREATE PROCEDURE VisualLibri()
BEGIN
	SELECT * FROM LIBRO;
END $$
DELIMITER ;

#Visualizzazione dei cartacei di una biblioteca
DELIMITER $$
CREATE PROCEDURE VisualCartaceiBib(in BibliotecaScelta varchar(40))
BEGIN
	SELECT CARTACEO.Codice, Titolo, Anno, Edizione, Genere,StatoPrestito, Pagine, Scaffale, StatoConservazione
	FROM CARTACEO JOIN LIBRO ON (CARTACEO.Codice=LIBRO.Codice)
	WHERE Biblioteca = BibliotecaScelta;
END $$
DELIMITER;


#Visualizzazione degli ebook di una biblioteca
DELIMITER $$
CREATE PROCEDURE VisualEbookBib(in BibliotecaScelta varchar(40))
BEGIN
	SELECT EBOOK.Codice, Titolo, Anno, Edizione, Genere, Dimensione, NumeroAccessi, Link
	FROM EBOOK JOIN LIBRO ON (EBOOK.Codice=LIBRO.Codice)
	WHERE Biblioteca = BibliotecaScelta;
END $$
DELIMITER;

#Visual Autori per titolo
DELIMITER $$
CREATE PROCEDURE VisualAutori (IN Codice INT)
BEGIN
	SELECT * FROM AUTORE WHERE CodAutore IN
    (SELECT CodiceAutore FROM LISTA_AUTORI WHERE CodiceLibro=Codice);
END $$
DELIMITER;


# Visualizzazione scheda di un E-BOOK	
DELIMITER $$
CREATE PROCEDURE VisualEbook(IN CodiceEbook int)
BEGIN
    UPDATE EBOOK SET NumeroAccessi=NumeroAccessi+1 WHERE (EBOOK.Codice=CodiceEbook);
	
    SELECT EBOOK.Codice, Titolo, Anno, Edizione, Genere ,Biblioteca, Dimensione, NumeroAccessi, Link
    FROM EBOOK JOIN LIBRO ON (EBOOK.Codice=LIBRO.Codice)
    WHERE EBOOK.Codice=CodiceEbook;
    
    SELECT * FROM AUTORE WHERE CodAutore IN
    (SELECT CodiceAutore FROM LISTA_AUTORI WHERE CodiceLibro=CodiceEbook);
END $$
DELIMITER ;

#inserimento dati nello storico ebook
DELIMITER $$
CREATE PROCEDURE StoricoEbook(IN CodiceEbook int, IN EmailUt varchar(30))
BEGIN
SET @GiornoUt = CURDATE();
SET @OraUt = CURTIME();
INSERT INTO STORICO_EBOOK(CodEbook, EmailUtente, Giorno, Ora)
VALUES (CodiceEbook, EmailUt, @GiornoUt, @OraUt);
END $$
DELIMITER ;


# Visualizzazione propri eventi di consegna
CREATE VIEW CONSEGNE_UT(Prestito,Titolo, Tipo, Note, EmailVol, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, StatoPrestito)
AS SELECT  CodPrestito, Titolo, Tipo, Note, EmailVol, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, StatoPrestito
	FROM PRESTITO JOIN CARTACEO ON (PRESTITO.CodLibro=CARTACEO.Codice)
					JOIN CONSEGNA ON (PRESTITO.Cod=CONSEGNA.CodPrestito)
						JOIN LIBRO ON (PRESTITO.CodLibro=LIBRO.Codice);

DELIMITER $$
CREATE PROCEDURE VisualConsegne(IN EmailUt varchar(30))
BEGIN
	SELECT *
	FROM CONSEGNE_UT
	WHERE EmailUtilizzatore = EmailUt;
END $$
DELIMITER ;






##SOLO UTILIZZATORI
# Registrazione alla utente piattaforma
DELIMITER $$
CREATE PROCEDURE RegistrazioneUtente( IN mail varchar(30), IN psw varchar(20),IN SessoUt char(1), IN NomeUt varchar(20), IN CognomeUt varchar(30), IN TelUt varchar(15), IN DataNascitaUt date, IN LuogoNascitaUt varchar(20), IN ProfessioneUt varchar(20))
BEGIN
	SET @DataOdierna=CURDATE(); 
	INSERT INTO UTILIZZATORE (Email, Pass, Sesso ,Nome, Cognome, Tel, DataNascita, LuogoNascita, DataCreazioneAccount, Professione)
    VALUES(mail, psw, SessoUt, NomeUt, CognomeUt, TelUt, DataNascitaUt, LuogoNascitaUt, @DataOdierna, ProfessioneUt);
END $$
DELIMITER ;

#Registrazione volontario alla piattaforma
DELIMITER $$
CREATE PROCEDURE RegistrazioneVolontario( IN mail varchar(30), IN psw varchar(20), IN NomeVol varchar(20), IN CognomeVol varchar(30), IN TelVol varchar(15), IN DataNascitaVol date, IN LuogoNascitaVol varchar(20), IN TrasportoVol varchar(20))
BEGIN
	INSERT INTO VOLONTARIO(Email, Pass, Nome, Cognome, Tel, DataNascita, LuogoNascita, Trasporto)
    VALUES(mail, psw, NomeVol, CognomeVol, TelVol, DataNascitaVol, LuogoNascitaVol, TrasportoVol);
END $$
DELIMITER ;

# Posti lettura disponibli
DELIMITER $$
CREATE PROCEDURE PostiDisponibili(IN Inizio time, IN Fine time, IN Biblio varchar(40), IN GiornoPren date)
BEGIN
	SELECT * 
    FROM POSTI_LETTURA
    WHERE NomeBiblioteca=Biblio AND Num NOT IN 
		(SELECT NumPosto
		FROM PRENOTAZIONE
		WHERE Giorno=GiornoPren AND Biblioteca=Biblio AND ((Inizio BETWEEN OraInizio AND OraFine) OR (Fine BETWEEN OraInizio AND OraFine)));
END $$
DELIMITER ;



# Prenotazione di un posto lettura
DELIMITER $$
CREATE PROCEDURE PrenotazionePosto(IN GiornoPren date, IN InizioPren time, IN FinePren time, IN Num int, IN Biblio varchar(40), IN EmailUt varchar(30))
BEGIN
	INSERT INTO PRENOTAZIONE(NumPosto, Biblioteca, EmailUtilizzatore, Giorno, OraInizio, OraFine)
    VALUES(Num, Biblio, EmailUt, GiornoPren, InizioPren, FinePren);
END $$
DELIMITER ;

#Visualizzazione prenotazioni di posti lettura da parte di un utente
DELIMITER $$
CREATE PROCEDURE VisualPostiUt(IN EmailUti varchar(30))
BEGIN
	SELECT Giorno, OraInizio, OraFine, Num, Biblioteca, Presa, Ethernet 
    FROM PRENOTAZIONE 
    JOIN POSTI_LETTURA AS P ON (NumPosto = P.Num ) AND (Biblioteca = P.NomeBiblioteca)
    WHERE EmailUtilizzatore=EmailUti;
END $$
DELiMITER ;



# Prestito di un libro cartaceo
DELIMITER $$
CREATE PROCEDURE PrestitoCartaceo( IN CodiceLibro int, IN EmailUti varchar(30)) 
BEGIN
	INSERT INTO PRESTITO(CodLibro, EmailUtilizzatore)
	VALUES(CodiceLibro, EmailUti);
    #LO STATO DEL PRESTITO CAMBIA CON UN TRIGGER
    #DATA INIZIO E FINE VENGONO INSERITI DA UN TRIGGER ALL INSERIMENTO DELLA CONSEGNA DEL LIBRO RICHIESTO 
END $$
DELIMITER ;

#TRIGGER PRESTITO CARTACEO
CREATE TRIGGER PrestitoCartaceo
AFTER INSERT ON PRESTITO
FOR EACH ROW 
UPDATE CARTACEO SET StatoPrestito="Prenotato" WHERE (Codice=NEW.CodLibro);



# Visualizzazione delle proprie prenotazioni
CREATE VIEW PRESTITI_UT(Prestito, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, Titolo)
AS SELECT  Cod, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, Titolo 
		FROM PRESTITO JOIN LIBRO ON Cod=Codice;

DELIMITER $$
CREATE PROCEDURE PrestitiUtente(IN EmailUti varchar(30)) 
BEGIN
	SELECT *
	FROM PRESTITI_UT
	WHERE EmailUtilizzatore = EmailUti;  
END $$
DELIMITER ;





##SOLO VOLONTARI
# Visualizzazione di tutte le prenotazioni inserite sulla piattaforma
CREATE VIEW PRESTITI_VOL(Prestito, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, StatoPrestito, Biblioteca)
AS SELECT  Cod, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, StatoPrestito, Biblioteca
		FROM PRESTITO JOIN CARTACEO ON (PRESTITO.CodLibro=CARTACEO.Codice)
						JOIN LIBRO ON (PRESTITO.Cod=LIBRO.Codice)
                        WHERE StatoPrestito <> "Disponibile";
        
DELIMITER $$
CREATE PROCEDURE VisualPrenotazioniCartei()
BEGIN
	SELECT *
	FROM PRESTITI_VOL;
END $$
DELIMITER ;

# Inserimento di un nuovo evento di consegna
DELIMITER $$
CREATE PROCEDURE InsertConsegna (IN NumPrestito int, IN Tipo varchar(12), IN Note varchar(200), IN EmailVolontario varchar(30))
BEGIN
	SET @Giorno=CURDATE(); 
	INSERT INTO CONSEGNA(CodPrestito, Tipo, Note, Giorno, EmailVol)
    VALUES(NumPrestito, Tipo, Note, @Giorno, EmailVolontario);
END $$
DELIMITER ;

#TRIGGER CONSEGNA
DELIMITER |
CREATE TRIGGER ConsegnaCartaceo
AFTER INSERT ON CONSEGNA
FOR EACH ROW 
BEGIN
	IF (NEW.Tipo="Affidamento") THEN
		#INSERISCI DATA INIZIO E FINE SU PRESTITO
		#La data di fine prestito viene calcolata come 15 giorni dalla data di consegna
		UPDATE PRESTITO SET DataAvvio = NEW.Giorno WHERE (Cod=NEW.CodPrestito);
        UPDATE PRESTITI_VOL SET DataAvvio = NEW.Giorno WHERE (PRESTITI_VOL.Prestito=NEW.CodPrestito);
		UPDATE PRESTITO SET DataFine = DATE_ADD(NEW.Giorno, INTERVAL 15 DAY) WHERE (Cod=NEW.CodPrestito);
        UPDATE PRESTITI_VOL SET DataFine = DATE_ADD(NEW.Giorno, INTERVAL 15 DAY) WHERE (PRESTITI_VOL.Prestito=NEW.CodPrestito);
	ELSE
		#se riconsegno prima aggiorno la data
		UPDATE PRESTITO SET DataFine = NEW.Giorno WHERE (Cod=NEW.CodPrestito);
        UPDATE PRESTITI_VOL SET DataFine=NEW.Giorno WHERE (PRESTITI_VOL.Prestito=NEW.CodPrestito);
	END IF;
	#CAMBIO LO STATO IN CONSEGNATO O DISPONIBILE
	SET @CodiceLibro = 0;
	SELECT CodLibro INTO @CodiceLibro
	FROM PRESTITO
	WHERE Cod=NEW.CodPrestito;
    IF (NEW.Tipo="Affidamento") THEN
		UPDATE CARTACEO SET StatoPrestito="Consegnato" WHERE (Codice=@CodiceLibro);
        UPDATE PRESTITI_VOL SET StatoPrestito="Consegnato" WHERE (PRESTITI_VOL.Prestito=NEW.CodPrestito);
	ELSE 
		UPDATE CARTACEO SET StatoPrestito="Disponibile" WHERE (Codice=@CodiceLibro);
        UPDATE PRESTITI_VOL SET StatoPrestito="Disponibile" WHERE (PRESTITI_VOL.Prestito=NEW.CodPrestito);
    END IF;
END |
DELIMITER ;




# Aggiornamento di un evento di consegna
DELIMITER $$
CREATE PROCEDURE UpdateConsegna (IN NumPrestito int, IN TipoConsegna varchar(12), IN NoteC varchar(200),IN GiornoC date,IN EmailC varchar(30))
BEGIN
	IF (NoteC IS NOT NULL AND NoteC <> "" AND NoteC <> " ") THEN
		UPDATE CONSEGNA
		SET Note=NoteC
		WHERE CodPrestito=NumPrestito AND Tipo=TipoConsegna;
	END IF;
    IF (GiornoC IS NOT NULL AND GiornoC <> 0000-00-00) THEN
		UPDATE CONSEGNA
		SET Giorno=GiornoC
		WHERE CodPrestito=NumPrestito AND Tipo=TipoConsegna;
	END IF;
    IF (EmailC IS NOT NULL AND EmailC <> "" AND EmailC <> " ") THEN
		UPDATE CONSEGNA
		SET EmailVol=EmailC
		WHERE CodPrestito=NumPrestito AND Tipo=TipoConsegna;
	END IF;
END $$
DELIMITER ;



#SOLO AMMINISTRATORI

#Biblioteca amministratore
DELIMITER $$
CREATE PROCEDURE BibliotecaAmministratore(IN EmailAmministratore varchar(30))
BEGIN
	SELECT Responsabile as NomeBiblioteca
	FROM AMMINISTRATORE
    WHERE Email=EmailAmministratore;
END $$
DELMITER ;

#Inserimento degli autori di un libro e collegamento con il libro
DELIMITER $$
CREATE PROCEDURE InsertAutori(IN CodLibro int, IN Autori varchar(100))
BEGIN
	SET @delimiterCount = LENGTH(Autori) - LENGTH(REPLACE(Autori, ',', ''));
	SET @autori_sub = SUBSTRING_INDEX(Autori, ',',1);
	SET @loopCount = 1;
   
    WHILE @loopCount <= @delimiterCount + 1 DO
		SET @autore = SUBSTRING_INDEX(Autori, ',', 1);	
		SET @AutoreEsistente = (SELECT CodAutore FROM AUTORE WHERE Nome= SUBSTRING_INDEX(@autore, ' ', 1) AND COGNOME = SUBSTRING_INDEX(@autore, ' ', -1));
		SET @CoppiaEsistente = (SELECT CodiceAutore FROM LISTA_AUTORI WHERE CodiceLibro=CodLibro AND CodiceAutore=@AutoreEsistente );
        
        IF (@AutoreEsistente IS NULL) THEN
           /*Put an author in table AUTORE*/
            INSERT INTO AUTORE(Nome,Cognome)
            VALUES (SUBSTRING_INDEX(@autore, ' ', 1), SUBSTRING_INDEX(@autore, ' ', -1)) ;
            SET @codice = (SELECT Count(*) FROM AUTORE);
            /*Connect author with book*/
			INSERT INTO LISTA_AUTORI(CodiceAutore, CodiceLibro)
			VALUES (@codice, CodLibro);
        ELSEIF (@CoppiaEsistente IS NULL) THEN
			/*Connect EXISTING author with book*/
			INSERT INTO LISTA_AUTORI(CodiceAutore, CodiceLibro)
			VALUES (@AutoreEsistente, CodLibro);
        END IF;
        
        /* Remove last used id from input string */
		SET Autori = REPLACE(Autori, CONCAT(@autore, ','), '');
		SET @loopCount = @loopCount + 1;
	END WHILE;
END $$
DELIMITER ; 


# Inserimento di un libro presso la biblioteca gestita
/*  NELLA CALL DI QUESTA PROCUDERE, QUANDO INSERIAMO UN EBOOK,
	BISOGNA IMMETTERE IL VALORE "0" PER I CAMPI Pagine e Scafale,
    PER GLI ALTRI CAMPI INERENTI A CARTACEO POSSIAMO LASCIARE UN 
    CAMPO VUOTO -> "". LO STESSO VALE SE INSERIAMO UN CARTACEO,
    POSSIAMO INSERIRE I CAMPI Dimensione e Link VUOTI.*/
DELIMITER $$
CREATE PROCEDURE InsertLibro(IN Titolo varchar(50), IN Anno smallint, IN Edizione varchar(30), IN Biblioteca varchar(40), Genere varchar(30),
IN Tipo Bool,
IN StatoPrestito varchar(11), IN Pagine smallint, IN Scaffale smallint, IN StatoConservazione varchar(9),
IN Dimensione varchar(10), IN Link varchar(2100) )
# se Tipo=true allora è un cartaceo, se Tipo=false allora è un ebook
BEGIN
		INSERT INTO LIBRO(Titolo, Anno, Edizione, Biblioteca, Genere)
        VALUES(Titolo, Anno, Edizione, Biblioteca, Genere);
        SET @UltimoCodice = LAST_INSERT_ID();
	IF Tipo="1" THEN
        INSERT INTO CARTACEO(Codice, StatoPrestito, Pagine, Scaffale, StatoConservazione)
        VALUES (@UltimoCodice,  StatoPrestito, Pagine, Scaffale, StatoConservazione);
    ELSE
		INSERT INTO EBOOK(Codice, Dimensione, Link)
        VALUES(@UltimoCodice, Dimensione, Link);
    END IF;
END $$
DELIMITER ;



#Cancellazione di un libro presso la biblioteca gestita
DELIMITER $$
CREATE PROCEDURE DeleteLibro(IN CodiceLibro int)
BEGIN
	DELETE FROM LIBRO
    WHERE Codice=CodiceLibro;
END $$
DELIMITER ;


#Aggiornamento di un libro presso la biblioteca gestita
DELIMITER $$
CREATE PROCEDURE UpdateLibro(IN CodiceLibro int, IN BibliotecaGestita varchar(40) , 
				IN TitoloU varchar(50), IN AnnoU smallint, IN EdizioneU varchar(30), IN GenereU varchar(30),
				IN StatoPrestitoU varchar(11), IN PagineU smallint, IN ScaffaleU smallint, IN StatoConservazioneU varchar(9),
                IN DimensioneU varchar(10), IN NumeroAccessiU int, IN LinkU varchar(2100), IN AutoriU varchar(100))
BEGIN
	IF (TitoloU IS NOT NULL AND TitoloU <> "" AND TitoloU <> " ") THEN
		UPDATE LIBRO
		SET Titolo=TitoloU
		WHERE Codice=CodiceLibro AND Biblioteca=BibliotecaGestita;
	END IF;
    IF (AnnoU IS NOT NULL AND AnnoU <> 0) THEN
		UPDATE LIBRO
		SET Anno=AnnoU
		WHERE Codice=CodiceLibro AND Biblioteca=BibliotecaGestita;
	END IF;
    IF (EdizioneU IS NOT NULL AND EdizioneU <> "" AND EdizioneU <> " ") THEN
		UPDATE LIBRO
		SET Edizione=EdizioneU
		WHERE Codice=CodiceLibro AND Biblioteca=BibliotecaGestita;
	END IF;
    IF (GenereU IS NOT NULL AND GenereU <> "" AND GenereU <> " ") THEN
		UPDATE LIBRO
		SET Genere=GenereU
		WHERE Codice=CodiceLibro AND Biblioteca=BibliotecaGestita;
	END IF;
    IF (StatoPrestitoU IS NOT NULL AND StatoPrestitoU <> "" AND StatoPrestitoU <> " ") THEN
		UPDATE CARTACEO
		SET StatoPrestito=StatoPrestitoU
		WHERE Codice=CodiceLibro;
	END IF;
    IF (PagineU IS NOT NULL AND PagineU <> 0) THEN
		UPDATE CARTACEO
		SET Pagine=PagineU
		WHERE Codice=CodiceLibro;
	END IF;
    IF (ScaffaleU IS NOT NULL AND ScaffaleU <> 0) THEN
		UPDATE CARTACEO
		SET Scaffale=ScaffaleU
		WHERE Codice=CodiceLibro;
	END IF;
	IF (StatoConservazioneU IS NOT NULL AND StatoConservazioneU <> "" AND StatoConservazioneU <> " ") THEN
		UPDATE CARTACEO
		SET StatoConservazione=StatoConservazioneU
		WHERE Codice=CodiceLibro;
	END IF;
    IF (DimensioneU IS NOT NULL AND DimensioneU <> "" AND DimensioneU <> " ") THEN
		UPDATE EBOOK
		SET Dimensione=DimensioneU
		WHERE Codice=CodiceLibro;
	END IF;
	IF (NumeroAccessiU IS NOT NULL AND NumeroAccessiU <> 0) THEN
		UPDATE EBOOK
		SET NumeroAccessi=NumeroAccessiU
		WHERE Codice=CodiceLibro;
	END IF;
	IF (LinkU IS NOT NULL AND LinkU <> "" AND LinkU <> " ") THEN
		UPDATE EBOOK
		SET Link=LinkU
		WHERE Codice=CodiceLibro;
	END IF;
	IF (AutoriU IS NOT NULL AND AutoriU <> "" AND AutoriU <> " ") THEN
		DELETE FROM LISTA_AUTORI WHERE LISTA_AUTORI.CodiceLibro=CodiceLibro;
        CALL InsertAutori(CodiceLibro,AutoriU);
	END IF;
END $$
DELIMITER ;



# Visualizzazione di tutte le prenotazioni presso la biblioteca gestita
CREATE VIEW PRENOTAZIONI_AMM(Prenotazione, Giorno, OraInizio, OraFine, NumPosto, Biblioteca, EmailUtilizzatore, Presa, Ethernet)
AS SELECT IdPren, Giorno, OraInizio, OraFine, NumPosto, Biblioteca, EmailUtilizzatore, Presa, Ethernet
	FROM PRENOTAZIONE JOIN POSTI_LETTURA ON (NumPosto=Num AND Biblioteca=NomeBiblioteca);

DELIMITER $$
CREATE PROCEDURE VisualPrenotazioniPosti(IN BibliotecaG varchar(40))
BEGIN 
	SELECT *
	FROM PRENOTAZIONI_AMM
    JOIN POSTI_LETTURA AS P ON (NumPosto = P.Num ) AND (Biblioteca = P.NomeBiblioteca)
	WHERE Biblioteca=BibliotecaG;
END $$
DELIMITER ;


# Inserimento di un messaggio rivolto ad un utente utilizzatore
DELIMITER $$
CREATE PROCEDURE InsertMessaggio(IN Titolo varchar(30), IN Testo varchar(300) , IN EmailAmministratore varchar(30), IN EmailUtilizzatore varchar(30))
BEGIN
    INSERT INTO MESSAGGIO(Giorno, Testo, Titolo, EmailAmm, EmailUti)
	VALUES (CURDATE(),Testo,Titolo,EmailAmministratore,EmailUtilizzatore);
END $$
DELIMITER ;

# Inserimento di una segnalazione di comportamento non corretto
DELIMITER $$
CREATE PROCEDURE InsertSegnalazione(IN Testo varchar(300), IN EmailAmministratore varchar(30), IN EmailUtilizzatore varchar(30))
BEGIN
    INSERT INTO SEGNALAZIONE(Giorno, Testo, EmailAmm, EmailUti)
	VALUES (CURDATE(),Testo,EmailAmministratore,EmailUtilizzatore);
END $$
DELIMITER ;

#TRIGGER SOSPENSIONE
#Quando un utilizzatore riceve più di 3 segnalazioni il suo account viene settato a "Sospeso"
DELIMITER |
CREATE TRIGGER Sospensione
AFTER INSERT ON SEGNALAZIONE
FOR EACH ROW
BEGIN
SET @CountSegnalazioni = 0;
SELECT Count(*) INTO @CountSegnalazioni 
FROM SEGNALAZIONE
WHERE EmailUti = NEW.EmailUti;
	IF (3 <= @CountSegnalazioni) THEN
		UPDATE UTILIZZATORE
        SET StatoAccount="Sospeso"
        WHERE Email=NEW.EmailUti;       
	END IF;
END |
DELIMITER ;


# Rimuovere tutte le segnalazioni di un utente, riportandone lo stato ad Attivo
DELIMITER $$
CREATE PROCEDURE AssoluzioneUtente(IN EmailUtilizzatore varchar(30))
BEGIN
	DELETE FROM SEGNALAZIONE WHERE EmailUti=EmailUtilizzatore;
    UPDATE UTILIZZATORE 
	SET StatoAccount="Attivo"
	WHERE Email=EmailUtilizzatore;
END $$
DELIMITER ; 

# Visualizzare la classifica dei volontari che hanno effettuato più consegne
DELIMITER $$
CREATE PROCEDURE ClassificaVol()
BEGIN
	SELECT Count(EmailVol), EmailVol 
	FROM CONSEGNA 
	GROUP BY EmailVol
	ORDER BY Count(EmailVol) DESC;
END $$
DELIMITER ;

# Visualizzare la classifica dei libri cartacei più prenotati
DELIMITER $$
CREATE PROCEDURE ClassificaCartacei()
BEGIN
	SELECT Count(CodLibro) as NumPrestiti, CodLibro, Titolo
	FROM PRESTITI_UT
	GROUP BY CodLibro
	ORDER BY Count(CodLibro) DESC;   
END $$
DELIMITER ;
	
    
# Visualizzare la classifica degli e-book più acceduti   
DELIMITER $$
CREATE PROCEDURE ClassificaEbook()
BEGIN  
	SELECT Titolo, EBOOK.Codice, NumeroAccessi, Anno, Edizione, Biblioteca
	FROM EBOOK JOIN LIBRO ON (EBOOK.Codice=LIBRO.Codice)
	ORDER BY NumeroAccessi DESC;   
END $$
DELIMITER ;

# Visualizzare la classifica delle biblioteche con postazioni letture meno utilizzate (in percentuale rispetto al numero di posti letture disponibili)
DELIMITER $$
CREATE PROCEDURE ClassificaBibliotecheMenoUsate()
BEGIN
	 SELECT Biblioteca, Count(Distinct(IdPren)) as NumeroPrenotazioni, Count(Distinct(Num)) as NumeroPosti, 
			TRUNCATE(((Count(Distinct(IdPren))/Count(Distinct(Num)))*100) ,2) as Percentuale  
	FROM PRENOTAZIONE JOIN POSTI_LETTURA ON (Biblioteca=NomeBiblioteca)
	GROUP BY Biblioteca
	ORDER BY Percentuale ASC;
END $$
DELIMITER ; 


#CLUSTERING
/* Implementare un sistema di clustering basato su algoritmo di K-Means, attraverso
il quale si segmentano gli utenti utilizzatori, sulla base della loro professione, età, genere e
numero di richieste di prestiti di libri cartacei effettuati. Visualizzare -tramite apposita
funzionalità nella piattaforma- l’elenco degli utenti che appartiene a ciascun cluster.*/

SELECT UTILIZZATORE.Email,
		DATE_FORMAT(FROM_DAYS(DATEDIFF(CURRENT_DATE(),UTILIZZATORE.DataNascita)), '%Y') + 0 AS Eta,
        Sesso,
        Count(Cod) AS NumeroPrenotazioni 
FROM UTILIZZATORE LEFT JOIN PRESTITO ON (Email=EmailUtilizzatore)
GROUP BY Email
INTO OUTFILE "/tmp/datiCluster.arff" #lo alloca nella cartella temportanea di un sistema linux
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';