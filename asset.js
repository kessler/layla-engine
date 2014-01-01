var $c = require('js-toolkit2/toolkit');

var asset = {};

/**
 * Handles the creation of audio tags to facilitate simultaneous playback of the same sample
 */
asset.SoundEffect = function(url, rate) {
	this.rate = rate;
	this.current = rate - 1;
	this.elements = new Array(rate);

	// we need to create several audio containers so we can play multiple instances of the same sample
	for (var i = 0; i < rate; i++) {
		var audio = $c.createElement('audio');
		audio.src = url;
		this.elements[i] = audio;
	}
};

asset.SoundEffect.prototype.play = function() {

	this.elements[this.current--].play();

	if (this.current == 0)
		this.current = this.rate - 1;
};

// disable sound when not supported
if (!$c.isAudioSupported())
	asset.SoundEffect.prototype.play = function() {};

asset.Image = {};

asset.Image.create = function(url) {
	var image = new Image();
	image.src = url;
	return image;
};

asset.Circle = {};

/**
 * Circles factory
 */
asset.Circle.create = function(x, y, r, params) {

	if (typeof(r) == 'undefined')
		throw 'missing radius';

	if (typeof(params) == 'undefined') {
		return new asset.Circle.Default(x, y, r);
	} else {
		var hasLineStyle = 'lineStyle' in params;
		var hasFillStyle = 'fillStyle' in params;

		if (hasLineStyle && hasFillStyle)
			return new asset.Circle.FilledStroked(x, y, r, params.lineStyle, params.fillStyle);
		else if (hasLineStyle)
			return new asset.Circle.Stroked(x, y, r, params.lineStyle);
		else if (hasFillStyle)
			return new asset.Circle.Filled(x, y, r, params.fillStyle);
		else
			throw 'misings params (either lineStyle or fillStyle or both';
	}

};

asset.Circle.Default = function(x, y, r) {
	this.x = x;
	this.y = y;
	this.r = r;
};

asset.Circle.Default.prototype.draw = function(context) {
	context.beginPath();
	context.arc(this.x, this.y, this.r, 0, 360);
	context.fill();
	context.closePath();
};

asset.Circle.Stroked = function(x, y, r, lineStyle) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.lineStyle = lineStyle;
};

asset.Circle.Stroked.prototype.draw = function(context) {
	var tempStyle = context.strokeStyle;

	context.beginPath();
	context.strokeStyle = this.lineStyle;
	context.arc(this.x, this.y, this.r, 0, 360);
	context.stroke();
	context.closePath();

	context.strokeStyle = tempStyle;
};

asset.Circle.Filled = function(x, y, r, fillStyle) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.fillStyle = fillStyle;
};

asset.Circle.Filled.prototype.draw = function(context) {
	var tempStyle = context.fillStyle;

	context.beginPath();
	context.fillStyle = this.fillStyle;
	context.arc(this.x, this.y, this.r, 0, 360);
	context.fill();
	context.closePath();

	context.fillStyle = tempStyle;
};


asset.Circle.FilledStroked = function(x, y, r, lineStyle, fillStyle) {
	this.x = x;
	this.y = y;
	this.r = r;
	this.fillStyle = fillStyle;
	this.lineStyle = lineStyle;
};

asset.Circle.FilledStroked.prototype.draw = function(context) {
	var tempFillStyle = context.fillStyle;
	var tempStrokeStyle = context.strokeStyle;

	context.beginPath();
	context.fillStyle = this.fillStyle;
	context.strokeStyle = this.strokeStyle;

	context.arc(this.x, this.y, this.r, 0, 360);
	context.fill();
	context.stroke();
	context.closePath();

	context.fillStyle = tempFillStyle;
	context.strokeStyle = tempStrokeStyle;
};


asset.Rectangle = {};

/**
 * Rectangles factory
 */
asset.Rectangle.create = function(x, y, w, h, params) {

	if (typeof(params) == 'undefined') {
		return new asset.Rectangle.Default(x, y, w, h);
	} else {
		var hasLineStyle = 'lineStyle' in params;
		var hasFillStyle = 'fillStyle' in params;

		if (hasLineStyle && hasFillStyle)
			return new asset.Rectangle.FilledStroked(x, y, w, h, params.lineStyle, params.fillStyle);
		else if (hasLineStyle)
			return new asset.Rectangle.Stroked(x, y, w, h, params.lineStyle);
		else if (hasFillStyle)
			return new asset.Rectangle.Filled(x, y, w, h, params.fillStyle);
		else
			throw "misings params (either lineStyle or fillStyle or both";
	}

};

asset.Rectangle.Default = function(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};

asset.Rectangle.Default.prototype.draw = function(context) {

	context.fillRect(this.x, this.y, this.w, this.h);
};

asset.Rectangle.Stroked = function(x, y, w, h, lineStyle) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.lineStyle = lineStyle;
};

asset.Rectangle.Stroked.prototype.draw = function(context) {
	var tempStyle = context.strokeStyle;

	context.strokeStyle = this.lineStyle;
	context.strokeRect(this.x, this.y, this.w, this.h);

	context.strokeStyle = tempStyle;
};

asset.Rectangle.Filled = function(x, y, w, h, fillStyle) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.fillStyle = fillStyle;
};

asset.Rectangle.Filled.prototype.draw = function(context) {
	var tempStyle = context.fillStyle;

	context.fillStyle = this.fillStyle;
	context.fillRect(this.x, this.y, this.w, this.h);

	context.fillStyle = tempStyle;
};


asset.Rectangle.FilledStroked = function(x, y, w, h, lineStyle, fillStyle) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.fillStyle = fillStyle;
	this.lineStyle = lineStyle;
};

asset.Rectangle.FilledStroked.prototype.draw = function(context) {
	var tempFillStyle = context.fillStyle;
	var tempStrokeStyle = context.strokeStyle;

	context.fillStyle = this.fillStyle;
	context.strokeStyle = this.lineStyle;

	context.fillRect(this.x, this.y, this.w, this.h);
	context.strokeRect(this.x, this.y, this.w, this.h);

	context.fillStyle = tempFillStyle;
	context.strokeStyle = tempStrokeStyle;
};

module.exports = asset;