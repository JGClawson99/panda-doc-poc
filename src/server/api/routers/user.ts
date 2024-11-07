import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

//   create: protectedProcedure
//     .input(z.object({ name: z.string().min(1) }))
//     .mutation(async ({ ctx, input }) => {
//       return ctx.db.post.create({
//         data: {
//           name: input.name,
//           createdBy: { connect: { id: ctx.session.user.id } },
//         },
//       });
//     }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      orderBy: { id: "desc" },
    });

    return user ?? null;
  }),

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findMany({
      orderBy: { id: "desc" },
      take: 10,
    });

    return user ?? null;
  }),

  getUser: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findFirst({
      orderBy: { id: "desc" },
    });

    return user ?? null;
  }),




});
