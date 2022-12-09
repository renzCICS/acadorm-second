const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


// Load Owner MOdel
const Owner = require('../models/owner');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username'}, (username, password, done) => {
            // Match User
            Owner.findOne({username: username })
            .then(owner => {
                if(!owner) {
                    return done(null, false, { message: "That username is not registered"});
                }

                // Match password
                bcrypt.compare(password, owner.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch) {
                        return done(null, owner);
                    } else {
                        return done(null, false, { message: 'Password incorrect'})
                    }
                })
            })
            .catch(err => consolelog(err));
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser((id, done) => {
        Owner.findById(id, (err, user) => {
            done(err, user);
        })
    })
}