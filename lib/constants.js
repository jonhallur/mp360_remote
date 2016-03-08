/**
 * Created by jonh on 6.3.2016.
 */
Remotes = new Mongo.Collection("remotes");

RemoteMidiSettings = new Mongo.Collection("midi_settings");

CAMERA_ONE_KEYCODE=49;
CAMERA_TWO_KEYCODE=50;
CAMERA_THREE_KEYCODE=51;

BUTTON_UP_KEYCODE=38;
BUTTON_DOWN_KEYCODE=40;
BUTTON_LEFT_KEYCODE=37;
BUTTON_RIGHT_KEYCODE=39;

CAMERA_ONE_MIDI = 65;
CAMERA_TWO_MIDI = 66;
CAMERA_THREE_MIDI = 67;

BUTTON_UP_MIDI = 61;
BUTTON_DOWN_MIDI = 62;
BUTTON_LEFT_MIDI = 60;
BUTTON_RIGHT_MIDI = 64;

BUTTON_UP = "button_up";
BUTTON_DOWN = "button_down";
BUTTON_LEFT = "button_left";
BUTTON_RIGHT = "button_right";

BUTTON_OPPOSITES = {
  BUTTON_UP: BUTTON_DOWN,
  BUTTON_DOWN: BUTTON_UP,
  BUTTON_LEFT: BUTTON_RIGHT,
  BUTTON_RIGHT: BUTTON_LEFT
};

SELECTED_REMOTE = "selected_remote";

CAMERA_ONE_INDEX = 1;
CAMERA_TWO_INDEX = 2;
CAMERA_THREE_INDEX = 3;

class Button {
  constructor (type, pin) {
    this.type = type;
    this.pin = pin;
  }
}

class Settings {
  constructor(midi, keyCode, action, display_name) {
    this.midi = midi;
    this.keyCode = keyCode;
    this.action = action;
    this.display_name = display_name;
  }
}

class CameraSelectSetting extends Settings {
  constructor (midi, keyCode, index, display_name) {
    super(midi, keyCode, SELECTED_REMOTE, display_name);
    this.index = index;
  }
}

class CameraActionSettings extends Settings {
  constructor (midi, keyCode, action, counter_action, display_name) {
    super(midi, keyCode, action, display_name);
    this.counter_action = counter_action;
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

remote_one =
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

remote_two =
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

remote_three =
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

camera_one_settings = new CameraSelectSetting(
  CAMERA_ONE_MIDI,
  CAMERA_ONE_KEYCODE,
  CAMERA_ONE_INDEX,
  "Camera One");

camera_two_settings = new CameraSelectSetting(
  CAMERA_TWO_MIDI,
  CAMERA_TWO_KEYCODE,
  CAMERA_TWO_INDEX,
  "Camera Two");

camera_three_settings = new CameraSelectSetting(
  CAMERA_THREE_MIDI,
  CAMERA_THREE_KEYCODE,
  CAMERA_THREE_INDEX,
  "Camera Three");

remote_button_up_settings = new CameraActionSettings(
  BUTTON_UP_MIDI,
  BUTTON_UP_KEYCODE,
  BUTTON_UP,
  BUTTON_DOWN,
  "glyphicon glyphicon-arrow-up");

remote_button_down_settings = new CameraActionSettings(
  BUTTON_DOWN_MIDI,
  BUTTON_DOWN_KEYCODE,
  BUTTON_DOWN,
  BUTTON_UP,
  "glyphicon glyphicon-arrow-down");

remote_button_left_settings = new CameraActionSettings(
  BUTTON_LEFT_MIDI,
  BUTTON_LEFT_KEYCODE,
  BUTTON_LEFT,
  BUTTON_RIGHT,
  "glyphicon glyphicon-arrow-left");

remote_button_right_settings = new CameraActionSettings(
  BUTTON_RIGHT_MIDI,
  BUTTON_RIGHT_KEYCODE,
  BUTTON_RIGHT,
  BUTTON_LEFT,
  "glyphicon glyphicon-arrow-right");
