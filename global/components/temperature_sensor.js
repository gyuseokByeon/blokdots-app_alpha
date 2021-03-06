
// Setup DB for component

const component_setup = {
  "component": "Temperature Sensor",
  "type": "analog",
  "dir": "in",
  "image_url": "temperature",
  "presets": ["Data", "Percentage", "Degrees C"],
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
            "option"  : ["units","deg Celsius","percent"]
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

    code+= '\t\t// set new variable for the selected unit (degrees)\n';
    code+= '\t\tvar sensorValue = 0;\n\n';

    // append var name and action init handler
    code+= '\t'+slotObj.var + '.on("'+ actionObj.jhonny5 +'", action_'+iftttDBObj.id+' );\n\n';

    code+= '\tfunction action_'+iftttDBObj.id+'(){\n\n';

    code+= 'var val = '+slotObj.var+'.value;\n\n';

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
            operator = '<';
          break;
          
          case 'below':
            operator = '>';
          break;
        }

        code+= '// set new variable for the selected unit ('+iftttObj.if.parameters[2].value+')\n';

        switch( iftttObj.if.parameters[2].value ){
          
          default:
          case 'units':
            
            code+= 'sensorValue = this.value;\n';
          break;
          
          case 'deg Celsius':

            code*= 'sensorValue = parseFloat( ( Math.round( ( 1.0/(Math.log(R/R0)/B+1/298.15)-273.15 ) * 10 ) / 10 ).toFixed(1) ); // convert to temperature via datasheet\n';

          break;
          case 'percent':

            code+= 'sensorValue = Math.round( val/1024 * 100 );\n';//this.fsscaleTo(0, 100);\n';
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










