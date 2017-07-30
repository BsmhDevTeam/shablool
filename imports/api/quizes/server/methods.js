import Quiz from '../quizes';

Quiz.extend({
  meteorMethods: {
    create() {
      return this.save();
    },
    update(fields) {
      this.set(fields, { cast: true });
      this.lastUpdate = new Date();
      return this.save();
    },
    delete() {
      return this.remove();
    },
    removeImage() {
      this.image = 'no-image';
      return this.save();
    },
  },
});
