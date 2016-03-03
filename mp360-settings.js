/**
 * Created by jonh on 17.2.2016.
 */

if (Meteor.isClient) {
  // This code only runs on the client
  Template.settings.helpers({
    allow_edit: function () {
      return false;
    },
    remotes_settings: function () {
      return Settings.find();
    }
  });

  Template.settings.events({
    'click .show_settings_button': function (event) {
      var show_settings = Session.get('show_settings');
      Session.set('show_settings', !show_settings);
      if (show_settings === false) {
        $('.settings_form').css({display: 'block'})
      } else {
        $('.settings_form').css({display: 'none'})
      }
      console.log("click button");
    }
  })
}