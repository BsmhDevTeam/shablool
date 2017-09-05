import { noImage } from '/imports/startup/both/constants';
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
      this.image = noImage;
      return this.save();
    },
  },
});
