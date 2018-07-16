
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
        "action" : "changing",
        "jhonny5" :  "change",
        "parameters" : []
      },
      {
        "action" : "getting",
        "jhonny5" :  "change",
        "parameters" : [
          {
            "filler"  : null,
            "option"  : ["over","below"]
          },
          {
            "filler"  : null,
            "option"  : "integer"
          },
          {
            "filler"  : null,
            "option"  : ["units","lumen"]
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

    // append var name and action init handler
    code+= '\t'+slotObj.var + '.on("'+ actionObj.jhonny5 +'", function(){\n';

    switch( iftttObj.if.action ){

      case 'changing':

        code+= '\t\t\t' + parseThen( iftttObj );
  
      break;

      case 'getting':


        var operator = '';

        switch( iftttObj.if.parameters[0].value ){
          
          default:
          case 'over':
            operator = '>';
          break;
          
          case 'below':
            operator = '<';
          break;
        }

        code+= '\t\tif( this.value '+operator+' '+iftttObj.if.parameters[1].value+' ){\n';

          code+= '\t\t\t' + parseThen( iftttObj );

        code+= '\t\t}\n';


      break;

    }

    // close .on of if
    code+= '\t});\n';

    return code;
  }
}














