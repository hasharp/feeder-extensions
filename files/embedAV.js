// アップロードされた音楽や動画を再生する拡張機能
// 再生にはaudioタグやvideoタグを使用する
// DOCTYPEがHTML5じゃない？  こまけぇこたぁいいんだよ！！

(function(self, common, ext, fqon) {
	var mimetypes = {
		'audio': {
			'aac':  'audio/aac',
			'ac3':  'audio/ac3',
			'aif':  'audio/aiff',
			'aiff': 'audio/aiff',
			'au':   'audio/basic',
			'flac': 'audio/x-flac',
			'm4a':  'audio/mp4',
			'mka':  'audio/x-matroska',
			'mp3':  'audio/mp3',
			'oga':  'audio/ogg',
			'ogg':  'audio/ogg',
			'ra':   'audio/vnd.rn-realaudio',
			'wav':  'audio/wave',
			'wma':  'audio/x-ms-wma',
		},
		'video': {
			'3gp':  'video/3gpp',
			'3gpp': 'video/3gpp',
			'asf':  'video/x-ms-asf',
			'asx':  'video/x-ms-asf',
			'avi':  'video/x-msvideo',
			'flv':  'video/flv',
			'm4v':  'video/mp4',
			'mkv':  'video/x-matroska',
			'mp4':  'video/mp4',
			'mov':  'video/quicktime',
			'mp2':  'video/mpeg',
			'mpg':  'video/mpeg',
			'mpeg': 'video/mpeg',
			'ogv':  'video/ogg',
			'qt':   'video/quicktime',
			'webm': 'video/webm',
			'wmv':  'video/x-ms-wmv',
		},
	};
	
	for (var i in mimetypes) {
		var element = document.createElement(i);
		if (!element.canPlayType) {
			mimetypes[i] = {};
			continue;
		}
		for (var j in mimetypes[i]) {
			if (!element.canPlayType(mimetypes[i][j])) {
				delete mimetypes[i][j];
			}
		}
	}
	
	
	return {
		'mimetypes': mimetypes,
		'constructor': function() {
			common.addFilter('embedAV', function(entries, skelton) {
				entries.forEach(function(entry, index, array) {
					array[index][5] = entry[5].replace(/<button class="download_btn" onclick="window\.open\('(.+?)'\);">(.*?)<br \/>.*?<\/button>/ig, function(all, url, filename) {
						var appendix = '';
						if (filename.indexOf('.') != -1) {
							var ext = filename.split('.').pop().toLowerCase();
							for (var i in mimetypes) {
								if (ext in mimetypes[i]) {
									appendix = '<br><'+i+' preload="none" controls class="extension-embed-av-'+i+' extension-embed-image"><source src="'+url+'" type="'+mimetypes[i][ext]+'"></'+i+'>';
									break;
								}
							}
						}
						return all + appendix;
					});
				});
				return entries;
			});
		},
		'destructor': function() {
			common.removeFilter('embedAV');
		},
	};
});