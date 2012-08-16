/**
 *  https://github.com/PowerKiKi/ie_expand_select_width
 */
(function( $ ){ 

	$.fn.ieExpandSelectWidth = function() {
		$('html > head').append('<style>select.ie_expand_select_width { width: auto; }</style>');

		this.filter('select')
		.bind('mouseenter focus',function(){
			open($(this));
		})
		.bind('blur change', function(){
			close($(this));
		})
		.bind('mouseleave', function(){
			if (!$(this).is(':focus'))
				close($(this));
		});

		return this;
	};
	

	/**
	 * Open the expanded select
	 * @param select jQuery object for the original select element
	 */
	function open(select)
	{
		// Allow only one select to be opened at any given time
		if ($.data(document.body, 'ie_expand_select_width_lock') || select.is('.ie_expand_select_width') || $('.ie_expand_select_width_clone').length)
		{
			return;
		}
		$.data(document.body, 'ie_expand_select_width_lock', true);

		// Clone the select to keep the layout intact
		var selectClone = select.clone();
		selectClone.addClass('ie_expand_select_width_clone');
		selectClone.css('visibility', 'hidden');

		// Insert the clone instead of original's position
		select.before(selectClone);
		
		// Move the original as an overlay on top of the clone
		select.appendTo('body');
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

		select.addClass('ie_expand_select_width');
		select.data('ie_expand_select_width_clone', selectClone);
		$(window).bind('resize.ie_expand_select_width', reposition);

		$.data(document.body, 'ie_expand_select_width_lock', false);
	}

	/**
	 * Close the expanded select
	 * @param select jQuery object for the original select element
	 */
	function close(select)
	{
		var selectClone = select.data('ie_expand_select_width_clone');
		if (!selectClone || $.data(document.body, 'ie_expand_select_width_lock'))
		{
			return;
		}
		
		select.removeClass('ie_expand_select_width');
		select.css('position', 'static');
		selectClone.replaceWith(select);
		select.data('ie_expand_select_width_clone', null);
		
		$(window).unbind('resize.ie_expand_select_width');
	}
	
	/**
	 * Reposition overlays on top of their clones
	 */
	function reposition()
	{
		$('select.ie_expand_select_width').each(function(i, s) {
			var select = $(s);
			var selectClone = select.data('ie_expand_select_width_clone');
			if (selectClone)
			{
				select.position({
					my : 'left',
					at : 'left',
					of : selectClone
				});
			}
		});
	}
})( jQuery );
