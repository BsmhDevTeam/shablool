import { FilesCollection } from 'meteor/ostrio:files';

const Image = new FilesCollection({
  storagePath: 'C:/Users/Toval/Workspace/shablool-data',
  collectionName: 'images',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    return file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)
    ? true
    : 'בבקשה תעלה תמונה השוקלת לכל היותר 10MB';
  },
});

export default Image;
