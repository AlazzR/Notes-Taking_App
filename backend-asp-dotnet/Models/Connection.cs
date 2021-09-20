using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Models {
    [Table("connections", Schema = "real_time_processing")]
    public class Connection {
        [Key]
        [Column("connectionId")]
        public string ConnectionID { get; set; }
        [Column("userAgent")]
        public string UserAgent { get; set; }
        [Column("connected")]
        public bool Connected { get; set; }
    }
}
