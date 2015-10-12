/*TODO: add voice to buy button for bothweb and mobile,
fix push button so it is in the middle,
fix drag and drop to work with web version,
make checkout screen prettier
putbuy button event in differntfile,
make cicrlemenu pretty

- the two scan buttons and the voice button.
----------------------------------------
-circular menu
-swipe left and right to naviagte?


hold for 1 seconds vibrate phone then toggle draggable on after the drop toggle draggle off or when touchends
enable button for adding to cart only when acvitve


 */
function displayInit() {
	fusionEngine.initialize();
    initializeListeners();
    initCart();
	cartSlider();
    displayCart();
    displayMovies();
	doCircleMenu();
    addButtonClickEvents();

};

function checkoutPageInit(){

	fusionEngine.initialize();
    initCart();
    cartSlider();
    displayCart();
	doCircleMenu();
    addButtonClickEvents();


    $(".myitem").empty();
    $(".myitemqty").empty();
    $(".myitemprice").empty();
    $(".myitemqtyprice").empty();
    $(".mytotal").empty();
    var cart = getCart();
    var totalPriceofCart= 0;
    for(var i = 0; i < cart.length; i++){
        if(cart[i] != "undefined"){
            console.log("price: ",cart[i].price, "count", cart[i].count);
            totalPriceofCart +=cart[i].price*cart[i].count;
            var idnum=cart[i].id;
            var listitem = $( "<li/>");
            $( "<p/>").text(cart[i].label).appendTo( $(".myitem") ) ;
            $( "<p/>").text(cart[i].count).appendTo( $(".myitemqty"));
            $( "<p/>").text(cart[i].price).appendTo( $(".myitemprice"));
            $( "<p/>").text(cart[i].price*cart[i].count).appendTo( $(".myitemqtyprice"));

        }
    }
    $( "<p/>").text(totalPriceofCart.toPrecision(4)+"€").appendTo( $(".mytotal"));


};


/*
 * Display all products.
 *
 */
function displayProducts(productList) {

    /* Get html table context */
    var contentBody = document.getElementById('contentBody');

    /* Remove previous results */
    $('#contentBody').empty();

    /* The product list is empty */
    if (!productList || productList.length == 0) {
        /* Create message */
        var msg = document.createElement('li');
        msg.appendChild(document.createTextNode('No product found'));
        contentBody.appendChild(msg);

    }
    /* The product list is not empty */
    else {

        /* Construct the html code */
        for (var i = 0; i < productList.length; i++) {

            /* Construct an element */
            var li = document.createElement('li');
            var div = document.createElement('div');
            var img = document.createElement('img');
            var h1 = document.createElement('h1');
            var p = document.createElement('p');
            var h2 = document.createElement('h2');

            img.setAttribute('class', 'draggable product_image');
            img.setAttribute('alt', productList[i].label);
            img.setAttribute('src', productList[i].pathToImage);

            h1.appendChild(document.createTextNode(productList[i].label));

			switch(productList[i].dtype){
				case "movie":
					p.appendChild(document.createTextNode(productList[i].description));
					break;
				case "music":
					p.appendChild(document.createTextNode(productList[i].artist));
					break;
				default:
			}
			

            h2.appendChild(document.createTextNode(productList[i].price+"€"));

            var cartButton = document.createElement('button');
            var cartButtonName = document.createTextNode('Add');

            cartButton.setAttribute('id', 'product' + productList[i].id);
            cartButton.setAttribute('value', JSON.stringify(productList[i]));

            // cf events.js
            (function(cart){
				cart.addEventListener('click', function(){
					console.log('add to cart!');
					var serializedProduct = cart.value;
					var deserializedProduct = JSON.parse(serializedProduct);
					addToCart(deserializedProduct);
				});
			})(cartButton);

            cartButton.appendChild(cartButtonName);
            // alert("before"+productList[i].id);
            div.setAttribute('id', productList[i].id);
            div.setAttribute('class', 'product');


            div.appendChild(img);
            div.appendChild(h1);
            div.appendChild(p);
            div.appendChild(h2);
            div.appendChild(h2);
            div.appendChild(cartButton);

            li.appendChild(div);
            contentBody.appendChild(li);
            $("#" + productList[i].id).data("myProd", JSON.stringify(productList[i]));
            //console.log($("#" + productList[i].id).data());


        }

    }
    //attach drag and drop events to all of the content
    myDragAndDropInit();
};

/*
 * Display all movies.
 * Requetes asynchrones -->
 * besoin d'une fonction de callback pour recuperer les resultats
 * une fois la requete terminee.
 */
function displayMovies() {
    getAllByType(
        "movie",
        function (resultList) {
            displayProducts(resultList);
        }
    );
};

function displayMusics() {
    getAllByType(
        "music",
        function (resultList) {
            displayProducts(resultList);
        }
    );
};

function displayCart() {
    console.log("display cart");
    $(".shoppingCartContent").empty();
	var cart = getCart();
    console.log("display cart length",cart.length);

    for(var i = 0; i < cart.length; i++){
		if(cart[i] != "undefined"){
            var idnum=cart[i].id;
            var listitem = $( "<li/>");
            $( "<a/>").attr('id',"itemnum"+cart[i].id).addClass("cartitem").text(cart[i].label).appendTo( listitem ) ;
            listitem.appendTo(".shoppingCartContent");
            $("<div/>").addClass("itemcount").text(cart[i].count).appendTo(listitem);
            $( "<div/>").attr('id',"delnum"+cart[i].id).addClass("delitem").text("X").appendTo( listitem);
            $("#delnum" + cart[i].id).bind('click'
                , function (idnum) {
                    return function () {
                        removeFromCart(idnum)     ;
                    }
                }(idnum)
            );

		}
	}
};

function cartSlider(){
	$('.slideout-menu-toggle').on('click', function(event){
		event.preventDefault();
		var slideoutMenu = $('.slideout-menu');
		var slideoutMenuWidth = $('.slideout-menu').width();
		
		slideoutMenu.toggleClass("open");
		
		if (slideoutMenu.hasClass("open")) {
			/* Only one open at the same time */
			if($('.circle').hasClass("open")){
				$('.circular-menu').toggleClass("openontop");
				$('.circle').toggleClass("open");
				
			}
			
			slideoutMenu.animate({
				right: '0px'
			});	
		} else {
			slideoutMenu.animate({
				right: '-50%'
			});	
		}
	});
};
