import './tag-template.html'

Template.tag_template.events({
    'click .remove-tag' (event, instance) {
        this.removeTag();
    },
});