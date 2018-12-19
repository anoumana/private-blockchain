/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/
// Importing the module 'level'
const level = require('level');
// Declaring the folder path that store the data
const chainDB = './chaindata';
// Declaring a class
class LevelSandbox {
	// Declaring the class constructor
    constructor() {
    	this.db = level(chainDB);
    }

  	// Get data from levelDB with a key (Promise)
  	getLevelDBData(key){
        let self = this; // Because we are returning a promise, we will need this to be able to reference 'this' inside the Promise constructor
        return new Promise(function(resolve, reject) {
          //console.log("key : " + key);
            self.db.get(key, (err, value) => {
                if(err){
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    }else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                }else {
                //  console.log("get block from db" + key + " val" + JSON.stringify(value));
                    resolve(value);
                }
            });
        });
    }

  	// Get all data from levelDB  (Promise)
  	getAllLevelDBData(){
        let self = this; 
        var dataArray = [];
        return new Promise(function(resolve) {
            self.db.createReadStream()
            .on('data', function (data) {
                    // Count each object inserted
                dataArray.push(data);
                console.log('getAllData = ', data);
            })
            .on('error', function (err) {
                // reject with error
                console.log("error " + err);
                resolve(dataArray);
            })
            .on('close', function () {
                //resolve with the count value
                resolve(dataArray);
            });
       });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }

  	// Implement this method
    getBlocksCount() {
        let self = this;
        let count = 0;
        // Add your code here
    //  console.log("ingetblock");
           return new Promise(function(resolve) {
                self.db.createReadStream()
                .on('data', function (data) {
                        // Count each object inserted
                    count++;
                    console.log("count* : " + count);
                    console.log('key=', data);
                })
                .on('error', function (err) {
                    // reject with error
                    console.log("error " + err);
                })
                .on('close', function () {
                    //resolve with the count value
                    console.log("count: " + count);
                    resolve (count);
                });
           });
      }
}

// Export the class
module.exports.LevelSandbox = LevelSandbox;
