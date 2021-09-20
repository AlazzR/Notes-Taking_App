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
	CONSTRAINT UNIQUE_username UNIQUE(username),
	CONSTRAINT PK_Users PRIMARY KEY(id)
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
		
		
CREATE TABLE [NotesUsers].[Token](
	id uniqueidentifier PRIMARY KEY CONSTRAINT DFT_token_id DEFAULT NEWID(),
	token NVARCHAR(500) NOT NULL,
	createdAt DATE NOT NULL CONSTRAINT DFT_token_createdAt DEFAULT GETDATE(),
	userID uniqueidentifier NOT NULL,
	CONSTRAINT FK_token_user FOREIGN KEY(userID) REFERENCES [NotesUsers].[User](id) ON DELETE CASCADE
);
				
/****************************** NOTES INFORMATION ****************************************/
CREATE SCHEMA NotesInfo AUTHORIZATION dbo;

CREATE TABLE [NotesInfo].[Notes](
	id uniqueidentifier CONSTRAINT DFT_note_id DEFAULT NEWID(),
	title NVARCHAR(MAX) NOT NULL,
	note NVARCHAR(MAX) NOT NULL, 
	createdAt DATETIME2(7)NOT NULL CONSTRAINT  DFT_noteCreation DEFAULT GETDATE(),
	updatedAt DATETIME2(7) NULL, 
	userId uniqueidentifier NOT NULL,
	CONSTRAINT FK_userID FOREIGN KEY(userId) REFERENCES [NotesUsers].[User](id) ON DELETE CASCADE,
	CONSTRAINT PK_notes PRIMARY KEY(id)
);

CREATE TABLE [NotesInfo].[Comments](
	id uniqueidentifier PRIMARY KEY CONSTRAINT DFT_comment_id DEFAULT NEWID(),
	NoteId uniqueidentifier NOT NULL,
	NoteOwner NVARCHAR(28) NOT NULL,
	CommentOwner NVARCHAR(28) NOT NULL,
	CommentValue NVARCHAR(MAX) NOT NULL,
	CreatedAt DATETIME2(7) CONSTRAINT DFT_createdAt DEFAULT GETDATE(),
	CONSTRAINT FK_note_id FOREIGN KEY(NoteId) REFERENCES [NotesInfo].[Notes](id) ON DELETE CASCADE,
	CONSTRAINT FK_note_owner FOREIGN KEY(NoteOwner) REFERENCES [NotesUsers].[User](username) ON DELETE NO ACTION,
	CONSTRAINT FK_comment_owner FOREIGN KEY(NoteOwner) REFERENCES  [NotesUsers].[User](username) ON DELETE NO ACTION
);
/******************************* Real Time Connections *************************************/
CREATE SCHEMA real_time_processing AUTHORIZATION dbo;

CREATE TABLE [real_time_processing].[connections](
	connectionId NVARCHAR(256) PRIMARY KEY,
	userAgent NVARCHAR(MAX) NOT NULL,
	connected BIT  NOT NULL DEFAULT(0)
);

@"SELECT username 
                "
                    "   FROM [NotesUsers].[User] " +
                    "   WHERE username NOT IN ( " +
                    "       SELECT CommentOwner " +
                    "           FROM [NotesInfo].[Comments] " +
                    "           WHERE NoteOwner <> @user AND CommentOwner = @user) " +
                    "   AND NOT IN ( " +
                    "       SELECT CommentOwner " +
                    "           FROM [NotesInfo].[Comments] " +
                    "           WHERE NoteOwner = @user AND CommentOwner <> @user);";

/*******************************************************************************************/
SELECT username
	FROM [NotesUsers].[User]
	WHERE username NOT IN (
		SELECT CommentOwner
			FROM [NotesInfo].[Comments]
			WHERE NoteOwner <> @user AND CommentOwner = @user
	) AND username NOT IN(
		SELECT CommentOwner
			FROM [NotesInfo].[Comments]
		WHERE NoteOwner = @user AND CommentOwner <> @user)
	AND username <> @user;