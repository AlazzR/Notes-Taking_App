using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Dtos {
    public class NoteCreation {
        public string Title { get; set; }
        public string Note { get; set; }
        public NoteCreation() { }
    }
}
