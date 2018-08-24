

// build html markup to insert in slot -> returns string
function setupSlotControls( slotDOM , comp ){

  // find the values for this component type
  var componentTypeObject;
  for(var i = 0; i < componentList.length; i++){
    var curr = componentList[i];
    if(curr.component == comp){
      componentTypeObject = curr;
    }
  }

  var img = '<img class="component-icon" src="../global/img/comp/'+componentTypeObject.image_url+'.svg"/>';
  slotDOM.find('.controls').append( img );

  var typeIndicator = '<div class="type-indicator '+componentTypeObject.type+' '+componentTypeObject.dir+'">'+componentTypeObject.dir+'</div>';
  slotDOM.find('.controls').append( typeIndicator );

  var moreArrow = '<div class="more"></div>';
  slotDOM.find('.controls').append( moreArrow );

  var m = '';

  switch( comp ){

    case 'Button':
    case 'Potentiometer':
    case 'Touch Sensor':
    case 'Temperature Sensor':
    case 'Brightness Sensor':

      m+= '<div class="value-container">';
        m+= '<div class="value">10</div>'
      m+= '</div>';
      m+= '<div class="value-bar-container">';
        m+= '<div class="value-bar"></div>';
      m+= '</div>';
      m+= '<div class="real-value"></div>';

    break;

    //  'LED':
    case 'Servo Motor':

      m+= '<div class="value-container">';
        m+= '<div class="value">10</div>'
      m+= '</div>';

      
      // m+= '<div class="value-bar-container range-slider"></div>';

      m+= '<input type="range" min="0" max="1000" value="500">'

      m+= '<div class="real-value"></div>';

    break;

    case 'LED':

      if ( parseInt( slotDOM.attr('pwm') ) ) {

        // if is pwm pin

        m+= '<div class="value-container">';
        m+= '<div class="value">10</div>'
        m+= '</div>';

        m+= '<input type="range" min="0" max="1000" value="500">'

        m+= '<div class="real-value"></div>';

      }else{

        m+= 'no PWM';

      }


    break;


    case 'Buzzer':

      m+= '<div class="value-container">';
        m+= '<div class="value">10</div>'
      m+= '</div>';

      m+= '<div class="button">Sound</div>'

      m+= '<div class="real-value"></div>';

    break;

    default:

      m+= 'not ready yet…';

    break;
  }

  slotDOM.find('.info').append(m);

  var a = '<div class="extra-settings">';
        a+= '<select>';
        a+= '</select>';
      a+= '</div>';

  slotDOM.append( a );


  // insert content into menus
  var presetsList = componentTypeObject.presets;
 

  presetsList.forEach(function( pre ){

    var li = '<option>'+pre+'</option>';
    slotDOM.find('select').append(li);

  });


  ipcRenderer.send('componentConnected',findSlotObj( slotDOM ));

}

// Some comment

function buildLiveViewDisplayListener( slotObj ){

  switch( slotObj.comp ){

    case 'Button':
    case 'Touch Sensor':
    
      window[ slotObj.var ] = new five.Button({
        pin   : slotObj.slot,
        board : board 
      });

      button_LiveViewDisplayListener( 0 , slotObj.slot );

      window[ slotObj.var ].on("down", function() {
        button_LiveViewDisplayListener( 1 , slotObj.slot );
      });
      window[ slotObj.var ].on("up", function() {
        button_LiveViewDisplayListener( 0 , slotObj.slot );
      });

    break;

    case 'Potentiometer':

      window[ slotObj.var ] = new five.Sensor({
        pin   : slotObj.slot,
        board : board 
      });

      window[ slotObj.var ].on("change", function(val) {
        potentiometer_LiveViewDisplayListener( val , slotObj.slot );
      });

    break;

    case 'Brightness Sensor':

      window[ slotObj.var ] = new five.Sensor({
        pin   : slotObj.slot,
        board : board 
      });

      window[ slotObj.var ].on("change", function(val) {
        brightnessSensor_LiveViewDisplayListener( val , slotObj.slot );
      });

    break;

    case 'Temperature Sensor':

      window[ slotObj.var ] = new five.Sensor({
        pin   : slotObj.slot,
        board : board 
      });

      window[ slotObj.var ].on("change", function(val) {
        temperatureSensor_LiveViewDisplayListener( val , slotObj.slot );
      });

    break;

    // Outputs 

    case 'LED':

      window[ slotObj.var ] = new five.Led({
        pin   : slotObj.slot,
        board : board 
      });

      var slotDOM = findSlotDOM( slotObj.slot );

      led_LiveViewDisplayControl( slotObj , parseInt( slotDOM.attr('pwm') ) );

    break;

    case 'Servo Motor':

      window[ slotObj.var ] = new five.Servo({
        pin   : slotObj.slot,
        board : board 
      });

      servo_LiveViewDisplayControl( slotObj );

    break;

    case 'Buzzer':

      window[ slotObj.var ] = new five.Piezo({
        pin   : slotObj.slot,
        board : board 
      });
      buzzer_LiveViewDisplayControl( slotObj );

    break;

    default:

      console.log( slotObj.comp+': not ready yet…');

    break;
  }

}


