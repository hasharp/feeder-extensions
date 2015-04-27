// Unicorn

(function(self, common, ext, fqon) {
	var playing = false;
	
	var audio = new Audio('ht'+'tp://50.7.37.2/ost/gundam-uc-origianl-soundtrack/bqrukxjgqd/02%20-%20UNICORN.mp3');
	
	self.syncCallback = function(data) {
		if (!soundEnabled) {
			return;
		}
		
		if (data.code == 3) {
			var info = data.param.split('\t');
			
			if (info[4] == 'jp/fvTz.' || info[4] == '4jvGoem/') {
				if (info[5].match(/<b>百の運命<\/b>/i)) {
					if (playing) {
						playing = false;
						
						var func = function(volume) {
							volume -= 0.02;
							if (volume < 0) {
								volume = 0;
								audio.pause();
								return;
							}
							audio.volume = volume;
							setTimeout(func, 100, volume);
						};
						func(1);
					} else {
						if (info[5].match(/完全強化される\(UC\)/i)) {
							audio.pause();
							audio.currentTime = 0;
							audio.volume = 1;
							audio.play();
							playing = true;
						}
					}
				}
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