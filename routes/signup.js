const { response } = require('express');
const express = require('express');
const router = express.Router();
const mongoClient = require('../config/connect')
const userSignup = require('../config/userconfig')

router.get('/', (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect("/home");
  } else {
    res.render('signup', { "emailError": req.session.err })
    req.session.err = false;
  }
})

router.post("/submit", (req, res, next) => {
  userSignup.doSignup(req.body).then((response) => {
    res.redirect('/');
  })
    .catch((err) => {
      req.session.err = err;
      res.redirect('/signup')
    })
});

module.exports = router;






  //   mongoClient.connect(url,(err, client) => {
    //     if (err) {
    //       res.send("data base not connected")
    //     } else {
    //       client.db("week5").collection('user3').insertOne(req.body)
    //     }
    //   })
    //   res.render("login")