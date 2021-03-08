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
NomeFoto varchar(15),
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
NumeroAccessi int,
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
DataNasciata date,
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
Giorno date,
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
VALUES  ("Biblioteca Univeristaria","Via Zamboni 33","bub.info@unibo.it","www.bub.unibo.it","Nel 1742 questo primo nucleo della Biblioteca si arricchì di manoscritti e opere a stampa","44.496952311102845","11.352406741622467"),
		("Biblioteca Nicola Matteucci","Strada Maggiore 45","sps.bibliotecamatteucci@unibo.it","https://dsps.unibo.it/it/biblioteca","Il primissimo nucleo bibliografico dell’attuale biblioteca viene costituito con la nascita nel 1964 della Facoltà di Scienze Politiche che vede tra i suoi fondatori il politologo Nicola Matteucci.","44.49152049033292","11.354048728911785"),
		("Biblioteca Giurica Antonio Cicu","Via Zamboni 27","abis.bibliotecacicu@unibo.it","http://giuridica.sba.unibo.it/","La biblioteca della SP.I.S.A. fu voluta dal Professor Fabio Roversi Monaco (Rettore dell’Università di Bologna dal 1985 al 2000 e attualmente Rettore Emerito).","44.49676694031628","11.351733584733914"),
        ("Biblioteca economica Walter Bigiavi","Via delle Belle Arti 33","info.bigiavi@unibo.it","http://bigiavi.sba.unibo.it/","La Biblioteca di Discipline economico-aziendali “Walter Bigiavi” nasce dall’unione della Biblioteca di Discipline economiche “Walter Bigiavi” con le biblioteche dei dipartimenti di Scienze aziendali e di Scienze economiche,","44.49790902645268","11.35191257124072"),
        ("Biblioteca di discipline umanistiche","Via Zamboni 36","bdu.lettere@unibo.it","http://bdu.sba.unibo.it/","La Biblioteca di Discipline Umanistiche nasce nel 1926 come biblioteca di Facoltà di Lettere e Filosofia da un primo nucleo di pubblicazioni donate da Giovanni Pascoli nel 1909 e contenente anche opere di Giosuè Carducci.","44.496876287221966","11.351636955898286");
        
INSERT INTO TELEFONO (NomeBiblioteca, NumTel)
VALUES  ("Biblioteca Univeristaria","0512088300"),
        ("Biblioteca Univeristaria","0512088385"),
        ("Biblioteca Nicola Matteucci","0512092532"),
        ("Biblioteca Nicola Matteucci","0512092533"),
        ("Biblioteca Nicola Matteucci","0512092534"),
        ("Biblioteca Giurica Antonio Cicu","0512099626"),
        ("Biblioteca Giurica Antonio Cicu","0512099629"),
        ("Biblioteca Giurica Antonio Cicu","0512086037"),
        ("Biblioteca economica Walter Bigiavi","0512098280"),
        ("Biblioteca economica Walter Bigiavi","0512098285"),
        ("Biblioteca di discipline umanistiche","0512098310");

INSERT INTO UTILIZZATORE (Email, Pass, StatoAccount)
VALUES ("gino@gmail.com","1234","Attivo");

INSERT INTO POSTI_LETTURA(Num, NomeBiblioteca, Presa, Ethernet) 
VALUES	("1","Biblioteca Univeristaria",true, false),
		("2","Biblioteca Univeristaria",true, false),
        ("3","Biblioteca Univeristaria",true, false),
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

