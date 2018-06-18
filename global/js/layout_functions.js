

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