var rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;
var gamepadInput = (function () {
    return {
        haveEvents: 'GamepadEvent' in window,
        haveWebkitEvents: 'WebKitGamepadEvent' in window,
        gamepadInitialized: false,
        gamepadButtonState: [],
        gamepadAxesState: [],
        buttonEventListener: function(buttonIndex) {
            var buttonName = 'button_' + buttonIndex;
            window.addEventListener(buttonName, function (e) {
                gamepadInput.buttonCallbackFunction(e);
            });
        },
        buttonEventDisaptcher: function (buttonIndex, buttonValue) {
            var buttonName = 'button_' + buttonIndex;
            var buttonEvent = new CustomEvent(buttonName, {
                detail: {
                    name: buttonName,
                    value: buttonValue
                }
            });
            window.dispatchEvent(buttonEvent);
        },
        axesEventListener: function (axesIndex) {
            var axesName = 'axes_' + axesIndex;
            window.addEventListener(axesName, function (e) {
                gamepadInput.axesCallbackFunction(e);
            });
        },
        axesEventDisaptcher: function (axesIndex, axesValue) {
            var axesName = 'axes_' + axesIndex;
            var axesEvent = new CustomEvent(axesName, {
                detail: {
                    name: axesName,
                    value: axesValue
                }
            });
            window.dispatchEvent(axesEvent);
        },
        axisPassesThreshold: function (a) {
            var axesThreshold = 0.1;
            if (Math.abs(a) > axesThreshold) {
                return true
            }
            else {
                return false
            }
        },
        monitorLoop: function () {
            let gamepads = window.navigator.getGamepads();
            gamepads = Array.prototype.slice.call(gamepads);

            // Loop all the gamepads on each frame
            gamepads.forEach((gamepad, index) => {
                if (gamepad) {
                    if (gamepadInput.gamepadInitialized == true) {
                        //Buttons
                        for (i = 0; i < gamepad.buttons.length; i++) {
                            if (gamepad.buttons[i].value != gamepadInput.gamepadButtonState[i]) {
                                gamepadInput.buttonEventDisaptcher(i, gamepad.buttons[i].value);
                                //Set state for next comparison
                                gamepadInput.gamepadButtonState[i] = gamepad.buttons[i].value;
                            }
                        }
                        //Axes
                        for (i = 0; i < gamepad.axes.length; i++) {
                            if (gamepad.axes[i] != gamepadInput.gamepadAxesState[i]) {
                                if (gamepadInput.axisPassesThreshold(gamepad.axes[i])) {
                                    gamepadInput.axesEventDisaptcher(i, gamepad.axes[i]);
                                    //Set state for next comparison
                                    gamepadInput.gamepadAxesState[i] = gamepad.axes[i];
                                }
                                else {
                                    if (gamepadInput.gamepadAxesState[i] != 0) {
                                        gamepadInput.axesEventDisaptcher(i, 0);
                                        gamepadInput.gamepadAxesState[i] = 0;
                                    }
                                }

                            }
                        }
                    }
                    else {
                        //initialize Gamepad values
                        for (i = 0; i < gamepad.buttons.length; i++) {
                            gamepadInput.gamepadButtonState.push(gamepad.buttons[i].value);
                            gamepadInput.buttonEventListener(i);
                        }
                        for (i = 0; i < gamepad.axes.length; i++) {
                            gamepadInput.gamepadAxesState.push(gamepad.axes[i]);
                            gamepadInput.axesEventListener(i);
                        }
                        gamepadInput.gamepadInitialized = true;
                    }

                }

            });

            rAF(gamepadInput.monitorLoop);

        },
        initialize: function () {
            if (gamepadInput.haveEvents) {
                window.addEventListener("gamepadconnected", gamepadInput.monitorLoop);
                window.addEventListener("gamepaddisconnected", gamepadInput.monitorLoop);
            } else if (gamepadInput.haveWebkitEvents) {
                window.addEventListener("webkitgamepadconnected", gamepadInput.monitorLoop);
                window.addEventListener("webkitgamepaddisconnected", gamepadInput.monitorLoop);
            }
        }
    }


})();

// gamepadInput.buttonCallbackFunction = function(e){console.log(e.detail);};
// gamepadInput.axesCallbackFunction = function(e){console.log(e.detail);};
// gamepadInput.initialize();