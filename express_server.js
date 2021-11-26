// Requiring and calling Express package
const express = require("express");
const app = express();

// Requiring and calling Body Parser Package
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

const PORT = 8080;

// Setting template engine to EJS
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// Main page
app.get("/", (req, res) => {
  res.send("Hello!");
});

// URLs page
app.get("/urls.json", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

// Pre-POST page
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// Post-POST page
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body["longURL"];
  res.redirect(`/urls/${shortURL}`);
});

// Post-POST Page Redirection
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  req.params.shortURL = templateVars.shortURL;
  res.render("urls_show", templateVars);
});

// Tiny URL auto-redirect
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

