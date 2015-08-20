if (extensions && !extensions.features) {
	(function(ext, globalEval) {
		// globalEvalを私物化
		ext.globalEval = globalEval;
		
		
		// 初期化
		var isFirst = true;
		ext.enabledFeatures = [];
		ext.storage = {};
		
		
		// 拡張機能定義
		ext.features = {
			'embedPictures': {
				'available':   true,
				'force':       true,
			},
			'toasts': {
				'available':   true,
				'force':       true,
			},
			'unicorn': {
				'available':   (profileId == 'Airmodo' || ext.debug),
				'selected':    false,
				'caption':     'UC時にUnicornを流す（自己責任）',
				'description': 'ダイス結果にUCが出た時にUnicornを流します（自己責任）',
			},
			'dropFile': {
				'available':   true,
				'selected':    false,
				'caption':     'ファイルや画像をドロップしてアップロード',
				'description': '投稿欄にファイルや画像をドラッグ＆ドロップでアップロードできるようにします',
			},
			'rollDiceFromExpression': {
				'available':   true,
				'selected':    true,
				'caption':     '式からダイスロールを行う',
				'description': '投稿内容に式を入力してダイスロールを行います',
			},
			'addPicturePicker': {
				'available':   true,
				'selected':    true,
				'caption':     '画像ピッカーを追加',
				'description': '今まで投稿された画像の選択機能を追加します',
			},
			'addRecentlyUsedPicturePickerM': {
				'available':   true,
				'selected':    true,
				'caption':     '最近自分が使用した画像ピッカーを追加',
				'description': '最近自分が使用した画像の選択機能を追加します',
			},
			'addRecentlyUsedPicturePickerS': {
				'available':   true,
				'selected':    true,
				'caption':     '最近誰かに使用された画像ピッカーを追加',
				'description': '最近誰かに使用された画像の選択機能を追加します',
			},
			'embedGyazo': {
				'available':   true,
				'selected':    true,
				'caption':     '吹き出しにGyazoを展開',
				'description': '投稿にGyazoのアドレスが含まれていた場合、埋め込み画像に変換します',
			},
			'embedYabumi': {
				'available':   true,
				'selected':    true,
				'caption':     '吹き出しにYabumiを展開',
				'description': '投稿にYabumiのアドレスが含まれていた場合、埋め込み画像に変換します',
			},
			'embedImgur': {
				'available':   true,
				'selected':    true,
				'caption':     '吹き出しにImgurを展開',
				'description': '投稿にImgurのアドレスが含まれていた場合、埋め込み画像に変換します',
			},
			'embedSeiga': {
				'available':   true,
				'selected':    true,
				'caption':     '吹き出しにニコニコ静画を展開',
				'description': '投稿にニコニコ静画のアドレスが含まれていた場合、埋め込み画像に変換します',
			},
			'embedPixiv': {
				'available':   true,
				'selected':    true,
				'caption':     '吹き出しにPixivを展開',
				'description': '投稿にPixivのアドレスが含まれていた場合、埋め込み画像に変換します',
			},
			'embedYoutube': {
				'available':   true,
				'selected':    false,
				'caption':     '吹き出しにYoutubeを展開',
				'description': '投稿にYoutubeのアドレスが含まれていた場合、埋め込み動画に変換します',
			},
			'embedNiconico': {
				'available':   true,
				'selected':    false,
				'caption':     '吹き出しにニコニコ動画を展開',
				'description': '投稿にニコニコ動画のアドレスが含まれていた場合、埋め込み動画に変換します',
			},
			'embedAV': {
				'available':   true,
				'selected':    false,
				'caption':     '吹き出しに動画や音楽を展開',
				'description': '動画ファイルや音楽ファイルが投稿され、それが再生できる場合に埋め込みます',
			},
			'embedTwitter': {
				'available':   true,
				'selected':    true,
				'caption':     '吹き出しにTwitterを展開',
				'description': '投稿にTwitterのツイートのアドレスが含まれていた場合、当該ツイートを埋め込みます',
			},
			'removeNotification': {
				'available':   true,
				'selected':    false,
				'caption':     'お知らせを隠す',
				'description': '最初にページに表示されるお知らせを非表示にします',
			},
			'removeAds': {
				'available':   true,
				'selected':    false,
				'caption':     '広告を隠す',
				'description': 'ページに表示されている広告を非表示にします',
			},
			'toggleTrip': {
				'available':   true,
				'selected':    false,
				'caption':     '名前入力欄のトリップの表示を切り替え',
				'description': '名前入力欄にトリップを表示するかをダブルクリックで切り替えられるようにします',
			},
			'toastMessages': {
				'available':   true,
				'selected':    false,
				'caption':     '新着メッセージをトースト表示',
				'description': '新たにメッセージを受信した際、右下にトーストで通知します',
			},
			'toastEntries': {
				'available':   true,
				'selected':    false,
				'caption':     'ログ閲覧時、新着投稿をトースト表示',
				'description': 'ログを閲覧しているときに新たな投稿を受信した際、左上にトーストで通知します',
			},
			'changeStyles': {
				'available':   true/*ext.debug*/,
				'selected':    false,
				'caption':     'スタイルを変更（製作者用）',
				'description': '製作者好みのスタイルに変更します',
			},
		};
		
		
		
		// 共通関数読み込み
		ext.commonFunctions = ext.loadScript('@common.js', globalEval, false)(ext, 'extensions.commonFunctions');
		
		
		// localStorageに保存する
		ext.saveStorage = function() {
			localStorage.setItem(profileId+'/extensions', JSON.stringify(ext.storage));
		};
		
		// localStorageを読み込む
		ext.loadStorage = function() {
			ext.storage = localStorage.getItem(profileId+'/extensions') ? JSON.parse(localStorage.getItem(profileId+'/extensions')) : {};
		};
		
		// Cookieを設定する
		ext.setCookie = function(name, value, global) {
			var options = {
				'expires': 3650,
				'path':    global ? '/' : '/'+profileId+'/',
			};
			if (global) {
				options.domain = 'x-feeder.info';
				name += '_g';
			}
			
			$.cookie(name, value, options);
		};
		
		// Cookieを取得する
		ext.getCookie = function(name, global) {
			/*
			if (global) {
				return $.cookie(name+'_g') ? $.cookie(name+'_g') : $.cookie(name);
			} else {
				return $.cookie(name) ? $.cookie(name) : $.cookie(name+'_g');
			}
			/*/
			return global ? $.cookie(name+'_g') : $.cookie(name);
			//*/
		};
		
		// サイズ変更時用の関数を呼ぶ（サイズ変更時に呼ぶ）
		ext.updateSize = function() {
			for (var i in ext.features) {
				var e = ext.features[i];
				if (!e.available) continue;
				if (!e.ready) continue;
				
				var enabled = e.enabled || e.force;
				if (enabled && e.objects.resize) {
					e.objects.resize();
				}
			}
		};
		
		
		
		// 読み込み
		ext.loadStorage();
		ext.globalConfig = (ext.getCookie('egc', false) != '0');
		ext.commonFunctions.embedWidth  = ext.getCookie('eew', ext.globalConfig) ? Math.max(parseInt(ext.getCookie('eew', ext.globalConfig)), 1) : 320;
		ext.commonFunctions.embedHeight = ext.getCookie('eeh', ext.globalConfig) ? Math.max(parseInt(ext.getCookie('eeh', ext.globalConfig)), 1) : ext.commonFunctions.embedWidth;
		
		
		// 拡張機能選択欄追加
		$('#avatar_picker_icn').parent().append('<br><span id="extension_icons"></span>');
		
		
		// リストボックスの項目を移動する関数
		ext.moveListboxItems = function(src, dst) {
			var src = $(src);
			var dst = $(dst);
			
			var items = src.val();
			if (items) {
				items.forEach(function(e) {
					dst.append(
						src.children('option[value="'+e+'"]')
						.remove()
						.dblclick(function() {
							ext.moveListboxItems(dst,src);
						})
					);
				});
			}
		};
		
		// 機能選択関数
		ext.selectExtensions = function(silent) {
			// 設定読み込み
			var selectedFeatures = ext.getCookie('esf', ext.globalConfig);
			if (selectedFeatures) {
				selectedFeatures = selectedFeatures.split('-');
				for (var i in ext.features) {
					ext.features[i].selected = (selectedFeatures.indexOf(i) != -1);
				}
			}
			
			// ダイアログ書き出し
			var parts = {
				'ef_options': '',
				'df_options': '',
			};
			for (var i in ext.features) {
				var e = ext.features[i];
				if (!e.available) continue;
				if (e.force) continue;
				//var mode   = isFirst ? e.selected : e.enabled;
				var mode   = e.selected;
				var target = mode ? 'ef_options' : 'df_options';
				parts[target] += (
					''
					+ '\t\t\t\t\t'
					+ '<option value="'
					+ i
					+ '" title="'
					+ e.description
					+ '" ondblclick="extensions.moveListboxItems(\'#'
					+ (mode  ? 'enabled_extensions' : 'disabled_extensions')
					+ '\',\'#'
					+ (!mode ? 'enabled_extensions' : 'disabled_extensions')
					+ '\')">'
					+ e.caption
					+ '</option>'
					+ '\n'
				);
			}
			
			var data = '';
			data += '<div style="text-align: center;">\n';
			data += '	<div id="extension-config-tabs" style="text-align: left; margin-bottom: 1em;">\n';
			data += '		<ul>\n';
			data += '			<li><a href="#extension-config-tabs-1">機能選択</a></li>\n';
			data += '			<li><a href="#extension-config-tabs-2">詳細設定</a></li>\n';
			data += '		</ul>\n';
			data += '		<div id="extension-config-tabs-1" style="text-align: center;">\n';
			data += '			<div>\n';
			data += '				使用する機能を選択してください<br>\n';
			data += '				本ダイアログはヘッダの<img src="img/emoticons/180.gif" style="margin: 0 0.5em; border: 0 none transparent;" />からいつでも開けます<br>\n';
			data += '			</div>\n';
			data += '			<div style="display: table; margin: 0.3em auto;">\n';
			data += '				<div style="display: table-row; font-weight: bold;">\n';
			data += '					<div style="display: table-cell;">\n';
			data += '						<label for="extensions_disabled">使用しない機能</label>\n';
			data += '					</div>\n';
			data += '					<div></div>\n';
			data += '					<div style="display: table-cell;">\n';
			data += '						<label for="extensions_enabled" style="color: #008F3F;">使用する機能</label>\n';
			data += '					</div>\n';
			data += '				</div>\n';
			data += '				<div style="display: table-row;">\n';
			data += '					<div style="display: table-cell;">\n';
			data += '						<select id="disabled_extensions" multiple size="2" style="width: 22em; height: 19em;">\n';
			data += parts.df_options + '\n';
			data += '						</select>\n';
			data += '					</div>\n';
			data += '					<div style="display: table-cell; vertical-align: middle; padding: 0 1em;">\n';
			data += '						<button onclick="extensions.moveListboxItems(\'#disabled_extensions\',\'#enabled_extensions\')" style="margin-bottom: 1em;">→</button><br>\n';
			data += '						<button onclick="extensions.moveListboxItems(\'#enabled_extensions\',\'#disabled_extensions\')">←</button><br>\n';
			data += '					</div>\n';
			data += '					<div style="display: table-cell;">\n';
			data += '						<select id="enabled_extensions" multiple size="2" style="width: 22em; height: 19em;">\n';
			data += parts.ef_options + '\n';
			data += '						</select>\n';
			data += '					</div>\n';
			data += '				</div>\n';
			data += '			</div>\n';
			data += '			<div id="extension_description" style="color: #1F5FBF;">　</div>\n';
			data += '		</div>\n';
			data += '		<div id="extension-config-tabs-2" style="line-height: 2em;">\n';
			data += '			<input type="checkbox" id="extension_globalconfig"'+(ext.getCookie('egc',ext.globalConfig)!='0'?' checked':'')+'><label for="extension_globalconfig">全ルーム共通の設定を使用する</label><br>\n';
			data += '			<input type="checkbox" id="extension_skipdialog"'+(ext.getCookie('esd',ext.globalConfig)!='0'?' checked':'')+'><label for="extension_skipdialog">起動時に選択画面を表示しない</label><br>\n';
			data += '			<label for="extension_skipdialog">埋め込み動画像の最大幅</label><input type="text" id="extension_embedwidth" style="width: 4em; margin: 0 0.5em;" value="'+ext.commonFunctions.embedWidth+'">px<br>\n';
			data += '			<label for="extension_skipdialog">埋め込み動画像の最大高さ</label><input type="text" id="extension_embedheight" style="width: 4em; margin: 0 0.5em;" value="'+ext.commonFunctions.embedHeight+'">px<br>\n';
			data += '		</div>\n';
			data += '	</div>\n';
			data += '	<div>\n';
			data += '		<input type="checkbox" id="extension_saveconf"'+(ext.getCookie('esc',ext.globalConfig)!='0'?' checked':'')+'><label for="extension_saveconf">設定を保存する</label>\n';
			data += '	</div>\n';
			data += '</div>\n';
			
			// 決定ボタンが押されたか、決定ボタンが押されたことにされた場合
			var onOkButtonPressed = function() {
				// 有効化された機能を調べる
				ext.enabledFeatures = [];
				$('#enabled_extensions option').each(function() {
					ext.enabledFeatures.push($(this).val());
				});
				for (var i in ext.features) {
					if (ext.features[i].force) {
						ext.enabledFeatures.push(i);
					}
				}
				
				
				// 実行する関数
				var execute = function(e, enabled) {
					// スタートアップ関数実行
					if (enabled && !e.startuped) {
						e.startuped = true;
						e.objects.startup && e.objects.startup();
					}
					
					// コンストラクタ／デストラクタ実行
					var f = enabled ? e.objects.constructor : e.objects.destructor;
					f && f();
					
					// フラグ管理
					e.enabled = enabled;
				};
				
				// 拡張機能読み込み
				for (var i in ext.features) {
					var e = ext.features[i];
					
					// リリースされている機能か？
					if (!e.available) continue;
					
					// undefinedをfalseに変換
					e.enabled = !!e.enabled;
					
					// 機能は有効か？
					// （force指定のあるものは常に有効、リストにも出さない）
					var enabled = (ext.enabledFeatures.indexOf(i) != -1);
					enabled = enabled || !!ext.features[i].force;
					
					// コンストラクタ／デストラクタ実行
					if (enabled != e.enabled) {
						// オブジェクト初期化
						if (!e.objects) {
							e.ready = false;
							e.objects = {};
							ext.loadScript(i+'.js', globalEval, function(func, e, i, enabled) {
								// オブジェクトを格納
								var object = func(e.objects, ext.commonFunctions, ext, 'extensions.features.'+i+'.objects');
								$.extend(e.objects, object);
								
								// 実行
								execute(e, enabled);
								
								// 機能選択時に呼ばれないため、こちらで呼んでやる
								e.objects.resize && e.objects.resize();
								
								// フラグ更新
								e.ready = true;
								
								// completedコールバックを呼び出すべきときなら呼び出す
								if (!e.completed) {
									var flag = true;
									for (var j in ext.features) {
										var f = ext.features[j];
										if (((ext.enabledFeatures.indexOf(j) != -1) || f.force) && !f.ready) {
											flag = false;
											break;
										}
									}
									
									if (flag) {
										for (var j in ext.features) {
											var f = ext.features[j];
											
											if (f.completed || !f.objects) {
												continue;
											}
											
											f.objects.completed && f.objects.completed();
											f.completed = true;
										}
									}
								}
							}, e, i, enabled);
						} else {
							execute(e, enabled);
						}
					}
				}
				
				// 内部変数に設定を保存
				ext.globalConfig = $('#extension_globalconfig').prop('checked');
				ext.commonFunctions.embedWidth  = Math.max(parseInt($('#extension_embedwidth').val()),  1);
				ext.commonFunctions.embedHeight = Math.max(parseInt($('#extension_embedheight').val()), 1);
				
				// クッキーに設定を保存
				var saveConfig = $('#extension_saveconf').prop('checked');
				
				ext.setCookie('egc', (ext.globalConfig ? '1' : '0'), false);
				if (saveConfig) {
					var selectedFeatures = JSON.parse(JSON.stringify(ext.enabledFeatures));
					for (var i in ext.features) {
						if (ext.features[i].selected && !ext.features[i].available) {
							if (selectedFeatures.indexOf(i) == -1) {
								selectedFeatures.push(i);
							}
						}
					}
					
					ext.setCookie('esf', '-'+selectedFeatures.join('-'),                           ext.globalConfig);
					ext.setCookie('esd', ($('#extension_skipdialog').prop('checked') ? '1' : '0'), ext.globalConfig);
					ext.setCookie('eew', ''+ext.commonFunctions.embedWidth,                        ext.globalConfig);
					ext.setCookie('eeh', ''+ext.commonFunctions.embedHeight,                       ext.globalConfig);
				}
				ext.setCookie('esc', (saveConfig ? '1' : '0'),                                 ext.globalConfig);
				
				// スタイルとか諸々更新
				ext.updateSize();
				
				// 変数更新
				isFirst = false;
				
				// 変更を反映
				changePage(1, 0);
			}
			
			var options = {
				title: '拡張機能選択',
				width: 700,
				height: 560,
				autoOpen: true,
				closeOnEscape: true,
				resizable: false,
				modal: false,
				buttons: {
					'取り消し': function() {
						$(this).dialog('close');
					},
					'決定' : function() {
						onOkButtonPressed();
						$(this).dialog('close');
					},
				},
			};
			
			// HTML適用
			$('#mini_dialog_frame').html(data);
			
			// 拡張機能の説明文を表示するためのイベントハンドラを登録
			['enabled_extensions', 'disabled_extensions'].forEach(function(id) {
				$('#'+id).on('focus change', function() {
					var sel = $(this).val();
					var msg = '　';
					if (sel && sel.length == 1) {
						msg = ext.features[sel[0]].description;
					}
					$('#extension_description').text(msg);
				});
			});
			
			// タブを作る
			$('#extension-config-tabs').tabs();
			
			if (!silent) {
				// 普通にダイアログを呼び出す
				$('#mini_dialog_frame').dialog(options);
			} else {
				// あたかもダイアログが呼び出されたかのように振る舞う
				$('#mini_dialog_frame').hide();
				onOkButtonPressed();
			}
		};
		
		
		// ヘッダに呼び出しアイコン追加
		$('#header_items').css('width', '210px');
		$('#header_items').prepend('<img id="extensions_icn" src="img/emoticons/180.gif" class="clickable" title="拡張機能選択" />&nbsp;');
		$('#extensions_icn').click(function() {
			ext.selectExtensions(false);
			return false;
		});
		
		
		// 選択画面呼び出し
		ext.selectExtensions((ext.getCookie('esd', ext.globalConfig) == '1'));
	})(extensions, eval);
}