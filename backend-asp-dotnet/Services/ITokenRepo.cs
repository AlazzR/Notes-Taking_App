using backend_asp_dotnet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Services {
    public interface ITokenRepo {
        public bool InsertNewToken(string token);
        public bool RemoveToken(string token);
        public User AuthenticateTokenAndUser(string token);
    }
}
