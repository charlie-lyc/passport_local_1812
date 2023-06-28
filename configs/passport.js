const { Strategy: LocalStrategy } = require('passport-local')
const bcrypt = require('bcryptjs')
/**
 * Mongoose no longer accepts a callback
 */
const mongoose = require('mongoose')
const User = require('../models/User')


module.exports = (passport) => {
    passport.use(new LocalStrategy({ usernameField: 'email' }, 
        (email, password, done) => {
            if (process.env.NODE_ENV === 'dev') {
                console.log('Authenticated by Passport-Local')
            }
            // Match user
            User.findOne({ email: email})
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'That email is not registered.' })
                    }
                    // Match password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: 'Password does not match.' })
                        }
                    })
                })
        }
    ))
    /**
     * OR
     */
    /**
     * 'serializeUser()' determines what user information should be stored in the session.
     * This is called when a user is authenticated and successfully logged in.
     * Its purpose is to serialize the user object or a part of it into a format
     * that can be stored in the session.
     */
    passport.serializeUser((user, done) => {
        if (process.env.NODE_ENV === 'dev') {
            console.log('Serialize User')
        }
        return done(null, user.id)
    })
    /**
     * 'deserializeUser()' is the counterpart to 'serializeUser()'.
     * This is called on subsequent requests to deserialize the user information stored in the session 
     * and retrieve the full user object.
     * Its purpose is to retrieve the user based on the stored information (in this case, user ID) 
     * and make it available on the 'req.user' object with 'express-session'
     */
    passport.deserializeUser((id, done) => {
        if (process.env.NODE_ENV === 'dev') {
            console.log('Deserialize User')
        }
        User.findById(id)
            .then((err, user) => {
                return done(err, user)
            })
    })
}