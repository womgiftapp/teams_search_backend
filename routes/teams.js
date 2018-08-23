const express = require('express');
const router = express.Router();
//const geolib = require('geolib');
// const { MongoClient, ObjectID } = require('mongodb');

var mongoUtil = require('.././config/mongoUtil');

var conection = mongoUtil.connectServer();


router.get('/geonear', (req, res) => {
    if (typeof req.query.radius === "undefined"
        && typeof req.query.lat === "undefined"
        && typeof req.query.lng === "undefined") {
        console.log('Unknown location and radius for search nearby teams');
        return;
    }

    // db.getCollection('Teams').aggregate([
    //     { 
    //           "$geoNear": {
    //               "near": {
    //                    "type": "Point",
    //                    "coordinates": [24.56, 27.45]
    //                },
    //                "distanceField": "distance",
    //                "maxDistance": 200,
    //                "spherical": true,
    //                "query": { "loc.type": "Point" }
    //            }
    //       }
    //   ])

    conection.then(function (client) {
        console.log('Connected to MongoDB server');
        const db = client.db('joinme');

        // db.collection('Teams').find({}).toArray().then((teams) => {
        //     res.json(teams);
        //    console.log(JSON.stringify(teams, undefined, 2));
        // });
        
        db.collection('Teams').aggregate([
            {
                $geoNear: {
                    "near": {
                        "type": "Point",
                        "coordinates": [23.56, 27.45]
                        //coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                    },
              //      key: 'location',
                    "distanceField": "distance",
              //distanceField: "dist.calculated",
                    "maxDistance": 2000,
                    "spherical": true,
                  //  "query": { "loc.type": "Point" }
                }
            }
            // ,
            // {
            //     "$sort": { "distance": -1 } // Sort the nearest first
            // }

            //db.getCollection('Teams').aggregate([{$sort:{"_id":-1}}])
            // {
            //         $sort: { "_id": -1 } // Sort the nearest first
            //     }
        ]
        // ,
        //     function (err, docs) {
        //         //if(err) console.log("Error"+err);
        //         console.log("docs: "+docs);
        //        // res.json(docs);
        //     }
        ).toArray().then((docs)=>{
            console.log(JSON.stringify(docs, undefined, 2));
        });
        
        client.close;
    }).catch((err) => {
        console.log('Unable to connect to MongoDB server');
    });

});

// Get Teams in Radius route
router.get('/', (req, res) => {

    conection.then(function (client) {
        console.log('Connected to MongoDB server');
        //    
        if (typeof req.query.radius !== "undefined"
            && typeof req.query.lat !== "undefined"
            && typeof req.query.lng !== "undefined") {

            client.db().collection('Teams').find({
                location: { $geoWithin: { $centerSphere: [[32, 21.1], 10 / 3963.2] } }
            }
            ).toArray().then((teams) => {
                console.log(JSON.stringify(teams, undefined, 2));
                // let teamsInRadius=[];
                // teams.forEach(team => {
                //     var { name, location: { lat, lng } } = team;
                //     console.log(`name: ${name}, lat: ${lat}, lng: ${lng}`);
                //     if (typeof req.query.radius !== "undefined"
                //         && typeof req.query.lat !== "undefined"
                //         && typeof req.query.lng !== "undefined") {
                //         //                    
                //         const inRadius = geolib.isPointInCircle(
                //             { latitude: lat, longitude: lng },
                //             { latitude: req.query.lat, longitude: req.query.lng },
                //             req.query.radius * 1000);
                //         //
                //         const distance = geolib.getDistance(
                //             { latitude: lat, longitude: lng },
                //             { latitude: req.query.lat, longitude: req.query.lng }
                //         );

                //         console.log(`distance from current location: ${distance / 1000}; in radius ${inRadius}`);
                //         if (inRadius) {
                //             teamsInRadius.push(team);
                //         }
                //     }
                // });
                res.json(teams);

            }, (err) => {
                console.log('Unable to fetch Teams', err);
            });
        }

        //Work version of getting teams inRadius from current location 
        // client.db().collection('Teams').find({
        // }).toArray().then((teams) => {
        //     //console.log(JSON.stringify(teams, undefined, 2));
        //     let teamsInRadius=[];
        //     teams.forEach(team => {
        //         var { name, location: { lat, lng } } = team;
        //         console.log(`name: ${name}, lat: ${lat}, lng: ${lng}`);
        //         if (typeof req.query.radius !== "undefined"
        //             && typeof req.query.lat !== "undefined"
        //             && typeof req.query.lng !== "undefined") {
        //             //                    
        //             const inRadius = geolib.isPointInCircle(
        //                 { latitude: lat, longitude: lng },
        //                 { latitude: req.query.lat, longitude: req.query.lng },
        //                 req.query.radius * 1000);
        //             //
        //             const distance = geolib.getDistance(
        //                 { latitude: lat, longitude: lng },
        //                 { latitude: req.query.lat, longitude: req.query.lng }
        //             );

        //             console.log(`distance from current location: ${distance / 1000}; in radius ${inRadius}`);
        //             if (inRadius) {
        //                 teamsInRadius.push(team);
        //             }
        //         }
        //     });
        //     res.json(teamsInRadius);

        // }, (err) => {
        //     console.log('Unable to fetch Teams', err);
        // });
        //res.send(`lat: ${req.query.lat}, lng: ${req.query.lng}, radius: ${req.query.radius}`);
    }).catch((err) => { console.log('Unable to connect to MongoDB server' + err); });

});



//POST Team route
router.post('/', (req, res) => {
    console.log(req.body);
    res.send('team');
});

module.exports = router;