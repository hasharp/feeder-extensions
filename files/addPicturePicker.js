// 画像ピッカーを追加

// なにやら正常に動作しない部分があるので、関数を置き換える
function changePicturesPage(page) {
	$.get('pictures.php?page='+page, function(data) {
		$('#mini_dialog_frame').html(data.replace(/'note_contents'/g, 'focusForm'));
	});
}

// メインルーチン
(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
		},
		'destructor': function() {
			$('#picture_picker_icn').remove();
		},
		'completed': function() {
			$('#extension_icons').append('<a id="picture_picker_icn" class="clickable" style="margin-right: 0.5em;"><img src="img/icons/picture_feed.png" title="画像をリストから選択"></a>');
			$('#picture_picker_icn').click(function() {
				openPicturePicker();
				changePicturesPage(1);
				return false;
			});
		}
	};
});