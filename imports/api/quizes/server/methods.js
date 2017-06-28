import Quiz from '../quizes';

Quiz.extend({
  meteorMethods: {
    create() {
      return this.save();
    },
    update(fields) {
      this.set(fields);
      this.lastUpdate = new Date();
      return this.save();
    },
    delete() {
      return this.remove();
    },
  },
});
