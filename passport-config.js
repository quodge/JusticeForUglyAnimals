const LocalStrategy = require('passport-local').Strategy

function initialize(passport, getUserByUsername){
    const authenticateUser = (username, password, done) => {
        const user = getUserByUsername(username)
        if user == null){
            return done(null, false, {message: 'No user with that email'})
        }

        if(password == user.password){
            return done(null, user)
        }else{
            return done(null, false, {message: 'Password incorrect'})
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'username'}), 
    authenticateUser)
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })

}

module.export = initialize