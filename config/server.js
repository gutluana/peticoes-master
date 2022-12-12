console.log('estou no : [Config] Server');
const express = require("express");
const expressSession = require("express-session");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: 'segredo',
    resave: false,
    saveUninitialized: false
}));

app.listen(port, () => 
console.log(`Servidor rodando na porta ${port}`));

module.exports = app;