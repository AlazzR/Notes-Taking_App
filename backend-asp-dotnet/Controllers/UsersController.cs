using backend_asp_dotnet.Data;
using backend_asp_dotnet.Dtos;
using backend_asp_dotnet.Models;
using backend_asp_dotnet.Services;
using backend_asp_dotnet.Utilities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Controllers {
    [ApiController]
    [Route("/users")]
    public class UsersController : Controller {
        private readonly NotesDbContext _context;
        private readonly ILogger<UsersController> _logger;
        private readonly ITokenRepo _tokenRepo;
        private readonly INoteRepo _noteRepo;

        public UsersController(NotesDbContext context, ILogger<UsersController> logger,
            ITokenRepo tokenRepo, INoteRepo noteRepo) {
            this._context = context;
            this._logger = logger;
            this._tokenRepo = tokenRepo;
            this._noteRepo = noteRepo;
        }

        [HttpGet("")]
        [EnableCors("allow_react_app")]
        public IActionResult GetUsersInPagination([FromQuery] int offset, [FromQuery] int fetch) {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                User user = this._tokenRepo.AuthenticateTokenAndUser(token);
                var usersInteractedWith = this._context.Comments
                    .Where(comment => 
                    (!comment.NoteOwner.Equals(user.Username) && comment.CommentOwner.Equals(user.Username)) ||
                    (comment.NoteOwner.Equals(user.Username) && !comment.CommentOwner.Equals(user.Username))).ToList()
                    .Select(comment => {
                        if (!comment.CommentOwner.Equals((user.Username)))
                            return new UserProjection() { Username = comment.CommentOwner };
                        return new UserProjection() { Username = comment.NoteOwner };

                    }).ToList<UserProjection>();
                /*
                var usersNotInteractedWith = this._context.Users.Where(u => usersInteractedWith
                   .Any(exist => !exist.Username.Equals(u.Username)))
                    .OrderBy(u => u.Username).Skip(offset).Take(fetch)
                    .Select(u => new UserProjection() { Username = u.Username }).ToList();
                */
                string sql = @"
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
                        AND username <> @user 
                        ORDER BY username
                        OFFSET @offsetValue ROWS FETCH NEXT @fetchRows ROWS ONLY
                    ";
                List<UserProjection> usersNotInteractedWith = this._context.Users
                    .FromSqlRaw(sql, 
                        new SqlParameter("@user", user.Username),
                        new SqlParameter("@offsetValue", offset),
                        new SqlParameter("@fetchRows", fetch))
                    .Select(u => new UserProjection() { Username = u.Username}).ToList();
                return Ok(new { Connected = usersInteractedWith, NotConnected = usersNotInteractedWith
                    , CountConnected = this._context.Users.Count() - usersInteractedWith.Count() - 1, 
                    CountNotConnected = usersNotInteractedWith
                .Count()});

            }catch(Exception exc) {
                this._logger.LogDebug("Users acquisition " + exc.Message);
                return BadRequest();
            }
        }
    }
}
