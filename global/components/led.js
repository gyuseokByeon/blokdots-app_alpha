
// Setup DB for component

const component_setup = {
  "component": "LED",
  "type": "digital",
  "dir": "out",
  "image_url": "led",
  "presets": ["Data","Brightness"],
  "pwm": 0,
  "ifttt": { 
    "actions" : [
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
        "jhonny5"  : "toggle",
        "parameters" : []  
      },
      {
        "reaction" : "blink",
        "jhonny5"  : "blink",
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
      },
      {
        "reaction" : "pulse",
        "jhonny5"  : "pulse",
        "pwm"     : true,
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
      },
      {
        "reaction" : "adjust brightness",
        "pwm"      : true,
        "parameters" : []  
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

        case 'switch':

          switch( iftttObj.then.parameters[0].value ){

            case 'on':
              
              code+= slotObj.var + '.on();\n';

            break;
            case 'off':

              code+= slotObj.var + '.off();\n';

            break;

          }

        break;

        case 'toggle':

            code+= slotObj.var + '.toggle();\n';

        break;

        case 'blink':
        case 'pulse':

          var interval;

          switch(iftttObj.then.action){
            case 'blink': interval = 300; break;
            case 'pulse': interval = 700; break;
          }

          var time = iftttObj.then.parameters[0].value;
          var unit = iftttObj.then.parameters[1].value

          switch(unit){
            case 'seconds':

              time = time * 1000;

            break;
            case 'minutes':

              time = time * 60000;

            break;
            case 'times':

              time = interval * time * 2;

            break;
          }

          code+= slotObj.var + '.'+actionObj.jhonny5+'('+interval+');';

          code+= 'setTimeout(function(){\n';

            code+= '\t' + slotObj.var + '.stop();\n';

          code+= '}, '+ time +');';

          

        break;

        case 'adjust brightness':

          code+= 'var brightness = ( ( parseInt('+ifSlotVar+'.value) - 1 ) / -4 ) - 1; \n';
          code+= slotObj.var + '.brightness(brightness);\n';

        break;

      }

    // if is action
    }else{

      switch( iftttObj.then.action ){

        case 'switches':


        break;
      }

    }

    return code;
  }
}

























