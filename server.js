//load express and create app
var express = require('express');
var app = express();
const PORT = process.env.PORT || 8080;
//set port based on environment
var port = PORT;
//send index.html file to the user for the home page
app.get('/', function(req, res){
    //create routes for admin section
    var adminRouter = express.Router();
    //admin main page. the dashboard (http://locahost:PORT/admin)
    adminRouter.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
    });
    //users page(http://localhost:Port/admin/users)
    adminRouter.get('/users', function(req, res){
        res.send('I show all the users!');
    });
    //posts page (http://localhost:PORT/admin/posts)
    adminRouter.get('/posts', function(req, res){
        res.send('I show all the posts!'); 
    });

    //Apply the routes to the app
    app.use(/'admin', adminRouter);
    
});
//Start server
app.listen(PORT);
console.log('Express Server running at http://127.0.0.1:'.PORT);

