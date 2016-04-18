// a counter used to create unique IDs
var guid = 0;
var MAX = Math.pow(2, 53)

function fixEvent(event) {
    
    addW3CStandardEventMethods(event)
    fixEventCoordinates(event)

    return event;
};

function fixEventCoordinates(event) {
    // fix mouse events
    if (typeof(event.x) === 'undefined' && typeof(event.y) === 'undefined') {
        event.x = event.pageX;
        event.y = event.pageY;

        if (typeof(event.x) === 'undefined' && typeof(event.y) === 'undefined') {
            event.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            event.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
    }
}

function addW3CStandardEventMethods(event) {
    // add W3C standard event methods
    if (!event.preventDefault) {
        event.preventDefault = preventDefault;
    }

    if (!event.stopPropagation) {
        event.stopPropagation = stopPropagation;
    }
}

function preventDefault() {
    this.returnValue = false;
}

function stopPropagation() {
    this.cancelBubble = true;
}

/* end private stuff */

var events = {};

// public interface
// based on http://ejohn.org/projects/flexible-javascript-events/
events.addEvent = function(element, type, handler, context) {
    var _handler;

    if (typeof(context) !== 'undefined') {
        _handler = function(event) {
            handler.call(context, event);
        };
    } else {
        _handler = function(event) {
            handler.call(element, event);
        };
    }

    if (guid > MAX) guid = 0;

    var key = ++guid;
    var subkey = type + key;
    key = 'e' + subkey;

    if ( element.attachEvent ) {
        element[key] = _handler;
        element[subkey] = function(){ element[key]( fixEvent(window.event) ); }
        element.attachEvent( 'on'+type, element[subkey] );
    } else {
        element.addEventListener( type, _handler, false );
    }
    
    return [element, type, _handler, subkey, key];
};

//public interface
events.removeEvent = function(token) {
    removeEventImpl.apply(null, token)
}

function removeEventImpl(element, type, handler, subkey, key) {
    if ( element.detachEvent ) {
        element.detachEvent( 'on'+type, element[subkey] );
        element[subkey] = null;
        element[key] = null;
    } else {
        element.removeEventListener( type, handler, false );
    }
};

events.click = function(element, handler, context) {
    return events.addEvent(element, 'click', handler, context);
};

events.mouseover = function(element, handler, context) {
    return events.addEvent(element, 'mouseover', handler, context);
};

module.exports = events;