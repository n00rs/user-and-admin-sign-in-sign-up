const express = require('express');
const router = express.Router();
const db = require('../config/connect');
const userconfig = require('../config/userconfig');

router.get("/", (req, res, next) => {
    if (req.session.loggedIn) {
        res.redirect('/home')
    } else {
        res.render('login', { "loginError": req.session.loginError })
        req.session.loginError = false;
    }
})

router.get("/home", (req, res,) => {
    let user = req.session.user;
    if (req.session.loggedIn) {
        res.render('home', { user })
    } else {
        res.redirect('/')
    }
})

router.post("/login", (req, res) => {
    userconfig.doLogin(req.body).then((response) => {
        if (response.status) {
            req.session.loggedIn = true;
            req.session.user = response.user;
            res.redirect('/home')
        } else {
            req.session.loginError = "invalid password or id";
            res.redirect('/');
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/')
})

module.exports = router;