
// Setup DB for component

const component_setup = {
  "component": "Button",
  "type": "digital",
  "dir": "in",
  "image_url": "button",
  "presets": ["Data"],
  "pwm": 0,
  "ifttt": { 
    "actions" : [
      {
        "action" : "pressed",
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
      },
      {
        "action" : "released",
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
      },{
        "action" : "held",
        "parameters" : [
          {
            "filler"  : "for",
            "option"  : "integer"
          },
          {
            "filler"  : null,
            "option"  : ["seconds","minutes"]
          }
        ]  
      }
    ]
  }
};


// Parse function for component

function parse(action,arr){

  var code;

  return code;

}

