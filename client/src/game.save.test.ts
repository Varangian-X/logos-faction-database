import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("game.save and game.load", () => {
  it("saves game data and retrieves it successfully", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const testGameData = {
      playerName: "Commander Test",
      credits: 5000,
      turn: 10,
      fleet: [],
    };

    // Save game
    const saveResult = await caller.game.save({
      gameData: testGameData,
      saveSlot: 1,
    });

    expect(saveResult).toEqual({ success: true });

    // Load game
    const loadResult = await caller.game.load({ saveSlot: 1 });

    expect(loadResult).toBeDefined();
    expect(loadResult).toMatchObject(testGameData);
  });

  it("returns null when no save exists", async () => {
    const { ctx } = createAuthContext();
    // Create a different user context to ensure no save exists
    const ctx2: TrpcContext = {
      ...ctx,
      user: {
        ...ctx.user!,
        id: 9999, // Non-existent user ID
      },
    };
    const caller = appRouter.createCaller(ctx2);

    const loadResult = await caller.game.load({ saveSlot: 1 });

    expect(loadResult).toBeNull();
  });
});
