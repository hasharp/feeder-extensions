// Pixivの画像を展開する拡張機能

(function(self, common, ext, fqon) {
	var originalWidth = 700;
	return {
		'peCount': 0,
		'constructor': function() {
			common.addFilter('embedPixiv', function(entries, skelton) {
				var i = 0;
				entries = common.replaceURLs(entries, function(url, entry) {
					var matches = url.match(/^https?:\/\/www\.pixiv.net\/member_illust.php\?.*?illust_id=(\d+)/);
					if (matches) {
						self.peCount++;
						var id = 'embedPixiv_' + entry[0] + '_' + self.peCount;
						return '<iframe src="ht'+'tp://embed.pixiv.net/embed_mk2.php?id='+matches[1]+'&size=large&border=on" id="'+id+'" name="'+id+'" class="extension-embed-pixiv" frameborder="0"></iframe>';
					}
				});
				return entries;
			});
			$(window).on('message.extension', function(event) {
				if (event.originalEvent.origin != 'ht'+'tp://embed.pixiv.net') {
					return;
				}
				var data = JSON.parse(event.originalEvent.data);
				$('#'+data[0]).css('height', data[1]+'px');
				$('#'+data[0]).css('margin-bottom', ((common.embedWidth/originalWidth-1)*data[1])+'px');
				$('#'+data[0]).addClass('extension-embed-pixiv-loaded');
			});
		},
		'destructor': function() {
			common.removeFilter('embedPixiv');
			$(window).off('message.extension');
		},
		'resize': function() {
			var scale = common.embedWidth / originalWidth;
			var style = (
				''
				+ '-ms-transform: scale('+scale+');'
				+ '-webkit-transform: scale('+scale+');'
				+ 'transform: scale('+scale+');'
				+ 'margin-right: '+(common.embedWidth-originalWidth)+'px;'
			);
			common.setStyle('.extension-embed-pixiv', style);
			
			$('.extension-embed-pixiv-loaded').each(function() {
				var height = parseFloat($(this).css('height'));
				$(this).css('margin-bottom', ((common.embedWidth/originalWidth-1)*height)+'px');
			});
		},
		'startup': function() {
			common.setStyle(
				'.extension-embed-pixiv',
				(
					''
					+ '-ms-transform-origin: 0 0;'
					+ '-webkit-transform-origin: 0 0;'
					+ 'transform-origin: 0 0;'
					+ 'width: 700px;'
					+ 'height: 40px;'						// 暫定的な高さ（丁度Pixivのロゴだけが見えるように）
				)
			);
		},
	};
});