using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace backend_asp_dotnet.Data {
    public class ValidateDoB: ValidationAttribute {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext) {
            if (value == null)
                return new ValidationResult("Unknown object");
            DateTime date = (DateTime)value;
            if (date.Year >= 1990 && date.Year <= DateTime.Now.Year)
                return ValidationResult.Success;
            return new ValidationResult("Please enter a validDob");
        }
    }
}
