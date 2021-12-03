// Helper functions

// Function checks if user exists already in userDatabase
const getUserByEmail = (email, userDatabase) => {

  for (let obj in userDatabase) {
    let user = userDatabase[obj];

    if (user.email === email) {
      return user;
    }
  }

  return false;
};

module.exports = { getUserByEmail };