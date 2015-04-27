// 最近使用した画像を追加する拡張機能

(function(self, common, ext, fqon) {
	return {
		'sid': 'fmp',
		'list': [],
		'float': function(id, path) {
			self.list = common.floatPicture(self.sid, self.list, id, path);
		},
		'logFunc': function(data) {
			if (data.code == 3) {
				var entry = getFeedArray(data.param);
				if (isIgnoredUser(entry[0][7])) {
					return;
				}
				if (entry[0][7] == sessionId) {
					var pictures = common.parsePictures(entry[0][3]);
					var pictures = pictures.concat(common.parsePictures(entry[0][5]));
					pictures.forEach(function(picture) {
						self.float(picture.n, picture.t);
					});
				}
			}
		},
		'constructor': function() {
			self.list = ext.storage[self.sid] ? ext.storage[self.sid] : [];
			if (!ext.storage[self.sid] && ext.getCookie(self.sid, false)) {
				self.list = JSON.parse(ext.getCookie(self.sid, false));
				ext.setCookie(self.sid, '', false);
			}
			socket.on('syncCallback', self.logFunc);
		},
		'destructor': function() {
			$('#recentlyusedbyme_picker_icn').remove();
			socket.removeListener('syncCallback', self.logFunc);
			self.list = {};
		},
		'completed': function() {
			$('#extension_icons').append('<a id="recentlyusedbyme_picker_icn" class="clickable" style="margin-right: 0.5em;"><img src="img/emoticons/94.gif" title="自分が最近使用した画像を選択"></a>');
			$('#recentlyusedbyme_picker_icn').click(function() {
				self.list = common.openRecentlyUsedPicturePicker('最近使用した画像の貼り付け', self.list, fqon+'.list');
				return false;
			});
		}
	};
});