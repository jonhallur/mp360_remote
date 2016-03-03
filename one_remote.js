Remotes = new Mongo.Collection("remotes");

const ONE_KEYCODE=49;
const TWO_KEYCODE=50;
const THREE_KEYCODE=51;

const ARROW_UP_KEYCODE=38;
const ARROW_DOWN_KEYCODE=40;
const ARROW_LEFT_KEYCODE=37;
const ARROW_RIGHT_KEYCODE=39;

const BUTTON_UP = Symbol();
const BUTTON_DOWN = Symbol();
const BUTTON_LEFT = Symbol();
const BUTTON_RIGHT = Symbol();

var last_key_pressed = null;
class Button {
  constructor (type, pin) {
    this.type = type;
    this.pin = pin;
  }
}

class UpButton extends Button {
  constructor (pin) {
    super(BUTTON_UP, pin);
  }
}

class DownButton extends Button {
  constructor (pin) {
    super(BUTTON_DOWN, pin);
  }
}

class LeftButton extends Button {
  constructor (pin) {
    super(BUTTON_LEFT, pin);
  }
}

class RightButton extends Button {
  constructor (pin) {
    super(BUTTON_RIGHT, pin);
  }
}

class Buttons {
  constructor(up, down, left, right) {
    var error_message = " button not correct type";
    if (!(up instanceof UpButton)) {
      throw("UP" + error_message);
    }
    if (!(down instanceof DownButton)) {
      throw("DOWN" + error_message);
    }
    if(!(left instanceof LeftButton)) {
      throw("LEFT" +  error_message);
    }
    if (!(right instanceof RightButton)) {
      throw("RIGHT" + error_message);
    }
    this.up = up;
    this.down = down;
    this.left = left;
    this.right = right;
  }
}

class Remote {
  constructor (index, display_name, buttons) {
    this.index = index;
    this.display_name = display_name;
    this.buttons = buttons;
  }
}

var remote_one =
  new Remote(
    1,
    "Remote 1",
    new Buttons(
      new UpButton(17),
      new DownButton(27),
      new LeftButton(22),
      new RightButton(4)
    )
  );

var remote_two =
  new Remote(
    2,
    "Remote 2",
    new Buttons(
      new UpButton(6),
      new DownButton(13),
      new LeftButton(26),
      new RightButton(5)
    )
  );

var remote_three =
  new Remote(
    3,
    "Remote 3",
    new Buttons(
      new UpButton(24),
      new DownButton(25),
      new LeftButton(12),
      new RightButton(23)
    )
  );

