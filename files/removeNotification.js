// お知らせを（一旦）除去する拡張機能
// 要るのかコレ？

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			setTimeout(function() {
				$('#notification').hide();
			}, (notificationClass == 'normal') ? 0 : 5000);
		},
		'destructor': function() {
		},
	};
});