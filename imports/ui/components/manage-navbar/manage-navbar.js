import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './manage-navbar.html';

Template.manageNavbar.events({
  'submit .js-search' (event) {
    event.preventDefault();
    const query = event.target.query.value;
    FlowRouter.go('search', { query: query });
  }
});
