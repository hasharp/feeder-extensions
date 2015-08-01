// Youtubeを展開する拡張機能
// メモ：基本16:9ないし4:3で高さに+30px（プレイバックコントローラー分）すれば良さそう
//       再生リストの場合は+30しないっぽい

(function(self, common, ext, fqon) {
	return {
		'constructor': function() {
			common.addFilter('embedYoutube', function(entries, skelton) {
				// 動画
				entries = common.replaceURLs(entries, function(url) {
					var matches = url.match(/^https?:\/\/(?:www\.|m\.)?youtu(?:\.be|be\.com|be\-nocookie\.com).*[\/=]([\-\w]{11})/i);
					if (matches) {
						return '<iframe type="text/html" src="http://www.youtube.com/embed/'+matches[1]+'" class="extension-embed-youtube-video" frameborder="0" allowfullscreen />';
					}
				});
				// 再生リスト
				entries = common.replaceURLs(entries, function(url) {
					var matches = url.match(/^https?:\/\/(?:www\.)?youtube(?:\-nocookie)?\.com\/playlist\?list=([\-\w]+)/i);
					if (matches) {
						return '<iframe src="http://www.youtube.com/embed/videoseries?list='+matches[1]+'" class="extension-embed-youtube-playlist" frameborder="0" allowfullscreen></iframe>';
					}
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('embedYoutube');
		},
		'resize': function() {
			if (common.embedWidth * 9 < common.embedHeight * 16) {
				common.setStyle('.extension-embed-youtube-video', 'width: '+common.embedWidth+'px; height: '+(common.embedWidth/16*9+30)+'px;');
				common.setStyle('.extension-embed-youtube-playlist', 'width: '+common.embedWidth+'px; height: '+(common.embedWidth/16*9)+'px;');
			} else {
				common.setStyle('.extension-embed-youtube-video', 'width: '+((common.embedHeight-30)*16/9)+'px; height: '+common.embedHeight+'px;');
				common.setStyle('.extension-embed-youtube-playlist', 'width: '+(common.embedHeight*16/9)+'px; height: '+common.embedHeight+'px;');
			}
		},
	};
});