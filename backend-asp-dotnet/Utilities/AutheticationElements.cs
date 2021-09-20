using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace backend_asp_dotnet.Utilities {
    public class AuthenticationElements {

        public static string GenerateToken(IConfiguration configuration, string username, DateTime createdAt) {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            //payload
            Claim[] claims = new[]
            {
                new Claim("username", username),
                new Claim("created-at", createdAt.ToString()),
            };

            //create token
            var token = new JwtSecurityToken(configuration["Jwt:Issuer"],
                configuration["Jwt:Issuer"], claims, signingCredentials: credentials);

            //seralize it from jwt token to string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Summary:
        //      This method tried to deseralize the token into the unencrypted claims that is contained
        //      in it.
        //  Returns:
        //      Will return a collection of claims.
        public static IEnumerable<Claim> GetUsernameFromToken(IConfiguration configuration, string jwt) {
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken tokens = handler.ReadJwtToken(jwt);
            return tokens.Claims;
        }

        public static string GetTokenValueFromHeader(IHeaderDictionary header) {
            StringValues bearer;
            if (!header.TryGetValue("Authorization", out bearer))
                throw new Exception("This request can't be done because it doesn't have a valid header");
            return bearer.ToString().Split("Bearer ")[1];
        }

        public static string HashPassword(IConfiguration configuration, string password, int iterationCount = 100000) {
            //salt the password with your secret key
            byte[] salt = new byte[256 / 8];
            salt = Encoding.ASCII.GetBytes(configuration["PasswordSecretKey"]);

            string hashed = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,
                iterationCount: iterationCount,
                numBytesRequested: 256 / 8));
            return hashed;
        }
    }
}
