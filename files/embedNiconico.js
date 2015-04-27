// niconicoを展開する拡張機能
// ファイル名とかで大文字のNを使用しているのは見やすいから
// メモ：w及びhで大きさ指定、n=1で別ウィンドウ指定、cbでコールバック指定（document.writeが回避できる）

(function(self, common, ext, fqon) {
	return {
		'neCount': 0,
		'neCallbacks': {},
		'neCallback': function(player, id) {
			var object = $(player.getHTML());
			object.removeAttr('width');
			object.removeAttr('height');
			object.attr('class', 'extension-embed-niconico');
			$('#'+id).append(object);
		},
		'constructor': function() {
			common.addFilter('embedNiconico', function(entries, skelton) {
				entries = common.replaceURLs(entries, function(url, entry) {
					var matches = url.match(/^https?:\/\/www\.nicovideo\.jp\/watch\/(\w+)/i);
					if (matches) {
						self.neCount++;
						var id = 'nicoEmbed_' + entry[0] + '_' + self.neCount;
						self.neCallbacks[id] = function(player) {
							self.neCallback(player, id);
						};
						return '<script type="text/javascript" src="ht'+'tp://ext.nicovideo.jp/thumb_watch/'+matches[1]+'?n=1&cb='+fqon+'.neCallbacks.'+id+'"></script><div id="'+id+'" class="extension-embed-niconico-container"></div>';
					}
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('embedNiconico');
		},
		'resize': function() {
			common.setStyle('.extension-embed-niconico', 'width: '+(common.embedWidth+10)+'px; height: '+(common.embedWidth/16*9+37)+'px;');
		},
		'startup': function() {
			common.setStyle('.extension-embed-niconico-container', 'display: inline-block;');
		},
	};
});