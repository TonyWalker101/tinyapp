// Helper functions
const bcrypt = require("bcrypt");

// Function generates a random string for use with user IDs
const generateRandomString = () => {
  return Math.random().toString(20).substring(2,8);
};

// Function checks if user exists already in userDatabase
const getUserByEmail = (email, userDatabase) => {

  for (let obj in userDatabase) {
    let user = userDatabase[obj];

    if (user.email === email) {
      return user;
    }
  }
};

// Function checks if a user's password matches our database
const userPasswordMatches = (user, password) => {

  if (bcrypt.compareSync(password, user.password)) {
    return true;
  };
  
};


module.exports = { 
  getUserByEmail, 
  generateRandomString,
  userPasswordMatches
};