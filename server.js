//load express and create app
var express = require('express');
//Session tokens imports 
//const session = require('express-session');
const {v4:uuidv4} = require('uuid');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const passport = require('passport');
//const connectEnsureLogin = require('connect-ensure-login');
const User = require('./user.js');
const ejs = require('ejs');
const bcrypt = require('bcryptjs');
const flash = require('express-flash')
const session = require('cookie-session')
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
//const methodOverride = require('method-override')
const jwt_decode = require("jwt-decode");
var app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
const {check, validationResult } = require('express-validator')
//set port based on environment
var port = PORT;
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

const jwtKey = process.env.JWT_KEY
const jwtExpirySeconds = 600
//app.use(express.urlencoded({extended: false}));
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  collection.insertOne({email: "test@test.com", password: "password"}, function(err, res){
      if (err) throw err;
        console.log("Record added");
  })
  // perform actions on the collection object
  //client.close();
});
mongoose.connect(uri); 

//Login-----------------------------------------------------
const usersSchema = {
    firstname: String,
    surname: String, 
    dob: String,
    email: String,
    username: String,
    password: String

}
const user = mongoose.model("User", usersSchema);

const username = mongoose.model('username', usersSchema);

username.find({}, function(err, users){
     
        usernamesList: users


    })

const users = mongoose.model('username', 'password', usersSchema);

users.find({}, function(err, users){
    usersList: users
})

// const initializePassport = require('./passport-config');
// initializePassport(
//     passport, 
//     username => users.find(user => users.username === username),
//     id => users.find(user => user.id === id)
// )

// app.use(flash())
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false
// }))

//app.use(passport.initialize())
//app.use(passport.session())






app.get('/', function(req, res){
    
    res.render('pages/index');
    
});

app.post('/login', (req, res) => {
    var loginDetails = req.body;
    client.db("LFTU").collection("users").findOne({username: loginDetails.username}, function(err, user){
        if(user == undefined){
            res.send("Username not found");
        }
        bcrypt.compare(loginDetails.password, user.password, function(err, access){
            if(access == false){
                res.send("Incorrect password");
            }
            else{
                var userName = loginDetails.username;
                

                const token = jwt.sign({ username: userName }, jwtKey, {
                    algorithm: "HS256",
                    expiresIn: jwtExpirySeconds,
                })
                console.log("token = ", token)
                res.cookie("token", token, {maxAge: jwtExpirySeconds * 1000})
                res.redirect('/');
            }
        })
    })


    
})
/////////////////////////////////////////////////////////////



// app.use(session({
//     genid: function(req){
//         return uuidv4();
//     },
//     secret: '=fmLV*U@FL`N]]~/zqtFCch.pBTGoU',
//     resave: false,
//     saveUninitialized: true,
//     cookie: { maxAge: 60 * 60 * 1000 }
// }));




//send index.html file to the user for the home page






app.get('/login', function(req, res) {
    checkTokenInvalid(req, res); 
    res.render('pages/login');    
    
   });

   var loginValidate =[
       check('password').isLength({ min: 8}).withMessage('Password must be at least 8 characters')
       .matches('[0-9]').withMessage('Password must contain a number')
       .matches('[A-Z]').withMessage('Password must contain an uppercase letter')];
   // process the form (POST http://localhost:PORT/login)
   
   

app.post('/signout', (req, res) => {
    console.log('Reaching /signout post')
    const newToken = jwt.sign({ username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: 0,
    })
    console.log("token = ", newToken)
    res.cookie("token", newToken, {maxAge: 0 * 1000})
    
    res.redirect('/');
})

//create routes for admin section
var adminRouter = express.Router();
//admin main page. the dashboard (http://locahost:PORT/admin)
adminRouter.get('/', function(req, res){
    checkUserIsAdmin(req, res)
    res.render('pages/Admin');
});
//users page(http://localhost:Port/admin/users)
adminRouter.get('/users', function(req, res){
    res.send('I show all the users!');
    // var output = 'getting the login! ';
    // var input1 = req.query.input1;
    // var input2 = req.query.input2;
    // console.log('The params:'+ req.query.input1 + " " + req.query.input2);
});
adminRouter.post('/users' , (req, res) => {
    user.find({}, function(err, users){
        res.render('pages/Users', {
            usersList: users
        })
    })

});

//posts page (http://localhost:PORT/admin/posts)
adminRouter.get('/comments', function(req, res){
    res.send('I delete all the comments'); 
});
adminRouter.post('/comments', function(req, res){
    client.db("LFTU").collection("comments").deleteMany({});
    res.redirect("/comments");
    
})

//Apply the routes to the app
app.use('/admin', adminRouter);


//Middleware
adminRouter.use(function(req, res, next){
    //log each request to the console
    console.log(req.method, req.url);
    //Continue to next part and go to route
    next();});

const commentsSchema = {
    userComment: String
}

const comment = mongoose.model('Comment', commentsSchema);

//Comments page
// var commentsRouter = express.Router();
app.get('/comments' ,(req, res) => {
    checkTokenValid(req, res)
    
    comment.find({}, function(err, comments){
        res.render('pages/Comments', {
            commentsList: comments
    })
    
  
    
        
    });
    
// const db = client.db("LFTU");
// var cursor = db.collection('comments').find({});


});
app.post('/comments' , (req, res) => {
    console.log(req.body);
    var comment = req.body;

    client.db("LFTU").collection("comments").insertOne(comment, function(err, res){
        if (err) throw err;
        console.log("Comment added");
    })
    res.redirect('/comments');
});
// app.use('/comments', commentsRouter);

