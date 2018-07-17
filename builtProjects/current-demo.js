// New Card
function iftttCard_0(){
	// counter for times pressed / released
	var i = 0;
	slot2.on("down", function(){
		i++;
		if( i == 2 ){
			slot3.on();			// Reset counter
			i = 0;
			console.log("undefined");
		}
	});
}

// New Card
function iftttCard_1(){
	// counter for times pressed / released
	var i = 0;
	slot2.on("down", function(){
		i++;
		if( i == 3 ){
			slot3.off();			// Reset counter
			i = 0;
			console.log("undefined");
		}
	});
}

module.exports = {
	run: function(){	iftttCard_0();
	iftttCard_1();
}
}