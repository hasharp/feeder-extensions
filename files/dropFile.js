// ファイルや画像をドロップできるようにする拡張機能

(function(self, common, ext, fqon) {
	return {
		'pendingFile': null,
		'constructor': function() {
			common.addFilter('input', 'dropFile', function(data) {
				var file = self.pendingFile
				if (!file) return data;
				
				var formData = new FormData();
				var url;
				
				var match;
				if (match = data.content.match(/^([\s\S]*?)\[P:\*(?:\/(\d))?\]([\s\S]*)$/)) {
					url = 'post_picture.php';
					
					formData.append('front_comment', match[1]);
					formData.append('rear_comment', match[3]);
					formData.append('frame_size', match[2] || '0');
					formData.append('picture', file);
				} else if (match = data.content.match(/^([\s\S]*?)\[F:\*\]([\s\S]*)$/)) {
					url = 'post_file.php';
					
					formData.append('front_comment', match[1]);
					formData.append('rear_comment', match[2]);
					formData.append('file', file);
				} else {
					return data;
				}
				
				formData.append('name', data.name);
				if (data.isImportant) formData.append('is_special', '1');
				formData.append('category_id', data.category);
				
				$('#post_form_single, #post_form_multi, #post_btn').prop('disabled', true);
				
				$.ajax({
					url:         url,
					method:      'POST',
					data:        formData,
					processData: false,
					contentType: false,
					complete:    function(data) {
						$('#post_form_single, #post_form_multi, #post_btn').prop('disabled', false);
						if (data.responseText != 'OK') {
							alert(data.responseText);
							return;
						}
						$('#' + activeForm).val('');
						if (activeForm == 'post_form_multi' && defaultHeight != undefined) {
							resetFormHeight();
						}
					},
				});
				
				return false;
			});
			$('#post_form_single, #post_form_multi')
				.on('dragenter.dropFile', function(e) {
					$('#post_form_frame').css('opacity', '0.75');
				})
				.on('dragleave.dropFile', function(e) {
					$('#post_form_frame').css('opacity', '1');
				})
				.on('drop.dropFile', function(e) {
					$('#post_form_frame').css('opacity', '1');
					
					var dataTransfer = e.originalEvent.dataTransfer;
					
					if (dataTransfer.files.length != 1) return true;
					
					var file = dataTransfer.files[0];
					
					var isPicture = (file.type.substr(0, 6).toLowerCase() == 'image/');
					var maxSize = isPicture ? common.roomInfo.maxPictureFileSize : common.roomInfo.maxFileSize;
					
					if (file.size > maxSize) {
						alert('ファイルサイズが大きすぎます');
						return false;
					}
					
					/*
					// 何故かダメ（return falseを外しても）
					dataTransfer.clearData();
					dataTransfer.setData('text/plain', (isPicture ? '[P:*'+'/2]' : '[F:*]'));
					*/
					
					appendText(activeForm, (isPicture ? '[P:*/2]' : '[F:*]'));
					
					self.pendingFile = file;
					
					return false;
				});
		},
		'destructor': function() {
			common.removeFilter('input', 'dropFile');
			$('#post_form_single, #post_form_multi').off('.dropFile');
		},
	};
});