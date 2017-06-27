import Tag from '../tags';

Tag.extend({
  meteorMethods: {
    create() {
      return this.save();
    },
    update(fields) {
      this.set(fields);
      return this.save();
    },
    delete() {
      return this.remove();
    },
  },
});
