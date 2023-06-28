const express = require('express')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('../models/User')
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth')


const router = express.Router()

//////////////////////////////////////////////////////////////////
router.get('/register', forwardAuthenticated, (req, res) => {
    // res.send('register')
    const errors = []
    res.render('register', {
        errors,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    })
})
router.post('/register', async (req, res) => {
    // console.log(req.body)
    const errors = []
    const { name, email, password, password2 } = req.body
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields.'})
    }
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match.'})
    }
    if (password.length < 6) {
        errors.push({ msg: 'Passwords should be at least 6 characters.'})
    }
    if (errors.length > 0) {
        res.render('register', { 
            errors,
            name,
            email,
            password,
            password2,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        })
    } else {
        // res.send('register')
        try {
            const user = await User.findOne({ email })
            if (user) {
                errors.push({ msg: 'Email already in use.'})
                res.render('register', { 
                    errors,
                    name,
                    email,
                    password,
                    password2,
                    success_msg: req.flash('success_msg'),
                    error_msg: req.flash('error_msg')
                })
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashedPass = await bcrypt.hash(password, salt)
                const newUser = await User.create({
                    name,
                    email,
                    // password,
                    password: hashedPass
                })
                if (!newUser) {
                    errors.push({ msg: 'Not registered user.'})
                    res.render('register', { 
                        errors,
                        name,
                        email,
                        password,
                        password2,
                        success_msg: req.flash('success_msg'),
                        error_msg: req.flash('error_msg')
                    })
                } else {
                    req.flash('success_msg', 'You are registered and now can log in.')
                    res.redirect('/users/login')
                }
            }
        } catch (err) {
            if (process.env.NODE_ENV) {
                console.log(err)
            }
        }
    }
})

//////////////////////////////////////////////////////////////////
router.get('/login', forwardAuthenticated, (req, res) => {
    // res.send('login')
    const errors = []
    res.render('login', { 
        errors,
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    })
})
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true   
    })(req, res, next)
})
// router.post('/login', async (req, res) => {
//     // console.log(req.body)
//     const errors = []
//     const { email, password } = req.body
//     if (!email || !password) {
//         errors.push({ msg: 'Please fill in all fields.'})
//     }
//     if (password.length < 6) {
//         errors.push({ msg: 'Password should be at least 6 characters.'})
//     }
//     if (errors.length > 0) {
//         res.render('login', { 
//             errors,
//             success_msg: req.flash('success_msg'),
//             error_msg: req.flash('error_msg')
//         })
//     } else {
//         // res.send('login')
//         try {
//             const foundUser = await User.findOne({ email })
//             if (!foundUser) {
//                 errors.push({ msg: 'Not found user.'})
//                 res.render('login', { 
//                     errors,
//                     success_msg: req.flash('success_msg'),
//                     error_msg: req.flash('error_msg')
//                 })
//             } else {
//                 const match = await bcrypt.compare(password, foundUser.password)
//                 if (!match) {
//                     errors.push({ msg: 'Password does not match.'})
//                     res.render('login', { 
//                         errors,
//                         success_msg: req.flash('success_msg'),
//                         error_msg: req.flash('error_msg')
//                     })
//                 } else{
//                     // res.render('dashboard', { user: foundUser })
//                     res.redirect('/dashboard')
//                 }
//             }
//         } catch (err) {
//             if (process.env.NODE_ENV) {
//                 console.log(err)
//             }
//         }
//     }
// })

//////////////////////////////////////////////////////////////////
router.get('/logout', ensureAuthenticated, (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out.')
    res.redirect('/users/login')
})


module.exports = router