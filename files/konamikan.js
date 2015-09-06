// コナミ感

(function(self, common, ext, fqon) {
	// キーコード
	var keyCodes = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
	// 入力状態
	var index = 0;
	
	// パラメータを解析
	var parseParam = function(param) {
		var decode = function(str) {
			return decodeURIComponent(str.replace(/\+/g, ' '));
		};
		var object = {};
		for (var sets=param.split('&'), i=0; i<sets.length; i++) {
			object[decode(sets[i].split('=')[0])] = decode(sets[i].split('=')[1]);
		}
		return object;
	};
	
	// パラメータを生成
	var buildParam = function(object) {
		var encode = function(str) {
			return encodeURIComponent(str).replace(/%20/g, '+');
		};
		var param = '';
		for (var i in object) {
			param += '&' + encode(i) + '=' + encode(object[i]);
		}
		param = param.substr(1);
		return param;
	};
	
	return {
		'constructor': function() {
			// キー入力検知
			$(document).on('keyup.konamikan', function(e) {
				if (e.which != keyCodes[index]) {
					index = 0;
					return;
				}
				index++;
				if (index >= keyCodes.length) {
					index = 0;

					var $objects = $('#sub_white_board_frame, #sub_broadcasting_frame, #sub_mini_game_frame').find('object');
					var $filteredObjects = [];
					$.each($objects, function() {
						var $param = $(this).children('');
						var values = parseParam($param.attr('value'));
						var hostname = values.hostname || values.rhost;
						if (!hostname.match(/^www\./)) $filteredObjects.push(this);
					});
					if ($filteredObjects.length < 1) {
						return;
					}
					
					var defaultAP = common.roomInfo.subdomain + '/' + profileId;
					var accessPoint = prompt('ホワイトボード、生放送、ゲームの接続先を変更できます\n接続先を サブドメイン/部屋名 の形式で入力してください\n例: ' + defaultAP, defaultAP);
					if (accessPoint == null || accessPoint == '' || accessPoint == defaultAP) {
						return;
					}
					
					var APS = accessPoint.split('/');
					if (APS.length != 2) {
						alert('形式が間違っています');
						return;
					}
					
					var subdomain = APS[0]
					var roomId = APS[1];
					if (subdomain != 'www1' && subdomain != 'www2') {
						alert('サブドメインはwww1またはwww2のみ使用可能です');
						return;
					}
					
					$.each($filteredObjects, function() {
						var $param = $(this).children('param[name=flashvars]');
						var values = parseParam($param.attr('value'));
						var hostname = subdomain + '.x-feeder.info';
						if (values.hostname) {
							values.hostname = hostname;
						} else {
							values.rhost = hostname;
							values.hhost = hostname;
						}
						values.feeder_id = roomId;
						$param.attr('value', buildParam(values));
						$(this).after($(this).clone()).remove();
					});
					
					alert('接続先を ' + accessPoint + ' に変更しました\nサブコンテンツフレームを閉じると接続先は元に戻ります');
				}
			});
		},
		'destructor': function() {
			$(document).off('.konamikan');
		},
	};
});