// Functions for different component types -------------------------------------

function button_LiveViewDisplayListener( val , slotNum ){

  var slotDOM = findSlotDOM( slotNum );

  slotDOM.find('.value').html( val );
  slotDOM.find('.real-value').html( val );
  slotDOM.find('.value-bar').css( 'width' , (val / 1)*100+'%' );
  
}

function potentiometer_LiveViewDisplayListener( val , slot ){

  var slotDOM;
  $('.slot').each(function(){
    if( $(this).attr('slot') == slot ){
      slotDOM = $(this);
    }
  });

  var mode = slotDOM.attr('mode');

  var valMax = 1023;
  var maxDeg = 270;

  val = valMax - val;

  var valPercentage =  100 * (val/valMax);
  slotDOM.find('.real-value').html( val );
  slotDOM.find('.value-bar').css( 'width' , valPercentage+"%" );

  switch(mode){

    case 'Data':
    default:
      slotDOM.find('.value').html( val );
    break;

    case 'Percentage':
      slotDOM.find('.value').html( Math.round( valPercentage ) +"%" );
    break;

    case 'Angle':
      var rotationVal = Math.round( val/1023 * maxDeg );///10;
      slotDOM.find('.value').html( rotationVal + '°' );
    break;

  }
}

function temperatureSensor_LiveViewDisplayListener( val , slot ){

  var slotDOM;
  $('.slot').each(function(){
    if( $(this).attr('slot') == slot ){
      slotDOM = $(this);
    }
  });

  var mode = slotDOM.attr('mode');

  var valMax = 1023;
  var maxDeg = 270;

  val = valMax - val;

  var valPercentage =  100 * (val/valMax);
  slotDOM.find('.real-value').html( val );
  slotDOM.find('.value-bar').css( 'width' , valPercentage+"%" );

  switch(mode){

    case 'Data':
    default:
      slotDOM.find('.value').html( val );
    break;

    case 'Percentage':
      slotDOM.find('.value').html( Math.round( valPercentage ) +"%" );
    break;

    case 'Degrees C':

      const B = 4275;
      const R0 = 100000;

      var R = valMax/val-1;
      R = R0*R;

      var temperatureVal = ( Math.round( ( 1.0/(Math.log(R/R0)/B+1/298.15)-273.15 ) * 10 ) / 10 ).toFixed(1); // convert to temperature via datasheet

      slotDOM.find('.value').html( temperatureVal + '°C' );

    break;

  }
}


function brightnessSensor_LiveViewDisplayListener( val , slot ){

  var slotDOM;
  $('.slot').each(function(){
    if( $(this).attr('slot') == slot ){
      slotDOM = $(this);
    }
  });

  var mode = slotDOM.attr('mode');

  var valMax = 1023;

  val = valMax - val;

  var valPercentage =  100 * (val/valMax);
  slotDOM.find('.real-value').html( val );
  slotDOM.find('.value-bar').css( 'width' , valPercentage+"%" );

  switch(mode){

    case 'Data':
    default:
      slotDOM.find('.value').html( val );
    break;

    case 'Percentage':
      slotDOM.find('.value').html( Math.round( valPercentage ) +"%" );
    break;

    case 'Lumen':

      var lumenVal = Math.round( ( Math.pow(val, -0.71) * (62.77 ) ) * 1000 );
      slotDOM.find('.value').html( lumenVal + ' mlm' );

    break;

    case 'Lux':

      var luxVal = Math.round(  (Math.pow( val , -1.43) * (350)) * 1000 ) ;
      slotDOM.find('.value').html( luxVal + ' mlx' );

    break;

  }
}



// Actuators -----------------

