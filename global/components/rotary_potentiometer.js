
// Setup DB for component

const component_setup = {
  "component": "Potentiometer",
  "type": "analog",
  "dir": "in",
  "image_url": "rotary_potentiometer",
  "presets": ["Data", "Percentage", "Angle"],
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
            "option"  : ["units","deg","percent"]
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

    var iftttObj = iftttDBObj.ifttt;
    code+= '\t\tvar sensorValue = 0;\n\n';

    // append var name and action init handler
    code+= '\t'+slotObj.var + '.on("'+ actionObj.jhonny5 +'", action_'+iftttDBObj.id+' );\n\n';

    code+= '\tfunction action_'+iftttDBObj.id+'(){\n';

    code+= '// reverse value for more natural feeling (clockwise\n';
    code+= 'var val = 1023 - '+slotObj.var+'.value;\n\n';
    
    switch( iftttObj.if.action ){

      case 'changing':

        code+= '\t\t\t' + parseThen( iftttObj , slotObj.var );
  
      break;

      case 'getting':

        // get right operator
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

        switch( iftttObj.if.parameters[2].value ){
          
          default:
          case 'units':
            
            code+= '\t\tsensorValue = val;\n';
          break;
          
          case 'deg':
            code+= '// set new variable for the selected unit (degrees)\n';
            code+= '\t\tsensorValue = Math.round( val/1023 * 270 );';//this.fsscaleTo(0, 270);\n';   
          break;
          case 'percent':
            code+= '// set new variable for the selected unit (percent)\n';
            code+= '\t\tsensorValue = Math.round( val/1023 * 100 )\n;';//this.fsscaleTo(0, 100);\n';
          break;
        }

        code+= '\t\tif( sensorValue '+operator+' '+iftttObj.if.parameters[1].value+' ){\n';

          code+= '\t\t\t' + parseThen( iftttObj , slotObj.var );

        code+= '\t\t}\n';


      break;

    }

    // close .on of if
    code+= '\t}\n';

    return code;
  }
}










