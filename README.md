# Layla

Old project, a standalone micro animation lib for javascript.

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

Based on
http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html
http://www.koonsolo.com/news/dewitters-gameloop/

TODO:
full working example