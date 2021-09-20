using backend_asp_dotnet.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Services {
    public interface INoteRepo {
        public Guid CreateNewNote(string token, string title, string note);
        public bool UpdateNote(string token, Guid id, string title, string note);
        public bool DeleteNote(string token, Guid id);
        public NoteProjection GetNoteById(string token, Guid id); 
    }
}
