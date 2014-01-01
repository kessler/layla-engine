/**
 * main engine, the main event loop is based on the wonderful article: http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html, which i
 * suspect is based on http://www.koonsolo.com/news/dewitters-gameloop/
 *
 * author: Yaniv Kessler (yaniv at codeark dot com)
 *
 */

function FPSEngine(fps, updateStateCallback, drawCallback) {

	this._updateStateCallback = updateStateCallback;
	this._drawCallback = drawCallback;
	this._skipTicks = 1000 / fps;
	this._maxFrameSkip = 10;
	this._gameTick = 0;
	this._nextGameTick = 0;

	// these two variables are used to control the engine run state
	this._intervalReference = false;

	this._onEachFrame;

	if (window.webkitRequestAnimationFrame)
		this._onEachFrame = this._onEachFrameWebkit;
	else if (window.mozRequestAnimationFrame)
		this._onEachFrame = this._onEachFrameMozilla;
	else
		this._onEachFrame = this._onEachFrameGeneric;
};

FPSEngine.prototype = {
	start: function () {
		this._nextGameTick = (new Date).getTime();
		this._onEachFrame(this._run);
	},
	stop: function () {
		this._gameTick = 0;
		if (!this._intervalReference)
			this._cb = function() {};
		else
			clearInterval(this._intervalReference);
	},
	_run: function() {

		var loops = 0;

		while ((new Date).getTime() > this._nextGameTick && loops < this._maxFrameSkip) {
		  this._updateStateCallback(this._gameTick);
		  this._nextGameTick += this._skipTicks;
		  loops++;
		  this._gameTick++;
		}

		if (loops > 0)
			this._drawCallback(this._gameTick);
	},
	_onEachFrameWebkit: function(cb) {
		var context = this;
		this._cb = function() { cb.call(context); webkitRequestAnimationFrame(context._cb); }
		this._cb();
	},
	_onEachFrameMozilla: function(cb) {
		var context = this;
		this._cb = function() { cb.call(context); mozRequestAnimationFrame(context._cb); }
		this._cb();
	},
	_onEachFrameGeneric: function(cb) {
		var context = this;
		this._intervalReference = setInterval(context.cb, 1000 / 60);
	}
};

module.exports = FPSEngine;