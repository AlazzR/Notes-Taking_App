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
    [Route("/")]
    public class AccessController : Controller {
        private readonly NotesDbContext _context;
        private readonly ILogger<AccessController> _logger;
        private readonly IConfiguration _configuration;
        private readonly IUserRepo _userRepo;
        private readonly ITokenRepo _tokenRepo;

        private readonly ICommentHub _commentHub;

        public AccessController(IConfiguration configuration, 
            ILogger<AccessController> logger, NotesDbContext context, IUserRepo _userRepo,
            ITokenRepo tokenRepo, INoteRepo noteRepo, ICommentHub commentHub) {
            this._context = context;
            this._logger = logger;
            this._configuration = configuration;
            this._userRepo = _userRepo;
            this._tokenRepo = tokenRepo;
            this._commentHub = commentHub;
        }

        [HttpPost("sign-up")]
        [EnableCors("allow_react_app")]
        public IActionResult SignUp([FromBody] UserSignUp user) {
            try {
                
                string token = this._userRepo.SignUpUsers(user);
                if (!this._tokenRepo.InsertNewToken(token))
                    throw new Exception("Wrong token value");
                
                this._logger.LogDebug("This user successfully signed up " + user.Username);
                return StatusCode(201, new { Token = token });
            } catch(Exception exc) {
                this._logger.LogDebug("User: " + exc.Message);
                this._logger.LogDebug("This user was unsuccessfull in sign up " + user.Username);
                return BadRequest("Either username is already taken or you are giving bad entries.");
            }

        }

        [HttpPost("sign-in")]
        [EnableCors("allow_react_app")]
        public IActionResult SignIn([FromBody] UserSignIn user) {
            try {

                string token = this._userRepo.SignInUser(user);
                if (!this._tokenRepo.InsertNewToken(token))
                    throw new Exception("Wrong token value");

                this._logger.LogDebug("This user successfully signed in " + user.Email);
                return StatusCode(202, token);
            } catch (Exception exc) {
                this._logger.LogDebug("This user was unsuccessfull in sign in " + user.Email);
                return BadRequest("Either the password or the email is wrong.");
            }
        }

        [HttpDelete("logout")]
        [EnableCors("allow_react_app")]
        public IActionResult Logout() {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                if (!this._tokenRepo.RemoveToken(token))
                    throw new Exception("Wrong token value");

                this._logger.LogDebug("This token successfully remover " + token);
                return Ok();
            } catch (Exception exc) {
                this._logger.LogDebug("Token remove " + exc.Message);
                return BadRequest("Either the password or the email is wrong.");
            }
        }
        [HttpGet("username")]
        [EnableCors("allow_react_app")]
        public IActionResult GetUserName() {
            try {
                string token = AuthenticationElements.GetTokenValueFromHeader(Request.Headers);
                User user = this._tokenRepo.AuthenticateTokenAndUser(token);
                if (user == null)
                    throw new Exception("There are no user with the following token: " + token);

                return Ok(new { Username = user.Username });
            } catch (Exception exc) {
                this._logger.LogDebug("User: " + exc.Message);
                return BadRequest("You aren't allowed to do this entry.");
            }
        }
    }
}
