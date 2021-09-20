using backend_asp_dotnet.Data;
using backend_asp_dotnet.Models;
using backend_asp_dotnet.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Hubs {

    [EnableCors("allow_react_app")]
    public class CommentsHub: Hub<ICommentClient>, ICommentHub {
        private readonly NotesDbContext _dbContext;
        private readonly ILogger<CommentsHub> _logger;
        public CommentsHub(NotesDbContext dbContext, ILogger<CommentsHub> logger) {
            this._dbContext = dbContext;
            this._logger = logger;
        }

        public async Task RemoveConnectionFromGroup(Guid userId, Guid noteId) {
            await this.Groups.RemoveFromGroupAsync(noteId.ToString(), Context.ConnectionId);
            this._logger.LogDebug("Remove the following user: " + userId);
        }

        public async Task SendUpdatedComments(Comment comment) {
            await this.Groups.AddToGroupAsync(Context.ConnectionId, comment.NoteId.ToString());
            this._logger.LogDebug(Context.ConnectionId); 
            await Clients.Group(comment.NoteId.ToString()).ReceiveMessage(comment);
        }


    }

}
