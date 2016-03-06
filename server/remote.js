
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
