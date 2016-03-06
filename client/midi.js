/**
* Created by jonh on 5.3.2016.
*/
Meteor.startup(function () {
  Session.setDefault("midi_inputs", []);
  Session.setDefault("midi_available", false);
  Session.setDefault("selected_midi_input", null);
  Session.setDefault("selected_midi_name", "(NONE)");
});

Template.midi.onRendered(function () {
  updateMidiStatus();
});

Template.midi.helpers({
  midi_inputs: function () {
    console.log(Session.get("midi_inputs"));
    return Session.get("midi_inputs");
  },
  selected_midi_input_name: function () {
    return Session.get("selected_midi_name");
  },
  midi_available: function () {
    return Session.get("midi_available") ? "available" : "not available";
  }
});

Template.midi.events({
  'click .midi-input': function(event) {
    event.preventDefault();

    var input_id = event.currentTarget.parentNode.id;
    Session.set("selected_midi_input", input_id);
    Session.set("selected_midi_name", getMidiNameFromId(input_id));

    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess({
        sysex: false
      }).then(function (midiAccess) {
        var inputs = midiAccess.inputs.values();
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
          if (input_id === input.value.id) {
            input.value.onmidimessage = onMidiMessage;
          }
          else {
            input.value.onmidimessage = null;
          }
        }

      }, null);
    }
  }
});