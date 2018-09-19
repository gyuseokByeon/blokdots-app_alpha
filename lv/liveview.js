

// a json object to always know about all slots
var allSlots = [];

function initSlots(){


  let initSlotsObj = boardList[0];

/*
  console.log( currentBoardObj )

  if( currentBoardObj == undefined ){
    // set board to uno, if no list
    currentBoardObj = boardList[0];

    console.log( currentBoardObj )
  }
*/

  let Slots = initSlotsObj.param.Slots;//boardList['Grove Arduino Uno'].Slots;
  let pwmSlots = initSlotsObj.param.pwm;//boardList['Grove Arduino Uno'].pwm;

  var conMark = '<div class="slot-container"></div>';
  $('#slot-wrapper section').append(conMark);

  const Container = $('#slot-wrapper section .slot-container');


  var i = 0;


  Slots.forEach(function(slot){

    // insert a JSON object for each slot
    allSlots[ i ] = {
      'slot'  : slot,
      'state' : 'empty',
      'var'   : null,
      'comp'  : null,
      'type'  : null,
      'dir'   : null
    }

    var displaySlot = slot;
    if ( $.isNumeric( displaySlot ) ){
      displaySlot = 'D'+displaySlot;
    }

    var pwm = 0;
    if( $.inArray( slot , pwmSlots) != -1 ){
      pwm = 1;
    }

    var m = '<div class="slot" slot="'+slot+'" pwm="'+pwm+'">';
          m+= '<div class="controls">';
            m+= '<div class="indicator"></div>';
            if(pwm){ m+= '<div class="pwm-indicator">pwm</div>'; }
            m+= '<div class="number">'+displaySlot+'</div>';
            m+= '<div class="info">// Not Connected</div>';
            m+= '<div class="btn use_btn ghost-dark">Setup</div>';
          m+= '</div>';
        m+= '</div>';

    Container.append(m);

    i++;

  });

  $('.slot').each(function(){
    slotState( $(this) , 'empty' );
  });

  updateSlotDBforProject();

}


function findSlotDOM( slotNum ){

  var slotDOM;
  $('.slot').each(function(){
    if( $(this).attr('slot') == slotNum ){
      slotDOM = $(this);
    }
  });

  return slotDOM;
}


function findSlotObj( slotDOM ){

  var slotObj;
  //  find the equivalent slot object

  for(var i = 0; i < allSlots.length; i++){
    var curr = allSlots[i];
    if(curr.slot == slotDOM.attr('slot') ){
      slotObj = curr;
    }
  }

  return slotObj;
}

/*
function componentTypeObj( slotDOM ){

  var componentTypeObj;
  //  find the equivalent slot object

  for(var i = 0; i < allSlots.length; i++){
    var curr = allSlots[i];
    if(curr.slot == slotDOM.attr('slot') ){
      componentTypeObj = curr;
    }
  }

  return componentTypeObj;
}
*/

// displays if board is connected ----------------------------


function initBlokdotsConnectionIndicator(){

  var m = '<div class="connection"></div>';
  $('#grove_1 .separator').append(m);

  // toggleLiveViewControls( false );

}

function blokdotsConnectionIndicator( bool ){

  const conn = $('#grove_1 .connection');

  if( bool ){

    conn.addClass('connected');
    conn.text('board connected');
  }else{

    conn.removeClass('connected');
    conn.text('device not found');
  }

  toggleLiveViewControls( bool );
}

// en / disable live view wether blokdots is connected
function toggleLiveViewControls( bool ){

  if( bool ){
    $('#click-prevent').remove();  
  }else{
    var m = '<div id="click-prevent"></div>';
    $('#slot-wrapper').append(m);  
  }

}


// apply new components to board ------------------------------------

function connectSlot( slotDOM ){


  // get slot number and check if int
  var groveSlot = slotDOM.attr('slot');
  if( groveSlot.indexOf('A') < 0 ){
    groveSlot = parseInt(groveSlot);
  }

  slotState( slotDOM , 'setup' );

  appendSetupComponentList( slotDOM , groveSlot );

  slotHeightAdjust( slotDOM , 'open' );
}



function disconnectSlot( slotDOM ){

  slotState( slotDOM , 'empty' );

  
      
  let slotObj = findSlotObj( slotDOM );

  // remove var for listners
  delete window[ slotObj.var ];

  // clear database again
  slotObj.state  = 'empty';
  slotObj.var    = null;
  slotObj.comp   = null;
  slotObj.type   = null;
  slotObj.dir    = null;
  

  ipcRenderer.send('disconnectSlotLV', slotDOM.attr('slot') );

}


