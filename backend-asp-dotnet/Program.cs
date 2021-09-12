using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

/*
    https://www.c-sharpcorner.com/article/jwt-json-web-token-authentication-in-asp-net-core/
    https://www.c-sharpcorner.com/UploadFile/rahul4_saxena/mvc-4-custom-validation-data-annotation-attribute/

 */


namespace backend_asp_dotnet {
    public class Program {
        public static void Main(string[] args) {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder => {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
