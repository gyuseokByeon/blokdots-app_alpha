
var allSlotsProject = [];


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

  for(var i = 0; i < allSlotsProject.length; i++){
    var curr = allSlotsProject[i];
    if(curr.slot == slotDOM.attr('slot') ){
      slotObj = curr;
    }
  }

  return slotObj;
}


function findComponentTypeObj( slotObj , type ){

  var componentTypeObj;
  //  find the equivalent slot object

  if( !type ){
    var type = slotObj.comp;
  }

  for(var i = 0; i < componentList.length; i++){
    var curr = componentList[i];
    if(curr.component == type){
      componentTypeObj = curr;
    }
  }

  return componentTypeObj;
}

// ------------------------------------------------------------


function initSlots(){


  const Slots = boardList['Grove Arduino Uno'].Slots;
  const pwmSlots = boardList['Grove Arduino Uno'].pwm;
  const Container = $('#setup #components #slots');

  var i = 0;


  Slots.forEach(function(slot){

    // insert a JSON object for each slot
    allSlotsProject[ i ] = {
      'slot'      : slot,
      'state'     : 'empty',
      'var'       : null,
      'comp'      : null,
      'name'      : null,
      'type'      : null,
      'dir'       : null,
      'ifttt_ids' : []
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
            // if(pwm){ m+= '<div class="pwm-indicator">pwm</div>'; }
            m+= '<div class="number">'+displaySlot+'</div>';
            m+= '<div class="info">// Not Defined</div>';
          m+= '</div>';
        m+= '</div>';

    Container.append(m);

    i++;

  });

  $('.slot').each(function(){
    slotState( $(this) , 'empty' );
  });

}



function slotState( slotDOM , state , slotObj ){

  var hadComponent = slotDOM.hasClass('connected');
  
  if( !slotObj ){
    slotObj = findSlotObj( slotDOM );
  }

  // slotHeightAdjust( slotDOM , 'close' );
  slotDOM.removeClass('empty quickSetup missing wrong');
  $('.setup-component-list').remove();

  switch (state){

    case 'empty':

      slotDOM.removeClass('connected');

      // remove possible other elements
      slotDOM.find('.info').html('// Not Defined');
      slotDOM.find('.use_btn').remove();
      slotDOM.find('.component-icon').remove();

      if( hadComponent ){
        slotDOM.find('.close').remove();
        slotDOM.find('.type-indicator').remove();
      }

    break;
    case 'quickSetup':

      if( hadComponent ){
        slotDOM.find('.component-icon').remove();
        slotDOM.find('.close').remove();
        slotDOM.find('.info').empty();
        slotDOM.find('.info').html('// Not Defined');
      }
 
      var componentTypeObj = findComponentTypeObj( slotObj );
      var img = '<img class="component-icon" src="../global/img/comp/'+componentTypeObj.image_url+'.svg"/>';
      var useBtn = '<div class="btn use_btn ghost-dark">Use</div>';

      slotDOM.find('.controls').append( img ).append( useBtn );
      slotDOM.attr('component-type',componentTypeObj.component);

    break;
    case 'connected':

      slotDOM.find('.use_btn').remove();
      slotDOM.find('.info').empty();

      var thisComponent = setupComponentForProject( slotDOM );

      var close = '<div class="close"></div>';
      var typeIndicator = '<div class="type-indicator '+thisComponent.type+' '+thisComponent.dir+'">'+thisComponent.dir+'</div>';
      var varLabel = '<div class="varLabel">var: ['+thisComponent.var+']</div>';
      var compName = '<div class="compName">'+thisComponent.name+'</div>';
      
      slotDOM.find('.controls').append( close );
      slotDOM.find('.info').append( typeIndicator ).append( varLabel ).append( compName );

      

    break;

    case 'missing':
    break;

    case 'wrong':
    break;

  }

  slotDOM.addClass(state);

}

function showQuicksetupSlot( slotObj ){

  const slotDOM = findSlotDOM( slotObj.slot );
  slotState( slotDOM , 'quickSetup' , slotObj );
}

function setSlot( slotObj ){

  const slotDOM = findSlotDOM( slotObj.slot );

  // check if slot has been there before
  if ( slotDOM.hasClass('missing') ) {
    slotDOM.removeClass('missing');
  }else{
    slotState( slotDOM , 'connected' );
  }
}

function slotGotDetached( slotNum ){

  const slotDOM = findSlotDOM( slotNum );

  if( slotDOM.hasClass( 'empty' ) ){

  }else if(slotDOM.hasClass( 'quickSetup' )){

    slotState( slotDOM , 'empty' );

  }else if(slotDOM.hasClass( 'connected' )){

    slotState( slotDOM , 'missing' );

  }

}


// Setup backend List ----------------------------------------------------
function setupComponentForProject( slotDOM ){

  // allSlotsProject

  var componentTypeObj = findComponentTypeObj( null , slotDOM.attr('component-type') );

  var currComponentObj;

  var slotNum = slotDOM.attr('slot');
  var varname = 'slot'+slotNum;

  for(var i = 0; i < allSlotsProject.length; i++){

    var curr = allSlotsProject[i];
    if(curr.slot == slotNum){
      
      curr.state  = 'connected';
      curr.var    = varname;
      curr.comp   = componentTypeObj.component;
      curr.name   = componentTypeObj.component;
      curr.type   = componentTypeObj.type;
      curr.dir    = componentTypeObj.dir;

      currComponentObj = curr;

    }
  }

  return currComponentObj;

}
function disconnectComponentForProject( slotDOM ){

  if( slotDOM.hasClass('missing') || slotDOM.hasClass('wrong') ){
    slotState(slotDOM,'empty');
  }else{
    slotState(slotDOM,'quickSetup');
  }

  // clear database again
  for(var i = 0; i < allSlotsProject.length; i++){

    var curr = allSlotsProject[i];
    if(curr.slot == slotDOM.attr('slot')){
      
      curr.state        = 'empty';
      curr.var          = null;
      curr.comp         = null;
      curr.name         = null;
      curr.type         = null;
      curr.dir          = null;
      curr.ifttt_ids    = [];
    }
  }

}



// Click Events
function buttonClickEventsSetup(){

  // if use button is clicked within setup 
  $('#setup #components').on('click','.use_btn',function(){
    var btn = $(this);
    var slotDOM = btn.closest('.slot');
    if ( slotDOM.hasClass('quickSetup') ) {
      ipcRenderer.send('useProject', slotDOM.attr('slot') );
    }
  });

  $('.slot').on('click','.close',function(){

    var slotDOM = $(this).closest('.slot');

    disconnectComponentForProject( slotDOM );

  });

}

// Ready Call Functions
$(document).ready(function(){
  initSlots();
  buttonClickEventsSetup();
});





















