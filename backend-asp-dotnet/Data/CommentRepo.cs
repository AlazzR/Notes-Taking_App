using backend_asp_dotnet.Dtos;
using backend_asp_dotnet.Models;
using backend_asp_dotnet.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Data {
    public class CommentRepo : ICommentRepo {
        private readonly ILogger<CommentRepo> _logger;
        private readonly NotesDbContext _context;
        private readonly ITokenRepo _tokenRepo;

        public CommentRepo(ILogger<CommentRepo> logger, NotesDbContext context, ITokenRepo tokenRepo) {
            this._logger = logger;
            this._context = context;
            this._tokenRepo = tokenRepo;
        }

        public List<CommentProjection> GetCommentsOfNote(string token, string noteOwner, Guid NoteId) {
            User user = this._tokenRepo.AuthenticateTokenAndUser(token);
            if (user == null)
                return null;
            User owner = this._context.Users.Where(u => u.Username.Equals(noteOwner))
                .ToList().DefaultIfEmpty(null).FirstOrDefault();
            if (owner == null)
                return null;
            return this._context.Comments.Where(c => c.NoteOwner.Equals(owner.Username)
                && c.NoteId == NoteId).Select(c => new CommentProjection { 
                    Id = c.Id,
                    NoteId = c.NoteId,
                    NoteOwner = c.NoteOwner,
                    CommentOwner = c.CommentOwner,
                    CommentValue = c.CommentValue,
                    CreatedAt = c.CreatedAt
                }).OrderBy(n => n.CreatedAt).ToList();
        }

        public CommentProjection? PostNewComment(string token, Comment comment) {
            User user = this._tokenRepo.AuthenticateTokenAndUser(token);
            if (user == null)
                return null;
            try {
                User noteOwner = this._context.Users.Where(u => u.Username.Equals(comment.NoteOwner))
                    .ToList().DefaultIfEmpty(null).FirstOrDefault();
                if (noteOwner == null)
                    return null;
                Note note = this._context.Notes.Where(n => n.Id == comment.NoteId && n.UserId == noteOwner.Id)
                    .ToList().DefaultIfEmpty(null).FirstOrDefault();
                if (note == null)
                    return null;
                Comment obj = new Comment {
                    CommentOwner = user.Username,
                    NoteOwner = comment.NoteOwner,
                    NoteId = note.Id,
                    CreatedAt = DateTime.Now,
                    CommentValue = comment.CommentValue,
                    Note = note
                };
                this._context.Comments.Add(obj);
                this._context.SaveChanges();
                return new CommentProjection() {
                    Id = obj.Id, CommentOwner = obj.CommentOwner,
                    NoteOwner = obj.NoteOwner, CommentValue = obj.CommentValue,
                    CreatedAt = obj.CreatedAt
                };
            } catch (Exception exc) {
                this._logger.LogDebug("Comment: " + exc.Message);
                return null;
            }
        }

        public bool RemoveComment(string token, Comment comment) {
            User user = this._tokenRepo.AuthenticateTokenAndUser(token);
            if (user == null)
                return false;
            try {

                Comment obj = this._context.Comments.Where(c => 
                c.NoteOwner.Equals(user.Username) && 
                c.Id == comment.Id &&
                c.NoteId == comment.NoteId)
                    .ToList().DefaultIfEmpty(null).FirstOrDefault();
                if (obj == null)
                    return false;
                this._context.Entry(obj).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
                this._context.SaveChanges();
                return true;
            } catch (Exception exc) {
                this._logger.LogDebug("Comment: " + exc.Message);
                return false;
            }
        }
    }
}
