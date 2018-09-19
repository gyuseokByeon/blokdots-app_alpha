
// Setup DB for component

const component_setup = {
  "component": "Buzzer",
  "type": "digital",
  "dir": "out",
  "image_url": "buzzer",
  "presets": ["Data", "Note"],
  "pwm": 0,
  "ifttt": { 
    "actions" : undefined,
    "reactions" : [
      {
        "reaction" : "beep",
        "parameters" : [
        ]  
      }
      /*
      ,
      {
        "reaction" : "play melody",
        "parameters" : [
          {
            "filler"  : "of",
            "option"  : ["Zelda Chest"]
          }
        ]  
      }
      */
    ]
  }
};

const piezoNotes = {
  'c':1898,
  'd':1690,
  'e':1500,
  'f':1420,
  'g':1265,
  'x':1194,
  'a':1126,
  'z':1063,
  'b':1001,
  'C':947,
  'y':893,
  'D':843,
  'w':795,
  'E':749,
  'F':710,
  'q':668,
  'G':630,
  'i':594,
  ' ':0
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

        case 'beep':

          code+= 'var beepTime = 200;\n';

          code+= slotObj.var + '.frequency(392, beepTime);\n';

          code+= 'setTimeout(function(){\n';
            code+= '// Make sure buzzer stops again\n';
            code+= slotObj.var + '.noTone();\n';
          code+= '}, beepTime);\n';

        break;

        case 'play melody':

          let melody = '';
          let tempo;

          switch( iftttObj.then.parameters[0].value ){

            case 'Zelda Chest':

              melody = 'gabygabyxzCDxzCDabywabywzCDEzCDEbywFCDEqywFGDEqi        azbC';
              tempo = 75;

            break;
          }

          code+= slotObj.var + '.play({tempo:'+tempo+',song: [';

          for (var i = 0; i < melody.length; i++) {
            let note = melody.charAt(i);
            code+= '['+piezoNotes[ note ] +',1]';

            if( i < melody.length-1 ){
              code+=',';
            }
          }

          code+= ']});';

        break;
      }

    // if is action
    }else{


    }

    return code;
  }
}

























