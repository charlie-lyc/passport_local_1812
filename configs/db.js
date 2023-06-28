/**
 * Mongoose no longer accepts a callback.
 */
const mongoose = require('mongoose')


module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        if (process.env.NODE_ENV === 'dev') {
            console.log(`MongoDB connected`);
        }
    } catch (err) {
        if (process.env.NODE_ENV === 'dev') {
            console.log(err);
        }
    }
}