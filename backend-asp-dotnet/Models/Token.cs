using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Models {
    [Table("Token", Schema = "NotesUsers")]
    public class Token {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid Id { get; set; }
        [Column("token", TypeName = "NVARCHAR(500)")]
        [Required]
        public string TokenValue { get; set; }
        [Column("createdAt", TypeName = "DATE")]
        [Required]
        public DateTime CreatedAt { get; set; }
        [Column("userId", TypeName = "uniqueidentifier")]
        [Required]
        public Guid UserId { get; set; }
        public User User { get; set; }
    }
}