INSERT INTO LIBRO(Titolo, Anno, Edizione, Biblioteca) 
VALUES	("Divina Commedia-Completo","1814","Originale","Biblioteca Univeristaria"),
		("Divina Commedia-Paradiso","2015","Petrini","Biblioteca Univeristaria"),
        ("Divina Commedia-Inferno","2015","Petrini","Biblioteca Univeristaria"),
        ("Divina Commedia-Purgatorio","2015","Petrini","Biblioteca Univeristaria"),
        ("Il deserto dei tartari","1940","RCS","Biblioteca Univeristaria"),
        ("Il deserto dei tartari","2012","Feltrinelli","Biblioteca Nicola Matteucci"),
        ("Il nome della Rosa","1980","Bompiani","Biblioteca Nicola Matteucci"),
        ("Il nome della Rosa","2002","Repubblica","Biblioteca Nicola Matteucci"),
        ("Prima Lezione di diritto","2006","Laterza","Biblioteca Giurica Antonio Cicu"),
        ("Fondamenti della scienza giuridica","2005","Giappichelli","Biblioteca Giurica Antonio Cicu"),
        ("Argomenti di teoria del diritto","2016","Faralli","Biblioteca Giurica Antonio Cicu"),
        ("Elogio del diritto","2019","Nave di Tesco","Biblioteca Giurica Antonio Cicu"),
        ("Il mistero del processo","1994","Adelphi","Biblioteca Giurica Antonio Cicu"),
        ("Sistemi giuridici comparati","1996","Utet","Biblioteca Giurica Antonio Cicu"),
        ("Il metodo Warren Buffet","1994","Hoepli","Biblioteca economica Walter Bigiavi"),
        ("Microeconomia","2014","Piras","Biblioteca economica Walter Bigiavi"),
        ("Macroeconomia","2010","Il Mulino","Biblioteca economica Walter Bigiavi"),
        ("Pachidermi e pappagalli","2019","Feltinelli","Biblioteca economica Walter Bigiavi"),
        ("Storia economica","2006","Franco Angeli","Biblioteca economica Walter Bigiavi"),
        ("Corso di economia aziendale","2005","Il  Mulino","Biblioteca economica Walter Bigiavi"),
        ("L'alchimista","2017","La nave di Teseo","Biblioteca di discipline umanistiche"),
        ("Manifesto della psicologia","2012","Mastopaolo","Biblioteca di discipline umanistiche"),
        ("Nella quiete e nella gratitudine","2007","Accademia Edizioni","Biblioteca di discipline umanistiche"),
        ("Il mito del denaro","2009","Magi","Biblioteca di discipline umanistiche"),
        ("Tutto è relazione","2019","Crisalide","Biblioteca di discipline umanistiche");
        
 
INSERT INTO CARTACEO(Codice,StatoPrestito, Pagine, Scaffale, StatoConservazione) 
VALUES	("1","Disponibile","1500","15","Non Buono"),
		("2","Disponibile","190","5","Buono"),
		("6","Prenotato","100","6","Ottimo"),
		("8","Disponibile","300","7","Scadente"),
		("9","Consegnato","300","7","Ottimo"),
        ("10","Disponibile","300","7","Ottimo"),
		("13","Disponibile","300","7","Ottimo"),
        ("15","Disponibile","1000","7","Ottimo"),
        ("16","Disponibile","800","7","Scadente"),
        ("19","Disponibile","550","7","Non Buono"),
        ("22","Disponibile","1200","7","Ottimo"),
        ("23","Disponibile","300","7","Scadente"),
		("24","Disponibile","600","7","Ottimo");
        

INSERT INTO VOLONTARIO(Email, Pass, Nome, Cognome, Tel, DataNascita, LuogoNascita, Trasporto)
VALUES  ("tiziano@me.it","aaaaa","Tiziano","Bruno","32323342","1998-01-01","Palermo","bici"),
		("fabio@me.it","aaaaa","Fabio","Cigna","31232345","2000-01-01","Ferrara","bus"),
        ("pippo@me.it","aaaaa","Pippo","Baudo","322622616","1968-01-02","Milano","auto");

INSERT INTO PRESTITO(DataAvvio, DataFine, CodLibro, EmailUtilizzatore)
VALUES  ("2021-01-01","2021-05-01","2","gino@gmail.com"),
		("2021-01-01","2021-03-01","6","gino@gmail.com"),
        ("2021-01-02","2021-04-01","1","gino@gmail.com");

INSERT INTO CONSEGNA(CodPrestito, Tipo, Note, Giorno, EmailVol)
VALUES  ("1","Restituzione","werervrev","2021-01-01","tiziano@me.it"),
		("2","Restituzione","verervre","2021-02-01","fabio@me.it");
        

/*INSERT INTO PRENOTAZIONE(Giorno, OraInizio, OraFine, NumPosto, Biblioteca, EmailUtilizzatore) 
VALUES  ("","","","","",""),
		("","","","","",""),
		("","","","","",""),
		("","","","","",""),
		("","","","","","");*/
        

#OPERAZIONI SUI DATI (da implementare attraverso stored procedure)
##tutti gli utenti
# Autenticazione alla piattaforma
DELIMITER $$
CREATE PROCEDURE Autenticazione( IN mail varchar(30), IN psw varchar(20), OUT Stato varchar(7) )
BEGIN
	SELECT StatoAccount as Stato
	FROM UTILIZZATORE
	WHERE (Email=mail AND Pass=psw);
END $$
DELIMITER ;

