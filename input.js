/**
 *	KeyboardEventBuffer - serves as a "buffer" for keyboard events, helping us to integrate browser keyboard events into the main game loop
 *
 * 	author: Yaniv Kessler (yaniv at codeark dot com)
 */
var events = require('./BrowserEvents.js');

var KEYCODES_LENGTH = 255;

module.exports.KeyboardEventBuffer = KeyboardEventBuffer;
module.exports.KeyboardPositionModifier2d = KeyboardPositionModifier2d;

function KeyboardEventBuffer(element) {
	if (element) {
		this._element = element;
	} else {
		this._element = window;
	}

	this._init();
};

/**
 * initialize the buffer
 */
KeyboardEventBuffer.prototype._init = function () {

	// each loop iteration we check the state of this array, cells that are marked as true, are "clicked"
	this._keyFlags = [];

	for (var i = 0; i < KEYCODES_LENGTH; i++) {
		this._keyFlags[i] = false;
	}

	this._onKeyDownToken = false;
	this._onKeyUpToken = false;
	this._onKeyPressToken = false;
};

KeyboardEventBuffer.prototype.isKeyPressed = function(keycode) {
	return this._keyFlags[keycode];
};

KeyboardEventBuffer.prototype._onKeyDown = function(event) {
	this._keyFlags[event.keyCode] = true;
};

KeyboardEventBuffer.prototype._onKeyUp = function(event) {
	this._keyFlags[event.keyCode] = false;
};

KeyboardEventBuffer.prototype.start = function() {
	var keyFlags = this._keyFlags;

	this._onKeyDownToken = events.addEvent(this._element, 'keydown', KeyboardEventBuffer.prototype._onKeyDown, this);
	this._onKeyUpToken = events.addEvent(this._element, 'keyup', KeyboardEventBuffer.prototype._onKeyUp, this);
};

KeyboardEventBuffer.prototype.stop = function () {
	events.removeEvent(this._onKeyDownToken);
	events.removeEvent(this._onKeyUpToken);

	this._init();
};

function KeyboardPositionModifier2d(target, keyboardEventBuffer, params) {
	this.target = target;
	this.keyboardEventBuffer = keyboardEventBuffer;

	if (!('north' in params)) {
		throw new Error('missing north key definition');
	}

	if (!('east' in params)) {
		throw new Error('missing east key definition');
	}

	if (!('south' in params)) {
		throw new Error('missing south key definition');
	}

	if (!('west' in params)) {
		throw new Error('missing west key definition');
	}

	this.params = params;
};

KeyboardPositionModifier2d.create = function(target, keyboardEventBuffer) {
	return new KeyboardPositionModifier2d(target, keyboardEventBuffer, { north: $c.Keys.Up, east: $c.Keys.Right, south: $c.Keys.Down, west: $c.Keys.Left });
};

KeyboardPositionModifier2d.prototype.update = function(cb) {
	if (this.keyboardEventBuffer.isKeyPressed(this.params.north)) {
		var lastPosition = this.target.y;
		this.target.y -= velocity;
		this.cancel = function() { this.target.y = lastPosition; };
	} else if (this.keyboardEventBuffer.isKeyPressed(this.params.east)) {
		var lastPosition = this.target.x;
		this.target.x += velocity;
		this.cancel = function() { this.target.x = lastPosition; };
	} else if (this.keyboardEventBuffer.isKeyPressed(this.params.south)) {
		var lastPosition = this.target.y;
		this.target.y += velocity;
		this.cancel = function() { this.target.y = lastPosition; };
	} else if (this.keyboardEventBuffer.isKeyPressed(this.params.west)) {
		var lastPosition = this.target.x;
		this.target.x -= velocity;
		this.cancel = function() { this.target.x = lastPosition; };
	}
};