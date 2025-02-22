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

import { Prisma } from "@prisma/client";

export const userDataSelect = {
  id: true,
  username: true,
} satisfies Prisma.UserSelect;

export const postDataInclude = {
  author: {
    select: userDataSelect,
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
