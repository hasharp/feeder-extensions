// Imgurを展開する拡張機能

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			common.addFilter('embedImgur', function(entries, skelton) {
				entries = common.replaceURLs(entries, function(url, entry) {
					var matches = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/i);
					if (matches) {
						// 拡張子pngだけど実際にはjpegが返ってくることもある
						return '<img src="'+common.loadingImage+'" alt="ht'+'tp://imgur.com/'+matches[1]+'.png" data-original="ht'+'tp://i.imgur.com/'+matches[1]+'m.png" class="extension-embed-image" />';
					}
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('embedImgur');
		},
	};
});