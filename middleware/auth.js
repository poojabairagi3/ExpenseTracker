const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');

        const user = jwt.verify(token, 'secrectkey');
        // console.log('userID     >>>>>   ', user.userId);
        User.findByPk(user.userId).then(user => {
            req.user = user;
            // console.log(user);     //very imp
            next();
        }).catch(err => { throw new Error(err) })
    }
    catch (err) {
        console.log(err)
        res.status(401).json({ success: false })
    }
}

module.exports = {
    authenticate
}