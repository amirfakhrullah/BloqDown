import { z } from "zod";
import { prisma } from "../../db/client";
import { createRouter } from "./context";

export const postsRouter = createRouter()
  .query("get-all-posts", {
    async resolve({ ctx }) {
      const posts = await prisma.post.findMany({
        select: {
          id: true,
          title: true,
          created: true,
          userToken: true,
        },
      });

      return posts.map((post) => {
        return {
          ...post,
          isOwner: post.userToken === ctx.token,
        };
      });
    },
  })
  .query("get-my-posts", {
    async resolve({ ctx }) {
      return await prisma.post.findMany({
        where: {
          userToken: {
            equals: ctx.token,
          },
        },
        select: {
          id: true,
          title: true,
          created: true,
          userToken: true,
        },
      });
    },
  })
  .query("get-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const post = await prisma.post.findFirst({
        where: {
          id: input.id,
        },
      });

      return {
        ...post,
        isOwner: post?.userToken === ctx.token,
      };
    },
  })
  .mutation("create", {
    input: z.object({
      title: z.string().min(6).max(200),
      description: z.string().min(6).max(1000),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) {
        return { error: "Unauthorized" };
      }
      return await prisma.post.create({
        data: {
          title: input.title,
          description: input.description,
          userToken: ctx.token,
        },
      });
    },
  });
