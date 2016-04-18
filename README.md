# Layla

A standalone micro animation lib for javascript.

```javascript
    var layla = require('layla')
    var engine = new layla.Engine(25, update, draw)

    // the keyboard buffer 
    var keyboardBuffer = new layla.input.KeyboardEventBuffer(window)
    keyboardBuffer.start()

    function update(currentTick) {
        // update the scene
    }

    function draw(currentTick) {
        // draw the scene
    }

```

TODO:
full working example