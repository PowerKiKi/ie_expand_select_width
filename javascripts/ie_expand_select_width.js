
$(document).ready(function(){

	function open(select)
	{
		// Allow only one select to be opened at any given time
		if ($.data(document.body, 'ie_fixed_select_lock') || select.is('.ie_fixed_select') || $('.ie_fixed_select_clone').length)
		{
			return;
		}
		$.data(document.body, 'ie_fixed_select_lock', true);

		// Clone the select to keep the layout intact
		var selectClone = select.clone();
		selectClone.addClass('ie_fixed_select_clone');

		// Insert the clone instead of original's position
		select.before(selectClone);
		
		// Move the original as an overlay on top of the clone
		select.appendTo("body");
		select.position({
			my : 'left',
			at : 'left',
			of : selectClone
		});
		
		// Prevent shortening and be sure it's always on top of everything else
		select.css({
			'min-width': select.width(),
			'z-index': 999
		});

		select.addClass('ie_fixed_select');
		select.data('ie_fixed_select_clone', selectClone);
		$.data(document.body, 'ie_fixed_select_lock', false);
	}

	function close(select)
	{
		var selectClone = select.data('ie_fixed_select_clone');
		if (!selectClone || $.data(document.body, 'ie_fixed_select_lock'))
		{
			return;
		}

		select.removeClass('ie_fixed_select');
		select.css('position', 'static');
		selectClone.replaceWith(select);
		select.data('ie_fixed_select_clone', null);
	}

	$('html > head').append('<style>select.ie_fixed_select { width: auto; }</style>');

	$("select")
	.bind("mouseover",function(){
		open($(this));
	})
	.bind("blur change", function(){
		close($(this));
	})
	.bind("mouseout", function(){
		if (!$(this).is(':focus'))
			close($(this));
	});

	$(window).resize(function() {
		$('select.ie_fixed_select').each(function(i, s) {
			var select = $(s);
			var selectClone = select.data('ie_fixed_select_clone');
			if (selectClone)
			{
				select.position({
					my : 'left',
					at : 'left',
					of : selectClone
				});
			}
		});
	});

});
