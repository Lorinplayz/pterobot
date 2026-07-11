// ======================================================
// 🖥️ Lorinplayz DEPLOY - /panelstatus (v1)
// ⚡Made by Lorinplayz | Asia/Kolkata
// ======================================================

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import moment from "moment-timezone";
import dotenv from "dotenv";
dotenv.config();

export default {
  data: new SlashCommandBuilder()
    .setName("panelstatus")
    .setDescription("🖥️ Shows live status of the Pterodactyl panel and nodes"),

  async execute(interaction) {
    await interaction.deferReply();

    const sendStatus = async () => {
      const startTime = Date.now();
      const panelData = await fetchPanelData();
      const ping = Date.now() - startTime;

      const nodesList =
        panelData.nodes.length > 0
          ? panelData.nodes
              .map(
                n =>
                  `🧩 **${n.name}** — ${n.status}\n📍 Location: \`${n.location}\`\n💾 Memory: \`${n.memory}MB\` | Disk: \`${n.disk}MB\`\n⏱️ Uptime: \`${n.uptime}\``
              )
              .join("\n")
          : "⚠️ No nodes found or panel offline.";

      const embed = new EmbedBuilder()
        .setColor(panelData.status === "🟢 Online" ? "Green" : "Red")
        .setAuthor({ name: "🖥️ VORTEX DEPLOY - Panel Status" })
        .setDescription("💫 Real-time panel & node status (updates every **10s**) 🔄")
        .addFields(
          { name: "🌐 Panel Status", value: panelData.status, inline: true },
          { name: "📡 Panel Ping", value: `\`${ping}ms\``, inline: true },
          { name: "⏱️ Panel Uptime", value: `\`${panelData.uptime}\``, inline: true },
          { name: "🧠 Nodes", value: `\`${panelData.nodes.length}\` active`, inline: true },
          { name: "📋 Nodes List", value: nodesList.slice(0, 1024) }
        )
        .setFooter({ text: "⚡ Made by Lorinplayz | Pterobot 👑" })
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

    // 🔒 Attach interval to client for manual clearing if needed
    interaction.client.panelIntervals = interaction.client.panelIntervals || [];
    interaction.client.panelIntervals.push(interval);
  },
};

// ======================================================
// 📡 FETCH PANEL DATA
// ======================================================
async function fetchPanelData() {
  const base = process.env.PTERO_URL;
  const key = process.env.PTERO_API_KEY;

  try {
    const res = await fetch(`${base}/api/application/nodes`, {
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Panel offline");

    const json = await res.json();
    const nodes = json.data.map(n => ({
      name: n.attributes.name,
      location: n.attributes.location_id,
      memory: n.attributes.memory,
      disk: n.attributes.disk,
      uptime: getFakeUptime(),
      status: "🟢 Online",
    }));

    return {
      status: "🟢 Online",
      uptime: getFakeUptime(),
      nodes,
    };
  } catch {
    return { status: "🔴 Offline", uptime: "—", nodes: [] };
  }
}

// ======================================================
// 🕒 FAKE UPTIME GENERATOR
// ======================================================
function getFakeUptime() {
  const seconds = Math.floor(process.uptime());
  const dur = moment.duration(seconds, "seconds");
  return `${dur.hours()}h ${dur.minutes()}m ${dur.seconds()}s`;
}
