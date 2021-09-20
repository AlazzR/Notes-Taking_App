using backend_asp_dotnet.Dtos;
using backend_asp_dotnet.Models;
using backend_asp_dotnet.Services;
using backend_asp_dotnet.Utilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Data {
    public class NoteRepo: INoteRepo {
        private readonly ILogger<NoteRepo> _logger;
        private readonly NotesDbContext _context;
        private readonly ITokenRepo _tokenRepo;

        public NoteRepo(ILogger<NoteRepo> logger, NotesDbContext context, ITokenRepo tokenRepo) {
            this._logger = logger;
            this._context = context;
            this._tokenRepo = tokenRepo;
        }
        
        public Guid CreateNewNote(string token, string title, string note) {
            User user = this._tokenRepo.AuthenticateTokenAndUser(token);
            if (user == null)
                throw new Exception("The following token doesn't correspond to a user " + token);
            Note obj = new Note {
                Title = title,
                NoteValue = note,
                User = user,
                UserId = user.Id,
                createdAt = DateTime.Now
            };
            this._context.Notes.Add(obj);
            this._context.SaveChanges();
            return obj.Id;
        }

        public bool UpdateNote(string token, Guid id, string title, string note) {
            User user = this._tokenRepo.AuthenticateTokenAndUser(token);
            if (user == null)
                return false;
            Note existingNote = this._context.Notes.Where(n => n.Id == id && n.User == user && n.UserId == user.Id)
                .ToList().DefaultIfEmpty(null).FirstOrDefault();
            if (existingNote == null)
                return false;
            try {
                existingNote.Title = title;
                existingNote.NoteValue = note;
                existingNote.updatedAt = DateTime.Now;
                this._context.Entry(existingNote).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                this._context.SaveChanges();
                return true;
            }catch(Exception exc) {
                this._logger.LogDebug("Note: " + exc.Message);
                return false;
            }
        }

        public bool DeleteNote(string token, Guid id) {
            User user = this._tokenRepo.AuthenticateTokenAndUser(token);
            if (user == null)
                return false;
            Note existingNote = this._context.Notes.Where(n => n.Id == id && n.User == user && n.UserId == user.Id)
                .ToList().DefaultIfEmpty(null).FirstOrDefault();
            if (existingNote == null)
                return false;
            try {
                this._context.Notes.Remove(existingNote);
                this._context.SaveChanges();
                return true;
            } catch (Exception exc) {
                this._logger.LogDebug("Note: " + exc.Message);
                return false;
            }
        }

        public NoteProjection GetNoteById(string token, Guid id) {
            User user = this._tokenRepo.AuthenticateTokenAndUser(token);
            if (user == null)
                throw new Exception("There are no user with the following token: " + token);
            NoteProjection note = this._context.Notes
                .Where(note => note.Id == id)
                .Select(note => new NoteProjection() {
                    Id = note.Id, Title = note.Title, Note = note.NoteValue,
                    CreatedAt = note.createdAt
                }).ToList().DefaultIfEmpty(null).FirstOrDefault();
            if (note == null)
                throw new Exception("There are no notes that correspond to the following id " + id);
            return note;
        }
    }
}
