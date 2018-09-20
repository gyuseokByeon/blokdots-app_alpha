// New Card
function iftttCard_0() {
    // counter for times pressed / released
    var i = 0;
    slot2.on("down", action_0);

    function action_0() {
        i++;
        if (i == 1) {
            var position = 1;
            slot6.to(position);

            // Reset counter
            i = 0;
        }
    }

    // to trigger events
    iftttCard_0.action_0 = action_0;

}

// New Card
function iftttCard_1() {
    var sensorValue = 0;

    slotA1.on("change", action_1);

    function action_1() {
        // reverse value for more natural feeling (clockwise
        var val = 1023 - slotA1.value;

        var position = parseInt((slotA1.value / 1024) * 180);
        slot6.to(position);
    }

    // to trigger events
    iftttCard_1.action_1 = action_1;

}

// New Card
function iftttCard_2() {
    // counter for times pressed / released
    var i = 0;
    slot2.on("down", action_2);

    function action_2() {
        i++;
        if (i == 1) {
            slot8.blink(300);
            setTimeout(function() {
                slot8.stop();
            }, 1800);
            // Reset counter
            i = 0;
        }
    }

    // to trigger events
    iftttCard_2.action_2 = action_2;

}

// New Card
function iftttCard_3() {
    // counter for times pressed / released
    var i = 0;
    slot2.on("down", action_3);

    function action_3() {
        i++;
        if (i == 1) {
            var beepTime = 200;
            slot3.frequency(392, beepTime);
            setTimeout(function() {
                // Make sure slot3.stops again
                slot3.noTone();
            }, beepTime);

            // Reset counter
            i = 0;
        }
    }

    // to trigger events
    iftttCard_3.action_3 = action_3;

}

module.exports = {
    run: function() {
        iftttCard_0();
        iftttCard_1();
        iftttCard_2();
        iftttCard_3();
    },
    stop: function() {
        slot2.removeListener("down", iftttCard_0.action_0);
        slotA1.removeListener("change", iftttCard_1.action_1);
        slot2.removeListener("down", iftttCard_2.action_2);
        slot2.removeListener("down", iftttCard_3.action_3);
    }
}