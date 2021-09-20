using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Dtos {
    public class NotesPagination {
        public int Offset { get; set; }
        public int Fetch { get; set; }
        public string Username { get; set; }

        public NotesPagination() { }
    }
}
