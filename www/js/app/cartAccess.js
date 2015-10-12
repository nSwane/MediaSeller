
var myShoppingcart = [];

function clearCart(){
    console.log("clearing cart");
    var temp = [];
    sessionStorage.setItem("mycart",JSON.stringify(temp)) ;
    myShoppingcart=retrieve();
    displayCart();

}
function initCart(){

	var serializedCart = sessionStorage.getItem("mycart");
	if(serializedCart){
		myShoppingcart= JSON.parse(serializedCart);  //load it intot he var
		console.log("init cart size: "+myShoppingcart.length);
	}
	else{
		sessionStorage.setItem("mycart",JSON.stringify(myShoppingcart)) ;   //create empty list
		console.log("init non exisiting cart size: "+myShoppingcart.length);
	}
}

function checkForExsisting(id){
    var size = myShoppingcart.length;
    for(i = 0; i< size;i++){
        var arf = myShoppingcart[i].id == id;
        var barf = myShoppingcart[i].id === id
        console.log("checking id: "+id+ " against the id: "+myShoppingcart[i].id+ "t ou f: "+ arf+barf);
        if (myShoppingcart[i].id == id){
            console.log("there are the same");
            return i;

        };

    }
    return -1;
}


/* Add a product into the cart_Structure */
function addToCart(product){
    myShoppingcart = retrieve();

    //push an object in to our array
    var index =  checkForExsisting(product.id);
    console.log("index is: "+index);
    if(index >=0){
        console.log("exsiting");
        myShoppingcart[index].count= myShoppingcart[index].count +1;
    }
    else {
        console.log("not exsisting");
        product.count = 1;
        myShoppingcart.push(product);
    }

    store();

    console.log('Product ' + product.label+ ' added to cart');
    displayCart();
};

/* Remove a product from cart_Structure */
function removeFromCart(id){
    myShoppingcart = retrieve();
    var index =  checkForExsisting(id);
    console.log("index is: "+index);
    if(index >=0){
        //myShoppingcart.pop(index);
        myShoppingcart.splice(index, 1);
        console.log('Product removed from cart');
    }
    else {
        console.log('Product not found');
       //nothing to delete
    }

    store();
    displayCart();

};

/* Store the cart_Structure into sessionStorage */
function store(){

    sessionStorage.setItem("mycart",JSON.stringify(myShoppingcart)) ;
   // console.log('Store cart_Structure: '+cart_Structure.length+' elements');
};

function retrieve(){
   return myShoppingcart= JSON.parse(sessionStorage.getItem("mycart"));


}
/* Return the cart (product array)*/
function getCart(){
    return myShoppingcart;
};

/**
 * Created by jennifer on 09/12/14.
 */
