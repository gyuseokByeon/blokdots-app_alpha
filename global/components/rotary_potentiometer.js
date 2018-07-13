
// Setup DB for component

const component_setup = {
 "component": "Potentiometer",
  "type": "analog",
  "dir": "in",
  "image_url": "rotary-potentiometer",
  "presets": ["Data", "Percentage", "Angle"],
  "pwm": 0,
  "ifttt": { 
    "actions" : [
      {
        "action" : "pressed",
        "jhonny5" :  "down",
        "parameters" : [
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
    ]
  }
};


// Export function and vars

module.exports = {
  setup: component_setup,

  // Parse function for IFTTT
  parse: function( slotObj , actionObj , iftttObj ){

    var code = '';

    // close .on of if
    code+= '\t});\n';

    return code;
  }
}














