// 受信したメッセージを右下にトースト表示

(function(self, common, ext, fqon) {
	// 受信した新着メッセージの数
	var receivedMessageNum = 0;
	
	// 送受信ボックス表示関数書き換え
	var orgViewMessages = window.viewMessages;
	var viewMessages = function(mode) {
		if (mode == 'inbox') {
			openDialogFrame('受信BOX', {
				'閉じる': function() {
					$(this).dialog('close');
				}
			});
			
			$.get('message.php?mode=' + mode, function(data) {
				var $data = $(data);
				
				// NEW付加
				var $td = $data.find('#message_view>tbody>tr>td');
				for (var i=0; i*4<$td.length, i<receivedMessageNum; i++) {
					$($td[i*4]).html('<img src="img/icons/new.gif" title="新着">');
				}
				
				// カウンタ初期化
				receivedMessageNum = 0;
				
				// 表示
				$('#message_info').hide();
				$('#dialog_frame').html($data);
			});
		} else {
			// オリジナルの関数を呼び出す
			orgViewMessages.call(this, mode);
		}
	};
	
	// 新着メッセージ受信処理
	self.syncCallback = function(data) {
		if (data.code == 6 && data.param == sessionId) {
			$.get('message.php', {'mode': 'inbox'}, function(data) {
				var table = $(data).find('#message_view');
				var messages = table.children('tbody').get(0) ? table.children('tbody').children('tr') : table.children('tr');
				$.each(messages, function(index, element) {
					// ヘッダは除外
					if (index == 0) {
						return;
					}
					
					// 内容を取得
					// 新着アイコン, 名前（＋トリップ）, 内容, 返信ボタン
					var content = $(element).children('td');
					
					// 新着じゃないものは除外
					if (content.first().html() == '') {
						return;
					}
					
					
					// カウンタ増加
					receivedMessageNum++;
					
					// 情報を取得
					var name  = content.eq(1).clone().children().remove().end().text();
					var trip  = content.eq(1).children('.trip').text();
					var body  = content.eq(2).html();
					var reply = content.eq(3).children('button:first').attr('onclick');
					
					var head = name + (trip ? ' <span style="font-size: 0.8em; color: #3F7F3F;">'+trip+'</span>' : '');
					
					// トースト表示
					if (typeof(toastr) != 'undefined') {
						toastr.success(body, head, {
							'positionClass': 'toast-bottom-right',
							'onclick': function() {
								eval(reply);
							},
						});
					}
				});
			});
		}
	};
	
	return {
		'constructor': function() {
			socket.on('syncCallback', self.syncCallback);
			window.viewMessages = viewMessages;
		},
		'destructor': function() {
			socket.removeListener('syncCallback', self.syncCallback);
			window.viewMessages = orgViewMessages;
		},
	};
});