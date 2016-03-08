/**
 * Created by jonh on 6.3.2016.
 */
resetKeyStates = function () {
  [BUTTON_UP, BUTTON_DOWN, BUTTON_LEFT, BUTTON_RIGHT].forEach( function (key) {
    Session.set(key, 0);
  });
};

getRemoteStates = function () {
  return {
    up: Session.get(BUTTON_UP),
    down: Session.get(BUTTON_DOWN),
    left: Session.get(BUTTON_LEFT),
    right: Session.get(BUTTON_RIGHT)
  }
};

getMidiNameFromId = function (input_id) {
  var inputs = Session.get("midi_inputs");
  for(var index in inputs) {
    if (inputs.hasOwnProperty(index) && (inputs[index].id === input_id)) {
      return inputs[index].name;
    }
  }
};

onMidiMessage = function (message) {
  data = event.data;
  cmd = data[0] >> 4;
  channel = data[0] & 0xf;
  type = data[0] & 0xf0; // channel agnostic message type. Thanks, Phil Burk.
  note = data[1];
  velocity = data[2];

  var cameras = RemoteMidiSettings.findOne({}).cameras;
  var arrows = RemoteMidiSettings.findOne({}).buttons;
  var buttons = cameras.concat(arrows);
  var dirty = false;
  switch (type) {
    case 144: // noteOn message
      //noteOn(note, velocity);
      buttons.forEach( function (button) {
        if (note === parseInt(button.midi)) {
          if (button.hasOwnProperty('counter_action')) {
            Session.set(button.action, 1);
            Session.set(button.counter_action, 0)
          }
          else if (button.hasOwnProperty('index')) {
            Session.set(button.action, button.index);
          }
          dirty = true
        }

      });
      break;
    case 128: // noteOff message
      arrows.forEach( function (button) {
        if (note === parseInt(button.midi)) {
          Session.set(button.action, 0);
          dirty = true;
        }
      });
      break;
  }
  if (dirty) {
    Meteor.call("updateStatus", Session.get(SELECTED_REMOTE), getRemoteStates());
  }
};

updateMidiStatus = function () {
  if (navigator.requestMIDIAccess) {
    var midi_inputs = [];
    navigator.requestMIDIAccess({
      sysex: false
    }).then(function (midiAccess) {
      var inputs = midiAccess.inputs.values();
      for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        midi_inputs.push({name: input.value.name, id: input.value.id});
      }
      Session.set("midi_inputs", midi_inputs);
      Session.set("midi_available", true);

    }, function (midiAccess) {
      Session.set("midi_available", false);
    });
  }
  else {
    Session.set("midi_available", false);
  }
};
