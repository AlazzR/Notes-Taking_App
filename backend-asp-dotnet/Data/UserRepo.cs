using backend_asp_dotnet.Dtos;
using backend_asp_dotnet.Models;
using backend_asp_dotnet.Services;
using backend_asp_dotnet.Utilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Data {
    public class UserRepo : IUserRepo {
        private readonly ILogger<UserRepo> _logger;
        private readonly NotesDbContext _context;
        private readonly IConfiguration configuration;

        public UserRepo(ILogger<UserRepo> _logger, NotesDbContext _context, IConfiguration configuration) {
            this._logger = _logger;
            this._context = _context;
            this.configuration = configuration;
        }

        public string SignInUser(UserSignIn user) {
            string hashed = AuthenticationElements.HashPassword(this.configuration, user.Password);

            User exists = this._context.Users.Where(u => u.Email.Equals(user.Email)
                && u.Password.Equals(hashed))
                .ToList().DefaultIfEmpty(null).FirstOrDefault();
            if(exists == null)
                throw new Exception("This user doesn't exist");

            string token = AuthenticationElements.GenerateToken(configuration, exists.Username, DateTime.Now);
            return token;
        }

        public string SignUpUsers(UserSignUp user) {
            User exists = this._context.Users.Where(u => u.Username == user.Username || u.Email == user.Email)
                .ToList().DefaultIfEmpty(null).FirstOrDefault();
            if (exists != null)
                throw new Exception("This user already exists");
            string hashed = AuthenticationElements.HashPassword(this.configuration, user.Password);
            string token = AuthenticationElements.GenerateToken(configuration, user.Username, DateTime.Now);

            this._context.Add(new User() { 
                Username = user.Username, Email = user.Email, Dob = user.Dob, Password = hashed});
            this._context.SaveChanges();
            return token;
    
        }
    }
}
