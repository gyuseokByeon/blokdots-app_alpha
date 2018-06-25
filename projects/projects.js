
var allSlots = [];

function initSlots(){


  const Slots = boardList['Grove Arduino Uno'].Slots;
  const pwmSlots = boardList['Grove Arduino Uno'].pwm;
  const Container = $('#setup #components #slots');

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



function slotState( slotDOM , state ){

  var hadComponent = slotDOM.hasClass('inUse');

  // slotHeightAdjust( slotDOM , 'close' );
  slotDOM.removeClass('empty setup inUse');
  $('.setup-component-list').remove();

  switch (state){

    case 'empty':

      // remove possible other elements
      slotDOM.find('.info').html('// Not Defined');
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

    break;

  }

  slotDOM.addClass(state);

}


// Ready Call Functions
$(document).ready(function(){
  initSlots();
});