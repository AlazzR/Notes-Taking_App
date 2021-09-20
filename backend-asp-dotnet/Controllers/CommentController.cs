using backend_asp_dotnet.Dtos;
using backend_asp_dotnet.Models;
using backend_asp_dotnet.Services;
using backend_asp_dotnet.Utilities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Controllers {
    [ApiController]
    [Route("/user/notes/comments")]
    public class CommentController : Controller {
        private readonly ILogger<CommentController> _logger;
        private readonly ICommentRepo _commentRepo;

        public CommentController(ILogger<CommentController> logger, ICommentRepo commentRepo) {
            this._logger = logger;
            this._commentRepo = commentRepo;
        }

        [HttpGet()]
        [EnableCors("allow_react_app")]
        public IActionResult GetCommentsOfNotes([FromQuery] string NoteOwner, [FromQuery] Guid NoteId) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                List<CommentProjection> comments = this._commentRepo.GetCommentsOfNote(token, NoteOwner, NoteId);
                return Ok(new { Comments = comments });
            } catch (Exception exc) {
                this._logger.LogDebug("Comment: " + exc.Message);
                return BadRequest(new { msg = "Not allowed action ", NoteId = NoteId });
            }
        }

        [HttpPost()]
        [EnableCors("allow_react_app")]
        public IActionResult PostNewComment([FromBody] Comment comment) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                CommentProjection? postedComment = this._commentRepo.PostNewComment(token, comment);
                if (postedComment == null)
                    throw new Exception("Unable to add a new comment to the following note " + comment.NoteId);
                return Ok(new { Comment = postedComment });
            } catch(Exception exc) {
                this._logger.LogDebug("Comment: " + exc.Message);
                return BadRequest(new { msg = "Not allowed action ", Comment = comment });
            }
        }

        [HttpDelete()]
        [EnableCors("allow_react_app")]
        public IActionResult DeleteComment([FromBody] Comment comment) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                bool flag = this._commentRepo.RemoveComment(token, comment);
                if (!flag)
                    throw new Exception("Unable to add remove the comment of the following note " + comment.NoteId);
                return Ok(new { msg = flag });
            } catch (Exception exc) {
                this._logger.LogDebug("Comment: " + exc.Message);
                return BadRequest(new { msg = "Not allowed action ", Comment = comment });
            }
        }
    }
}
