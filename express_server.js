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

// User registration logic

const userDatabase = {
  "abc": {
    id: "abc",
    email: "test@email.com",
    password: "123"
  }
};

// Helper function checks if user exists already in userDatabase
const userExistsInDatabase =  (email) => {
  for (let obj in userDatabase) {
    let user = userDatabase[obj];

    if (user.email === email) {
      return user;
    }
  }

  return false;
};

// Helper function checks if user's password matches
const userPasswordMatches =  (user, password) => {
  // for (let obj in userDatabase) {
  //   // let user = userDatabase[obj];

  if (user.password === password) {
    return true;
  };
  
  return false;
};



// Helper function that gets a user from the database
getUser = (object, cookie) => {
  return object[cookie];
};

// Home page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// /urls page
app.get("/urls", (req, res) => {
  const user = getUser(userDatabase, req.cookies["user_id"]);

  const templateVars = {
    urls: urlDatabase,
    user: user
  };

  res.render("urls_index", templateVars);
});

// /urls/new page
app.get("/urls/new", (req, res) => {
  const user = getUser(userDatabase, req.cookies["user_id"]);
  
  const templateVars = {
    user: user
  };
  res.render("urls_new", templateVars);
});

// /register page
app.get("/register", (req, res) => {

  const user = getUser(userDatabase, req.cookies["user_id"]);
  
  const templateVars = {
    // username: req.cookies["username"],
    user: user
    // database: userDatabase,
  };
  res.render("user_registration", templateVars);
});

// /login page
app.get("/login", (req, res) => {
  const user = getUser(userDatabase, req.cookies["user_id"]);
  
  const templateVars = {
    user: user
  };

  res.render("login", templateVars);
});


// Registering New User
app.post("/register", (req, res) => {
  // const user = getUser(userDatabase, req.cookies["user_id"]);
  const email = req.body.email;
  const password = req.body.password;

  randomID = generateRandomString();
  const newUser1 = {};
  
  if (email === "" || password === "") {
    // res.status(400);
    return res.status(400).send("Email and/or password is invalid");
  };
  
  if (userExistsInDatabase(email)) {
    // res.status(400);
    return res.status(400).send("Email already registered!");
  }

  newUser1["id"] = randomID
  newUser1["email"] = req.body["email"];
  newUser1["password"] = req.body["password"];

  res.cookie("user_id", newUser1["id"]);

  userDatabase[randomID] = newUser1;
  
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
  const email = req.body.email;
  const password = req.body.password;

  if (userExistsInDatabase(email)) {

    const user = userExistsInDatabase(email);

    if (userPasswordMatches(user, password)) {
      res.cookie("user_id", user.id);
      return res.redirect("/urls");
    }

  }

  return res.status(401).send("Email and/or password does not match our records");
});

// Logging Out 
app.post("/logout", (req, res) => {
  res.clearCookie("user_id", req.body["username"]);
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
  const user = getUser(userDatabase, req.cookies["user_id"]);

  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    user: user
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