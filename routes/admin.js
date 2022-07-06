const express = require('express');
const router = express.Router();
const adminConfig = require('../config/adminconfig');
const userConfig = require('../config/userconfig');
const verifyAdmin = (req, res, next) => {
    if (req.session.adminIn) {                                 //checking admin login session
        next()
    } else {
        res.redirect("/admin/login")
    }
}

router.get('/', verifyAdmin, (req, res) => {
    let admin = req.session.user;
    adminConfig.getUsers().then((users) => {
        res.render("admin/view-user", { admin, users })
    })
})

router.get('/adminSignup', (req, res) => {
    res.render("admin/admin-signup", { "Error": req.session.error })
    req.session.error = false;
})

router.post('/adminSignup/signup', (req, res) => {
    adminConfig.adminSignup(req.body).then((response) => {
        res.redirect('/admin');
    }).catch((err) => {
        req.session.error = err;

        res.redirect('/admin/adminSignup');
    })
})

router.get('/login', (req, res) => {
    if (req.session.adminIn) {
        res.redirect("/admin")
    } else {
        res.render('admin/login', ({ "Error": req.session.notAdmin }));
        req.session.notAdmin = false;
    }
})

router.post("/login/login", (req, res) => {
    console.log(req.body);
    adminConfig.adminLogin(req.body).then((response) => {
        if (response.status) {
            req.session.adminIn = true;
            req.session.user = response.admin;
            res.redirect('/admin');
        } else {
            req.session.notAdmin = "Not Authorised"
            res.redirect('/admin/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login")
})

router.get('/add-user', verifyAdmin, (req, res) => {
    res.render('admin/add-user', { "emailError": req.session.exisitError });
    req.session.exisitError = false;
})

router.post('/add-user', (req, res) => {
    userConfig.doSignup(req.body).then((data) => {
        res.redirect("/admin")
    }).catch((err) => {
        req.session.exisitError = err;
        res.redirect('/admin/add-user')
    })
})

router.get('/delete-user', verifyAdmin, (req, res) => {
    let id = req.query.id;
    adminConfig.deleteUsers(id).then((ans) => {
        res.redirect('/admin');
    })
})

router.get('/edit-user/:id', verifyAdmin, (req, res) => {
    let id = req.params.id;
    adminConfig.getUser(id).then((userData) => {
        res.render("admin/edit-user", { userData })
    })
})

router.post('/edit-user', (req, res) => {
    console.log(req.body);
    adminConfig.updateUser(req.body).then((response) => {
        res.redirect('/admin')
    })
})

module.exports = router;