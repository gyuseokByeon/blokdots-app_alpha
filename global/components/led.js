
// Setup DB for component

const component_setup = {
  "component": "LED",
  "type": "digital",
  "dir": "out",
  "image_url": "led",
  "presets": ["Data","Brightness"],
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
      },
      {
        "reaction" : "toggle",
        "parameters" : []  
      },
      {
        "reaction" : "blink",
        "parameters" : [
          {
            "filler"  : "for",
            "option"  : "integer"
          },
          {
            "filler"  : null,
            "option"  : ["seconds","minutes","times"]
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


      switch( iftttObj.then.action ){

        case 'switch':

          switch( iftttObj.then.parameters[0].value ){

            case 'on':

              code+= slotObj.var + '.on();';

            break;
            case 'off':

              code+= slotObj.var + '.off();';

            break;

          }

        break;

        case 'toggle':

            code+= slotObj.var + '.toggle();';

        break;

        case 'blink':


        break;

      }

    // if is action
    }else{


    }

    return code;
  }
}

























