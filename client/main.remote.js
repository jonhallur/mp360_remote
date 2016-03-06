

var last_key_pressed = null;

Session.setDefault("selected_remote", 1);
Session.setDefault("remotes_active", true);
Session.setDefault("settings_active", false);
Session.setDefault("midi_active", false);
Session.setDefault(BUTTON_UP, 0);
Session.setDefault(BUTTON_DOWN, 0);
Session.setDefault(BUTTON_LEFT, 0);
Session.setDefault(BUTTON_RIGHT, 0);

Template.body.helpers({
  remotes_active: function () {
    return Session.get("remotes_active") ? "active": "";
  },
  settings_active: function () {
    return Session.get("settings_active") ? "active": "";
  }
});

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
  },
  remotes_active: function () {
    return "active";
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
});

Router.route('/', function () {
  Session.set("remotes_active", true);
  Session.set("settings_active", false);
  Session.set("midi_active", false);
  this.render('one_remote');
});
Router.route('/settings', function () {
  Session.set("remotes_active", false);
  Session.set("settings_active", true);
  Session.set("midi_active", false);
  this.render('settings');
});
Router.route('/midi', function () {
  Session.set("remotes_active", false);
  Session.set("settings_active", false);
  Session.set("midi_active", true);
  this.render('midi');
});


