const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const MongoConnect = callback => {
  MongoClient.connect('mongodb+srv://arjunachyuth422:arjun422@arjuncluster.fom5d.mongodb.net/shop?retryWrites=true&w=majority&appName=ArjunCluster')
  .then(client => {
    console.log('Connected!');
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
  });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;


