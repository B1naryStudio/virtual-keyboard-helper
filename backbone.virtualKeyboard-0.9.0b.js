(function(Backbone, $) {
    "use strict";
    Backbone.virtualKeyboard = {
        _timeoutId: null,
        _version: "0.9.0b",
        device: {
            type: "Other",
            version: 1
        },
        bindIOSEvents: function(){
            $("input:not([type=radio],[type=checkbox]),textarea").off("focus.virtualKeyboard", "blur.virtualKeyboard")
                .on("focus.virtualKeyboard", function(){
                    if(!$(this).is(":focus")){
                        $(this).off("click.virtualKeyboard").one("click.virtualKeyboard", function(){
                            Backbone.trigger("virtualKeyboard");
                            Backbone.trigger("virtualKeyboard.opened");
                        });
                    }
                    else{
                        Backbone.trigger("virtualKeyboard");
                        Backbone.trigger("virtualKeyboard.opened");
                    }
                })
                .on("blur.virtualKeyboard", function(){
                    Backbone.trigger("virtualKeyboard");
                    Backbone.trigger("virtualKeyboard.closed");
                });
        },
        bindOtherEvents: function(){
            var viewportWidth = window.innerWidth;
            var viewportHeight = window.innerHeight;

            $(window).off("resize.virtualKeyboard").on("resize.virtualKeyboard", function(){
                if(Backbone.virtualKeyboard._timeoutId){
                    clearTimeout(Backbone.virtualKeyboard._timeoutId);
                }

                Backbone.virtualKeyboard._timeoutId = setTimeout(function(){
                    var currentWidth = window.innerWidth;
                    var currentHeight = window.innerHeight;

                    var isFocused = $("input:not([type=radio],[type=checkbox]),textarea").is(":focus");

                    if(currentWidth == viewportWidth && currentHeight < viewportHeight && isFocused){
                        // reassign height so we can tell when keyboard closes
                        viewportHeight = currentHeight;
                        Backbone.trigger("virtualKeyboard");
                        Backbone.trigger("virtualKeyboard.opened");
                    }

                    if(currentWidth == viewportWidth && currentHeight > viewportHeight){
                        // reassign height so we can tell when keyboard reopens
                        viewportHeight = currentHeight;
                        Backbone.trigger("virtualKeyboard");
                        Backbone.trigger("virtualKeyboard.closed");
                    }

                    if(currentWidth != viewportWidth && currentHeight != viewportHeight){
                        // device rotated
                        viewportHeight = currentHeight;
                        viewportWidth = currentWidth;
                    }
                }, 400);
            });
        }
    };

    Backbone.on("virtualKeyboard:bindEvents", function(){
        if(Backbone.virtualKeyboard.device.type == "iPhone" || (Backbone.virtualKeyboard.device.type == "iPad")){
            Backbone.virtualKeyboard.bindIOSEvents();
        }
        else{
            Backbone.virtualKeyboard.bindOtherEvents();
        }
    });

    Backbone.on("virtualKeyboard:device.detect", function(){
        Backbone.virtualKeyboard.device.version = 1;

        if (navigator.platform.indexOf("iPad") != -1) {
            Backbone.virtualKeyboard.device.type = "iPad";
            if (event.acceleration) Backbone.virtualKeyboard.device.version += window.devicePixelRatio;
        }
        else if(navigator.platform.indexOf("iPhone") != -1){
            Backbone.virtualKeyboard.device.type = "iPhone";
        }

        window.ondevicemotion = null;
        Backbone.trigger("virtualKeyboard:device.detected", Backbone.virtualKeyboard.device);
        Backbone.trigger("virtualKeyboard:bindEvents");
    });

    window.ondevicemotion = function(event){
        Backbone.trigger("virtualKeyboard:device.detect");
    };
}.call(this, Backbone, jQuery));