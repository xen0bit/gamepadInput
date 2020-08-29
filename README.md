# gamepadInput
HTML5 Gamepad API Event Driven Wrapper

Example Usage
```<script src="gamepadInput.min.js"></script>
<script>
//Define Button callback
gamepadInput.buttonCallbackFunction = function(e){console.log(e.detail);};
//Define Axes callback
gamepadInput.axesCallbackFunction = function(e){console.log(e.detail);};
//Initialize
gamepadInput.initialize();
</script>```