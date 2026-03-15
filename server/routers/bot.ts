import { z } from "zod";
import { publicProcedure, router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { discordServers, commandLogs, aiConversations, moderationLogs } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const botRouter = router({
  // الحصول على إحصائيات البوت
  getStats: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return {
        totalServers: 0,
        totalUsers: 0,
        totalCommands: 0,
        aiUsage: 0,
      };
    }

    try {
      const servers = await db.select().from(discordServers);
      const commands = await db.select().from(commandLogs);
      const aiConvs = await db.select().from(aiConversations);

      return {
        totalServers: servers.length,
        totalUsers: servers.reduce((acc, s) => acc + 1, 0) * 100,
        totalCommands: commands.length,
        aiUsage: aiConvs.length,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {
        totalServers: 0,
        totalUsers: 0,
        totalCommands: 0,
        aiUsage: 0,
      };
    }
  }),

  // الحصول على قائمة الخوادم
  getServers: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    try {
      const servers = await db.select().from(discordServers);
      return servers;
    } catch (error) {
      console.error("Error fetching servers:", error);
      return [];
    }
  }),

  // الحصول على تفاصيل خادم محدد
  getServer: protectedProcedure
    .input(z.object({ serverId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const server = await db
          .select()
          .from(discordServers)
          .where(eq(discordServers.serverId, input.serverId))
          .limit(1);

        return server[0] || null;
      } catch (error) {
        console.error("Error fetching server:", error);
        return null;
      }
    }),

  // تحديث إعدادات الخادم
  updateServer: protectedProcedure
    .input(
      z.object({
        serverId: z.string(),
        prefix: z.string().optional(),
        aiEnabled: z.number().optional(),
        modLogChannelId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };

      try {
        const updateData: any = {};
        if (input.prefix) updateData.prefix = input.prefix;
        if (input.aiEnabled !== undefined) updateData.aiEnabled = input.aiEnabled;
        if (input.modLogChannelId) updateData.modLogChannelId = input.modLogChannelId;

        await db
          .update(discordServers)
          .set(updateData)
          .where(eq(discordServers.serverId, input.serverId));

        return { success: true };
      } catch (error) {
        console.error("Error updating server:", error);
        return { success: false };
      }
    }),

  // الحصول على السجلات الأخيرة
  getRecentLogs: protectedProcedure
    .input(z.object({ serverId: z.string().optional(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        if (input.serverId) {
          const logs = await db
            .select()
            .from(commandLogs)
            .where(eq(commandLogs.serverId, input.serverId))
            .orderBy(desc(commandLogs.createdAt))
            .limit(input.limit);
          return logs;
        } else {
          const logs = await db
            .select()
            .from(commandLogs)
            .orderBy(desc(commandLogs.createdAt))
            .limit(input.limit);
          return logs;
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
      }
    }),

  // الحصول على محادثات الذكاء الاصطناعي
  getAIConversations: protectedProcedure
    .input(z.object({ serverId: z.string().optional(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        if (input.serverId) {
          const conversations = await db
            .select()
            .from(aiConversations)
            .where(eq(aiConversations.serverId, input.serverId))
            .orderBy(desc(aiConversations.createdAt))
            .limit(input.limit);
          return conversations;
        } else {
          const conversations = await db
            .select()
            .from(aiConversations)
            .orderBy(desc(aiConversations.createdAt))
            .limit(input.limit);
          return conversations;
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        return [];
      }
    }),

  // الحصول على سجلات الإدارة
  getModerationLogs: protectedProcedure
    .input(z.object({ serverId: z.string().optional(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      try {
        if (input.serverId) {
          const logs = await db
            .select()
            .from(moderationLogs)
            .where(eq(moderationLogs.serverId, input.serverId))
            .orderBy(desc(moderationLogs.createdAt))
            .limit(input.limit);
          return logs;
        } else {
          const logs = await db
            .select()
            .from(moderationLogs)
            .orderBy(desc(moderationLogs.createdAt))
            .limit(input.limit);
          return logs;
        }
      } catch (error) {
        console.error("Error fetching moderation logs:", error);
        return [];
      }
    }),

  // الحصول على إحصائيات خادم محدد
  getServerStats: protectedProcedure
    .input(z.object({ serverId: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      try {
        const commands = await db
          .select()
          .from(commandLogs)
          .where(eq(commandLogs.serverId, input.serverId));

        const aiConvs = await db
          .select()
          .from(aiConversations)
          .where(eq(aiConversations.serverId, input.serverId));

        const modLogs = await db
          .select()
          .from(moderationLogs)
          .where(eq(moderationLogs.serverId, input.serverId));

        return {
          totalCommands: commands.length,
          aiUsage: aiConvs.length,
          moderationActions: modLogs.length,
          successfulCommands: commands.filter((c) => c.success === 1).length,
          failedCommands: commands.filter((c) => c.success === 0).length,
        };
      } catch (error) {
        console.error("Error fetching server stats:", error);
        return null;
      }
    }),
});

export type BotRouter = typeof botRouter;
