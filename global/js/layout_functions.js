

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