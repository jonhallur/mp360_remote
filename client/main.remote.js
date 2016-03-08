var last_key_pressed = null;

Session.setDefault(SELECTED_REMOTE, 1);
Session.setDefault("remotes_open", true);
Session.setDefault("settings_open", false);
Session.setDefault("midi_open", false);
Session.setDefault(BUTTON_UP, 0);
Session.setDefault(BUTTON_DOWN, 0);
Session.setDefault(BUTTON_LEFT, 0);
Session.setDefault(BUTTON_RIGHT, 0);

Template.body.helpers({
  remotes_open: function () {
    return Session.get("remotes_open") ? "active": "";
  },
  settings_open: function () {
    return Session.get("settings_open") ? "active": "";
  },
  midi_open: function () {
    return Session.get("midi_open") ? "active": "";
  }
});

Template.one_remote.helpers({
  selected_remote: function () {
    return Session.get(SELECTED_REMOTE);
  },
  remote_1_active: function () {
    return Session.get(SELECTED_REMOTE) === 1 ? "active" : "";
  },
  remote_2_active: function () {
    return Session.get(SELECTED_REMOTE) === 2 ? "active" : "";
  },
  remote_3_active: function () {
    return Session.get(SELECTED_REMOTE) === 3 ? "active" : "";
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
  'mousedown .remote_selector': function (event) {
    var remote_number = parseInt(event.currentTarget.id[14]);
    Session.set(SELECTED_REMOTE, remote_number);
    resetKeyStates();
    Meteor.call("updateStatus", remote_number, getRemoteStates());
    event.preventDefault();
  },
  'mousedown .arrow_button': function (event) {
    var button_name = event.currentTarget.id;
    Session.set(button_name, 1);
    Session.set(BUTTON_OPPOSITES[button_name.toUpperCase()], 0);
    Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    event.preventDefault();
  },
  'mouseup .arrow_button': function (event) {
    var button_name = event.currentTarget.id;
    Session.set(button_name, 0);
    Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    event.preventDefault();
  },
  'mouseleave .arrow_button': function (event) {
    var button_name = event.currentTarget.id;
    if (Session.get(button_name) === 1) {
      Session.set(button_name, 0);
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    }
    event.preventDefault();
  },
  'keydown': function (event) {
    var dirty = null;
    var keyCode = event.which || event.keyCode;
    if (keyCode === last_key_pressed) {
      event.preventDefault();
      return;
    }
    var cameras = RemoteMidiSettings.findOne({}).cameras;
    var arrows = RemoteMidiSettings.findOne({}).buttons;
    var buttons = cameras.concat(arrows);

    buttons.forEach( function (button) {
      if (keyCode === parseInt(button.keyCode)) {
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
    if (dirty) {
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    }
    last_key_pressed = keyCode;
    event.preventDefault();
  },
  'keyup': function (event) {
    var dirty = null;
    var keyCode = event.which || event.keyCode;
    var arrows = RemoteMidiSettings.findOne({}).buttons;

    arrows.forEach( function (button) {
      if (keyCode === parseInt(button.keyCode)) {
        Session.set(button.action, 0);
        dirty = true;
      }
    });
    if (dirty) {
      Meteor.call("updateStatus", Session.get("selected_remote"), getRemoteStates());
    }
    last_key_pressed = null;
    event.preventDefault();
  }
});

Router.route('/', function () {
  Session.set("remotes_open", true);
  Session.set("settings_open", false);
  Session.set("midi_open", false);
  this.render('one_remote');
});
Router.route('/settings', function () {
  Session.set("remotes_open", false);
  Session.set("settings_open", true);
  Session.set("midi_open", false);
  this.render('settings');
});
Router.route('/midi', function () {
  Session.set("remotes_open", false);
  Session.set("settings_open", false);
  Session.set("midi_open", true);
  this.render('midi');
});


