// ファイルや画像をドロップできるようにする拡張機能

(function(self, common, ext, fqon) {
	return {
		'pendingFile': {
			ready: false,
		},
		'constructor': function() {
			common.addFilter('input', 'dropFile', function(data) {
				var ready = self.pendingFile.ready;
				self.pendingFile.ready = false;
				
				if (!ready) return data;
				
				var formData = new FormData();
				var url;
				
				if (self.pendingFile.isPicture) {
					var match = data.content.match(/^([\s\S]*?)\[P:\*(?:\/(\d))?\]([\s\S]*)$/);
					if (!match) return data;
					
					formData.append('front_comment', match[1]);
					formData.append('rear_comment', match[3]);
					formData.append('frame_size', match[2] || '0');
					formData.append('picture', self.pendingFile.file);
					
					url = 'post_picture.php';
				} else {
					var match = data.content.match(/^([\s\S]*?)\[F:\*\]([\s\S]*)$/);
					if (!match) return data;
					
					formData.append('front_comment', match[1]);
					formData.append('rear_comment', match[2]);
					formData.append('file', self.pendingFile.file);
					
					url = 'post_file.php';
				}
				
				formData.append('name', data.name);
				if (data.isImportant) formData.append('is_special', '1');
				formData.append('category_id', data.category);
				
				$.ajax({
					url:         url,
					method:      'POST',
					data:        formData,
					processData: false,
					contentType: false,
					complete:    function(data) {
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
					
					self.pendingFile = {
						ready:     true,
						isPicture: isPicture,
						file:      file,
					};
					
					return false;
				});
		},
		'destructor': function() {
			common.removeFilter('input', 'dropFile');
			$('#post_form_single, #post_form_multi').off('.dropFile');
		},
	};
});