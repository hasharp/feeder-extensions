// Twitterのツイートを展開する拡張機能

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			common.addFilter('output', 'embedTwitter', function(entries, skelton) {
				entries = common.replaceURLs(entries, function(url, entry) {
					var matches = url.match(/^https?:\/\/twitter\.com\/(?:.*)\/status(?:es)?\/(\d+)(?:[\/?].*)?$/);
					if (matches) {
						//return '<blockquote class="twitter-tweet extension-embed-twitter"><a href="'+url+'"></a></blockquote>';
						return '<div class="extension-embed-twitter-unloaded" data-url="'+url+'" data-id="'+matches[1]+'"></div>';
					}
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('output', 'embedTwitter');
		},
		'startup': function() {
			$.getScript('//platform.twitter.com/widgets.js');
			common.setStyle('.extension-embed-twitter', 'display: inline-block;');
			common.setStyle('.twitter-tweet', 'margin: 0 !important;');
		},
		'resize': function() {
			common.setStyle('.extension-embed-twitter', 'width: '+common.embedWidth+'px;');
		},
		'load': function() {
			$('.extension-embed-twitter-unloaded').each(function() {
				$(this).removeClass('extension-embed-twitter-unloaded');
				$(this).addClass('extension-embed-twitter');
				
				var createTweet = function(id, element) {
					twttr.widgets.createTweet(id, element).then(function(e) {
						if (e == undefined) {
							// ツイートが読めなかった模様
							$(element).remove().after('<a data-external="true" href="'+htmlspecialchars($(element).data('url'))+'" target="_blank">'+htmlspecialchars($(element).data('url'))+'</a>').remove();
						}
					});
				};
				
				if (typeof(twttr) != 'undefined') {
					// ライブラリがロード済み
					createTweet($(this).data('id'), this);
				} else {
					// ライブラリが未ロード
					var func = function(id, element, count) {
						if (count > 100) {
							return;
						}
						if (typeof(twttr) == 'undefined') {
							setTimeout(func, 100, id, element, count+1);
							return;
						}
						createTweet(id, element);
					};
					func($(this).data('id'), this, 0);
				}
			});
		},
	};
});