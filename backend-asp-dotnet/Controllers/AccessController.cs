using backend_asp_dotnet.Data;
using backend_asp_dotnet.Dtos;
using backend_asp_dotnet.Models;
using backend_asp_dotnet.Services;
using backend_asp_dotnet.Utilities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
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
        public AccessController(IConfiguration configuration, 
            ILogger<AccessController> logger, NotesDbContext context, IUserRepo _userRepo) {
            this._context = context;
            this._logger = logger;
            this._configuration = configuration;
            this._userRepo = _userRepo;
        }

        [HttpPost("sign-up")]
        public IActionResult SignUp([FromBody] UserSignUp user) {
            try {

                string token = this._userRepo.SignUpUsers(user);
                this._logger.LogDebug("This user successfully signed up " + user.Username);
                return Ok(token);
            }catch(Exception exc) {
                this._logger.LogDebug("This user was unsuccessfull in sign up " + user.Username);
                return BadRequest("Either username is already taken or you are giving bad entries.");
            }

        }

        [HttpPost("sign-in")]
        public IActionResult SignIn([FromBody] UserSignIn user) {
            try {

                string token = this._userRepo.SignInUser(user);
                this._logger.LogDebug("This user successfully signed in " + user.Email);
                return Ok(token);
            } catch (Exception exc) {
                this._logger.LogDebug("This user was unsuccessfull in sign in " + user.Email);
                return BadRequest("Either the password or the email is wrong.");
            }

        }

        [HttpGet("")]
        [EnableCors("allow_react_app")]
        public IActionResult Foo() {
            if (this._context.Database.CanConnect())
                return Ok("Connection worked");
            return BadRequest("Wasn't able to connect to the db");
        }
    }
}
