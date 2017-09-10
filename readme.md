### Introduction

An alternative to events in PlayCanvas.  Entities gain extra methods to broadcast messages to
scripts on entities in the hierarchy:

`broadcast` on or below the Entity.

`sendUpwards` on or above the Entity.

`send` on the Entity.

This works like the methods in Unity and removes the need for binding and unbinding event listeners.
And discovering objects on which bindings could be made in the first place.  The cost is
not insignificant if there are a lot of objects beneath the entity and `broadcast` is called. This
would be quite unusual though.  It's for events.  Don't call it every frame, if you want to do that
then you have something else up with your code.
 

### Installation

```language-shell
npm install --save playcanvas-sendmessage
```

### Usage

```language-javascript
import 'playcanvas-sendmessage'

...

//Script One - some kind of collision detection sensor on a sub object

ScriptOne.prototype.trigger = function(otherObject) {
    this.entity.sendUpwards('detected', this.name, otherObject, this);
};

//Script Two - the player control script

ScriptTwo.prototype.detected = function(sensorName, detectedObject, sensor) {
    if(sensorName === 'autoFirePoint' && detectedObject.tags.has('enemy')) {
        this.releaseTheDogsOfWar(detectedObject, sensor.getPosition());
    }
};
 
 

```

### Requirements

Requires PlayCanvas Engine to be running on the page.  Uses ES6/Babel/PlayCanvas template.
