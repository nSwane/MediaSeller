
/* Initialize listeners for the current page */
function initializeListeners(){

	/* Catch events on search bar */
	var searchBar = document.getElementById('searchBar');
	searchBar.addEventListener('submit', function(){
	
		/* Send modality to the fusion engine */
		var modality = {target: searchBar, name: 'KEY_SEARCH'};
		fusionEngine.push(modality);			
		
	});
	

};

/* Add a click listener on the node cart */
function cartAddListener(cart){

	cart.addEventListener('click', function(){
		console.log('add to cart!');
		var serializedProduct = cart.value;
		var deserializedProduct = JSON.parse(serializedProduct);
		addToCart(deserializedProduct);
	});
};


function addButtonClickEvents (){
    $(".disablevoice").hide();
    if (!('webkitSpeechRecognition' in window)) {
        $(".enablevoice").hide();
    }
    $("#gohome").click( function()
        {
            window.location=("IHM.html");
        }
    );
    $(".checkoutbutton").click( function()
        {
            window.location=("checkout.html");
        }
    );
    $("#button").click( function()
        {
            alert('button clicked');
        }
    );
    $("#achat").click(function () {

        var modality ={target: "bob",name:"CONFIRM_PURCHASE"}
        fusionEngine.push(modality);

    });
}