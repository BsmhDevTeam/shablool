import { FilesCollection } from 'meteor/ostrio:files';

const Image = new FilesCollection({
  storagePath: './resources',
  collectionName: 'images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    const allowedSize = file.size <= 10485760;
    const allowedExtension = /png|jpg|jpeg/i.test(file.extension);
    return allowedSize && allowedExtension ? true : 'בבקשה תעלה תמונה השוקלת לכל היותר 10MB';
  },
});

export default Image;
