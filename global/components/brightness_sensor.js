
// Setup DB for component

const component_setup = {
  "component": "Brightness Sensor",
  "type": "analog",
  "dir": "in",
  "image_url": "brightness",
  "presets": ["Data", "Lumen"],
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














