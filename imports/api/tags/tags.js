import { Mongo } from 'meteor/mongo';
import { Class } from 'meteor/jagi:astronomy';

const Tags = new Mongo.Collection('tags');

export default Class.create({
  name: 'Tag',
  collection: Tags,
  fields: {
    name: {
      type: String,
      validators: [
        {
          type: 'minLength',
          param: 3,
        },
        {
          type: 'maxLength',
          param: 20,
        },
      ],
    },
  },

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