# Visualizzazioni biblioteche presenti
DELIMITER $$
CREATE PROCEDURE VisualBiblioteche()
BEGIN
	DECLARE NomiBib varchar(40);
	DECLARE stoppaCursore INT DEFAULT 0;
	DECLARE NomiMax INT DEFAULT (SELECT COUNT(Nome) FROM BIBLIOTECA);
	DECLARE cursore CURSOR FOR
		SELECT Nome FROM BIBLIOTECA;
	SET stoppaCursore=0;
	OPEN cursore;
	WHILE (stoppaCursore<NomiMax) DO
		FETCH cursore INTO NomiBib;
		SELECT NomiBib;
        SET stoppaCursore = stoppaCursore+1;
	END WHILE;
	CLOSE cursore;
END $$
DELIMITER ;

# Visualizzazione dei posti lettura presenti in ogni biblioteca
DELIMITER $$
CREATE PROCEDURE VisualPosti()
BEGIN
	DECLARE Posto int;
	DECLARE Biblioteca varchar(40);
	DECLARE Presa boolean;
	DECLARE Ethernet boolean;
    DECLARE stopCur INT DEFAULT 0;
	DECLARE MaxReturn INT DEFAULT (SELECT Count(*) FROM POSTI_LETTURA);
	DECLARE cur CURSOR FOR 
		SELECT * FROM POSTI_LETTURA;
	SET stopCur = 0;
	OPEN cur;
	WHILE (stopCur<MaxReturn) DO 
		FETCH cur INTO Posto, Biblioteca, Presa, Ethernet;
		SELECT Posto, Biblioteca, Presa, Ethernet;
        SET stopCur=stopCur+1;
	END WHILE;
	CLOSE cur;
END $$
DELIMITER ; 

# Visualizzazione dei libri disponibili in ogni biblioteca
DELIMITER $$
CREATE PROCEDURE VisualLibri()
BEGIN
	DECLARE Codice int;
	DECLARE Titolo varchar(50);
	DECLARE Anno smallint;
    DECLARE Edizione varchar(30);
    DECLARE Biblioteca varchar(40);
    DECLARE stopCur INT DEFAULT 0;
	DECLARE MaxReturn INT DEFAULT (SELECT Count(*) FROM LIBRO);
	DECLARE cur CURSOR FOR 
		SELECT * FROM LIBRO;
	SET stopCur = 0;
	OPEN cur;
	WHILE (stopCur<MaxReturn) DO 
		FETCH cur INTO Codice, Titolo, Anno, Edizione, Biblioteca;
		SELECT Codice, Titolo, Anno, Edizione, Biblioteca;
        SET stopCur=stopCur+1;
	END WHILE;
	CLOSE cur;
END $$
DELIMITER ;

##solo utilizzatori
# Registrazione alla piattaforma
DELIMITER $$
CREATE PROCEDURE Registrazione( IN mail varchar(30), IN psw varchar(20), IN NomeUt varchar(20), IN CognomeUt varchar(30), IN TelUt varchar(15), IN DataNascitaUt date, IN LuogoNascitaUt varchar(20), IN ProfessioneUt varchar(20))
BEGIN
	SET @DataOdierna=CURDATE(); 
	INSERT INTO UTILIZZATORE (Email, Pass, Nome, Cognome, Tel, DataNascita, LuogoNascita, DataCreazioneAccount, Professione)
    VALUES(mail, psw, NomeUt, CognomeUt, TelUt, DataNascitaUt, LuogoNascitaUt, @DataOdierna, ProfessioneUt);
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

# Visualizzazione delle proprie prenotazioni

CREATE VIEW PRESTITI_UT(Prestito, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, Titolo)
AS SELECT  Cod, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, Titolo 
		FROM PRESTITO JOIN LIBRO ON Cod=Codice;

DELIMITER $$
CREATE PROCEDURE PrestitiUtente(IN EmailUti varchar(30)) 
BEGIN
	DECLARE CodPrestito int ;
	DECLARE DataAvvio date;
	DECLARE DataFine date;
	DECLARE CodLibro int;
	DECLARE Email varchar(30);
	DECLARE Titolo varchar(50);
    DECLARE stopCur INT DEFAULT 0;
	DECLARE MaxReturn INT DEFAULT ( SELECT Count(*) 
									FROM PRESTITI_UT
                                    WHERE EmailUtilizzatore = EmailUti);
	DECLARE cur CURSOR FOR (SELECT *
							FROM PRESTITI_UT
							WHERE EmailUtilizzatore = EmailUti );
	
    SET stopCur = 0;
    OPEN cur;
    WHILE (stopCur<MaxReturn) DO
		FETCH cur INTO CodPrestito, DataAvvio, DataFine, CodLibro, Email, Titolo;
        SELECT CodPrestito, DataAvvio, DataFine,CodLibro, Email, Titolo;
		SET stopCur=stopCur+1;
    END WHILE;
    CLOSE cur;
