
function doCircleMenu(){
	/* Manage toggle zction */
	var menu_item = document.querySelector('.menu-button');
	menu_item.onclick = function(e) {
		console.log('click');
		e.preventDefault();

		$('.circular-menu').toggleClass("openontop");
		$('.circle').toggleClass("open");

		
		/* Only one open at the same time */
		if($('.circle').hasClass("open") && $('.slideout-menu').hasClass("open")){
			$('.slideout-menu').toggleClass("open");
			$('.slideout-menu').animate({
				right: '-50%'
			});
		}
	};
	
	/* Add click listeners into items */
	var menu_items = document.querySelectorAll('.menu-item');
	for(var i = 0; i < menu_items.length; i++){
		menu_items[i].onclick = function(e) {
			console.log('click');
			e.preventDefault();
			
			switch(e.target.getAttribute('id')){
				case "movies":
					console.log('display movies');
					displayMovies();
					break;
				case "musics":
					console.log('display musics');
					displayMusics();
					break;
					
				default:
			}
			$('.circle').toggleClass("open");
            $('.circular-menu').toggleClass("openontop");
		}
	}
	
	/* Add click listeners into items */
	var menu_itemsF = document.querySelectorAll('.menu-functionality');
	for(var i = 0; i < menu_itemsF.length; i++){
		menu_itemsF[i].onclick = function(e) {
			console.log('click');
			e.preventDefault();
			
			switch(e.target.getAttribute('id')){
				case "startScan":
				
					if('ontouchstart' in window || !!(navigator.msMaxTouchPoints)){
						console.log("init for touch");  //need to check for capabilities if touch                                                   WVXBB
						startScan();
					 }
					else{
						console.log("init for click");
                    	startFakeScan();
					 }
					console.log('do scan');
					break;
				case "speech":
					console.log('do speech');
					recognizeSpeechFind();
					break;
				case "home":
					console.log('do home');
					window.location = "IHM.html";
					break;
					
				default:
			}
			$('.circle').toggleClass("open");
            $('.circular-menu').toggleClass("openontop");
		}
	}
	
	/* Display items on a circle */
	var items = document.querySelectorAll('.circle a');
	var l = items.length
	for(var i = 0; i < l; i++) {
		items[i].style.left = (50 - 35*Math.cos(-(1/(l-1))*i*Math.PI)) + "%";
		items[i].style.top = (80 + 35*Math.sin(-(1/(l-1))*i*Math.PI)) + "%";
	}
	
}