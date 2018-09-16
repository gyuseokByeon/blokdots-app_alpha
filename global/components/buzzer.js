
// Setup DB for component

const component_setup = {
  "component": "Buzzer",
  "type": "digital",
  "dir": "out",
  "image_url": "buzzer",
  "presets": ["Data", "Note"],
  "pwm": 0,
  "ifttt": { 
    "reactions" : [
      {
        "reaction" : "beep",
        "parameters" : [
        ]  
      }
    ]
  }
};


// Export function and vars

module.exports = {
  setup: component_setup,

  // Parse function for IFTTT
  parse: function( slotObj , actionObj , iftttObj , reactionFlag ){

    var code = '';

    // if is reaction
    if( reactionFlag ){

       switch( iftttObj.then.action ){

        case 'beep':


          code+= slotObj.var + '.frequency(587, 300);';

        break;
      }

    // if is action
    }else{


    }

    return code;
  }
}

























