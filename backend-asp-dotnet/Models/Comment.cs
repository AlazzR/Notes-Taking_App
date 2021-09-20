using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Models {
    [Table("Comments", Schema = "NotesInfo")]
    public class Comment {
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Column("NoteId", TypeName = "uniqueidentifier")]
        public Guid NoteId { get; set; }
        [Column("NoteOwner", TypeName = "NVARCHAR(28)")]
        public string NoteOwner { get; set; }
        [Column("CommentOwner", TypeName = "NVARCHAR(28)")]
        public string CommentOwner { get; set; }
        [Column("CommentValue", TypeName = "NVARCHAR(MAX)")]
        public string CommentValue { get; set; }
        [Column("CreatedAt", TypeName = "DATETIME")]
        public DateTime CreatedAt { get; set; }

        public Note Note { get; set; }

        public Comment() { }

    }
}
