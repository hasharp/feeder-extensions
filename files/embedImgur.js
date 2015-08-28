// Imgurを展開する拡張機能

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			common.addFilter('output', 'embedImgur', function(entries, skelton) {
				entries = common.replaceURLs(entries, function(url, entry) {
					var matches = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/(\w+)(\.\w+)?/i);
					if (matches) {
						// 拡張子pngだけど実際にはjpegが返ってくることもある
						var ext = matches[2] ? matches[2] : '.png';
						var size = ext.match(/^\.gif$/i) ? '' : 'm';
						return '<img src="'+common.loadingImage+'" alt="http://imgur.com/'+matches[1]+ext+'" data-original="http://i.imgur.com/'+matches[1]+size+ext+'" class="extension-embed-image" />';
					}
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('output', 'embedImgur');
		},
	};
});