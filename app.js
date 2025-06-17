const express = require('express');
const session = require('express-session');
const RHRoutes = require('./src/Routes/RHRoutes');
const mainRoutes = require('./src/Routes/mainRoutes');
const employeRoutes = require('./src/Routes/employeRoutes');
const computerRoutes = require('./src/Routes/computerRoutes');
const chatbotRoutes = require('./src/Routes/chatbotRoutes'); // Nouvelle ligne
const app = express();
require('dotenv').config();

app.set("views", "./src/views");
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: true,
  saveUninitialized: true,
}));
app.use(RHRoutes);
app.use(mainRoutes);
app.use(employeRoutes);
app.use(computerRoutes);
app.use(chatbotRoutes); // Nouvelle ligne

app.listen(3000, () => {
  console.log('le serveur est lancé sur le port 3000');
});