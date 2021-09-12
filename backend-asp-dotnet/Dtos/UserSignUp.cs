using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Dtos {
    public class UserSignUp {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public DateTime Dob { get; set; }

        public override string ToString() {
            return $"User: {this.Username}, {this.Email}, {this.Dob.ToString()}";
        }
    }
}
