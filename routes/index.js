const express = require('express')
const { ensureAuthenticated, forwardAuthenticated } = require('../middlewares/auth')


const router = express.Router()

router.get('/', 
    forwardAuthenticated, 
    (req, res) => {
        // res.send('welcome')
        res.render('welcome')
    }
)

router.get('/dashboard', 
    ensureAuthenticated, 
    (req, res) => {
        res.render('dashboard', {
            user: req.user
        })
    }
)

module.exports = router