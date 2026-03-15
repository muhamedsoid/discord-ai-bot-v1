import type { Command } from "../types";
import { Message, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, GuildMember, Role } from "discord.js";

export const roleCommand: Command = {
  name: "role",
  description: "إدارة الرتب في السيرفر",
  slashBuilder: new SlashCommandBuilder()
    .setName("role")
    .setDescription("إدارة الرتب في السيرفر")
    .addSubcommand(sub => 
      sub.setName("add")
        .setDescription("إعطاء رتبة لعضو")
        .addUserOption(opt => opt.setName("user").setDescription("العضو").setRequired(true))
        .addRoleOption(opt => opt.setName("role").setDescription("الرتبة").setRequired(true))
    )
    .addSubcommand(sub => 
      sub.setName("remove")
        .setDescription("سحب رتبة من عضو")
        .addUserOption(opt => opt.setName("user").setDescription("العضو").setRequired(true))
        .addRoleOption(opt => opt.setName("role").setDescription("الرتبة").setRequired(true))
    )
    .addSubcommand(sub => 
      sub.setName("create")
        .setDescription("إنشاء رتبة جديدة")
        .addStringOption(opt => opt.setName("name").setDescription("اسم الرتبة").setRequired(true))
        .addStringOption(opt => opt.setName("color").setDescription("لون الرتبة (Hex)").setRequired(false))
    )
    .addSubcommand(sub => 
      sub.setName("delete")
        .setDescription("حذف رتبة من السيرفر")
        .addRoleOption(opt => opt.setName("role").setDescription("الرتبة المراد حذفها").setRequired(true))
    ),
  async execute(interaction) {
    if (interaction instanceof Message) {
      await interaction.reply("❌ هذا الأمر متاح فقط عبر أوامر السلاش (/).");
      return;
    }

    const member = interaction.member as GuildMember;
    if (!member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      await interaction.reply({ content: "❌ ليس لديك صلاحية إدارة الرتب.", ephemeral: true });
      return;
    }

    const subcommand = interaction.options.getSubcommand();

    try {
      if (subcommand === "add") {
        const targetUser = interaction.options.getMember("user") as GuildMember;
        const role = interaction.options.getRole("role") as Role;

        if (targetUser.roles.cache.has(role.id)) {
          await interaction.reply({ content: `❌ العضو لديه رتبة **${role.name}** بالفعل.`, ephemeral: true });
          return;
        }

        await targetUser.roles.add(role);
        await interaction.reply({ content: `✅ تم إعطاء رتبة **${role.name}** للعضو **${targetUser.user.username}** بنجاح.` });

      } else if (subcommand === "remove") {
        const targetUser = interaction.options.getMember("user") as GuildMember;
        const role = interaction.options.getRole("role") as Role;

        if (!targetUser.roles.cache.has(role.id)) {
          await interaction.reply({ content: `❌ العضو ليس لديه رتبة **${role.name}**.`, ephemeral: true });
          return;
        }

        await targetUser.roles.remove(role);
        await interaction.reply({ content: `✅ تم سحب رتبة **${role.name}** من العضو **${targetUser.user.username}** بنجاح.` });

      } else if (subcommand === "create") {
        const name = interaction.options.getString("name", true);
        const color = (interaction.options.getString("color") || "#99AAB5") as any;

        const newRole = await interaction.guild?.roles.create({
          name,
          color,
          reason: `بواسطة ${interaction.user.tag}`
        });

        await interaction.reply({ content: `✅ تم إنشاء رتبة جديدة بنجاح: **${newRole?.name}**.` });

      } else if (subcommand === "delete") {
        const role = interaction.options.getRole("role", true) as Role;

        if (role.managed) {
          await interaction.reply({ content: "❌ لا يمكن حذف رتبة تابعة لبوت أو تطبيق.", ephemeral: true });
          return;
        }

        await role.delete(`بواسطة ${interaction.user.tag}`);
        await interaction.reply({ content: `✅ تم حذف الرتبة **${role.name}** بنجاح.` });
      }
    } catch (error) {
      console.error("Role command error:", error);
      await interaction.reply({ content: "❌ حدث خطأ أثناء تنفيذ الأمر. تأكد من أن رتبة البوت أعلى من الرتبة المطلوبة.", ephemeral: true });
    }
  },
};
