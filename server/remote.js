
if (Remotes.find().count() === 0) {
  Remotes.insert(remote_one);
  Remotes.insert(remote_two);
  Remotes.insert(remote_three);
}
if (RemoteMidiSettings.find().count() === 0) {
  midi_settings = {
    cameras: [camera_one_settings, camera_two_settings, camera_three_settings],
    buttons: [remote_button_up_settings, remote_button_down_settings, remote_button_left_settings, remote_button_right_settings]
  };
  RemoteMidiSettings.insert(midi_settings);
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
    [
      remote.buttons.up.pin,
      remote.buttons.down.pin,
      remote.buttons.left.pin,
      remote.buttons.right.pin
    ].forEach( function (pin) {
        var pin_num = parseInt(pin);
        wiring.pinMode(pin_num, wiring.OUTPUT);
        wiring.digitalWrite(pin_num, 0);
      });
  });

  Meteor.methods({
    'updateStatus': function (selected, states) {
      Remotes.find({}).forEach( function(remote) {
        if (remote.index === selected) {
          Object.keys(remote.buttons).forEach( function (button) {
            var pin = parseInt(remote.buttons[button].pin);
            var state = states[button];
            wiring.digitalWrite(parseInt(pin), state);
          });
        }
        else {
          Object.keys(remote.buttons).forEach( function (button) {
            var pin_num = parseInt(remote.buttons[button].pin);
            wiring.digitalWrite(pin_num, 0);
          })
        }
      });
    }
  });
});
