/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
var db;
if(window.openDatabase){
    var dbName = 'MediaSeller';
    var version = '1.0';
    var comment = 'database';
    var size = 1000;
    db = openDatabase(dbName, version, comment, size);
};

function onErrorInitialization(){
    console.log("Error initialization");
	alert("ERROR: Initialization failed");
};

function onSuccessDrop(){
    console.log("Drop OK");
	db.transaction(createTable, onErrorInitialization, onSuccessCreate);
};

function onSuccessCreate(){
    console.log("Create OK");
    generateData();

};

function dropTable(tx){
    var queryDropTable = "DROP TABLE IF EXISTS Product";
    tx.executeSql(queryDropTable, [], null, null);
};

function createTable(tx){
    var queryCreateTable = 
        "CREATE TABLE IF NOT EXISTS Product (\n\
        \
        id REAL PRIMARYKEY,\n\
        dtype TEXT,\n\
        label TEXT,\n\
        description TEXT,\n\
        pathToImage TEXT,\n\
        price REAL,\n\
        \
        genre TEXT,\n\
        actors TEXT,\n\
        producer TEXT,\n\
        \
        artist TEXT)";
    
    tx.executeSql(queryCreateTable, [], null, null);
};

function initializeDB(){
    db.transaction(dropTable, onErrorInitialization, onSuccessDrop);
};

function initializeApp(){
	app.initialize();
	console.log('Application initialized');
}