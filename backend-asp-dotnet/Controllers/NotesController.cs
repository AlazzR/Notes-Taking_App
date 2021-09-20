using backend_asp_dotnet.Data;
using backend_asp_dotnet.Dtos;
using backend_asp_dotnet.Models;
using backend_asp_dotnet.Services;
using backend_asp_dotnet.Utilities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Controllers {

    [ApiController]
    [Route("/user/notes/")]
    public class NotesController : Controller {
        private readonly NotesDbContext _context;
        private readonly ILogger<AccessController> _logger;
        private readonly IConfiguration _configuration;
        private readonly INoteRepo _noteRepo;
        private readonly ITokenRepo _tokenRepo;


        public NotesController(NotesDbContext context, ILogger<AccessController> logger,
            IConfiguration configuration, INoteRepo noteRepo, ITokenRepo tokenRepo) {
            this._context = context;
            this._logger = logger;
            this._configuration = configuration;
            this._noteRepo = noteRepo;
            this._tokenRepo = tokenRepo;
        }

        [HttpPost("fetch-notes")]
        [EnableCors("allow_react_app")]
        public IActionResult GetNotesInPagination([FromBody] NotesPagination pagination) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                User user = this._tokenRepo.AuthenticateTokenAndUser(token);

                List<NoteProjection> notes = this._context.Notes
                    .Where(note => note.User.Username.Equals(pagination.Username))
                    .Select(note => new NoteProjection(){ Id = note.Id, Title = note.Title, Note = note.NoteValue,
                    CreatedAt = note.createdAt})
                    .OrderBy(note => note.CreatedAt)
                    .Skip(pagination.Offset)
                    .Take(pagination.Fetch).ToList();
                int count = this._context.Notes
                    .Where(note => note.User.Username.Equals(pagination.Username))
                    .Count();
                return Ok(new { Notes = notes, Count = count });
            } catch (Exception exc) {
                return BadRequest("You aren't allowed to do this entry.");
            }
        }

        [HttpGet("fetch-notes")]
        [EnableCors("allow_react_app")]
        public IActionResult GetNoteById([FromQuery] Guid NoteId) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                NoteProjection note = this._noteRepo.GetNoteById(token, NoteId);
                return Ok(new { Note = note } );
            } catch (Exception exc) {
                return BadRequest("You aren't allowed to do this entry.");
            }
        }

        [HttpPost()]
        [EnableCors("allow_react_app")]
        public IActionResult PostNewNote([FromBody] NoteCreation newNote) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                User user = this._tokenRepo.AuthenticateTokenAndUser(token);

                Guid id = this._noteRepo.CreateNewNote(token, newNote.Title,
                    newNote.Note);

                Note note = this._context.Notes.Where(note => note.Id == id).FirstOrDefault();
                return Ok(new { Id = note.Id, CreatedAt = note.createdAt });
            }catch(Exception exc) {
                return BadRequest("You aren't allowed to do this entry.");
            }
        }

        [HttpPatch()]
        [EnableCors("allow_react_app")]
        public IActionResult UpdateNote([FromBody] NoteUpdate note) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);

                if (!this._noteRepo.UpdateNote(token, note.Id, note.Title, note.Note))
                    throw new Exception("Note: Unable to update the note " + note.Id);

                return Ok(new { noteId = note.Id });
            } catch (Exception exc) {
                return BadRequest("You aren't allowed to do this entry.");
            }
        }

        [HttpDelete()]
        [EnableCors("allow_react_app")]
        public IActionResult DeleteNote([FromBody] NoteUpdate note) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);

                if (!this._noteRepo.DeleteNote(token, note.Id))
                    throw new Exception("Note: Unable to delete the note " + note.Id);

                return Ok(new { Accepted = true });
            } catch (Exception exc) {
                return BadRequest("You aren't allowed to do this entry.");
            }
        }

    }
}
