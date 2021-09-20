using backend_asp_dotnet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Services {
    public interface ICommentClient {
        Task ReceiveMessage(Comment comment);
    }
}
