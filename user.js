// const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

// const uri = process.env.MONGODB_URI;
// mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// //user login schema
// const Schema = mongoose.Schema;
// const User = new Schema({
//     username: String,
//     password: String
// });

// User.plugin(passportLocalMongoose);

// module.exports = mongoose.model('userData', User, 'userData');