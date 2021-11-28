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

const userDatabase = {};

// / page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// /urls page
app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

// /urls/new page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// /login page
app.get("/login", (req, res) => {
  const templateVars = { username: userDatabase};
  res.render("login", templateVars);
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

// Username Creating 
app.post("/login/update", (req, res) => {
  res.cookie("username") = req.body["username"];
  console.log("Cookies:", res.cookie("username"));
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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
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

const generateRandomString = () => {
  return Math.random().toString(20).substring(2,8);
};

