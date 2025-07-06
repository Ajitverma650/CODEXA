const validator = require("validator");

// This function validates user registration data
const validate = (data) => {
  const mandatoryField = ['firstName', 'emailId', 'password'];

  // ✅ Check if all required fields are present
  const isAllowed = mandatoryField.every((key) => Object.keys(data).includes(key));
  if (!isAllowed) {
    throw new Error("Some Field Missing");
  }

  // ✅ Validate email format
  if (!validator.isEmail(data.emailId)) {
    throw new Error("Invalid Email");
  }

  // ✅ Validate password strength
  // You can customize rules if needed
  const isStrong = validator.isStrongPassword(data.password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,  // set to 1 if you want stricter rules
    minNumbers: 1,
    minSymbols: 0     // set to 1 if you want stricter rules
  });

  if (!isStrong) {
    throw new Error("Weak Password"); // 🛠️ fixed spelling from "Week"
  }
};

module.exports = validate;
