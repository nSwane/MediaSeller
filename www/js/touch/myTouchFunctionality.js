/**
 * Created by jennifer on 04/12/14.
 */

/* Helper padding according to touched point */
var dragPaddingX = 30;
var dragPaddingY = 60;

/* Initialize helper */
function initializeHelper(item){
	console.log('Initialize helper');
	var divHelper = document.createElement('div');
	divHelper.setAttribute('class', 'doigt');
	document.body.appendChild( divHelper );
	divHelper.style.top  = (item.touchStartAt.y-dragPaddingY) + 'px';
	divHelper.style.left = (item.touchStartAt.x+dragPaddingX) + 'px';
	item.divHelper = divHelper;
}

/* Remove helper */
function removeHelper(item){
	/* Remove helper if exists*/
	if(item.divHelper){
		console.log('Remove helper');
		document.body.removeChild(item.divHelper);
		delete(item.divHelper);
	}
}

/* Callback function on timeout before drag */
function dragTimeout(item){
	return function(){
		console.log('Timeout');
		
		/* Differenciate TOUCH_START -> TOUCH_MOVE with timeout triggered or not */
		item.timeoutRecieved = true;
		
		switch(item.currentState){
			case item.stateDefinition.TOUCH_START:
				
				/* Update state */
				item.currentState = item.stateDefinition.TOUCH_MOVE;
				
				/* Initialize helper */
				initializeHelper(item);
				break;
				
			default:
				console.log('Unexpected event on TOUCH_START -> TOUCH_MOVE: '+item.currentState);
		}
	}
}

/* Initialize timeout before drag */
function initializeDragTimeout(item){
	var delay = 1000;
	
	console.log('Initialize timeout before drag: '+delay+'ms');
	
	/* Do drag after 1000 ms */
	item.dragTimeout = setTimeout(dragTimeout(item), delay);
}

/* TouchStart handler */
function touchStartHandler(item){
	return function(event){
		console.log('touch start');
		
		var touches = event.changedTouches;
		var touchX = touches[0].pageX;
		var touchY = touches[0].pageY;
		
		/* Update time elapsed since last 'touch start' */
		// var last = item.touchStartLast;
		// console.log('Last touch start: '+last);
		// var elapsed = (new Date()).getTime() - last;
		// item.touchStartLast = elapsed;
		
		// console.log('time elapsed since last touch start: '+item.touchStartLast);
		
		/* Detect double tap */
		// if(item.touchStartLast < 1000){
			// console.log('double tap');
			
			// /* Send modality to the fusion engine */
			// var modality = {target: item, name: 'DOUBLE_TAP'};
			// fusionEngine.push(modality);
		// }
		
		item.touchStartNumber++;
		switch(item.touchStartNumber){
			case 1:
				item.touchStartFirst = (new Date()).getTime();
				console.log('first: '+ item.touchStartFirst); 
				break;
			case 2:
				item.touchStartSecond = (new Date()).getTime();
				console.log('first: '+ item.touchStartFirst); 
				console.log('second: '+ item.touchStartSecond);

				var elapsedTime = item.touchStartSecond - item.touchStartFirst;
				console.log('time elapsed since last touch start: '+elapsedTime);
				if(elapsedTime < 1000){
					console.log('double tap');
					
					/* Send modality to the fusion engine */
					var modality = {target: item, name: 'DOUBLE_TAP'};
					fusionEngine.push(modality);
				}
				delete(item.touchStartFirst);
				delete(item.touchStartSecond);
				item.touchStartNumber = 0;				
				break;
			default:
		}
		
		switch(item.currentState){
			case item.stateDefinition.IDLE:
				console.log('IDLE -> TOUCH_START');
				
				/* Update state */
				item.currentState = item.stateDefinition.TOUCH_START;
				
				/* Initialize timeout before drag */
				item.timeoutRecieved = false;
				item.touchStartAt = {x: touchX, y: touchY};
				initializeDragTimeout(item);
				
				break;
				
			default:
				console.log('Unexpected event on IDLE -> TOUCH_START: '+item.currentState);
		}
	}
}

