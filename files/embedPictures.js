// 画像を展開する拡張機能用の共通設定とか

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
		},
		'destructor': function() {
		},
		'startup': function() {
			// ライブラリ読み込み
			ext.loadScript('@jquery.lazyload.min.js', ext.globalEval);
		},
		'resize': function() {
			// 画像の最大サイズ制限
			common.setStyle('.extension-embed-image, .extension-embed-image-nolazyload', 'max-width: '+common.embedWidth+'px; max-height: '+common.embedHeight+'px;');
		},
		'load': function() {
			// LazyLoad
			if (typeof($.fn.lazyload) != 'undefined') {
				// ライブラリがロード済み
				$('img.extension-embed-image').lazyload();
			} else {
				// ライブラリが未ロード
				var func = function(count) {
					if (count > 100) {
						return;
					}
					if (typeof($.fn.lazyload) == 'undefined') {
						setTimeout(func, 100, count+1);
						return;
					}
					$('img.extension-embed-image').lazyload();
				};
				func(0);
			}
		},
	};
});