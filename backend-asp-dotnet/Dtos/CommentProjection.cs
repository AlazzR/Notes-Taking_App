using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Dtos {
    public class CommentProjection {
        public Guid Id { get; set; }
        public Guid NoteId { get; set; }
        public string NoteOwner { get; set; }
        public string CommentOwner { get; set; }
        public string CommentValue { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
