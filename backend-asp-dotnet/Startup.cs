using backend_asp_dotnet.Data;
using backend_asp_dotnet.Hubs;
using backend_asp_dotnet.Services;
using backend_asp_dotnet.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace backend_asp_dotnet {
    public class Startup {
        private readonly IConfiguration _configuration;
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration) {
            this._configuration = configuration;
            Configuration = this._configuration;
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {

            services.AddControllers();
            //allow cors
            services.AddCors(options => {
                options.AddPolicy(name: "allow_react_app",
                   builder => {
                       builder.WithOrigins("http://localhost:3000")
                           .AllowAnyHeader()
                           .AllowAnyMethod()
                           .AllowCredentials();
                   });
            });

            services.AddSignalR();
            //Allow JWT tokenization
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters = new TokenValidationParameters {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        //ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        ValidAudience = Configuration["Jwt:Issuer"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]))
                    };
                });

            //services.AddSingleton<AutheticationElements>();

            //Databases services
            InitializeDb(Configuration, services);
            services.AddScoped<IUserRepo, UserRepo>();
            services.AddScoped<INoteRepo, NoteRepo>();
            services.AddScoped<ITokenRepo, TokenRepo>();
            services.AddScoped<ICommentHub, CommentsHub>();
            services.AddScoped<ICommentRepo, CommentRepo>();


            /*
            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "backend_asp_dotnet", Version = "v1" });
            });
            */
        }

        private static void InitializeDb(IConfiguration configuration, IServiceCollection services) {
            //I will follow db first approach not code first approach.
            string connectionString = configuration.GetConnectionString("SqlServer");
            services.AddDbContext<NotesDbContext>(options => options.UseSqlServer(connectionString));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
                //app.UseSwagger();
                //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "backend_asp_dotnet v1"));
            }

            app.UseRouting();

            app.UseCors();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
                endpoints.MapHub<CommentsHub>("/user/notes/comments");
            });
        }
    }
}
