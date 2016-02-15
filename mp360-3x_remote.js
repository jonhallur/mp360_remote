Settings = new Mongo.Collection("settings");

const UP = '_up';
const DOWN = '_down';
const LEFT = '_left';
const RIGHT = '_right';
const OPPOSITE = {
  UP: DOWN,
  DOWN: UP,
  LEFT: RIGHT,
  RIGHT: LEFT
};

function SetRemoteState(remote, highState, lowState) {
  if (highState !== null) {
    Session.set('remote_' + remote + highState, 1);
  }
  if (lowState !== null) {
    Session.set('remote_' + remote + lowState, 0);
  }

}
function getRemoteStates() {
  return {
    remote_1_up: Session.get('remote_1_up'),
    remote_2_up: Session.get('remote_2_up'),
    remote_3_up: Session.get('remote_3_up'),
    remote_4_up: Session.get('remote_4_up'),
    remote_1_down: Session.get('remote_1_down'),
    remote_2_down: Session.get('remote_2_down'),
    remote_3_down: Session.get('remote_3_down'),
    remote_4_down: Session.get('remote_4_down'),
    remote_1_left: Session.get('remote_1_left'),
    remote_2_left: Session.get('remote_2_left'),
    remote_3_left: Session.get('remote_3_left'),
    remote_4_left: Session.get('remote_4_left'),
    remote_1_right: Session.get('remote_1_right'),
    remote_2_right: Session.get('remote_2_right'),
    remote_3_right: Session.get('remote_3_right'),
    remote_4_right: Session.get('remote_4_right')
  };
}
if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('remote_1_up', 0);
  Session.setDefault('remote_1_down', 0);
  Session.setDefault('remote_1_left', 0);
  Session.setDefault('remote_1_right', 0);
  Session.setDefault('remote_2_up', 0);
  Session.setDefault('remote_2_down', 0);
  Session.setDefault('remote_2_left', 0);
  Session.setDefault('remote_2_right', 0);
  Session.setDefault('remote_3_up', 0);
  Session.setDefault('remote_3_down', 0);
  Session.setDefault('remote_3_left', 0);
  Session.setDefault('remote_3_right', 0);

  Template.remotes.helpers({
    remote_1: function () {
      return Settings.findOne({name: "remote_1"});
    },
    remote_1_up_state: function () {
      return Session.get('remote_1_up') ? 'led-green' : 'led-red';
    },
    remote_1_left_state: function () {
      return Session.get('remote_1_left') ? 'led-green' : 'led-red';
    },
    remote_1_down_state: function () {
      return Session.get('remote_1_down') ? 'led-green' : 'led-red';
    },
    remote_1_right_state: function () {
      return Session.get('remote_1_right') ? 'led-green' : 'led-red';
    },
    remote_2: function () {
      return Settings.findOne({name: "remote_2"});
    },
    remote_2_up_state: function () {
      return Session.get('remote_2_up') ? 'led-green' : 'led-red';
    },
    remote_2_down_state: function () {
      return Session.get('remote_2_down') ? 'led-green' : 'led-red';
    },
    remote_2_left_state: function () {
      return Session.get('remote_2_left') ? 'led-green' : 'led-red';
    },
    remote_2_right_state: function () {
      return Session.get('remote_2_right') ? 'led-green' : 'led-red';
    },
    remote_3: function () {
      return Settings.findOne({name: "remote_3"});
    },
    remote_3_up_state: function () {
      return Session.get('remote_3_up') ? 'led-green' : 'led-red';
    },
    remote_3_down_state: function () {
      return Session.get('remote_3_down') ? 'led-green' : 'led-red';
    },
    remote_3_left_state: function () {
      return Session.get('remote_3_left') ? 'led-green' : 'led-red';
    },
    remote_3_right_state: function () {
      return Session.get('remote_3_right') ? 'led-green' : 'led-red';
    }
  });

  Template.remotes.events({
    'mousedown .remote': function (event) {
      var remote_num = event.target.id[7];
      var remote_action = event.target.id.substr(8);
      SetRemoteState(remote_num, remote_action, OPPOSITE[remote_action]);
      Meteor.call("updateStatus", getRemoteStates());
    },
    'mouseup .remote': function (event) {
      var remote_num = event.target.id[7];
      var remote_action = event.target.id.substr(8);
      SetRemoteState(remote_num, null, remote_action);
      Meteor.call("updateStatus", getRemoteStates());
    },
    'mouseleave .remote': function () {
      var remote_num = event.target.id[7];
      var remote_action = event.target.id.substr(8);
      SetRemoteState(remote_num, null, remote_action);
      Meteor.call("updateStatus", getRemoteStates());
    },

    'keydown': function (event) {
      var remote_1 = Settings.findOne({ name: 'remote_1' });
      var remote_2 = Settings.findOne({ name: 'remote_2' });
      var remote_3 = Settings.findOne({ name: 'remote_3' });
      //console.log(remote_1.up_key + " <> " + event.keyCode);

      switch (event.keyCode) {
        case remote_1.up_key:
          SetRemoteState(1, UP, DOWN);
          break;
        case remote_1.down_key:
          SetRemoteState(1, DOWN, UP);
          break;
        case remote_1.left_key:
          SetRemoteState(1, LEFT, RIGHT);
          break;
        case remote_1.right_key:
          SetRemoteState(1, RIGHT, LEFT);
          break;
        case remote_2.up_key:
          SetRemoteState(2, UP, DOWN);
          break;
        case remote_2.down_key:
          SetRemoteState(2, DOWN, UP);
          break;
        case remote_2.left_key:
          SetRemoteState(2, LEFT, RIGHT);
          break;
        case remote_2.right_key:
          SetRemoteState(2, RIGHT, LEFT);
          break;
        case remote_3.up_key:
          SetRemoteState(3, UP, DOWN);
          break;
        case remote_3.down_key:
          SetRemoteState(3, DOWN, UP);
          break;
        case remote_3.left_key:
          SetRemoteState(3, LEFT, RIGHT);
          break;
        case remote_3.right_key:
          SetRemoteState(3, RIGHT, LEFT);
          break;

      }
      Meteor.call("updateStatus", getRemoteStates());
      event.preventDefault();

    },
    'keyup': function (event) {
      var remote_1 = Settings.findOne({ name: 'remote_1' });
      var remote_2 = Settings.findOne({ name: 'remote_2' });
      var remote_3 = Settings.findOne({ name: 'remote_3' });
      switch (event.keyCode) {
        case remote_1.up_key:
          SetRemoteState(1, null, UP);
          break;
        case remote_1.down_key:
          SetRemoteState(1, null, DOWN);
          break;
        case remote_1.left_key:
          SetRemoteState(1, null, LEFT);
          break;
        case remote_1.right_key:
          SetRemoteState(1, null, RIGHT);
          break;
        case remote_2.up_key:
          SetRemoteState(2, null, UP);
          break;
        case remote_2.down_key:
          SetRemoteState(2, null, DOWN);
          break;
        case remote_2.left_key:
          SetRemoteState(2, null, LEFT);
          break;
        case remote_2.right_key:
          SetRemoteState(2, null, RIGHT);
          break;
        case remote_3.up_key:
          SetRemoteState(3, null, UP);
          break;
        case remote_3.down_key:
          SetRemoteState(3, null, DOWN);
          break;
        case remote_3.left_key:
          SetRemoteState(3, null, LEFT);
          break;
        case remote_3.right_key:
          SetRemoteState(3, null, RIGHT);
          break;
      }
      Meteor.call("updateStatus", getRemoteStates());
      event.preventDefault();
    }
  });
}

