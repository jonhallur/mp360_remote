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
  // with pressure and tilt off
  // note off: 128, cmd: 8
  // note on: 144, cmd: 9
  // pressure / tilt on
  // pressure: 176, cmd 11:
  // bend: 224, cmd: 14
  var dirty = false;
  switch (type) {
    case 144: // noteOn message
      //noteOn(note, velocity);
      console.log(note, velocity);
      switch (note) {
        case 60:
          Session.set(BUTTON_LEFT, 1);
          Session.set(BUTTON_RIGHT, 0);
          dirty = true;
          break;
        case 61:
          Session.set(BUTTON_UP, 1);
          Session.set(BUTTON_DOWN, 0);
          dirty = true;
          break;
        case 62:
          Session.set(BUTTON_DOWN, 1);
          Session.set(BUTTON_UP, 0);
          dirty = true;
          break;
        case 64:
          Session.set(BUTTON_RIGHT, 1);
          Session.set(BUTTON_LEFT, 0);
          dirty = true;
          break;
        case 65:
          Session.set("selected_remote", 1);
          dirty = true;
          break;
        case 66:
          Session.set("selected_remote", 2);
          dirty = true;
          break;
        case 67:
          Session.set("selected_remote", 3);
          dirty = true;
          break;
      }
      break;
    case 128: // noteOff message
      switch (note) {
        case 60:
          Session.set(BUTTON_LEFT, 0);
          dirty = true;
          break;
        case 61:
          Session.set(BUTTON_UP, 0);
          dirty = true;
          break;
        case 62:
          Session.set(BUTTON_DOWN, 0);
          dirty = true;
          break;
        case 64:
          Session.set(BUTTON_RIGHT, 0);
          dirty = true;
          break;
      }
      break;
    case 176: // controller message
      //controlChange(note, velocity);
      break;
  }
  if (dirty) {
    Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
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
