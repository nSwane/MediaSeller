
var db;
if(window.openDatabase){
    var dbName = 'MediaSeller';
    var version = '1.0';
    var comment = 'database';
    var size = 1024*1024;
    db = openDatabase(dbName, version, comment, size);
};

function onErrorAccess(){
    console.log("Error: SQL query failed");
};

/**
 * Requetes asynchrones -->
 * besoin d'une fonction de callback pour recuperer les resultats
 * une fois la requete terminee.
 * 
 * Get all products by type.
 * productType = "movie" | "music" | "all"
 * 
 * @param {type} productType
 * @param {type} callback
 * @returns {undefined}
 */
function getAllByType(productType, callback){
    
    var resultList = [];
    db.transaction( // begin transaction
        function (tx){ // execute query
            
            var querySelectMovies = "";
            var isAll = false;
            if(productType === "all"){
                querySelectMovies = "SELECT * FROM Product";
                isAll = true;
            }
            else{
                querySelectMovies = "SELECT * FROM Product WHERE dtype=?";
                
            }
            
            tx.executeSql(
                querySelectMovies,
                isAll?[]:[productType],
                function (tx, results){
                    var len = results.rows.length, i;
                    for (i = 0; i < len; i++){
                        
                        resultList[i] = {
							dtype: results.rows.item(i).dtype,
							id: results.rows.item(i).id,
                            label: results.rows.item(i).label,
                            description: results.rows.item(i).description,
                            price: results.rows.item(i).price,
                            pathToImage: results.rows.item(i).pathToImage                           
                        };
                        
                        switch(productType){
                            case "all":
                            case "movie":
                                resultList[i].genre = results.rows.item(i).genre;
                                resultList[i].actors = results.rows.item(i).actors;
                                resultList[i].producer = results.rows.item(i).producer;
                                if(!isAll){
                                    break;
                                }
                                
                            case "music":
                                resultList[i].artist = results.rows.item(i).artist;
                                resultList[i].genre = results.rows.item(i).genre;
                                if(!isAll){
                                    break;
                                }
                            default:
                        }                            
                   }
                   
                   callback(resultList);
                },
                onErrorAccess);
            }
            , function(){});
            
};

function report(id, label){
    console.log(id,label);
}
function findById(id, callback) {
   // console.log("try to find " + id + " on " + db);
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM Product WHERE id=?', [id], function (tx, results) {
            console.dir(results.rows);
            if (results.rows.length  == 0) {
                callback(null);
            } else {
                callback(results.rows.item(0));
            }
        });
    });
}


/**
 * Find products by key words.
 * Approximate search with fuse.js (Open Source)
 * 
 * @param {type} productInfo
 * @returns {undefined}
 */
function find(productInfo){
    console.log('Find '+productInfo);
	
    getAllByType(
        "all",
        function(resultList){
            var options = {
                keys: ['label', 'actors', 'artist', 'producer']   // keys to search in
            };
            
            var f = new Fuse(resultList, options, true);
            var result = f.search(productInfo);
            console.log(result.length);
            displayProducts(result);
        }
    );
    
    
};