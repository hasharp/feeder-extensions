// Gyazoを展開する拡張機能

(function(self, common, ext, fqon) {
	return {
		'caches': {},
		'constructor': function() {
			common.addFilter('output', 'embedGyazo', function(entries, skelton) {
				entries = common.replaceURLs(entries, function(url, entry) {
					if (url.match(/^https?:\/\/gyazo\.com\/[\da-f]+/i)) {
						return '<img src="'+common.loadingImage+'" data-url="'+url+'" onload="'+fqon+'.loadImage(this)" alt="'+url+'" class="extension-embed-image-nolazyload" />';
					}
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('output', 'embedGyazo');
		},
		'loadImage': function(image) {
			// SOP回避のためにYQL使ったらソースコードが悲しいことに…
			// 特に出力形式をちゃんと確認せずに例外で一気にまとめてる辺りなんかもう
			
			// 二回目以降はやらない
			if ($(image).data('converted')) {
				return;
			}
			$(image).data('converted', true);
			
			// オリジナルのURL
			var ourl = $(image).data('url');
			
			// キャッシュが存在するか
			if (ourl in self.caches) {
				var url = self.caches[ourl];
				$(image).attr('src', url);
				return;
			}
			
			// キャッシュがないので取得する
			$.get(
				'https://query.yahooapis.com/v1/public/yql',
				{
					'q':      'select * from html where url="https://api.gyazo.com/api/oembed?url='+encodeURIComponent(ourl)+'"',
					'format': 'json',
					'env':    'store://datatables.org/alltableswithkeys',
				},
				function(data) {
					var url;
					try {
						if (!data) {
							throw('Nothing was returned.');
						}
						url = JSON.parse(data['query']['results']['body'])['url']
						//url = url.replace(/\/\/bot\./i, '//embed.');
						
						// キャッシュに登録
						self.caches[ourl] = url;
					} catch(e) {
						// 取得処理に何らかのエラーが発生し、失敗した
						
						// console.log(e);
						url = common.failedImage;
						$(image).css('zoom', '2');
					}
					
					// src書き換え
					$(image).attr('src', url);
				}
			);
		},
	};
});