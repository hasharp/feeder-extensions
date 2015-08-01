// Imgurを展開する拡張機能

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			common.addFilter('embedImgur', function(entries, skelton) {
				entries = common.replaceURLs(entries, function(url, entry) {
					var matches = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/(\w+)(?:\.\w+)?/i);
					if (matches) {
						// 拡張子pngだけど実際にはjpegが返ってくることもある
						return '<img src="'+common.loadingImage+'" alt="http://imgur.com/'+matches[1]+'.png" data-original="http://i.imgur.com/'+matches[1]+'m.png" class="extension-embed-image" />';
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