END $$
DELIMITER ;




##solo volontari
# Visualizzazione di tutte le prenotazioni inserite sulla piattaforma
CREATE VIEW PRESTITI_VOL(Prestito, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, StatoPrestito, Biblioteca)
AS SELECT  Cod, DataAvvio, DataFine, CodLibro, EmailUtilizzatore, StatoPrestito, Biblioteca
		FROM PRESTITO JOIN CARTACEO ON (PRESTITO.Cod=CARTACEO.Codice)
						JOIN LIBRO ON (PRESTITO.Cod=LIBRO.Codice);
        

DELIMITER $$
CREATE PROCEDURE VisualPrenotazioniCartei()
BEGIN
	DECLARE Prestito int;
	DECLARE DataAvvio date;
	DECLARE DataFine date;
	DECLARE CodLibro int;
	DECLARE EmailUt varchar(30);
    DECLARE StatoPrestito varchar(11);
    DECLARE Biblioteca varchar(40);
    
	DECLARE stopCur INT DEFAULT 0;
	DECLARE MaxReturn INT DEFAULT ( SELECT Count(*) 
									FROM PRESTITI_VOL);
	DECLARE cur CURSOR FOR (SELECT *
							FROM PRESTITI_VOL);
	
    SET stopCur = 0;
    OPEN cur;
    WHILE (stopCur<MaxReturn) DO
		FETCH cur INTO Prestito, DataAvvio, DataFine, CodLibro, EmailUt, StatoPrestito, Biblioteca;
        SELECT Prestito, DataAvvio, DataFine, CodLibro, EmailUt, StatoPrestito, Biblioteca;
		SET stopCur=stopCur+1;
    END WHILE;
    CLOSE cur;
END $$
DELIMITER ;

# Inserimento di un nuovo evento di consegna
DELIMITER $$
CREATE PROCEDURE InsertConsegna (IN NumPrestito int, IN Tipo varchar(12), IN Note varchar(200),IN Giorno date,IN EmailVolontario varchar(30))
BEGIN
	INSERT INTO CONSEGNA(CodPrestito, Tipo, Note, Giorno, EmailVol)
    VALUES(NumPrestito, Tipo, Note, Giorno, EmailVolontario);
END $$
DELIMITER ;

# Aggiornamento di un evento di consegna
DELIMITER $$
CREATE PROCEDURE UpdateConsegna (IN NumPrestito int, IN TipoC varchar(12), IN NoteC varchar(200),IN GiornoC date,IN EmailVolontario varchar(30))
BEGIN
	UPDATE CONSEGNA
	SET Note=NoteC, Giorno=GiornoC, EmailVol=EmailVolontario
	WHERE CodPrestito=NumPrestito AND Tipo=TipoC;
END $$
DELIMITER ;




/* ANCORA DA IMPLEMENTARE

##tutti gli utenti
# Visualizzazione di un E-BOOK		(PENSO INTENDA GRAFICAMENTE??)
# Visualizzazione propri eventi di consegna



# Visualizzazione delle statistiche
##statistiche
# Visualizzare la classifica delle biblioteche con postazioni letture meno utilizzate (in percentuale rispetto al numero di posti letture disponibili)
# Visualizzare la classifica dei volontari che hanno effettuato piÃ¹ consegne
# Visualizzare la classifica dei libri cartacei piÃ¹ prenotati
# Visualizzare la classifica degli e-book piÃ¹ acceduti






##solo amministatori
# Inserimento/Cancellazione/Aggiornamento di un libro presso la biblioteca gestita
# Visualizzazione di tutte le prenotazioni presso la biblioteca gestita
# Inserimento di un messaggio rivolto ad un utente utilizzatore
# Inserimento di una segnalazione di comportamento non corretto
# Rimuovere tutte le segnalazioni di un utente, riportandone lo stato ad Attivo














#TRIGGER
Create trigger Nome
Before/After on tabella
for each row/statement
when CONDIZIONE
SET ALLORA, PROCEDURASQL



#La data di fine prestito viene calcolata come 15 giorni dalla data di consegna

#Quando un utilizzatore riceve più di 3 segnalazioni il suo account viene settato a "Sospeso"
CREATE TRIGGER Sospensione
AFTER INSERT ON SEGNALAZIONE
FOR EACH ROW 
BEGIN
	IF (SELECT COUNT(*) FROM SEGNALAZIONE GROUP BY EmailUti ) THEN
		SET UTILIZZATORE.StatoAccount="Sospeso"
	END IF
END;

#altri trigger 

*/