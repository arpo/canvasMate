/*
 * canvasMate 1.0
 * License MIT
 */


var HBR = window.HBR || {};
HBR.canvasMate = (function () {

	function _getImageData(canvas) {
		return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
	}

	function _takeSnapShot(tCanvas, format) {

		if (format === 'jpg') format = 'jpeg';
		format = format || 'png';

		var quality = 1, 
			b64 = tCanvas.toDataURL('image/' + format, quality);

		return b64;

	}

	function _download(canvas, filename) {

		var format = 'png';
		if (filename.indexOf('.jpg') > -1) {
			format = 'jpg';
		}

		var img64 = _takeSnapShot(canvas, format).replace("image/png", "image/octet-stream");
		var pom = document.createElement('a');
		pom.setAttribute('href', img64);
		pom.setAttribute('download', filename);
		pom.style.display = 'none';
		document.body.appendChild(pom);
		pom.click();
		document.body.removeChild(pom);
	}

	function _resizeSnapShot(datas, w, h, callback) {

		// We create an image to receive the Data URI
		var img = document.createElement('img');

		// When the event "onload" is triggered we can resize the image.
		img.onload = function () {

			if (h === null) {
				h = w * (img.height / img.width);
			}

			if (w === null) {
				w = h * (img.height / img.width);
			}

			// We create a canvas and get its context.
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');

			// We set the dimensions at the wanted size.
			canvas.width = w;
			canvas.height = h;

			// We resize the image with the canvas method drawImage();
			ctx.drawImage(this, 0, 0, w, h);

			var quality = 0.9,
				format = 'jpeg',
				b64 = canvas.toDataURL('image/' + format, quality);

			callback(b64);

		};

		// We put the Data URI in the image's src attribute
		img.src = datas;

	}

	function _clear(canvas) {
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
	}

	function _insertImage(canvas, imageB64, opt) {

		opt = opt || {};

		var context = canvas.getContext('2d'),
			that = this,
			clear = opt.clear || false,
			callback = _u.defVal(opt.callback, function () {}),
			x = _u.defVal(opt.x, 0),
			y = _u.defVal(opt.y, 0),
			fit = opt.fit || false;

		if (clear) {
			_clear(canvas);
		}

		var image = new Image();
		image.onload = function () {
			if (fit) {
				context.drawImage(image, 0, 0, canvas.width, canvas.height);
			} else {
				context.drawImage(image, x, y, image.width, image.height);
			}
			that.isDirty = true;
			callback();
		};

		image.src = imageB64;

	}

	function _setBase64(b64, canvas, callback) {

		var image = new Image();
		var context = canvas.getContext('2d');
		image.onload = function () {
			context.drawImage(image, 0, 0, canvas.width, canvas.height);
			if (callback) callback();
		};
		image.src = b64;

	}

	function _copyTo(fromCanvas, toCanvas, callback, doClear) {

		doClear = (typeof (doClear) === 'undefined') ? true : doClear;

		var that = this,
			imgData = _takeSnapShot(fromCanvas);

		_insertImage(toCanvas, imgData, {
			clear: doClear,
			fit: true,
			callback: function () {
				callback();
			}
		});

	}

	return {
		copyTo: _copyTo,
		clear: _clear,
		insertImage: _insertImage,
		takeSnapShot: _takeSnapShot,
		resizeSnapShot: _resizeSnapShot,
		getImageData: _getImageData,
		setBase64: _setBase64,
		download: _download,
	};

}());