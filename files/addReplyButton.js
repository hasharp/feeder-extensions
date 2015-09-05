// 投稿検索の検索結果に引用ボタンを追加する拡張機能

(function(self, common, ext, fqon) {
	// 送受信ボックス表示関数書き換え準備
	var orgSearchFeed = window.searchFeed;
	var searchFeed = function(page) {
		// オリジナルの関数を呼び出す
		orgSearchFeed.call(this, page);
		// 読み込み中状態のhtml取得
		var orgHtml = $('#search_result_frame').html();
		// 検索完了まで待機
		var func = function() {
			if ($('#search_result_frame').html() == orgHtml) {
				setTimeout(func, 100);
				return;
			}
			// 引用ボタン追加
			$.each($('#search_result_list>tbody>tr[class]'), function() {
				var $this = $(this);
				var id = $this.find('span.feed_id').text();
				
				var $reply = $('<div/>')
								.attr('title', '投稿を引用')
								.css({
									'display':       'inline-block',
									'padding-right': '0.5em',
									'cursor':        'alias',
								})
								.html(
									$('<img/>')
										.attr('src', 'img/icons/reference.gif')
								)
								.click(function() {
									appendText(focusForm, '>>' + id);
									return false;
								});
				$this.find('span.feed_id').before($reply);
			});
		};
		func();
	};
	
	return {
		'constructor': function() {
			window.searchFeed = searchFeed;
		},
		'destructor': function() {
			window.searchFeed = orgSearchFeed;
		},
	};
});