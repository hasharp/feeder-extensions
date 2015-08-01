// Pixivの画像を展開する拡張機能

(function(self, common, ext, fqon) {
	var originalWidth = 700;
	return {
		'peCount': 0,
		'updateSize': function($obj) {
			var height = $obj.data('height');
			var scale = Math.min(common.embedWidth / originalWidth, common.embedHeight / height, 1);
			$obj.css({
				'margin-right': ''+((scale-1)*originalWidth)+'px',
				'margin-bottom': ''+((scale-1)*height)+'px',
				'-ms-transform': 'scale('+scale+')',
				'-webkit-transform': 'scale('+scale+')',
				'transform': 'scale('+scale+')'
			});
		},
		'constructor': function() {
			common.addFilter('embedPixiv', function(entries, skelton) {
				var i = 0;
				entries = common.replaceURLs(entries, function(url, entry) {
					var matches = url.match(/^https?:\/\/www\.pixiv.net\/member_illust.php\?.*?illust_id=(\d+)/);
					if (matches) {
						self.peCount++;
						var id = 'embedPixiv_' + entry[0] + '_' + self.peCount;
						return '<iframe src="http://embed.pixiv.net/embed_mk2.php?id='+matches[1]+'&size=large&border=on" id="'+id+'" name="'+id+'" class="extension-embed-pixiv" frameborder="0"></iframe>';
					}
				});
				return entries;
			});
			$(window).on('message.extension', function(event) {
				if (event.originalEvent.origin != 'http://embed.pixiv.net') {
					return;
				}
				var data = JSON.parse(event.originalEvent.data);
				var $obj = $('#'+data[0]);
				$obj.data('height', data[1]);
				$obj.css('height', data[1]+'px');
				$obj.addClass('extension-embed-pixiv-loaded');
				self.updateSize($obj);
			});
		},
		'destructor': function() {
			common.removeFilter('embedPixiv');
			$(window).off('message.extension');
		},
		'resize': function() {
			$('.extension-embed-pixiv-loaded').each(function() {
				self.updateSize($(this));
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