import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { loadGameState, saveGameState } from "./db";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  game: router({
    save: protectedProcedure
      .input(z.object({
        gameData: z.any(),
        saveSlot: z.number().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        await saveGameState(ctx.user.id, input.gameData, input.saveSlot);
        return { success: true };
      }),
    load: protectedProcedure
      .input(z.object({
        saveSlot: z.number().default(1),
      }))
      .query(async ({ ctx, input }) => {
        const save = await loadGameState(ctx.user.id, input.saveSlot);
        return save ? save.gameData : null;
      }),
  }),
});

export type AppRouter = typeof appRouter;
