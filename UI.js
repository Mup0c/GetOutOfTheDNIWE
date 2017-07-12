"use strict"

console.log('UI loading');
var move_to;
var engine;

$(document).ready(function(){
	console.log('UI loaded');
	
	document.onkeydown = function checkKeycode(event){
		var keycode;
		if(!event) var event = window.event;
		if (event.keyCode) keycode = event.keyCode; // IE
		else if(event.which) keycode = event.which; // all browsers
		switch (keycode) {
			case (100): { move_to(-1, 0); break; }    // влево
			case (37): { move_to(-1, 0); break; }    // влево
			case (102): { move_to(1, 0); break; }     // вправо
			case (39): { move_to(1, 0); break; }     // вправо
			case (103): { move_to(0, -1); move_to(-1, 0); break; }   // вверх-влево
			case (104): { move_to(0, -1); break; }    // вверх
			case (38): { move_to(0, -1); break; }    // вверх
			case (105): { move_to(0, -1); move_to(1, 0); break; }    // вверх-вправо
	}
		console.log("keycode: "+keycode);
	}	
	


});
	