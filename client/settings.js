/**
 * Created by jonh on 17.2.2016.
 */

if (Meteor.isClient) {
  Session.setDefault("remote_1_readonly", true);
  Session.setDefault("remote_2_readonly", true);
  Session.setDefault("remote_3_readonly", true);
  // This code only runs on the client
  Template.settings.helpers({
    remotes: function () {
      return Remotes.find({});
    },
    settings_active: function () {
      return "active";
    }
  });

  Template.settings.events({
    'mousedown .edit-button': function (event) {
      var remote = event.currentTarget.id[0];
      var remote_readonly = "remote_" + remote + "_readonly";
      var readonly = Session.get(remote_readonly);
      $("#remote_" + remote).find("input").attr("readonly", !readonly);
      var save_button_selector = "#" + remote + "_save_button";
      if (readonly) {
        $(save_button_selector).addClass("btn-danger").removeClass("btn-default").attr("disabled", !readonly);
      }
      else {
        $(save_button_selector).addClass("btn-default").removeClass("btn-danger").attr("disabled", !readonly);
      }


      Session.set(remote_readonly, !readonly);
      event.preventDefault();
    },
    'mousedown .save-button': function (event) {
      var remote_index = event.currentTarget.id[0];
      var remote = Remotes.findOne({index: parseInt(remote_index)});
      var start = "#" + remote_index + "_";
      var end = "_pin";
      var up_pin = $(start + "up" + end).val();
      var down_pin = $(start + "down" + end).val();
      var left_pin = $(start + "left" + end).val();
      var right_pin = $(start + "right" + end).val();
      Remotes.update(remote._id, {
        $set:
        {
          "buttons.up.pin": up_pin,
          "buttons.down.pin": down_pin,
          "buttons.left.pin": left_pin,
          "buttons.right.pin": right_pin
        }
      });
      $("#remote_" + remote_index).find("input").attr("readonly", true);
      $("#" + remote_index + "_save_button").addClass("btn-default").removeClass("btn-danger").attr("disabled", true);
      Session.set("remote_" + remote_index + "_readonly", true);

      event.preventDefault();
    }
  })
}