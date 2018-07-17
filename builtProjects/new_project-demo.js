// YAY SOMETHING FANCY !!!!!!
function iftttCard_0(){
	// counter for times pressed / released
	var i = 0;
	slot2.on("down", function(){
		if( i == 1 ){
			slot3.on();		}
		i++;
	});
}

module.exports = {
	run: function(){
	// Run the functions ----------------------

	iftttCard_0();
}
}