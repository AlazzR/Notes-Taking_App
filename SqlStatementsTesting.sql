CREATE DATABASE notes_app;

USE [notes_app]
GO

/****************************** USERS INFORMATION ****************************************/

CREATE SCHEMA NotesUsers AUTHORIZATION dbo;
GO

CREATE TABLE [NotesUsers].[User](
	id uniqueidentifier CONSTRAINT DFT_user_id DEFAULT NEWID(),
	username NVARCHAR(28) NOT NULL,
	email NVARCHAR(1024) NOT NULL,
	password NVARCHAR(MAX) NOT NULL,
	dob DATE NOT NULL,
	CONSTRAINT UNIQUE_username UNIQUE(username)
);

ALTER TABLE [NotesUsers].[User]
	ADD CONSTRAINT chk_username
		CHECK(LEN(username) >= 8 and LEN(username) <= 28);

ALTER TABLE [NotesUsers].[User]
	ADD CONSTRAINT chk_dob
		CHECK(YEAR(dob) >= YEAR(CAST('19900101' AS DATE)) and YEAR(dob) <= YEAR(CAST(SYSDATETIME() AS DATE)));		
		
ALTER TABLE [NotesUsers].[User]
	ADD CONSTRAINT Unique_email
		UNIQUE(email);
				
/****************************** USERS INFORMATION ****************************************/