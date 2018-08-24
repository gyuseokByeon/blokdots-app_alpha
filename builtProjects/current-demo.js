// New Card
function iftttCard_0() {
    // counter for times pressed / released
    var i = 0;
    slot2.on("hold", action_0);

    function action_0() {
        // Time equals 500ms times maxTime
        var maxTime = 2;
        console.log("hit");
        i++;
        if (i == 2) {
            var brightness = ((parseInt(undefined.value) - 1) / -4) - 1;
            slot3.brightness(brightness);

            i = 0;
        }
    }

    // to trigger events
    iftttCard_0.action_0 = action_0;

}

module.exports = {
    run: function() {
        iftttCard_0();
    },
    stop: function() {
        slot2.removeListener("hold", iftttCard_0.action_0);
    }
}