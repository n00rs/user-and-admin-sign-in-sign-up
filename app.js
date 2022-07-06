const express = require('express');
const path = require('path');
const url = require('url')
const app = express();
const db = require('./connections/connect');
const port = 3000;
const session = require('express-session');

const adminRouter = require('./routes/admin');
const loginRouter = require("./routes/login");
const signupRouter = require('./routes/signup');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')

app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: "key", resave: false, saveUninitialized: true, cookie: { maxAge: 100000000 } }))

db.connect((err) => {
    if (err) console.log("error" + err);

    else console.log("db conneted");
})
app.use('/', loginRouter);
app.use('/signup', signupRouter);
app.use('/admin', adminRouter);

app.listen(port, () => { console.log("up at 3000"); })