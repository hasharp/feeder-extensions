// 製作者好みのスタイルに変更する拡張機能

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			$('#input_bold, #input_italic, #input_strike, #input_underline').css('display', 'none');
			$('#text_decorator_frame').css('width', '58px');
			$('#misc_post_menu').contents().filter(function(){return this.nodeType==3;})[0].textContent = '特殊';
			$('#misc_post_menu').css('width', '46px');
			$.each($('#navi_right').children('p'), function() {
				var caption = $(this).text();
				$(this).children('img').attr('title', caption);
				$(this).html($(this).children('img'));
			});
		},
		'destructor': function() {
			$('#text_decorator_frame').css('width', '138px');
			$('#input_bold, #input_italic, #input_strike, #input_underline').css('display', 'inline');
			$('#misc_post_menu').contents().filter(function(){return this.nodeType==3;})[0].textContent = '特殊な投稿';
			$('#misc_post_menu').css('width', '82px');
			$.each($('#navi_right').children('p'), function() {
				var caption = $(this).children('img').attr('title');
				$(this).children('img').after(caption);
				$(this).children('img').removeAttr('title');
			});
		},
	};
});