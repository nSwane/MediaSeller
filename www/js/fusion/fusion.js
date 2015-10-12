var fusionEngine = {
	initialize: function(){
		this.queue = [];
		console.log('fusion engine initialized');
	},
	
	push: function(modality){
		switch(modality.name){
			case 'DOUBLE_TAP':
				/* Double tap on a product for 'Add in cart' or 'Validate cart' */
				console.log('FUSION: double tap');
				
				var target = modality.target;
				var button = document.getElementById('product'+target.parentNode.id);
				var product = JSON.parse(button.value);
				recognizeSpeechAction(product);
				break;
				
			case 'KEY_SEARCH':
				/* Use keyboard to find a product */
				console.log('FUSION: keyboard search');
				
				var product = modality.target.elements['product'].value;
				console.log("searching product: "+product);
				if(product && product !== ""){
					find(product);
				}
				else{
					console.log('empty string');
				}
				break;
				
			case 'CONFIRM_PURCHASE':
				console.log('FUSION: confirm purchase');
                confirmSpeechAction();

				break;

				
			default:
				console.log('modality not managed');
		}
		
	}
}