// Slot states

function slotState( slotDOM , state ){

  var hadComponent = slotDOM.hasClass('inUse');

  slotHeightAdjust( slotDOM , 'close' );
  slotDOM.removeClass('empty setup inUse connected');
  $('.setup-component-list').remove();

  switch (state){

    case 'empty':

      // remove possible other elements
      slotDOM.find('.info').html('// Not Connected');
      slotDOM.find('.use_btn').addClass('ghost-dark').removeClass('ghost-light').text('Setup');
      slotDOM.find('.close').remove();

      if( hadComponent ){
        slotDOM.find('.component-icon').remove();
        slotDOM.find('.type-indicator').remove();
        slotDOM.find('.more').remove();
        slotDOM.find('.extra-settings').remove();
      }

    break;
    case 'setup':

      // just allow one slot to be in setup mode
      slotState( $('.slot.setup') , 'empty' );

      slotDOM.find('.info').text('Select component from list');
      slotDOM.find('.use_btn').text('Cancel');
      slotDOM.find('.use_btn').removeClass('ghost-dark').addClass('ghost-light');

    break;
    case 'inUse':

      var slotObj = findSlotObj( slotDOM );

      slotDOM.find('.info').empty();
      slotDOM.find('.use_btn').removeClass('ghost-light').text('Use');

      var close = '<div class="close"></div>'
      slotDOM.find('.controls').append(close);

      setupSlotControls( slotDOM , slotObj.comp );
      buildLiveViewDisplayListener( slotObj );

    break;
    case 'connected':


      slotDOM.addClass('inUse');
      updateSlotDBforProject();

    break;

  }

  slotDOM.addClass(state);

}


// Select slot

function appendSetupComponentList( slotObj , slotNum ){

  // check which type the selected slot has
  var slotType = slotObj.attr('slot');
  if ( $.isNumeric( slotType ) ){
    slotType = 'digital';
  }else{
    slotType = 'analog';
  }

  var slotPwm = parseInt( slotObj.attr('pwm') );

  var m = '<div class="setup-component-list">';
      m+= '<ul>';
  

  // list all components available in library
  for( var i=0 ; i < componentList.length ; i++ ){
    
    const component = componentList[i];
    
    /*

    this.comp = component.["component"];
    this.type = component.["type"];
    this.dir  = component.["dir"];
    this.img  = component.["image_url"];
    this.pwm  = component.["pwm"];

    // just list if suitable for slot
    if( 
         ( slotType == this.type  && this.pwm === 0 )  
      || ( this.pwm === slotPwm   && slotPwm  === 1 )  
      || ( slotType === this.type && this.type == 'digital' && this.pwm == 1 )
    
    ){

      m+= '<li comp="'+this.comp+'">';

        m+= '<img class="component-icon" src="../global/img/comp/'+this.img+'.svg"/>';

        m+= '<div class="name">'+this.comp+'</div>';

      m+= '</li>';

    }

    */

    if( 
         ( slotType == component.type  && component.pwm === 0 )  
      || ( component.pwm === slotPwm   && slotPwm  === 1 )  
      || ( slotType === component.type && component.type == 'digital' && component.pwm == 1 )
    ){

      m+= '<li comp="'+component.component+'">';

        m+= '<img class="component-icon" src="../global/img/comp/'+component.image_url+'.svg"/>';

        m+= '<div class="name">'+component.component+'</div>';

      m+= '</li>';

    }


  }

  m+= '</ul>';
  m+= '</div>';

  // add list to slot
  slotObj.append(m);

}
// Input events

