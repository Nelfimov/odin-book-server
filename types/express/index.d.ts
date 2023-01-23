import { User as IUser, UserMethods } from '../common/index.js';

declare global {
  namespace Express {
    export interface User extends IUser, UserMethods {}
  }
}

declare global {
  namespace Express {
    namespace Request {
      export interface User extends IUser, UserMethods {}
    }
  }
}
