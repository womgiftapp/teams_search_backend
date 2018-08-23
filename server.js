const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { MongoClient, ObjectID } = require('mongodb');

const teamsRoutes = require('./routes/teams');

// //  Connect all our routes to our application
// app.use('/teams', teamsRoutes);

//Get route
app.get('/', (req, res) => {
    res.send("work");
});

const mongoUtil = require('./config/mongoUtil');
app.use('/teams', teamsRoutes);


//mongoUtil.connectToServer(function (err) {
    
   // if (err) {
   //     return console.log('Unable to connect to MongoDB server');
   // }
   // console.log('Connected to MongoDB server');
    //  Connect all our routes to our application
   
    
//     var db = mongoUtil.getDb();

// console.log(db);

//     // Get Team route
//     app.get('/', (req, res) => {
//         console.log('get teams');
//         const name = 'Mat';
//             db.collection('Teams').find({
//                 name: name
//             }).toArray().then((docs) => {
//                 console.log(`Users with name ${name}`);
//                 console.log(JSON.stringify(docs, undefined, 2));
//             }, (err) => {
//                 console.log('Unable to fetch Teams', err);
//             });    res.send(`lat: ${req.query.lat}, lng: ${req.query.lng}`);
//     });
    
    // //Get route
    // app.get('/', (req, res) => {
    //     res.send("work");
    // });
//});


const port = 3000;
app.listen(port, () => {
    console.log(`Listen port ${port}`);
});