require('dotenv').config()
const express = require('express')
const expressEjsLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')
const mongoConnect = require('./configs/db')

/**
 * Import passport and configure strategy
 */
const passport = require('passport')
const passportConfigure = require('./configs/passport')
passportConfigure(passport)

//////////////////////////////////////////////////////////////
/* Initialize app */
const app = express()
/* Connect MongoDB */
mongoConnect()

/* Set view engine */
app.set('view engine', 'ejs')
/* EJS layout middleware */
app.use(expressEjsLayouts)

/* Body parser: through <form> HTML element */
app.use(express.urlencoded({ extended: true }))
/* Body parser: through object of body payload */
// app.use(express.json())

/** 
 * Session for 'connect-flash' and 'passport' package 
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,            // secure, but not efficient
    saveUninitialized: true, // secure, but not efficient
    // cookie: {                // for passport authentication
    //     secure: false,
    //     maxAge: 60 * 60000
    // }
}))
/* Connect-flash */
app.use(flash())

/**
 * Passport with session for using 'req.user', 'req.isAuthenticated()', 'req.logout()'
 */
app.use(passport.session())
/**
 * Initialize passport
 */
app.use(passport.initialize())

//////////////////////////////////////////////////////////////
/* Routing */
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))

//////////////////////////////////////////////////////////////
/* Port */
const port = process.env.PORT || 3001
/* Start server */
app.listen(port, () => {
    if (process.env.NODE_ENV == 'dev') {
        console.log(`Server started on port ${port}`);
    }
})