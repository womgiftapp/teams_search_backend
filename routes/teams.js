const express = require('express');
const router = express.Router();
//const geolib = require('geolib');
const mongoUtil = require('.././config/mongoUtil');

const conection = mongoUtil.connectServer();

// Get Teams in Radius route using mongo queries
router.get('/geonear', (req, res) => {

    if (!req.query.radius || !req.query.lat || !req.query.lng ) {
        res.send(400,'Unknown location and radius for search nearby teams');
        return;
    }
    if ( !req.query.skip || !req.query.take ){ //||  !Number(req.query.skip)||  !Number(req.query.take)) {        
        res.send(400,'Unknown skip and take parameters for search nearby teams pagination');
        return;
    }

    conection.then(function (client) {
        console.log('Connected to MongoDB server');
        const db = client.db('joinme');    

        db.collection('teams').createIndex({ "location": '2dsphere' }).then(() => {
            // Lng and lat for haifa current location "coordinates":[32.822190, 34.994930]     

            db.collection('teams').aggregate([
                {
                    $geoNear: {
                        spherical: true,
                        near: {
                            "type": "Point",
                            "coordinates": [parseFloat(req.query.lng), parseFloat(req.query.lat)]
                        },
                        distanceField: "distance",
                        maxDistance: parseFloat(req.query.radius)
                    }

                }, {
                    $skip: Math.abs(Number(req.query.skip))
                },{
                    $limit: Math.abs(Number(req.query.take))
                }
            ])
                .toArray().then((teams) => {
                    //console.log(JSON.stringify(teams, undefined, 2));
                    res.json(teams);
                }).catch((err) => {
                    console.log('Unable to find nearby teams', err);
                });
        }).catch((err) => {
            console.log('DB create index error', err);
        });;

        client.close;
    }).catch((err) => {
        console.log('Unable to connect to MongoDB server', err);
    });

});

// Get Teams in Radius route using nodejs functions
router.get('/', (req, res) => {

    conection.then(function (client) {
        console.log('Connected to MongoDB server');
        // validation of getting location and radius in query    
        if (!req.query.radius && !req.query.lat && !req.query.lng) {
            console.log('Unknown location and radius for search nearby teams');
            return;
        }

        //Work version of getting teams inRadius from current location 
        // client.db().collection('teams').find({
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
    // console.log(req.body);
    res.send('team');
});

module.exports = router;