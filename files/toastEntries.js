// ログ閲覧時に受信した投稿を左上にトースト表示

(function(self, common, ext, fqon) {
	self.syncCallback = function(data) {
		if (data.code == 3 || data.code == 4) {
			// スクロールをしていないかつページが1なら
			if (($(window).scrollTop() < $('#feed_list').offset().top)/* && (pageNum == 1)*/) {
				return;
			}
			
			// トースト表示
			if (typeof(toastr) != 'undefined') {
				var info = data.param.split('\t');
				
				var name;
				if (hideAvatarName) {
					name = info[3].replace(/<img .+? title="(.*?)" \/>/g, '$1');;
				} else {
					name = info[3].replace(/<img .+? title="(.*?)" \/>/g, '');;
				}
				name = name.replace(/<img src="\/.+?\/img\/emoticons\/(\d+).gif" .+?>/g, '[E:$1]');
				name = name.replace(/<a href="\/.+?\/pictures\/.+?" .+?><img title="(\d+)" src="\/.+?\/pictures\/.+?" \/><\/a>/g, '[P:$1]');
				
				var trip = info[4];
				
				var head = name + (trip ? ' <span style="font-size: 0.8em; color: #3F3F7F;">'+trip+'</span>' : '');
				
				var body = info[5] + '\n<p class="align_r post_time">' + info[6] + '</p>'
				
				toastr.info(body, head, {
					'toastClass': 'toast',
					'positionClass': 'toast-top-left',
					'onclick': function() {
						$('html, body').animate({scrollTop: 0}, 500);
					},
				});
			}
		}
	};
	
	return {
		'constructor': function() {
			socket.on('syncCallback', self.syncCallback);
		},
		'destructor': function() {
			socket.removeListener('syncCallback', self.syncCallback);
		},
	};
});