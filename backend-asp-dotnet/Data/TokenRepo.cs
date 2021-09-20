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
    public class TokenRepo : ITokenRepo {
        private readonly ILogger<TokenRepo> _logger;
        private readonly NotesDbContext _context;
        private readonly IConfiguration _configuration;
        
        public TokenRepo(IConfiguration configuration, ILogger<TokenRepo> logger, NotesDbContext context) {
            this._logger = logger;
            this._configuration = configuration;
            this._context = context;
        }
        public User AuthenticateTokenAndUser(string token) {
            IEnumerable<Claim> claims = AuthenticationElements.GetUsernameFromToken(this._configuration, token);
            User user = this._context.Users.Where(u => u.Username == claims.ElementAt(0).Value)
                .ToList().DefaultIfEmpty(null).FirstOrDefault();
            if (user == null)
                throw new Exception("This user doesn't exist because token not correct " + token);
            Token tokenExists = this._context.Tokens.Where(t => t.TokenValue.Equals(token) && t.UserId == user.Id)
                .ToList().DefaultIfEmpty(null).FirstOrDefault();
            if (tokenExists == null)
                throw new Exception("The token doesn't match the user older token " + user.Id + " " + token);
            return user;
        }
        public bool InsertNewToken(string token) {
            try {
                IEnumerable<Claim> claims = AuthenticationElements.GetUsernameFromToken(this._configuration, token);
                User user = this._context.Users.Where(u => u.Username == claims.First().Value).ToList()
                    .DefaultIfEmpty(null).FirstOrDefault();
                if (user == null)
                    throw new Exception("This user doesn't exist in the database");
                Token tokenExists = this._context.Tokens.Where(t => t.UserId == user.Id)
                    .ToList().DefaultIfEmpty(null).FirstOrDefault();
                //update token table with an updated token for the user.
                if(tokenExists != null) {
                    this._context.Entry(tokenExists).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
                }
                this._context.Tokens.Add(new Token { TokenValue = token, User = user, UserId = user.Id, CreatedAt = DateTime.Parse(claims.ElementAt(1).Value)});
                this._context.SaveChanges();
                return true;
            }catch(Exception e) {
                this._logger.LogDebug("Token: " + e.Message + " token value " + token);
                return false;
            }

        }
        public bool RemoveToken(string token) {
            try {
                IEnumerable<Claim> claims = AuthenticationElements.GetUsernameFromToken(this._configuration, token);
                User user = this._context.Users.Where(u => u.Username == claims.First().Value).ToList()
                    .DefaultIfEmpty(null).FirstOrDefault();
                if (user == null)
                    throw new Exception("This user doesn't exist in the database");
                Token tokenExists = this._context.Tokens.Where(t => t.UserId == user.Id)
                    .ToList().DefaultIfEmpty(null).FirstOrDefault();
                //update token table with an updated token for the user.
                if (tokenExists != null) {
                    this._context.Entry(tokenExists).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
                }
                this._context.SaveChanges();
                return true;
            } catch (Exception e) {
                this._logger.LogDebug("Token: " + e.Message + " token value " + token);
                return false;
            }

        }
    }
}
