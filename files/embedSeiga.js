// ニコニコ静画を展開する拡張機能

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			common.addFilter('embedSeiga', function(entries, skelton) {
				entries = common.replaceURLs(entries, function(url, entry) {
					var matches = url.match(/^http:\/\/seiga.nicovideo.jp\/seiga\/im(\d+)/i);
					if (matches) {
						return '<img src="'+common.loadingImage+'" alt="http://lohas.nicoseiga.jp/thumb/'+matches[1]+'l" data-original="http://lohas.nicoseiga.jp/thumb/'+matches[1]+'l" class="extension-embed-image" />';
					}
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('embedSeiga');
		},
	};
});