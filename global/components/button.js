
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
      },
      {
        "action" : "released",
        "jhonny5" :  "up",
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
        "jhonny5" :  "hold",
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


// Export function and vars

module.exports = {
  setup: component_setup,

  // Parse function for IFTTT
  parse: function( slotObj , actionObj , iftttDBObj ){

    var code = '';

    code+= '\t// counter for times pressed / released\n';
    code+= '\tvar i = 0;\n';

    // append var name and action init handler
    code+= '\t'+slotObj.var + '.on("'+ actionObj.jhonny5 +'", action_'+iftttDBObj.id+' );\n\n';

    code+= '\tfunction action_'+iftttDBObj.id+'(){\n';

    switch( iftttDBObj.ifttt.if.action ){

      case 'pressed':
      case 'released':

        code+= '\t\ti++;\n';


        code+= '\t\tif( i == '+iftttDBObj.ifttt.if.parameters[0].value+' ){\n';

          code+= '\t\t\t' + parseThen( iftttDBObj.ifttt ) +'\n';

          code+= '\t\t\t// Reset counter\n';
          code+= '\t\t\ti = 0;\n';

        code+= '\t\t}\n';


      break;

      case 'held':

        code+= '\t\t' + parseThen( iftttDBObj.ifttt ) +'\n';

      break;

    }

    // close .on
    code+= '\t}\n';

    return code;
  }
}














