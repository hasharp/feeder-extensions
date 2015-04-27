(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			var before;
			$(window).on('scroll.extension', function() {
				var now = ($(this).scrollTop() > 0);
				if (now != before) {
					before = now;
					
					// 下部のトーストの位置を調整
					common.setStyle('.toast-bottom-left, .toast-bottom-full-width, .toast-bottom-right', 'bottom: '+(now?72:12)+'px;');
					
					// 一番上にスクロールしたら上部のトースト削除
					if (!now) {
						if (typeof(toastr) != 'undefined') {
							toastr.clear($('.toast-top-left, .toast-top-full-width, .toast-top-right'));
						}
					}
				}
			});
		},
		'destructor': function() {
			$(window).off('scroll.extension');
		},
		'startup': function() {
			// ライブラリ読み込み
			ext.loadScript('@toastr.min.js', ext.globalEval, function() {
				toastr.options = {
					'closeButton':       true,
					'debug':             false,
					'newestOnTop':       false,
					'progressBar':       true,
					'preventDuplicates': false,
					'showDuration':      300,
					'hideDuration':      700,
					'timeOut':           10000,
					'extendedTimeOut':   2000,
					'showEasing':        'swing',
					'hideEasing':        'linear',
					'showMethod':        'slideDown',
					'hideMethod':        'fadeOut',
				};
			});
			$.get(ext.convertToURL('@toastr.css'), {}, function(data) {
				//data += '#toast-container > .toast { background-image: none !important; padding: 8px 8px 8px 8px !important; }';
				data += '#toast-container > .toast { padding-top: 6px; padding-bottom: 4px; }';
				data += '.toast .toast-title { color: #BFBFBF; }';
				data += '.toast a { color: #BFDFFF; }';
				data += '.toast .sent_time, .toast .post_time { color: #FFEFDF; }';
				data += '.toast .ref { border-radius: 4px; margin-left: 0; }';
				data += '.toast .ref .feed_id { color: #DFDFDF; }';
				data += '.toast .ref a.clickable { color: #DFEFFF; }';
				data += '.toast .ref a.clickable:hover { color: #BFBFBF; }';
				common.addStyleSheet(data);
			});
		},
	};
});