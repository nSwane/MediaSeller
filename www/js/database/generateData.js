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

function onErrorGeneration(){
	console.log("Error: Data generation failed");
};

function insertMovies(tx){
    var queryInsertMovie =
        "INSERT INTO Product(id, dtype, label, description, pathToImage, price, genre, actors, producer) \n\
        values (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    for(var i = 100; i < 113; i++){
		var index = i-100;
        
		var id = i;
        var dtype = "movie";
        var label = movies_data[index].label;
        var description = movies_data[index].description;
        var pathToImg = movies_data[index].pathToImage;
        var price = movies_data[index].price;
        var genre = movies_data[index].genre;
        var actors = movies_data[index].actors;
        var producer = movies_data[index].producer;
        tx.executeSql(
                queryInsertMovie,
                [id, dtype, label, description, pathToImg, price, genre, actors, producer],
                null,
                null
        );
    };    
};

function insertMusics(tx){
    var queryInsertMusic =
        "INSERT INTO Product(id, dtype, label, description, pathToImage, price, genre, artist) \n\
        values (?, ?, ?, ?, ?, ?, ?, ?)";
    
    for(var i = 200; i < 206; i++){
		var index = i-200;
		
        var id = i;
        var dtype = "music";
        var label = musics_data[index].label;
        var description = null;
        var pathToImg = musics_data[index].pathToImage;
        var price = musics_data[index].price;
        
        var genre = "genre"+i;
        var artist = musics_data[index].artist;
        tx.executeSql(
            queryInsertMusic,
            [id, dtype, label, description, pathToImg, price, genre, artist],
            null,
            null
        );
    };    
};

/*---------- Initialization chain ----------*/

function onSuccessGenerateMovies(){
    db.transaction(insertMusics, onErrorGeneration, onSuccessGenerateMusics);
}

function onSuccessGenerateMusics(){
	/* Go to IHM page after initialize all products */
	window.location="IHM.html";
}

function generateData(){
    db.transaction(insertMovies, onErrorGeneration, onSuccessGenerateMovies);
};

