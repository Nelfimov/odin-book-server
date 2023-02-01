import { default as multer, FileFilterCallback } from 'multer';

const storage = multer.diskStorage({
  destination: 'statics/images/profile-pictures',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });
