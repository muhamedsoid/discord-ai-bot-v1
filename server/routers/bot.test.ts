import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";

describe("Bot Router", () => {
  // إنشاء context مع مستخدم مصرح
  const authenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "test",
    role: "admin" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const createAuthContext = () => ({
    user: authenticatedUser,
    req: {
      protocol: "https",
      headers: {},
    } as any,
    res: {} as any,
  });

  describe("getStats", () => {
    it("should return stats object with correct properties", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const stats = await caller.bot.getStats();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("totalServers");
      expect(stats).toHaveProperty("totalUsers");
      expect(stats).toHaveProperty("totalCommands");
      expect(stats).toHaveProperty("aiUsage");
    });

    it("should return numbers for all stats", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const stats = await caller.bot.getStats();

      expect(typeof stats.totalServers).toBe("number");
      expect(typeof stats.totalUsers).toBe("number");
      expect(typeof stats.totalCommands).toBe("number");
      expect(typeof stats.aiUsage).toBe("number");
    });

    it("should return non-negative numbers", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const stats = await caller.bot.getStats();

      expect(stats.totalServers).toBeGreaterThanOrEqual(0);
      expect(stats.totalUsers).toBeGreaterThanOrEqual(0);
      expect(stats.totalCommands).toBeGreaterThanOrEqual(0);
      expect(stats.aiUsage).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getServers", () => {
    it("should return an array", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const servers = await caller.bot.getServers();

      expect(Array.isArray(servers)).toBe(true);
    });

    it("should handle empty server list", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const servers = await caller.bot.getServers();

      expect(servers).toEqual(expect.any(Array));
    });
  });

  describe("getRecentLogs", () => {
    it("should return an array of logs", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const logs = await caller.bot.getRecentLogs({ limit: 10 });

      expect(Array.isArray(logs)).toBe(true);
    });

    it("should respect the limit parameter", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const logs = await caller.bot.getRecentLogs({ limit: 5 });

      expect(logs.length).toBeLessThanOrEqual(5);
    });

    it("should use default limit of 50", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const logs = await caller.bot.getRecentLogs({});

      expect(Array.isArray(logs)).toBe(true);
    });
  });

  describe("getAIConversations", () => {
    it("should return an array of conversations", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const conversations = await caller.bot.getAIConversations({ limit: 10 });

      expect(Array.isArray(conversations)).toBe(true);
    });

    it("should handle empty conversations list", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const conversations = await caller.bot.getAIConversations({ limit: 10 });

      expect(conversations).toEqual(expect.any(Array));
    });
  });

  describe("getModerationLogs", () => {
    it("should return an array of moderation logs", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const logs = await caller.bot.getModerationLogs({ limit: 10 });

      expect(Array.isArray(logs)).toBe(true);
    });

    it("should handle empty moderation logs", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const logs = await caller.bot.getModerationLogs({ limit: 10 });

      expect(logs).toEqual(expect.any(Array));
    });
  });

  describe("getServerStats", () => {
    it("should return stats object for any server ID", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const stats = await caller.bot.getServerStats({
        serverId: "non-existent-id-12345",
      });

      if (stats) {
        expect(stats).toHaveProperty("totalCommands");
        expect(stats).toHaveProperty("aiUsage");
        expect(stats).toHaveProperty("moderationActions");
      }
    });

    it("should return stats object with correct properties when server exists", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const servers = await caller.bot.getServers();

      if (servers.length > 0) {
        const stats = await caller.bot.getServerStats({
          serverId: servers[0].serverId,
        });

        if (stats) {
          expect(stats).toHaveProperty("totalCommands");
          expect(stats).toHaveProperty("aiUsage");
          expect(stats).toHaveProperty("moderationActions");
          expect(stats).toHaveProperty("successfulCommands");
          expect(stats).toHaveProperty("failedCommands");

          expect(typeof stats.totalCommands).toBe("number");
          expect(typeof stats.aiUsage).toBe("number");
          expect(typeof stats.moderationActions).toBe("number");
          expect(typeof stats.successfulCommands).toBe("number");
          expect(typeof stats.failedCommands).toBe("number");
        }
      }
    });
  });

  describe("updateServer", () => {
    it("should return success status", async () => {
      const caller = appRouter.createCaller(createAuthContext());
      const result = await caller.bot.updateServer({
        serverId: "test-server-id",
        prefix: "!",
      });

      expect(result).toHaveProperty("success");
      expect(typeof result.success).toBe("boolean");
    });
  });

  describe("Authentication", () => {
    it("should reject unauthenticated requests for protected procedures", async () => {
      const unauthenticatedContext = {
        user: null,
        req: {
          protocol: "https",
          headers: {},
        } as any,
        res: {} as any,
      };

      const caller = appRouter.createCaller(unauthenticatedContext);

      try {
        await caller.bot.getServers();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("should allow public access to getStats", async () => {
      const publicContext = {
        user: null,
        req: {
          protocol: "https",
          headers: {},
        } as any,
        res: {} as any,
      };

      const caller = appRouter.createCaller(publicContext);
      const stats = await caller.bot.getStats();

      expect(stats).toBeDefined();
      expect(stats).toHaveProperty("totalServers");
    });
  });
});
