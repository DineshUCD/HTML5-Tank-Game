var InputEngineClass = {
  //Specify the event handler for the 'keyup' event in the 'setup' method.
  //Grab a DOM element using the document.getElementByID method.
  //DOMElement.addEventHandler('event name', eventHandlerFunction);
  //-----------------------------
  isUsingMouse: false,
  isUsingKeyboard: false,
  mouse: {
    x: 0,
    y: 0
  },
  screenMouse: {
    x: 0,
    y: 0
  },
  //-----------------------------------------
  initMouse: function () {
    if (this.isUsingMouse) {
      return;
    }
    this.isUsingMouse = true;
  },

  //-----------------------------------------
  initKeyboard: function () {
    if (this.isUsingKeyboard) {
      return;
    }
    this.isUsingKeyboard = true;
  },
  //-----------------------------------------
  setup: function() {

    this.bind(87, 'move-up');
    this.bind(65, 'move-left');
    this.bind(83, 'move-down');
    this.bind(68, 'move-right');

    this.bind(38, 'fire-up');
    this.bind(39, 'fire-right');
    this.bind(40, 'fire-down');
    this.bind(37, 'fire-left');

    canvas.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },
  //-----------------------------
  onMouseMove: function(event) {
    var posX = event.clientX;
    var posY = event.clientY;
  },
  //-----------------------------
  onKeyDown: function(event) {
    var keyID = event.keyCode;
    var action = bindings[keyID];
    if (action) {
      actions[action] = true;
      console.log("UNPRESSED");
    }
  },
  //-----------------------------
  onKeyUp: function(event) {
    var keyID = event.keyCode;
    var action = bindings[keyID];
    if (action) {
      actions[action] = false;
      console.log("PRESSED");
    }
  },
  //-----------------------------
  bind: function(key, action) {
    if (key < 0) {
      this.initMouse();
    } else if (key > 0) {
      this.initKeyboard();
    }

    bindings[key] = action;
  },
  //-----------------------------------------
  unbind: function (key) {
    this.bindings[key] = null;
  },
  //-----------------------------------------
  unbindAll: function () {
    this.bindings = [];
  },

} //Input Engine Class
