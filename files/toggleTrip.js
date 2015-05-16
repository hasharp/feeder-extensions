// トリップ切り替え

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			// 初期化
			self.holdedTrip = '';
			
			// 幅取得
			var originalWidth = $('#post_form_name').css('width');
			
			// 入力欄を入れ替え
			$('#post_form_name').attr('id', 'post_form_name_fake');
			$('#post_form_name_fake').after('<input type="hidden" id="post_form_name" value="">');
			$('#post_form_name').val(name);
			$('#post_form_name_fake').val(name);
			
			// 幅設定
			$('#post_form_name_fake').css('width', '95%');
			
			// イベントハンドラ設定
			$('#post_form_name_fake').on('keyup.extension blur.extension', function() {
				if (self.holdedTrip) {
					var a = $(this).val();
					var b = a.replace(/\$/g,'');
					if (a != b) {
						$(this).val(b);
					}
				}
				$('#post_form_name').val($(this).val()+self.holdedTrip);
			});
			$('#post_form_name_fake').on('dblclick.extension', function() {
				if (self.holdedTrip) {
					// 表示する
					$(this).css('background-color', '#FFFFFF');
					$('#post_form_name_fake').val($(this).val()+self.holdedTrip);
					self.holdedTrip = '';
				} else {
					// 非表示にする
					var name = $(this).val();
					self.holdedTrip = (name.indexOf('$') != -1) ? name.substr(name.indexOf('$')+1) : '';
					if (self.holdedTrip) {
						self.holdedTrip = '$' + self.holdedTrip;
						$(this).css('background-color', '#BFBFBF');
						$(this).val(name.substr(0,name.indexOf('$')));
					}
				}
			});
			$('#post_form_name_fake').trigger('dblclick.extension');
		},
		'destructor': function() {
			$('#post_form_name_fake').val($('#post_form_name').val());
			$('#post_form_name').remove();
			$('#post_form_name_fake').off('keyup.extension blur.extension dblclick.extension');
			$('#post_form_name_fake').attr('id', '#post_form_name');
		},
	};
});