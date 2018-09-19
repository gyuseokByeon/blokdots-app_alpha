
// Setup DB for component

const component_setup = {
  "component": "Servo Motor",
  "type": "analog",
  "dir": "out",
  "image_url": "servo",
  "presets": ["Data", "Angle"],
  "pwm": 1,
  "ifttt": { 
    "actions" : undefined,
    "reactions" : [
      {
        "reaction" : "adjust position",
        "pwm"       : true,
        "parameters" : []  
      },
      {
        "reaction" : "go to",
        "parameters" : [
          {
            "filler"  : null,
            "option"  : "integer"
          },
          {
            "filler"  : null,
            "option"  : ["degrees"]
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
  parse: function( slotObj , actionObj , iftttObj , reactionFlag , ifSlotVar ){

    var code = '';

    // if is reaction
    if( reactionFlag ){

      switch( iftttObj.then.action ){

        case 'adjust position':

          code+= 'var position = parseInt( ('+ifSlotVar+'.value / 1024 ) * 180 ); \n';
          code+= slotObj.var + '.to(position);\n';

        break;

        case 'go to':

          code+= 'var position = '+iftttObj.then.parameters[0].value+'; \n';
          code+= slotObj.var + '.to(position);\n';

        break;

      }

    // if is action
    }else{


    }

    return code;
  }
}

























