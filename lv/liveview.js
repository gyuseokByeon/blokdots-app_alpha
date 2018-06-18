


function initSlots(){


  const Slots = [2,3,4,5,6,7,8,'A0','A1','A2','A3'];
  const Container = $('#slot-wrapper section');

  Slots.forEach(function(slot){

    var displaySlot = slot;
    if (slot === parseInt(slot, 10)){
      displaySlot = 'D'+slot;
    }

    var m = '<div class="slot empty" slot="'+slot+'">';

          m+= '<div class="indicator"></div>';
          m+= '<div class="number">'+displaySlot+'</div>';

          m+= '<div class="info">// Not Connected</div>';

          m+= '<div class="btn use_btn ghost-dark">Setup</div>';

        m+= '</div>';

    Container.append(m);

  });

}


function initBlokdotsConnectionIndicator(){

  var m = '<div class="connection"></div>';
  $('#grove_1 .separator').append(m);

}

function blokdotsConnectionIndicator( bool ){

  const conn = $('#grove_1 .connection');

  if( bool ){

    conn.addClass('connected');
    conn.text('board connected')

  }else{

    conn.removeClass('connected');
    conn.text('device not found')

  }

}

function connectSlot(){

  $('.slot').on('click',function(){

    // get slot number and check if int
    var groveSlot = $(this).attr('slot');
    if( groveSlot.indexOf('A') < 0 ){
      groveSlot = parseInt(groveSlot);
    }

  });

}




// Run functions
$(document).ready(function(){

  // Layout Functions
  initSeparators();
  initBlokdotsConnectionIndicator();

  // Slots
  initSlots();
  connectSlot();

  blokdotsConnectionIndicator( connected );

});