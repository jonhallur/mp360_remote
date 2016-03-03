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

  })
}