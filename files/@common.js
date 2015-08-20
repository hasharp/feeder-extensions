// 何故かここにおいておく
ninja_ads_count = 3;

(function(ext, fqon) {
	// 格納用オブジェクト
	var self    = {};
	var entries = {};
	
	
	// 定義
	self.loadingImage    = 'img/icons/ajax_loader.gif';
	self.dummyImage      = 'img/icons/status_1.gif';
	self.failedImage     = 'img/emoticons/12.gif';
	self.embedWidth      = 320;
	self.embedHeight     = 320;
	self.deletedPictures = [];
	
	
	// 部屋情報取得
	var isPremium = !!$('#header>h1>img[src$="/crown.png"]').length;
	
	self.roomInfo = {
		isPremium:          isPremium,
		maxFileSize:        (isPremium ? 100 : 10) * 1024 * 1024,
		maxPictureFileSize: 5 * 1024 * 1024,
	};
	
	
	
	// 投稿を読み終わった時に呼ばれる関数
	self.loadedEntries = function() {
		// ロード後に呼ぶ関数を呼ぶ
		ext.enabledFeatures.forEach(function(feature) {
			var func = ext.features[feature].objects.load;
			func && func();
		});
		
		// リロードボタンを追加
		$('#feed_list tr[id]:not(:data(loaded)) .comment .reference_icn')
			.after(
				$('<span/>')
					.addClass('reload_icn')
					.append(
						$('<img/>')
						.attr('src', 'img/emoticons/230.gif')
						.attr('title', '投稿を再読み込み')
						.css({
							'height': '13px',
							'margin': '0 6px 0 2px',
							'cursor': 'pointer',
						})
						.click(function() {
							var $entry = $(this).parents('.comment_frame').parent();
							$entry.removeData('loaded');
							$entry.find('.comment td:first').html($('<img/>').attr('src', self.loadingImage));
							setTimeout(function() {
								$entry.html($(window.arrangeFeed([$entry.data('original-entry')], false)).children());
							}, 500);
						})
					)
			);
		
		// オリジナルのentryを登録＆ロードフラグをセット
		for (var i=0; i<entries.length; i++) {
			var $entry = $('#' + entries[i][0]);
			$entry.data('original-entry', entries[i]);
			$entry.data('loaded', true);
		}
		
		// エントリを消去
		entries = {};
	};
	
	
	// CSS読み込み
	self.addStyleSheet = function(css, id) {
		var element = $('<style type="text/css">'+css+'</style>');
		id && element.attr('id', id);
		if (self.sandboxStyle) {
			element.insertBefore(self.sandboxStyle);
		} else {
			element.appendTo('head:first');
		}
	};
	
	
	// CSS変更
	
	// 新しい砂場用Style要素
	self.sandboxStyle = $('<style type="text/css"></style>').appendTo('head:first').get(0);
	
	// 操作用関数
	self.setStyle = function(selector, style) {
		var sheet = self.sandboxStyle.sheet;
		var rules = sheet.cssRules;
		
		/*
		// 既存の設定があれば上書き
		for (var i=0; i<rules.length; i++) {
			if (rules[i].selectorText == selector) {
				console.log('exists '+i);
				rules[i].cssText = style;
				return;
			}
		}
		
		// どうやら既存の設定はなかった模様
		console.log('addnew');
		sheet.insertRule(selector + '{' + style + '}', rules.length);
		//*/
		
		sheet.insertRule(selector + '{' + style + '}', rules.length);
	};
	
	
	// フィルタ関数
	var filterFunctions = {
		input:  {},
		output: {},
	};
	
	// 投稿部に介入して編集
	var orgPostFeed = window.postFeed;
	window.postFeed = function() {
		// 投稿内容を作成
		var postData = {
			name:        $('#post_form_name').val(),
			content:     $('#' + activeForm).val(),
			isImportant: $('#is_special').prop('checked'),
			category:    $('input:radio[name=category_id_for_post]:checked').val() || 0,
		};
		
		// フィルタ処理
		for (var i in filterFunctions.input) {
			postData = filterFunctions.input[i](postData);
			if (postData == false) return;
		}
		
		// 投稿内容を反映
		$('#post_form_name').val(postData.name);
		$('#' + activeForm).val(postData.content);
		$('#is_special').prop('checked', postData.isImportant);
		$('#category_id_for_post_' + postData.category).prop('checked', true);
		
		// オリジナルの関数を呼び出す
		orgPostFeed.call(this);
		
		return;
	};
	
	// エントリ整形部に介入して編集
	var lazyLoadTimer = null;
	var orgArrangeFeed = window.arrangeFeed;
	window.arrangeFeed = function(entry, skelton) {
		// エントリをコピー
		entries = JSON.parse(JSON.stringify(entry));
		
		// フィルタ処理
		for (var i in filterFunctions.output) {
			entry = filterFunctions.output[i](entry, skelton);
		}
		
		// 読み込み完了時にイベントを発火するためのスクリプトを挿入する
		// 雑なやり方（最後のresultに追加する方法）だと次の投稿の読み取りが上手くいかない模様
		if (!skelton) {
			entry[entry.length-1][5] += '<script type="text/javascript">'+fqon+'.loadedEntries();</script>';
		}
		
		// オリジナルの関数を呼び出す
		var result = orgArrangeFeed.call(this, entry, skelton);
		
		return result;
	};
	
	// フィルタ関数を登録
	self.addFilter = function(type, name, func) {
		if (!(type in filterFunctions)) return false;
		filterFunctions[type][name] = func;
		return true;
	};
	
	// フィルタ関数を削除
	self.removeFilter = function(type, name) {
		if (!(type in filterFunctions)) return false;
		if (!(name in filterFunctions[type])) return false;
		delete filterFunctions[type][name];
		return true;
	};
	
	
	// URLを検出して置換
	self.replaceURLs = function(entries, func) {
		entries.forEach(function(entry, index, array) {
			array[index][5] = entry[5].replace(/<a (href="\/jump.php\?url=)(.+?)((?:&.+?)?".*?>).*?<\/a>/ig, function(all, prefix, url, suffix) {
				url = htmlspecialcharsDecode(decodeURIComponent(url));
				var res = func(url, entry);
				if (res == undefined) {
					return all;
				}
				if (res.match(/^<(?:img|span)\s/i) || res.match(/^[^<]/i)) {
					return '<a data-processed="true" ' + prefix + encodeURIComponent(url) + suffix + res + '</a>';
				}
				return res;
			});
		});
		return entries;
	};
	
	
	// HTMLタグから画像IDを取得（複数）
	self.parsePictures = function(str) {
		var pictures = [];
		var reg = /<a href="\/.+?\/pictures\/(.+?)" .+?><img title="(\d+)" src="\/.+?\/pictures\/(.+?)" \/><\/a>/g;
		var match;
		while ((match = reg.exec(str)) != null) {
			pictures.push({
				n: match[2],
				p: match[1],
				t: match[3],
			});
		}
		return pictures;
	};
	
	
	// 削除された画像を削除
	self.removeDeletedPictures = function(target) {
		self.deletedPictures.forEach(function(id) {
			target = target.filter(function(element) {
				return element.n != id;
			});
		});
		self.deletedPictures = [];
		return target;
	};
	
	
	// 画像を浮かせる
	// スレッドフロート型掲示板でのスレを浮かせる的なノリで
	self.floatPicture = function(name, target, id, path) {
		// 削除された画像を削除
		target = self.removeDeletedPictures(target);
		
		// 既に一覧にあったら消す
		target = target.filter(function(element) {
			return element.n != id;
		});
		
		// 一番上に登録
		target.unshift({
			n: id,
			p: path,
		});
		
		// 登録数が多すぎる場合は削除
		while (target.length > 500) {
			target.pop();
		}
		
		// 保存
		ext.storage[name] = target;
		ext.saveStorage();
		
		return target;
	};
	
	
	// 最近使った画像ピッカーを表示
	self.openRecentlyUsedPicturePicker = function(caption, target, fqtn) {
		// 削除された画像を削除
		target = self.removeDeletedPictures(target);
		
		var data = '';
		target.forEach(function(element) {
			data += '<img src="pictures/'+element.p+'" title="'+element.n+'" onmouseover="itemMouseOver(this);" onmouseout="itemMouseOut(this);" onclick="appendText(focusForm, \'[P:'+element.n+']\');" onerror="'+fqon+'.memorizeDeletedPicture('+fqtn+', this)" />';
		});
		
		$('#mini_dialog_frame').html(data);
		$('#mini_dialog_frame').dialog({
			title: caption,
			width: 600,
			height: 480,
			autoOpen: true,
			closeOnEscape: true,
			resizable: false,
			modal: false,
			buttons: {
				'閉じる': function() {
					$(this).dialog('close');
				}
			},
		});
		
		return target;
	};
	
	
	// 読み込み失敗したやつを登録
	self.memorizeDeletedPicture = function(target, element) {
		var id = parseInt($(element).attr('title'));
		$.ajax({
			'url': $(element).attr('src'),
			'statusCode': {
				'404': function() {
 					self.deletedPictures.push(id);
				},
			},
		});
	};
	
	return self;
});