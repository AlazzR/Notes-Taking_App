using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Models {
    [Table("Notes", Schema = "NotesInfo")]
    public class Note {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid Id { get; set; }
        [Column("title", TypeName = "NVARCHAR(MAX)")]
        [Required]
        public string Title { get; set; }
        [Column("note", TypeName = "NVARCHAR(MAX)")]
        [Required]
        public string NoteValue { get; set; }
        [Column("createdAt", TypeName = "DATETIME2(7)")]
        public DateTime createdAt { get; set; }
        [Column("updatedAt", TypeName = "DATETIME2(7)")]
        public DateTime updatedAt { get; set; }
        [Column("userId", TypeName = "uniqueidentifier")]
        public Guid UserId { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public User User { get; set; }
    }
}
