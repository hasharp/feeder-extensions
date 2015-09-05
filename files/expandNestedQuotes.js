// 引用中の引用を展開できるようにする拡張機能

(function(self, common, ext, fqon) {
	return {
		'expand': function(element, id) {
			var $element = $(element);
			var originalHtml = $element.html();
			
			// 読み込み中の表示にする
			$element.html(
				$('<img/>')
					.attr('src', common.loadingImage)
			);
			
			// ページ番号を取得して
			$.get('get_page_num.php?mode=0&id=' + id + '&num=20', function(page) {
				// エントリリストを取得して
				$.get('feed_list.php?mode=0&num=20&page=' + page + '&from=0&flip=0', function(rawEntries) {
					// 適合するエントリを探す
					var rawEntry = '';
					var entryList = rawEntries.split('\n');
					for (var i=0; i<entryList.length; i++) {
						var entryId = entryList[i].split('\t')[0];
						if (entryId == id) {
							rawEntry = entryList[i];
						}
					}
					// なければ元に戻す
					if (rawEntry == '') {
						$element.html(originalHtml);
						return;
					}
					// あれば更新
					var entry = $(arrangeFeed(getFeedArray(rawEntry, false))).find('table.comment>tbody>tr>td[colspan=2]').html();
					$element.after(entry).remove();
				});
			});
		},
		'constructor': function() {
			common.addFilter('output', 'expandNestedQuotes', function(entries, skelton) {
				entries.forEach(function(entry, index, array) {
					array[index][5] = entry[5].replace(/(<table class="ref">.+?)(&gt;&gt;(\d+))(.+?<\/table>)/g, function(all, prefix, tag, id, suffix) {
						id = parseInt(id);
						if (common.roomInfo.latestEntryId > 0 && id > common.roomInfo.latestEntryId) return all;
						
						return prefix + '<a onclick="'+fqon+'.expand(this, '+id+')">' + tag + '</a>' + suffix;
					});
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('output', 'expandNestedQuotes');
		},
	};
});