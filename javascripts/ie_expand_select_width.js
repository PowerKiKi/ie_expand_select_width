/**
 *  https://github.com/PowerKiKi/ie_expand_select_width
 */
(function( $ ){ 

	$.fn.ieExpandSelectWidth = function() {
		this.filter('select')
		.bind('mouseenter focus',function(event){
			open($(this), event.type == 'mouseenter');
		});

		return this;
	};
	
	/**
	 * Open the expanded select
	 * @param select jQuery object for the original select element
	 */
	function open(select, openedViaMouse)
	{
		// Allow only one select to be opened at any given time
		// and only select in 'single choice' mode
		if ($.data(document.body, 'ie_expand_select_width_lock')
			|| select.is('.ie_expand_select_width')
			|| select.attr('multiple')
			|| select.attr('size') > 1)
		{
			return;
		}
		$.data(document.body, 'ie_expand_select_width_lock', true);

		// Clone the select to keep the layout intact
		var selectClone = select.clone();
		selectClone.val(select.val());
		
		var style = getComputedStyleMap(select);
		style['min-width'] = select.width(); // Cannot be shorter than current width
		style['width'] = 'auto';
		style['z-index'] = 9999; // be sure it's always on top of everything else
		selectClone.css(style);

		// Insert the clone at the very end of document, so it does not break layout
		selectClone.appendTo('body');
		
		// Move the clone as an overlay on top of the original
		reposition(select, selectClone);
		
		if (!openedViaMouse)
		{
			selectClone.focus();
		}
		
		// Bind events to close
		selectClone
		.bind('keydown keyup', function(event){
			selectClone.data('ie_expand_select_width_key_is_down', event.type == 'keydown');
		})
		.bind('mousedown mouseup', function(event){
			selectClone.data('ie_expand_select_width_mouse_is_down', event.type == 'mousedown');
		})
		.bind('blur', function(){
			close(select, selectClone);
		})
		.bind('change', function(){
			// Only close if the change was made via mouse
			if (!selectClone.data('ie_expand_select_width_key_is_down'))
				close(select, selectClone);
		});

		// Only close if we are doing a simple hover and not an a choice in a expanded select
		if (openedViaMouse)
		{
			selectClone.bind('mouseleave', function(){
				if (!selectClone.is(':focus'))
					close(select, selectClone);
			});
		}
		
		$(window).bind('resize.ie_expand_select_width', function() { reposition(select, selectClone); });

		$.data(document.body, 'ie_expand_select_width_lock', false);
	}

	/**
	 * Close the expanded select
	 * @param select jQuery object for the original select element
	 */
	function close(select, selectClone)
	{
		if (!selectClone || $.data(document.body, 'ie_expand_select_width_lock'))
		{
			return;
		}
		
		select.removeClass('ie_expand_select_width');
		select.val(selectClone.val()).change();
		selectClone.remove();
		select.data('ie_expand_select_width_clone', null);
		
		$(window).unbind('resize.ie_expand_select_width');
	}
	
	/**
	 * Reposition overlays on top of their clones
	 */
	function reposition(select, selectClone)
	{
		// Move the clone as an overlay on top of the original
		selectClone.position({
			my : 'left',
			at : 'left',
			of : select,
			collision: 'none'
		});
	}
	
	/**
	 * Returns a map of computed CSS style for the fiven element
	 * Highly inspired from http://stackoverflow.com/a/6416477/37706
	 */
	function getComputedStyleMap(element) {
		var dom = element.get(0);
		var style;
		var result = {};
		if (window.getComputedStyle) {
			style = window.getComputedStyle(dom, null);
			for (var i = 0; i < style.length; i++) {
				var prop = style[i];
				result[prop] = style.getPropertyValue(prop);
			}
		}
		else if (dom.currentStyle) {
			style = dom.currentStyle;
			for(var prop in style) {
				result[prop] = style[prop];
			}
		}
		
		return result;
	}
	
})( jQuery );
