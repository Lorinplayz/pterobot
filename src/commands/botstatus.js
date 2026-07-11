// ======================================================
// 🤖 Lorinplayz Pterobot - /botstatus (v1)
// ⚡ Made by Lorinplayz | Asia/Kolkata
// ======================================================

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import os from "os";
import moment from "moment-timezone";

export default {
  data: new SlashCommandBuilder()
    .setName("botstatus")
    .setDescription("📊 View the live status of Vortex Deploy bot."),

  async execute(interaction) {
    await interaction.deferReply();

    const totalMem = Math.round(os.totalmem() / 1024 / 1024);
    const startTime = Date.now();

    const sendStatus = async () => {
      const botPing = Date.now() - startTime;
      const uptime = formatDuration(process.uptime());

      const embed = new EmbedBuilder()
        .setColor("Aqua")
        .setAuthor({ name: "⚙️ LORINPLAYZ PTEOBOT- Bot Status" })
        .setDescription("💫 Live monitoring of the bot every **10 seconds** 🔄")
        .addFields(
          { name: "📡 Ping", value: `\`${botPing}ms\``, inline: true },
          { name: "🕒 Uptime", value: `\`${uptime}\``, inline: true },
          { name: "🧠 Memory", value: `\`${Math.round(os.freemem() / 1024 / 1024)}MB / ${totalMem}MB\``, inline: true },
          { name: "📦 Commands Loaded", value: `${interaction.client.commands.size}`, inline: true },
          { name: "🏷️ Server", value: `${interaction.guild.name}`, inline: true }
        )
        .setFooter({ text: "⚡ Made by Okami | Vortex Deploy 👑" })
        .setTimestamp();

      if (!interaction.replied) {
        return await interaction.editReply({ embeds: [embed] });
      } else {
        const msg = await interaction.fetchReply();
        return await msg.edit({ embeds: [embed] });
      }
    };

    // 🔁 First call
    await sendStatus();

    // 🔁 Update every 10 sec
    const interval = setInterval(sendStatus, 10000);

    // 🔒 Attach interval to client so it can be cleared manually if needed
    interaction.client.statusIntervals = interaction.client.statusIntervals || [];
    interaction.client.statusIntervals.push(interval);
  },
};

function formatDuration(seconds) {
  const dur = moment.duration(seconds, "seconds");
  return `${dur.hours()}h ${dur.minutes()}m ${dur.seconds()}s`;
}
