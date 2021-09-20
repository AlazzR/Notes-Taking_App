using backend_asp_dotnet.Dtos;
using backend_asp_dotnet.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Services {
    public interface ICommentRepo {
        public CommentProjection? PostNewComment(string token, Comment comment);
        public bool RemoveComment(string token, Comment comment);
        public List<CommentProjection> GetCommentsOfNote(string token, string noteOwner, Guid NoteId);

    }
}
