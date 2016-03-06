/**
 * Created by jonh on 6.3.2016.
 */
Remotes = new Mongo.Collection("remotes");

ONE_KEYCODE=49;
TWO_KEYCODE=50;
THREE_KEYCODE=51;

ARROW_UP_KEYCODE=38;
ARROW_DOWN_KEYCODE=40;
ARROW_LEFT_KEYCODE=37;
ARROW_RIGHT_KEYCODE=39;

BUTTON_UP = "button_up";
BUTTON_DOWN = "button_down";
BUTTON_LEFT = "button_left";
BUTTON_RIGHT = "button_right";

class Button {
  constructor (type, pin) {
    this.type = type;
    this.pin = pin;
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