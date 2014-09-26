# VirtualKeboard helper (v 0.9.0b)

This library requires Backbone and jQuery.
This library provide events for mobile keyboard open/close.
Basically it binds on focus event in iPhone and iPad devices and on resize in other devices.
Was tested on iPad, iPhone and Android. if it won't work on other device please mail me)

## Basic events

### Rebind event

To rebind events, when you view was rerendered trigger Backbone event `virtualKeyboard:bindEvents`

```javascript
Backbone.trigger("virtualKeyboard:bindEvents");
```

### Device detected

When device was detected (Other, iPad, iPhone) `virtualKeyboard:device.detected` will be triggered
Basically this event triggering only at start, but this event will be triggered also if you manually trigger event `virtualKeyboard:device.detect`

```javascript
Backbone.on("virtualKeyboard:device.detected", function(deviceInfo){
/*
deviceInfo = {
    type: (Other || iPad || iPhone),
    version: (int)
}
*/
...
});
```

### Keyboard opened

When keyboard is opened it triggers 2 events `virtualKeyboard` and `virtualKeyboard.opened`

### Keyboard closed

When keyboard is opened it triggers 2 events `virtualKeyboard` and `virtualKeyboard.closed`