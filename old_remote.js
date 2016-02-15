var pins = {
	"up":    { "number": 13, "state": 0 },
        "down":  { "number": 26, "state": 0 },
        "left":  { "number": 19 , "state": 0 },
        "right": { "number":  6, "state": 0 }
};
var pin_names = {"up":1, "down":2, "left":3, "right":4};


if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'mousedown #up': function () {
      // increment the counter when button is clicked
      Meteor.call('set_pin_state', "up", "down");
    },
    'mouseup #up': function () {
      Meteor.call('set_pin_state', "", "up");
    },
    
    'mousedown #down': function () {
      // increment the counter when button is clicked
      Meteor.call('set_pin_state', "down", "up");
    },
    'mouseup #down': function () {
      Meteor.call('set_pin_state', "", "down");
    },
    
    'mousedown #left': function () {
      // increment the counter when button is clicked
      Meteor.call('set_pin_state', "left", "right");
    },
    'mouseup #left': function () {
      Meteor.call('set_pin_state', "", "left");
    },

    
    'mousedown #right': function () {
      // increment the counter when button is clicked
      Meteor.call('set_pin_state', "right", "left");
    },
    'mouseup #right': function () {
      Meteor.call('set_pin_state', "", "right");
    }
  });
}

if (Meteor.isServer) {
  var wiring = Meteor.npmRequire("wiring-pi");
  Meteor.startup(function () {
    Meteor.methods({
      set_pin_state: function (pin_high, pin_low) {
          if (pin_high !== "") {
              pins[pin_high]["state"] = 1;
          }
          if (pin_low !== "") {
              pins[pin_low]["state"] = 0;
          }
          updatePinStates(wiring);
      }
    });    
    wiring.wiringPiSetupGpio();
    for (var name in pin_names) {
      //console.log("name " + name);
      wiring.pinMode(pins[name]["number"], wiring.OUTPUT);
    }
    updatePinStates(wiring);
    
// code to run on server at startup

  
  });
}

function updatePinStates(wiring) {
    for (var name in pin_names) {
        var pin_num = pins[name]["number"];
        var pin_state = pins[name]["state"];
        //console.log("num " + pin_num + " state " + pin_state);
        wiring.digitalWrite(pin_num, pin_state);
    }
};