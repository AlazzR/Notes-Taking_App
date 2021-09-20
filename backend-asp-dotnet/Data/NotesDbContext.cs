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

            modelBuilder.Entity<User>()
                .HasMany<Note>(user => user.Notes)
                .WithOne(note => note.User)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>()
                .HasOne<Token>(user => user.Token)
                .WithOne(token => token.User)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<Note>()
                .HasMany<Comment>(comment => comment.Comments)
                .WithOne(note => note.Note)
                .OnDelete(DeleteBehavior.Cascade);

            //Constraints on Notes table
            modelBuilder.Entity<Note>().HasIndex(note => note.Id).IsUnique(true);
            modelBuilder.Entity<Note>().Property(note => note.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<Note>().Property(note => note.createdAt).HasDefaultValueSql("GETDATE()");

            //Constraints on Tokens table
            modelBuilder.Entity<Token>().HasIndex(token => token.Id).IsUnique(true);
            modelBuilder.Entity<Token>().Property(token => token.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<Token>().Property(token => token.CreatedAt).HasDefaultValueSql("GETDATE()");

            //Constraints on Comments table
            modelBuilder.Entity<Comment>().HasIndex(comment => comment.Id).IsUnique(true);
            modelBuilder.Entity<Comment>().Property(comment => comment.Id).HasDefaultValueSql("NEWID()");
            modelBuilder.Entity<Comment>().Property(comment => comment.CreatedAt).HasDefaultValueSql("GETDATE()");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Note> Notes { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<Comment> Comments { get; set; }

        public DbSet<Connection> Connections { get; set; }
    }
}
