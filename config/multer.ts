import { default as multer, FileFilterCallback } from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'statics/images/profile-pictures');
  },
  filename: (req, file, cb) => {
    cb(null, req.params.userID);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype.includes('jpeg') ||
    file.mimetype.includes('jpg') ||
    file.mimetype.includes('png')
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage, fileFilter });
