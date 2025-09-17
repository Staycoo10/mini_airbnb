const validateEmail = (email) => {
  const allowedDomains = ["gmail.com", "mail.com", "yahoo.com", "icloud.com"]; 
  const emailParts = email.split("@");
  
  if (emailParts.length !== 2 || !allowedDomains.includes(emailParts[1])) {
    return {
      isValid: false,
      error: "Email must be from an allowed domain (e.g., gmail.com)"
    };
  }
  
  return { isValid: true };
};

const validateIDNP = (idnp) => {
  if (idnp.length !== 13 || isNaN(idnp)) {
    return {
      isValid: false,
      error: "IDNP must contain exactly 13 numeric digits"
    };
  }
  
  return { isValid: true };
};

module.exports = {
  validateEmail,
  validateIDNP
};