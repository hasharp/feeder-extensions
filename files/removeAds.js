// 広告を除去する拡張機能
// 警告されるまではいっかー　という考えのもと設置する

(function(self, common, ext, fqon) {
	var doaction = function(object, method) {
		if (!object || !object.size()) {
			return;
		}
		switch (method) {
			case 'show':
				object.css('overflow', object.data('orgOverflow'));
				object.css('width', object.data('orgWidth'));
				object.css('height', object.data('orgHeight'));
				break;
			
			case 'hide':
				object.data('orgOverflow', object.css('overflow'));
				object.data('orgWidth', object.css('width'));
				object.data('orgHeight', object.css('height'));
				object.css('overflow', 'hidden');
				object.css('width', 0);
				object.css('height', 0);
				break;
		}
	}
	var toggleAds = function(mode) {
		// 上部の広告他
		for (var i=0; i<$('#wrapper').children().length; i++) {
			var e = $($('#wrapper').children().get(i));
			if (e.attr('id')) {
				break;
			}
			doaction(e, mode);
		}
		
		// 下部の広告
		if (!$('#footer').prev().attr('id')) {
			doaction($('#footer').prev(), mode);
		}
		
		// 右上の広告
		doaction($('#ad_square'), mode);
		
		// 右側の広告
		doaction($('#ad_skyscraper'), mode);
	};
	return {
		'constructor': function() {
			toggleAds('hide');
		},
		'destructor': function() {
			toggleAds('show');
		},
	};
});