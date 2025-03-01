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
  tags: {
    select: {
      tag: {
        select: {
          id: true,
          label: true,
          value: true,
        },
      },
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;

export type PostValues = {
  tags?: { id: string; value: string; label: string }[];
  category?: { name: string; id: string } | null;
  author: { id: string; username: string };
  id: string;
  content: string;
  summary?: string | null;
  authorId: string;
  published: boolean;
  categoryId: string | null;
  title: string;
  createTime: Date;
};
