using backend_asp_dotnet.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Models {
    [Table("User", Schema = "NotesUsers")]
    public class User {

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public Guid Id { get; set; }
        [Column("username", TypeName = "NVARCHAR(28)")]
        [Required]
        [MinLength(8)]
        public string Username { get; set; }
        [Column("email", TypeName = "NVARCHAR(1024)")]
        [Required]
        public string Email { get; set; }
        [Column("password", TypeName = "NVARCHAR(MAX)")]
        [Required]
        public string Password { get; set; }

        [Column("dob", TypeName = "Date")]
        [Required]
        [ValidateDoB]
        public DateTime Dob { get; set; }
        
        public User() {}

    }
}
