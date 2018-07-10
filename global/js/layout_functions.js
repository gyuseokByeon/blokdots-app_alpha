

function initSeparators(){

	$('section').each(function(){

		const sep = $(this);
		const name = sep.attr('sep-name');

		var m = "<div class='separator'>";
			m+= "<div class='name'>"+name+"</div>";
			m+= "</div>";

		sep.prepend(m);
	});

}


function fillBtnIcons(){

	$('.icon-btn').each(function(){

		var iconName = $(this).attr('btn-icon');

		$(this).css({
			'background-image' : 'url(../global/img/btn/'+iconName+'.svg)'
		});

	});
}


function changeIFTTTColumns(){

	var minCardWidth = 280;

	$(window).on('resize',function(){

		var containerWidth = $('#programm-container').width();

		var columnCount = parseInt( containerWidth / minCardWidth );

		$('#programm-container').css({
			'column-count' : columnCount
		});
	});

	$(window).trigger('resize');
}