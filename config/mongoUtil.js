var MongoClient = require( 'mongodb' ).MongoClient;

var _db;

// DB config
const dbPath = require('./database');

module.exports = {

  connectToServer: function( callback ) {
   
    MongoClient.connect( dbPath.mongoURI, { useNewUrlParser: true }, function(err, client) {
      _db = client.db('joinme');      
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  },

  connectServer: function() {
   return MongoClient.connect(dbPath.mongoURI, { useNewUrlParser: true })
  }


};
