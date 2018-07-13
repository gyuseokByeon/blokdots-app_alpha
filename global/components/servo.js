
// Setup DB for component

const component_setup = {
  "component": "Servo Motor",
  "type": "analog",
  "dir": "out",
  "image_url": "servo",
  "presets": ["Data", "Angle"],
  "pwm": 1,
  "ifttt": { 
    "actions" : [
      {
        "action" : "switches",
        "parameters" : [
          {
            "filler"  : null,
            "option"  : ["on","off"]
          },
          {
            "filler"  : null,
            "option"  : "integer"
          },
          {
            "filler"  : null,
            "option"  : ["times"]
          }
        ]  
      }
    ],
    "reactions" : [
      {
        "reaction" : "switch",
        "parameters" : [
          {
            "filler"  : null,
            "option"  : ["on","off"]
          }
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

    // if is action
    }else{


    }

    return code;
  }
}

























