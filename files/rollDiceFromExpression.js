// 式を用いてダイスを振る

(function(self, common, ext, fqon) {
	var orgPostFeed = window.postFeed;
	var modPostFeed = function() {
		// 書き込み内容取得
		var content = $('#'+activeForm).val();
		
		// ダイスロール
		if ((content.length < 50) && content.match(/\d{1,2}d\d{1,3}/) && content.match(/^[\dd+\- ]+$/)) {
			$('#' + activeForm).val('');
			if (activeForm == 'post_form_multi' && typeof(defaultHeight) != 'undefined') {
				resetFormHeight();
			}
			$.ajax({
				url: 'roll_dice.php',
				type: 'POST',
				dataType: 'text',
				data: {
					'name': $('#post_form_name').val(),
					'formula': content,
				},
				success: function(result) {
					if (result == 'OK') {
						if (name != $('#post_form_name').val()) {
							name = $('#post_form_name').val();
							syncMyStatus();
						}
					} else {
						$('#' + activeForm).val(formula);
						if (!result.match(/^<\?xml.*/)) {
							alert(result);
						} else {
							alert('セッションがタイムアウトしました。ページをリロード（PCの場合はF5キーを押下）して下さい。');
						}
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					$('#' + activeForm).val(content);
					alert('通信エラーが発生しました。インターネットに接続されている事をご確認下さい。');
				}
			});
			return;
		}
		
		// オリジナルの関数を呼び出す
		var result = orgPostFeed.call(this);
		
		return result;
	};
	
	return {
		'constructor': function() {
			window.postFeed = modPostFeed;
		},
		'destructor': function() {
			window.postFeed = orgPostFeed;
		},
	};
});
