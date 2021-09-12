using backend_asp_dotnet.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Services {
    public interface IUserRepo {
        string SignUpUsers(UserSignUp user);
        string SignInUser(UserSignIn user);

    }
}
