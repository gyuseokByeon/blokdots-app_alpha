
// Setup DB for component

const component_setup = {
  "component": "Brightness Sensor",
  "type": "analog",
  "dir": "in",
  "image_url": "brightness",
  "presets": ["Data","Percentage","Lumen","Lux",],
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
            "option"  : ["units","percentage","lumen","lux"]
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

    code+= '\tfunction action_'+iftttDBObj.id+'(){\n';

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

        switch( iftttObj.if.parameters[2].value ){
          
          default:
          case 'units':
            
            code+= '\t\tsensorValue = this.value;\n';
          break;
          
          case 'lumen':

            code+= '\t\tsensorValue = Math.round( ( Math.pow(val, -0.71) * (62.77 ) ) * 1000 );';//this.fsscaleTo(0, 270);\n';   
          break;
          case 'lux':

            code+= '\t\tsensorValue = Math.round(  (Math.pow( val , -1.43) * (350)) * 1000 );';//this.fsscaleTo(0, 270);\n';   
          break;
          case 'percentage':

            code+= '\t\tsensorValue = Math.round( val/1024 * 100*10 )/10;';//this.fsscaleTo(0, 100);\n';
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
















