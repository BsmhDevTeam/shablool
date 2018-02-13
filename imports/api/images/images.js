import { FilesCollection } from 'meteor/ostrio:files';

const MAX_SIZE = 10485760;

const Image = new FilesCollection({
  storagePath: './resources',
  collectionName: 'images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    const allowedSize = file.size <= MAX_SIZE;
    const allowedExtension = /png|jpg|jpeg/i.test(file.extension);
    return allowedSize && allowedExtension ? true : `גודל קובץ מקסימלי ${MAX_SIZE / 1024 ** 2}`;
  },
});

export default Image;
