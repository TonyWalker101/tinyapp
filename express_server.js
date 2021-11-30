// Requiring and calling Express package
const express = require("express");
const app = express();

// Requiring and calling Body Parser Package
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//Requiring Cookie Parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const PORT = 8080;

// Setting template engine to EJS
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  return Math.random().toString(20).substring(2,8);
};

// const randomID = generateRandomString();

// User registration logic

const userDatabase = {};

const newUser = {};

generateUser = (database, user) => {
  return database[randomID] = user;
};


// Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// /urls page
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

// /urls/new page
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

// /register page
app.get("/register", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    user: newUser,
    database: userDatabase,
  };
  res.render("user_registration", templateVars);
});

// Registering New User
app.post("/register", (req, res) => {
  randomID = generateRandomString();

  newUser["id"] = randomID
  newUser['email'] = req.body["email"];
  newUser['password'] = req.body["password"];
  userDatabase[randomID] = newUser;
  
  console.log(userDatabase);
  res.redirect(`/urls`);
});

// Tiny URL Creating 
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"];
  res.redirect(`/urls/${shortURL}`);
});


// Deleting URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  res.redirect("/urls");
});

// Login Creating 
app.post("/login", (req, res) => {
  res.cookie("username", req.body["username"]);
  res.redirect(`/urls`);
});

// Logging Out 
app.post("/logout", (req, res) => {
  delete res.cookie("username", req.body["username"]);
  res.redirect(`/urls`);
});

// Updating URL
app.post("/urls/:shortURL/update", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"];
  res.redirect(`/urls/${shortURL}`);
});

// /urls/TinyURL page
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  req.params.shortURL = templateVars.shortURL;
  res.render("urls_show", templateVars);
});

// Tiny URL auto-redirecting to Long URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, ()=> {
  console.log(`Example app listening on port ${PORT}`);
});

