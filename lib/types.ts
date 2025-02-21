import { Session, User } from "next-auth";

export interface UserInfo extends User {
  id?: string;
  username: string;
  email: string;
  password?: string;
}

export interface ISession extends Session {
  user?: UserInfo;
}
