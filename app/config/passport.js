const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')
function init(passport) {
    passport.use( new LocalStrategy({ usernameField: 'email' }, async (email, password, done) =>{
        //login logic
        //check if email exists
        const user = await User.findOne({ email: email})
        if(!user) {
            return done(null, false, {message: 'No user with this email'})
        }

        bcrypt.compare(password, user.password).then(match =>{
            if(match) {
                return done(null, user, { message: 'Logged in successfully'});
            }
            return done(null, false, { message: 'Wring username or password'})
        }).catch(err => {
            return done(null, false, {message: 'Something went wrong'});
        })


        //user recieved when password match
        passport.serializeUser((user, done) =>{
            done(null, user._id)
        })

        // passport.deserializeUser( (id, done) => {
        //     User.findById(id).then(user =>{
        //         done( user);
        //     })
        // })
        // passport.deserializeUser(function(id, done){
        //     User.findById(id).then(user => {
        //         // if(err){
        //         //     console.log('Error in finding user --> Passport');
        //         //     return done(err);
        //         // }
        //         return done(null, user);
        //     })
        // })
        // passport.deserializeUser(function(user, done) {
        //     process.nextTick(function() {
        //       return done(null, user);
        //     });
        // });
        // passport.deserializeUser --> User.findById(id).exec()
        // .then(user => {
        //   done(null, user);
        // })
        // .catch(err => {
        //   done(err);
        // });
        passport.deserializeUser(function(id, done) {
            User.findById(id).then(function (user) {
                done(null, user);
            }).catch(function (err) {
                done(err, null, { message: 'User does not exist' });
            });
        });
    }))
}

module.exports = init