if (Meteor.isServer) {
  if (Settings.find().count() === 0) {
    Settings.insert(
      {
        "name": "remote_1",
        "display_name": "Remote 1",
        "right_pin": 7,
        "right_key": 68,
        "up_pin": 17,
        "up_key": 87,
        "down_pin": 27,
        "down_key": 83,
        "left_pin": 22,
        "left_key": 65
      });
    Settings.insert(
      {
        "name": "remote_2",
        "display_name": "Remote 2",
        "right_pin": 5,
        "right_key": 39,
        "up_pin": 6,
        "up_key": 38,
        "down_pin": 13,
        "down_key": 40,
        "left_pin": 26,
        "left_key": 37
      });
    Settings.insert(
      {
        "name": "remote_3",
        "display_name": "Remote 3",
        "right_pin": 23,
        "right_key": 0x0008,
        "up_pin": 24,
        "up_key": 0x000A,
        "down_pin": 25,
        "down_key": 0x0007,
        "left_pin": 12,
        "left_key": 0x0006
      }
    )
  }
  Meteor.startup(function () {
    Meteor.methods({
      'updateStatus': function (remoteStates) {
        var remotes = ['remote_1', 'remote_2', 'remote_3'];
        remotes.forEach( function (remote) {
          var settings = Settings.findOne( {name: remote} );
          var up_status = remoteStates[remote + UP];
          var down_status = remoteStates[remote + DOWN];
          var left_status = remoteStates[remote + LEFT];
          var right_status = remoteStates[remote + RIGHT];
          var up_pin = settings.up_pin;
          var down_pin = settings.down_pin;
          var left_pin = settings.left_pin;
          var right_pin = settings.right_pin;

        });
      }
    });
  })
}
