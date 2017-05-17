import { Template } from 'meteor/templating';

import './tag-template.html';

Template.tagTemplate.events({
  'click .remove-tag'() {
    this.removeTag();
  },
});
