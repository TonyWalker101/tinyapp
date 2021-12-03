// Express Package
const express = require("express");
const app = express();
const PORT = 8080;

//Bcrypt Package
const bcrypt = require("bcrypt");

// Body Parser Package
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// Cookie Session Package
const cookieSession = require("cookie-session");
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}));

// Setting template engine to EJS
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID: "abc"},
  "9sm5xK": {longURL: "http://www.google.com", userID: "abc"}
};

//  Helper Functions

const { 
  getUserByEmail, 
  generateRandomString, 
  userPasswordMatches,
  urlsForUser
} = require("./helper");

const userDatabase = {
  "abc": {
    id: "abc",
    email: "test@email.com",
    password: bcrypt.hashSync("123",10)
  }};


// Helper function that gets a specific user from a database
getUser = (object, cookie) => {
  return object[cookie];
};

// Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// No user found page
app.get("/usernotfound", (req, res) => {

  
  if (!req.session.user_id) {

    const user = null;
    const templateVars = {
      user: user,
    };

    return res.render("login_required", templateVars);
  }
  
  return res.redirect("/urls");
});

// /urls page
app.get("/urls", (req, res) => {

  if (req.session.user_id) {

    const user = getUser(userDatabase, req.session.user_id);
    const urlList = urlsForUser(req.session.user_id, urlDatabase);
  
  
    const templateVars = {
      urls: urlList,
      user: user,
    };
  
    return res.render("urls_index", templateVars);    
  }

  return res.redirect("/usernotfound");
});

// /urls/new page
app.get("/urls/new", (req, res) => {

  if (req.session.user_id) {

    const user = getUser(userDatabase, req.session.user_id);
    
    const templateVars = {
      user: user
    };

    return res.render("urls_new", templateVars);
  }

  return res.redirect("/usernotfound");
});

// /register page
app.get("/register", (req, res) => {

  const user = getUser(userDatabase, req.session.user_id);
  
  const templateVars = {
    user: user
  };
  
  res.render("user_registration", templateVars);
});

// /login page
app.get("/login", (req, res) => {
  const user = getUser(userDatabase, req.session.user_id);
  
  const templateVars = {
    user: user
  };

  res.render("login", templateVars);
});


// Registering New User
app.post("/register", (req, res) => {
  const email = req.body.email;

  randomID = generateRandomString();
  const newUser1 = {};
  
  if (getUserByEmail(email, userDatabase)) {
    return res.status(400).send("Email already registered!");
  }

  newUser1["id"] = randomID
  newUser1["email"] = req.body["email"];
  newUser1["password"] = bcrypt.hashSync(req.body["password"], 10);
  req.session.user_id =  newUser1["id"];

  userDatabase[randomID] = newUser1;
  
  res.redirect(`/urls`);
});


// Tiny URL Creating 
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  const cookie = req.session.user_id;

  urlDatabase[shortURL] = {longURL: req.body["longURL"], userID: cookie};

  res.redirect(`/urls/${shortURL}`);
});


// Deleting URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const cookie = req.session.user_id;
  const shortURL = req.params.shortURL;
  
  if (cookie && urlDatabase[shortURL].userID === cookie) {
    delete urlDatabase[shortURL];
    return res.redirect("/urls"); 
  }

  return res.redirect("/usernotfound");
});

// Logging into our app 
app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  if (getUserByEmail(email, userDatabase)) {

    const user = getUserByEmail(email, userDatabase);

    if (userPasswordMatches(user, password)) {
      req.session.user_id = user.id;
      return res.redirect("/urls");
    }
  }

  return res.status(403).send("Email and password combination does not match our records!");
});

// Logging Out 
app.post("/logout", (req, res) => {

  req.session = null;
  res.redirect(`/login`);

});

// Updating URL
app.post("/urls/:shortURL/update", (req, res) => {
  
  const cookie = req.session.user_id;
  const shortURL = req.params.shortURL;

  if (cookie && urlDatabase[shortURL].userID === cookie) {
    delete urlDatabase[req.params.shortURL]
  
    const shortURL = generateRandomString();
    urlDatabase[shortURL] = {longURL: req.body["longURL"], userID: cookie};
  
    return res.redirect(`/urls/${shortURL}`);
  }
  
  return res.redirect("/usernotfound");

});

// /urls/TinyURL page
app.get("/urls/:shortURL", (req, res) => {
  const cookie = req.session.user_id;
  const shortURL = req.params.shortURL

  if (cookie && urlDatabase[shortURL].userID === cookie) {
    
    const user = getUser(userDatabase, cookie);
  
    const templateVars = { 
      shortURL: shortURL, 
      longURL: urlsForUser(cookie, urlDatabase)[shortURL],
      user: user
    };
  
    req.params.shortURL = templateVars.shortURL;
    return res.render("urls_show", templateVars);
  }
  
  return res.redirect("/usernotfound");
});

// Tiny URL auto-redirecting to Long URL
app.get("/u/:shortURL", (req, res) => {
  const urls = urlDatabase[req.params.shortURL];

  const longURL = urls.longURL;
  res.redirect(longURL);
});

app.listen(PORT, ()=> {
  console.log(`Example app listening on port ${PORT}`);
});