var eventsRouter = express.Router();
eventsRouter.get('/', function(req, res){
    checkTokenValid(req, res);


    res.render('pages/Events')
});
app.use('/events', eventsRouter);

var settingsRouter = express.Router();
settingsRouter.get('/', function(req, res){
    checkTokenValid(req, res);

    res.render('pages/Settings')
});
app.use('/settings', settingsRouter);


 

// var registerRouter = express.Router();
app.route('/register')
.get(function(req, res){
    checkTokenInvalid(req, res)
    res.render('pages/Register')
});
app.post('/register' , (req, res) => {
    //console.log(req.body); 
    var regData = req.body;
    //regData = regData + 'myEvents: [""]';
    // https://www.npmjs.com/package/bcryptjs to find bcryptjs
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(regData.password, salt, function(err, hash){
            regData.password = hash;
            client.db("LFTU").collection("users").insertOne(regData, function(err, res){
        
                if(err) throw err;
                console.log("User added");
                
            });
        })
    })
    res.redirect('/login');
    //Try to hash password. Comment out down to end of catch and change user to regData in insertOne
    // try{ 
    //     const hashedPassword = await bcrypt.hash(req.body.password, 10);
        //console.log('hashed password is ', regData);
    //     var user = users.push({
    //         id: Date.now().toString(),
    //         firstname: req.body.firstname,
    //         surname: req.body.surname,
    //         dob: req.body.dob,
    //         email:req.body.email,
    //         username: req.body.username,
    //         password: hashedPassword
    //     })
    //     var dateSubmit = Date.now().toString();
    //     var firstnameSubmit = req.body.firstname;
    //     var surnameSubmit = req.body.surname;
    //     var dobSubmit = req.body.dob;
    //     var emailSubmit = req.body.email;
    //     var usernameSubmit = req.body.username;
    //     var passwordSubmit = hashedPassword;


    //     // var user2 = {dateSubmit, firstnameSubmit, surnameSubmit, dobSubmit, usernameSubmit, passwordSubmit}
    //     res.redirect('/login')
    // } catch{
    //     res.redirect('/register')
    // }
    //////////////////////////////////////////////////////////

    
    
    //res.redirect("/login");
});

app.get('/pageUnavailable', function(req, res){
    res.render('pages/NotLoggedIn');
});
//app.use('/register', registerRouter);

function checkTokenValid(req, res){
    const token = req.cookies.token

    if(!token){
        res.redirect('/pageUnavailable')
        return res.status(401).end()
    }

    var payload

    try{
        payload = jwt.verify(token, jwtKey)
    }catch (e){
        if(e instanceof jwt.JsonWebTokenError){
            res.send('Credentials invalid')
            return res.status(401).end()
        }
        res.send(res.send('Other issue accessing token'))
        return res.status(400).end()
    }
    res.send('The username : ' + payload.username);
    const newToken = jwt.sign({ username: payload.username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    })
    console.log("token = ", newToken)
    res.cookie("token", newToken, {maxAge: jwtExpirySeconds * 1000})

}
function checkUserIsAdmin(req, res){
    const token = req.cookies.token

    if(!token){
        res.redirect('/pageUnavailable')
        return res.status(401).end()

        var payload

        try{
            payload = jwt.verify(token, jwtKey)
        }catch (e){
            if(e instanceof jwt.JsonWebTokenError){
                res.send('Credentials invalid')
                return res.status(401).end()
            }
            res.send('The username : ' + payload.username);
            const newToken = jwt.sign({ username: payload.username }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds,
            })
        }
        if (payload.username != AdminLFTU){
            res.redirect('/pageUnavailable')
        }
    }
}

function checkTokenInvalid(req, res){
    const token = req.cookies.token

    if(token){
        res.send('Already logged in')
        
    }
}











var cssRouter = express.Router();
cssRouter.get('/', function(req, res){
    res.sendFile(__dirname + '/Styles.css')
});
app.use('/styles', cssRouter);

var imageRouter = express.Router();
imageRouter.get('/buffalo', function(req, res){
    res.sendFile(__dirname + '/images/Buffalo.jpg')
});
imageRouter.get('/image1', function(req, res){
    res.sendFile(__dirname + '/images/photo1.jpg')
});
imageRouter.get('/image2', function(req, res){
    res.sendFile(__dirname + '/images/photo2.jpg')
});
imageRouter.get('/image3', function(req, res){
    res.sendFile(__dirname + '/images/photo3.jpg')
});
imageRouter.get('/image4', function(req, res){
    res.sendFile(__dirname + '/images/photo4.jpg')
});
imageRouter.get('/image5', function(req, res){
    res.sendFile(__dirname + '/images/photo5.jpg')
});
imageRouter.get('/sadDog', function(req, res){
    res.sendFile(__dirname + '/images/sadDog.jpg')
})

app.use('/images', imageRouter);

//Start server
app.listen(PORT);
console.log('Express Server running at http://127.0.0.1:'.PORT);

