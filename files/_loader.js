// スクリプトを読み込む関数

if (!extensions || !extensions.loadScript) {
	var extensions = {};
	extensions.debug = false;
	extensions.baseURL = 'ht'+'tps://copy.com/6cbqHussEJsfBVe3/feeder-extensions/';
	extensions.convertToURL = function(name) {
		return extensions.baseURL + name.replace(/@/g,'_') + '?_=' + +new Date();
	};
	extensions.loadScript = function(name, func, callback) {
		var url = extensions.convertToURL(name);
		if (callback === false) {
			var data = $.ajax({
				url:  url,
				type: 'get',
				async: false,
			});
			if (data.status != 200) {
				return undefined;
			}
			return func(data.responseText);
		} else {
			var args = arguments;
			$.get(url, function(data) {
				// funcの実行は確実に行う
				var result = func(data);
				
				// callbackは任意
				if (callback) {
					var args_n = [result];
					for (var i=3; i<args.length; i++) {
						args_n.push(args[i]);
					}
					callback.apply(window, args_n);
				}
			});
			return;
		}
	};
}