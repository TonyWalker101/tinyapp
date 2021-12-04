// tests

const { assert } = require('chai');
const bcrypt = require("bcrypt");

const {
  getUserByEmail,
  generateRandomString,
  userPasswordMatches,
  urlsForUser,
  getUser
} = require('../helper.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('#generateRandomString', function() {
  
  it('Should return a string', function() {

    const random = generateRandomString();

    const actualOutput = typeof random;
    const expectedOutput = "string";
    
    assert.equal(actualOutput, expectedOutput);
  });

  it('Should return a string of 6 characters/numbers', function() {

    const random = generateRandomString();

    const actualOutput = random.length;
    const expectedOutput = 6;
    
    assert.equal(actualOutput, expectedOutput);
  });

  it('Should return a string of 6 random characters/numbers', function() {

    const random = generateRandomString();
    const random2 = generateRandomString();

    const actualOutput = random;
    const expectedOutput = random2;
    
    assert.notEqual(actualOutput, expectedOutput);
  });

});


describe('#getUserByEmail', function() {
  
  it('Given an unknown email, should return undefined', function() {
    
    const actualOutput = getUserByEmail("test@example.com", testUsers);
    const expectedOutput = undefined;
    
    assert.equal(actualOutput, expectedOutput);
  });
  
  it('Given a valid email, should return the entire user object', function() {
    
    const actualOutput = getUserByEmail("user@example.com", testUsers);
    const expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    
    assert.deepEqual(actualOutput, expectedOutput);
  });
  
  it('Given a valid email, should return a user id if requested', function() {
    
    const actualOutput = getUserByEmail("user@example.com", testUsers).id;
    const expectedOutput = "userRandomID";
    
    assert.equal(actualOutput, expectedOutput);
  });
  
});

describe('#userPasswordMatches', function() {
  
  it('Should return true if the password matches our user DB', function() {

    const user = {
      id: "userRandomID",
      email: "user@example.com",
      password: bcrypt.hashSync("purple-monkey-dinosaur",10)
    };

    const password = "purple-monkey-dinosaur";

    const actualOutput = userPasswordMatches(user, password);
    const expectedOutput = true;
    
    assert.equal(actualOutput, expectedOutput);
  });

  it('Should return undefined if the password does not match our user DB', function() {

    const user = {
      id: "userRandomID",
      email: "user@example.com",
      password: bcrypt.hashSync("purple-monkey-dinosaur", 10)
    };

    const password = "wrong password";

    const actualOutput = userPasswordMatches(user, password);
    const expectedOutput = undefined;
    
    assert.equal(actualOutput, expectedOutput);
  });

});

describe('#urlsForUser', function() {

  const urlDatabase = {
    "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "abc"},
    "wdgfsd": {longURL: "http://www.google.com", userID: "123"},
    "rgasdv": {longURL: "http://www.google.com", userID: "123"}
  };
  
  
  it('Should return a {shortUrls: longUrls} object specific to that user from DB', function() {

    const actualOutput = urlsForUser("abc", urlDatabase);
    const expectedOutput = { "b2xVn2": "http://www.lighthouselabs.ca"};
    
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it('Should return an empty object if user has nothing in DB', function() {

    const actualOutput = urlsForUser("xyz", urlDatabase);
    const expectedOutput = {};
    
    assert.deepEqual(actualOutput, expectedOutput);
  });

});

describe('#getUser', function() {

  // const urlDatabase = {
  //   "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "abc"},
  //   "wdgfsd": {longURL: "http://www.google.com", userID: "123"},
  //   "rgasdv": {longURL: "http://www.google.com", userID: "123"}
  // };

  it('Should return a specific user object from a DB using a user id', function() {

    const actualOutput = getUser(testUsers, "userRandomID");
    const expectedOutput = {
      id: "userRandomID",
      email: "user@example.com",
      password: "purple-monkey-dinosaur"
    };
    
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it('Should return undefined if user id does not exist in DB', function() {

    const actualOutput = getUser(testUsers, "abc");
    const expectedOutput = undefined;
    
    assert.equal(actualOutput, expectedOutput);
  });

});