if( Meteor.isClient ) {
  Session.setDefault("selected_remote", 1);
  Session.setDefault(BUTTON_UP, 0);
  Session.setDefault(BUTTON_DOWN, 0);
  Session.setDefault(BUTTON_LEFT, 0);
  Session.setDefault(BUTTON_RIGHT, 0);

  Template.one_remote.helpers({
    selected_remote: function () {
      return Session.get("selected_remote");
    },
    remote_1_active: function () {
      return Session.get("selected_remote") === 1 ? "active" : "";
    },
    remote_2_active: function () {
      return Session.get("selected_remote") === 2 ? "active" : "";
    },
    remote_3_active: function () {
      return Session.get("selected_remote") === 3 ? "active" : "";
    },
    key_up_state: function () {
      return Session.get(BUTTON_UP) ? "active" : "";
    },
    key_down_state: function () {
      return Session.get(BUTTON_DOWN) ? "active" : "";
    },
    key_left_state: function () {
      return Session.get(BUTTON_LEFT) ? "active" : "";
    },
    key_right_state: function () {
      return Session.get(BUTTON_RIGHT) ? "active" : "";
    }
  });

  Template.one_remote.events({
    'mouseleave #button_up': function (event) {
      if (Session.get(BUTTON_UP) === 1) {
        Session.set(BUTTON_UP, 0);
        Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      }
      event.preventDefault();
    },
    'mouseleave #button_down': function (event) {
      if (Session.get(BUTTON_DOWN) === 1) {
        Session.set(BUTTON_DOWN, 0);
        Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      }
      event.preventDefault();
    },
    'mouseleave #button_left': function (event) {
      if (Session.get(BUTTON_LEFT) === 1) {
        Session.set(BUTTON_LEFT, 0);
        Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      }
      event.preventDefault();
    },
    'mouseleave #button_right': function (event) {
      if (Session.get(BUTTON_RIGHT) === 1) {
        Session.set(BUTTON_RIGHT, 0);
        Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      }
      event.preventDefault();
    },
    'mousedown .remote_selector': function (event) {
      var remote_number = parseInt(event.target.id[14]);
      Session.set("selected_remote", remote_number);
      resetKeyStates();
      Meteor.call("updateStatus", remote_number, getRemoteStates());
      event.preventDefault();
    },
    'mousedown #button_left': function (event) {
      Session.set(BUTTON_LEFT, 1);
      Session.set(BUTTON_RIGHT, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      event.preventDefault();
    },
    'mousedown #button_right': function (event) {
      Session.set(BUTTON_RIGHT, 1);
      Session.set(BUTTON_LEFT, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      event.preventDefault();
    },
    'mousedown #button_up': function (event) {
      Session.set(BUTTON_UP, 1);
      Session.set(BUTTON_DOWN, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      event.preventDefault();
    },
    'mousedown #button_down': function (event) {
      Session.set(BUTTON_DOWN, 1);
      Session.set(BUTTON_UP, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      event.preventDefault();
    },
    'mouseup #button_up': function (event) {
      Session.set(BUTTON_UP, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    },
    'mouseup #button_down': function (event) {
      Session.set(BUTTON_DOWN, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    },
    'mouseup #button_left': function (event) {
      Session.set(BUTTON_LEFT, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    },
    'mouseup #button_right': function (event) {
      Session.set(BUTTON_RIGHT, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    },
    'keydown': function (event) {
      var dirty = null;
      var keyCode = event.which || event.keyCode;
      if (keyCode === last_key_pressed) {
        event.preventDefault();
        return;
      }
      switch (keyCode) {
        case ONE_KEYCODE:
          Session.set("selected_remote", 1);
          resetKeyStates();
          dirty = true;
          break;
        case TWO_KEYCODE:
          Session.set("selected_remote", 2);
          resetKeyStates();
          dirty = true;
          break;
        case THREE_KEYCODE:
          Session.set("selected_remote", 3);
          resetKeyStates();
          dirty = true;
          break;
        case ARROW_DOWN_KEYCODE:
          Session.set(BUTTON_DOWN, 1);
          Session.set(BUTTON_UP, 0);
          dirty = true;
          break;
        case ARROW_LEFT_KEYCODE:
          Session.set(BUTTON_LEFT, 1);
          Session.set(BUTTON_RIGHT, 0);
          dirty = true;
          break;
        case ARROW_RIGHT_KEYCODE:
          Session.set(BUTTON_RIGHT, 1);
          Session.set(BUTTON_LEFT, 0);
          dirty = true;
          break;
        case ARROW_UP_KEYCODE:
          Session.set(BUTTON_UP, 1);
          Session.set(BUTTON_DOWN, 0);
          dirty = true;
          break;

      }
      if (dirty) {
        Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      }
      last_key_pressed = keyCode;
      event.preventDefault();
    },
    'keyup': function (event) {
      var dirty = null;
      switch (event.which || event.keyCode) {
        case ARROW_DOWN_KEYCODE:
          Session.set(BUTTON_DOWN, 0);
          dirty = true;
          break;
        case ARROW_LEFT_KEYCODE:
          Session.set(BUTTON_LEFT, 0);
          dirty = true;
          break;
        case ARROW_RIGHT_KEYCODE:
          Session.set(BUTTON_RIGHT, 0);
          dirty = true;
          break;
        case ARROW_UP_KEYCODE:
          Session.set(BUTTON_UP, 0);
          dirty = true;
          break;
      }
      if (dirty) {
        Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
      }
      last_key_pressed = null;
      event.preventDefault();
    }
  })
}

if (Meteor.isServer) {
  if (Remotes.find().count() === 0) {
    Remotes.insert(remote_one);
    Remotes.insert(remote_two);
    Remotes.insert(remote_three);
  }
  Meteor.startup(function () {
    var wiring;
    try {
      wiring = Meteor.npmRequire("wiring-pi");
    }
    catch (err){
      wiring = Object();
      wiring.digitalWrite = function(pin, value) {
        console.log("digital Write on pin: " + pin + " value: " + value );
      };
      wiring.pinMode = function(pin, mode) {
        console.log("pin mode pin: " + pin + " to mode: " + mode );
      };
      wiring.wiringPiSetupGpio = function() {
        console.log("pin mode set to gpio");
      };
      wiring.OUTPUT = "OUTPUT"

    }

    wiring.wiringPiSetupGpio();
    Remotes.find({}).forEach( function (remote) {
      //console.log(remote);
      [
        remote.buttons.up.pin,
        remote.buttons.down.pin,
        remote.buttons.left.pin,
        remote.buttons.right.pin
      ].forEach( function (pin) {
        wiring.pinMode(pin, wiring.OUTPUT);
        wiring.digitalWrite(pin, 0);
      });
    });

    Meteor.methods({
      'updateStatus': function (selected, states) {
        Remotes.find({}).forEach( function(remote) {
          if (remote.index === selected) {
            Object.keys(remote.buttons).forEach( function (button) {
              var pin = remote.buttons[button].pin;
              var state = states[button];
              wiring.digitalWrite(pin, state);
            });
          }
          else {
            Object.keys(remote.buttons).forEach( function (button) {
              wiring.digitalWrite(remote.buttons[button].pin, 0);
            })
          }
        });
      }
    });
  });


}

function resetKeyStates() {
  [BUTTON_UP, BUTTON_DOWN, BUTTON_LEFT, BUTTON_RIGHT].forEach( function (key) {
    Session.set(key, 0);
  });
}

function getRemoteStates() {
  return {
    up: Session.get(BUTTON_UP),
    down: Session.get(BUTTON_DOWN),
    left: Session.get(BUTTON_LEFT),
    right: Session.get(BUTTON_RIGHT)
  }
}