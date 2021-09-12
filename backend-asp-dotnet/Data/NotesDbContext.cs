using backend_asp_dotnet.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Data {
    public class NotesDbContext: DbContext {
        private readonly ILogger<NotesDbContext> _logger;

        public NotesDbContext(DbContextOptions options, ILogger<NotesDbContext>  logger): base(options) {
            this._logger = logger;
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {
            //Fluent Api
            //Constraints on Users table
            modelBuilder.Entity<User>().HasIndex(user => user.Id).IsUnique(true);
            modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique(true);
            modelBuilder.Entity<User>().HasIndex(user => user.Username).IsUnique(true);
            modelBuilder.Entity<User>().Property(user => user.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<User>().HasIndex(user => user.Email).IsUnique(true);

        }

        public DbSet<User> Users { get; set; }
    }
}
