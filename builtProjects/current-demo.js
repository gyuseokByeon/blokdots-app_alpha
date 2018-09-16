// New Card
function iftttCard_0() {
    // counter for times pressed / released
    var i = 0;
    slot2.on("down", action_0);

    function action_0() {
        i++;
        if (i == 1) {
            slot4.frequency(587, 300);
            // Reset counter
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
        slot2.removeListener("down", iftttCard_0.action_0);
    }
}