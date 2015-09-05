// 引用中の引用を展開できるようにする拡張機能

(function(self, common, ext, fqon) {
	return {
		'expand': function(element, from, target) {
			var $element = $(element);
			var originalHtml = $element.html();
			
			// 読み込み中の表示にする
			$element.html(
				$('<img/>')
					.attr('src', common.loadingImage)
			);
			
			// ページ番号を取得して
			$.get('get_page_num.php?mode=0&id=' + from + '&num=20', function(page) {
				// エントリリストを取得して
				$.get('feed_list.php?mode=0&num=20&page=' + page + '&from=0&flip=0', function(rawEntries) {
					// 適合するエントリを探す
					var rawEntry = '';
					var entryList = rawEntries.split('\n');
					for (var i=0; i<entryList.length; i++) {
						var entryId = entryList[i].split('\t')[0];
						if (entryId == from) {
							rawEntry = entryList[i];
						}
					}
					// なければ元に戻す
					if (rawEntry == '') {
						$element.html(originalHtml);
						return;
					}
					// あれば表示
					var entry = $(arrangeFeed(getFeedArray(rawEntry, false)));
					var quote = entry.find('span.feed_id:contains('+target+')').parents('table.ref');
					$element.after(quote).remove();
				});
			});
		},
		'constructor': function() {
			// フィルタ関数登録
			common.addFilter('output', 'expandNestedQuotes', function(entries, skelton) {
				entries.forEach(function(entry, index, array) {
					// まず引用を抜き出して
					array[index][5] = entry[5].replace(/<table class="ref">[\s\S]+?<span class="feed_id">(\d+)<\/span>[\s\S]+?<\/table>/g, function(all, from) {
						// そこから更にその中の引用を抜き出す
						return all.replace(/&gt;&gt;(\d+)/g, function(tag, target) {
							// 対象が存在しないIDならリンクにしない
							if (common.roomInfo.latestEntryId > 0 && target > common.roomInfo.latestEntryId) return tag;
							// リンク化
							return '<a onclick="'+fqon+'.expand(this, '+from+', '+target+')">' + tag + '</a>';
						});
					});
				});
				return entries;
			});
		},
		'destructor': function() {
			// フィルタ関数登録解除
			common.removeFilter('output', 'expandNestedQuotes');
		},
	};
});