/* TouchMove handler */
function touchMoveHandler(item){
	return function(event){
		console.log('touch move');
		
		
		var touches = event.changedTouches;
		var touchX = touches[0].pageX;
		var touchY = touches[0].pageY;
		
		switch(item.currentState){
			case item.stateDefinition.TOUCH_START:
			
				/* Update state */
				/* Drag only on timeout */
				if(!item.timeoutRecieved){
					item.currentState = item.stateDefinition.TOUCH_START;
					console.log('TOUCH_START -> TOUCH_START');
					
					/* No wish to drag -> Clear timeout before drag */
					clearTimeout(item.dragTimeout);
				}
				else{
					item.currentState = item.stateDefinition.TOUCH_MOVE;
					console.log('TOUCH_START -> TOUCH_MOVE');
				}
				break;
				
			case item.stateDefinition.TOUCH_MOVE:
				
				/* Avoid unwanted scroll while dragging */
				event.preventDefault();
				
				console.log('TOUCH_MOVE -> TOUCH_MOVE');
			
				/* Update state */
				item.currentState = item.stateDefinition.TOUCH_MOVE;
				
				/* Move helper */
				item.touchMoveAt = {x: touchX, y: touchY};
				moveHelper(item);
				
				break;
				
			default:
				console.log('Unexpected event on TOUCH_MOVE -> TOUCH_MOVE: '+item.currentState);
		}
	}
}

/* TouchEnd handler */
function touchEndHandler(item){
	return function(event){
		console.log('touch end');
		
		var touches = event.changedTouches;
		var touchX = touches[0].pageX;
		var touchY = touches[0].pageY;
		
		switch(item.currentState){
			case item.stateDefinition.TOUCH_START:
				console.log('TOUCH_START -> TOUCH_END');
				
				/* Clear timeout before drag */
				clearTimeout(item.dragTimeout);
				break;
				
			case item.stateDefinition.TOUCH_MOVE:
				console.log('TOUCH_MOVE -> TOUCH_END');
				
				/* Drop item if possible */
				item.touchEndAt = {x: touchX, y: touchY};
				dropItem(item);
				break;
				
			default:
				console.log('Unexpected event on [TOUCH_START | TOUCH_MOVE] -> TOUCH_END: '+item.currentState);
		}
		
		/* Remove helper */
		removeHelper(item);
		
		/* Update state */
		item.currentState = item.stateDefinition.TOUCH_END;
		item.currentState = item.stateDefinition.IDLE;
	}
}

/* Drop item into cart */
function dropItem(item){
	console.log('drop');
	
	/* Check if drop into draggable item */
	var fingerWidth = 50;
	var droppableItems = document.getElementsByClassName('makeMeDroppable');
	for(var i = 0; i < droppableItems.length; i++){
		var droppableItem = droppableItems[i];
		
		/* Add product into the cart if possible */
		/* Recall: the draggable item is a picture contained in a div and the product value is inside the button */
		var button = document.getElementById('product'+item.parentNode.getAttribute('id'));
		var p = JSON.parse(button.value);
		switch(droppableItem.getAttribute('id')){
			case "buttonCart":
				if((droppableItem.offsetLeft-fingerWidth) <= item.touchEndAt.x && item.touchEndAt.x <= (droppableItem.offsetLeft + droppableItem.offsetWidth + fingerWidth)
				&& (droppableItem.offsetTop-fingerWidth) <= item.touchEndAt.y && item.touchEndAt.y <= (droppableItem.offsetTop + droppableItem.offsetHeight + fingerWidth)){
					addToCart(p);
				}
				break;
			case "sliderCart":
				/* Only check x axis since the slider takes the whole height */
				if((droppableItem.offsetLeft-fingerWidth) <= item.touchEndAt.x && item.touchEndAt.x <= (droppableItem.offsetLeft + droppableItem.offsetWidth + fingerWidth)){
					addToCart(p);
				}
				break;
			default:
				console.log('Draggable item not managed: '+droppableItem.getAttribute('id'));
		}
		
	}
}

/* Move helper */
function moveHelper(item){
	console.log('move');
	
	item.divHelper.style.top  = (item.touchMoveAt.y-dragPaddingY) + 'px';
	item.divHelper.style.left = (item.touchMoveAt.x+dragPaddingX) + 'px';
}

/* Initialize drag&drop events */
function myDragAndDropInit() {
	
	var draggableItems = document.getElementsByClassName('draggable');
	for(var i= 0; i < draggableItems.length; i++){
		var draggableItem = draggableItems[i];
		
		/* Initalize item state */
		(function(item){
			/* Time elapsed since last 'touch start' */
			item.touchStartLast = (new Date()).getTime();
			item.touchStartNumber = 0;
			item.stateDefinition = {IDLE: 0, TOUCH_START: 1, TOUCH_MOVE: 2, TOUCH_END: 3, DRAG_START: 4};
			item.currentState = item.stateDefinition.IDLE;
		})(draggableItem);
		
		/* Add touchstart listener */
		(function(item){
			item.addEventListener('touchstart', touchStartHandler(item));
		})(draggableItem);
		
		/* Add touchstart listener */
		(function(item){
			item.addEventListener('touchmove', touchMoveHandler(item));
		})(draggableItem);
		
		/* Add touchend listener */
		(function(item){
			item.addEventListener('touchend', touchEndHandler(item));
		})(draggableItem);
	}
}
