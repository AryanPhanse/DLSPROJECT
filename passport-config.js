const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initialize(passport,getUserbyEmail,getUserById){
    const authenticateusers = async(email,password,done)=>{
        const users = getUserbyEmail(email)
        if(users==null)
        {
            return done(null,false,{message:"No user with that email"})
        }
        try{
            if(await bcrypt.compare(password,users.password)){
                return done(null,users)
            }
            else{
                return done(null,false,{message: "password incorrect"})
            }
        }catch(e){
            console.log(e);
            return done(e)
        }
    }
    passport.use(new localStrategy({usernameField:'email'},authenticateusers))
    passport.serializeUser((users,done)=>done(null,users.id))
    passport.deserializeUser((id,done)=>{
        return done(null,getUserById(id))
    })
}
module.exports=initialize