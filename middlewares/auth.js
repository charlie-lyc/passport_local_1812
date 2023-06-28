const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    } else {
        req.flash('error_msg', 'You need to log in.')
        res.redirect('/users/login')
    }
}

const forwardAuthenticated = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/dashboard')
    }
}

module.exports = {
    ensureAuthenticated,
    forwardAuthenticated
}