function buttonEventsLiveViewSlots(){

  // use button within 
  $('.slot').on('click','.use_btn',function(){

    const slotDOM = $(this).closest('.slot');

    if(slotDOM.hasClass('connected')){
      // Do not connect
    }else if( slotDOM.hasClass('empty') ){
      connectSlot( slotDOM );
    }else if( slotDOM.hasClass('setup') ){
      disconnectSlot( slotDOM );
    }else if( slotDOM.hasClass('inUse') ){
      const slotObj = findSlotObj( slotDOM );
      ipcRenderer.send('use', slotObj );
      slotState( slotDOM , 'connected' );
    }

  });


  $('body').on('click','.setup-component-list li',function(){

    var el = $(this);
   
    var comp = el.attr('comp');
    var slotObj = el.closest('.slot');
    var slot = slotObj.attr('slot');

    setupComponent( slot , comp );

    slotState( $('.slot.setup') , 'inUse' );

  });

  $('body').on('click','.slot .close',function(){

    var el = $(this);
    var slotObj = el.closest('.slot');
      
    disconnectComponent( slotObj.attr('slot') );

    //slotState( slotObj , 'empty' );

  });

  $('body').on('click','.slot .more',function(){

    var el = $(this);
    var slotObj = el.closest('.slot');

    var shown = slotObj.attr('extraSettingsShown');

    // Show and hide extra settings
    if( shown == 'true' ){
      slotHeightAdjust( slotObj , 'close' );
      slotObj.attr('extraSettingsShown','false');
      slotObj.removeClass('settings-shown');
    }else{
      slotHeightAdjust( slotObj , 'open' );
      slotObj.attr('extraSettingsShown','true');
      slotObj.addClass('settings-shown');
    }

  });

}

// bind slot to johnny-five object
function setupComponent( slot , comp ){

  console.log('%c'+slot + ' -> ' + comp , 'color: '+consoleColors.system+';' );
  
  // build correct value for slot
  if ( $.isNumeric( slot ) ){
    slot = parseInt(slot);
  }

  var componentTypeObject;
  for(var i = 0; i < componentList.length; i++){
    var curr = componentList[i];
    if(curr.component == comp){
      componentTypeObject = curr;
    }
  }

  // generate a variable for the slot
  var varname = 'slot'+slot;

  for(var i = 0; i < allSlots.length; i++){

    var curr = allSlots[i];
    if(curr.slot == slot){
      
      curr.state  = 'inUse';
      curr.var    = varname;
      curr.comp   = comp;
      curr.type   = componentTypeObject.type;
      curr.dir    = componentTypeObject.dir;

    }
  }

  updateSlotDBforProject();
}

function disconnectComponent( slotNum ){

  // find the equivalent slot object
  var slotDOM = findSlotDOM( slotNum );
  var slotObj = findSlotObj( slotDOM );

  // console.log( window[ slotObj.var ] )

  if( window[ slotObj.var ] ){

    /*
    if( slotObj.dir == 'in' ){

      // Stop emmitting events
      window[ slotObj.var ].disable();
    }
    */
    delete window[ slotObj.var ];

  }

  console.log('%cdisconnected slot '+slotNum,'color: '+consoleColors.system+';');

  disconnectSlot( slotDOM );

  updateSlotDBforProject();

}



function getSlotControlSelection(){
  $(document).on("change",'.extra-settings select',function(){

      var slotDOM = $(this).closest('.slot');
      var valueSelected = this.value;

      slotDOM.attr( 'mode' , valueSelected );

      /*
      var slotObj;
      for(var i = 0; i < allSlots.length; i++){
        var curr = allSlots[i];
        if(curr.slot == slotDOM.attr('slot') ){
          slotObj = curr;
        }
      }

      window[ slotObj.var ].trigger('change');
      */

  });
}




// Animation parts -----------------------------------------

function slotHeightAdjust( slotDOM , dir ){

  var newHeight = slotDOM.find('.controls').outerHeight();
  
  if( dir == 'open' ){

    var obj;

    if( slotDOM.hasClass('setup') ){
      obj = slotDOM.find('.setup-component-list');
    }else if( slotDOM.hasClass('inUse') ){
      obj = slotDOM.find('.extra-settings');
    }

    newHeight += obj.outerHeight();

  }

  slotDOM.css('height',newHeight);

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

function reattachAllSlots(){

  var inUseCounter = 0;

  for ( var i = 0; i < allSlots.length; i++) {
    var slotObj = allSlots[i];
    if( slotObj.state == 'inUse' ){
      inUseCounter++;
    }
  }

  if( inUseCounter != 0 ){

    console.log('set up previous connections');

    for ( var i = 0; i < allSlots.length; i++) {
      var slotObj = allSlots[i];
      
      if( slotObj.var ){
        buildLiveViewDisplayListener( slotObj );
      }
    }
  }
}




function updateSlotDBforProject(){

  ipcRenderer.send('updateAllSlotsLV', allSlots );

}



// Run functions
$(document).ready(function(){

  // Layout Functions
  initSeparators();
  initBlokdotsConnectionIndicator();
  fillBtnIcons();

  // Slots
  initSlots();
  buttonEventsLiveViewSlots();
  getSlotControlSelection();

  blokdotsConnectionIndicator( connected );

  ipcCommunicationInitLV();

});