//load express and create app
var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080;
const bodyParser = require('body-parser');
//set port based on environment
var port = PORT;

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







//send index.html file to the user for the home page
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
    
});

app.route('/login-process')
    .get(function(req, res) {
        res.send('This is the login page')    
       var output = 'getting the login! ';
       var input1 = req.query.input1;
       var input2 = req.query.input2;
       console.log('The params:'+ req.query.input1 + " " + req.query.input2);
      
    //res.send('Login Page working')
   })
   // process the form (POST http://localhost:PORT/login)
   .post(function(req, res) { console.log('processing');
   res.send('processing the login form!');
 });

//create routes for admin section
var adminRouter = express.Router();
//admin main page. the dashboard (http://locahost:PORT/admin)
adminRouter.get('/', function(req, res){
    res.sendFile(__dirname + '/admin.html');
});
//users page(http://localhost:Port/admin/users)
adminRouter.get('/users', function(req, res){
    res.send('I show all the users!');
    // var output = 'getting the login! ';
    // var input1 = req.query.input1;
    // var input2 = req.query.input2;
    // console.log('The params:'+ req.query.input1 + " " + req.query.input2);
});
//posts page (http://localhost:PORT/admin/posts)
adminRouter.get('/posts', function(req, res){
    res.send('I show all the posts!'); 
});

//Apply the routes to the app
app.use('/admin', adminRouter);


//Middleware
adminRouter.use(function(req, res, next){
    //log each request to the console
    console.log(req.method, req.url);
    //Continue to next part and go to route
    next();});



//Comments page
var commentsRouter = express.Router();
commentsRouter.get('/', function(req, res){
    res.sendFile(__dirname + '/Comments.html');
});
app.use('/comments', commentsRouter);

var eventsRouter = express.Router();
eventsRouter.get('/', function(req, res){
    res.sendFile(__dirname + '/Events.html')
});
app.use('/events', eventsRouter);

var settingsRouter = express.Router();
settingsRouter.get('/', function(req, res){
    res.sendFile(__dirname + '/Settings.html')
});
app.use('/settings', eventsRouter);

var loginRouter = express.Router();
loginRouter.get('/', function(req, res){
    res.sendFile(__dirname + '/login.html')
});
app.use('/login', loginRouter);


var registerRouter = express.Router();
registerRouter.get('/', function(req, res){
    res.sendFile(__dirname + '/Register.html')
});
app.use('/register', registerRouter);

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

app.use('/images', imageRouter);

//Start server
app.listen(PORT);
console.log('Express Server running at http://127.0.0.1:'.PORT);