function led_LiveViewDisplayControl( slotObj , pwm ){
  
  var slotDOM = findSlotDOM( slotObj.slot );

  if( pwm ){

    var valMax = 255;

    updateVal( Math.round( valMax/2 ) );

    function updateVal( val ){

      var valPercentage =  100 * (val/valMax);

      slotDOM.find('.value').html( val );
      slotDOM.find('.real-value').html( val );
      slotDOM.find('.value-bar').css( 'width' , valPercentage+'%' );

      window[ slotObj.var ].brightness(val);

    }

    slotDOM.on('input', 'input[type=range]' , function() {

      var currVal = Math.round( $(this).val()/1000 * valMax );
      updateVal(currVal);
      
    });

  }else{

    window[ slotObj.var ].on();

  }


  /*
  var newPos = 0;
  const knob = slotDOM.find('.knob');

  slotDOM.on('mousedown','.knob',function(){

    newPos = parseInt(knob.css('left')) + 2;

    knob.css( 'left' , newPos );

  });
  slotDOM.on('mouseup','.knob',function(){

    var barWidth = $('.value-bar').outerWidth();

    var newVal = Math.round( (newPos/barWidth)*valMax );

    updateVal( newVal );

  });
  */
  
}

function buzzer_LiveViewDisplayControl( slotObj  ){
  
  var slotDOM;
  $('.slot').each(function(){
    if( $(this).attr('slot') == slotObj.slot ){
      slotDOM = $(this);
    }
  });

  $(document).on('click', '.button' , function() {

    window[ slotObj.var ].play({
      tempo: 150, // Beats per minute, default 150
      song: [ // An array of notes that comprise the tune
        [ "c4", 1 ], // Each element is an array in which 
                     // [0] is the note to play and 
                     // [1] is the duration in "beats" (tempo, above)
        [ "e4", 2 ],
        [ "g4", 3 ],
        [ null, 4 ] // null indicates "no tone" for the beats indicated
      ]
    });

  });
  
}




function servo_LiveViewDisplayControl( slotObj , pwm ){
  
  var slotDOM = findSlotDOM( slotObj.slot );
  var slider  = slotDOM.find('input[type=range]');

  var valMax = 180;
  var maxDeg = 180;

  updateVal( Math.round( valMax/2 ) );

  function updateVal( val ){

    var valPercentage =  100 * (val/valMax);

    slotDOM.find('.real-value').html( val );
    // slotDOM.find('.value-bar').css( 'width' , valPercentage+'%' );

    window[ slotObj.var ].to(val);

    var mode = slotDOM.attr('mode');
    switch(mode){

      case 'Data':
      default:
        slotDOM.find('.value').html( val );
      break;

      case 'Percentage':
        slotDOM.find('.value').html( Math.round( valPercentage ) +"%" );
      break;

      case 'Angle':
        var rotationVal = Math.round( val/valMax * maxDeg*10 )/10;
        slotDOM.find('.value').html( rotationVal + '°' );
      break;

    }
  }


  slotDOM.on('input', 'input[type=range]' , function() {

    var currVal = Math.round( $(this).val()/1000 * valMax );

    updateVal(currVal);
  });

  // initRangeSlider( slotDOM.find('.range-slider') );

}





// inputs
function initRangeSlider( sliderDOM ){

  var m = '<div class="value-bar">';
        m+= '<div class="knob"></div>';
      m+= '</div>';

  sliderDOM.append(m);

  const knob = sliderDOM.find('.knob');
  const valueBar = sliderDOM.find('.value-bar');

  var value = 0;
  var sliderWidth = sliderDOM.outerWidth();

  var isDown = false

  sliderDOM.on('mousedown',knob,function( evt ){
    isDown = true;
  });
  sliderDOM.on('mouseup',knob,function( evt ){
    isDown = false;
  });
  sliderDOM.on('mousemove',knob,function( evt ){

    if(isDown){
      var offsetX = sliderDOM.offset().left;
      sliderWidth = sliderDOM.outerWidth();
      var newVal = offsetX - evt.pageX;
    
      value = (newVal/sliderWidth) *-100;

      if ( value >= 100 ) { value=100; }
      if ( value <= 0 ) { value=0; }

      valueBar.css('width',value+'%');  
      return value;
    }

  });

}




function removeAllSlotListeners(){

  console.log('remove all listeners and vars')

  for ( var i = 0; i < allSlots.length; i++) {
    
    var slotObj = allSlots[i];

    if( slotObj.var ){
      delete window[ slotObj.var ];
    }
  }


}
