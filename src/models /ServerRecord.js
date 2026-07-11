// ======================================================
// 🖥️ Lorinplayz DEPLOY - Server Record Model
// ⚡ Made by Lorinplayz | Asia/Kolkata
// ======================================================

import { EmbedBuilder } from "discord.js";

export default class ServerRecord {
  constructor({ id, name, egg, owner, ram, disk, cpu, description, status = "stopped", createdAt = new Date(), updatedAt = new Date() }) {
    this.id = id;
    this.name = name;
    this.egg = egg;
    this.owner = owner; // user ID or email
    this.ram = ram;     // in MB
    this.disk = disk;   // in MB
    this.cpu = cpu;     // in %
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Returns professional embed of server info
  toEmbed() {
    return new EmbedBuilder()
      .setColor(this.status === "running" ? "Green" : "Red")
      .setTitle(`🖥️ Server Info - ${this.name}`)
      .addFields(
        { name: "🆔 Server ID", value: `\`${this.id}\``, inline: true },
        { name: "🥚 Egg", value: `\`${this.egg}\``, inline: true },
        { name: "👤 Owner", value: `\`${this.owner}\``, inline: true },
        { name: "💾 RAM", value: `\`${this.ram} MB\``, inline: true },
        { name: "🗄️ Disk", value: `\`${this.disk} MB\``, inline: true },
        { name: "⚙️ CPU", value: `\`${this.cpu}%\``, inline: true },
        { name: "📄 Description", value: this.description || "None", inline: false },
        { name: "🔹 Status", value: `\`${this.status}\``, inline: true },
        { name: "🕒 Created At", value: `<t:${Math.floor(this.createdAt.getTime()/1000)}:f>`, inline: true },
        { name: "🕒 Updated At", value: `<t:${Math.floor(this.updatedAt.getTime()/1000)}:f>`, inline: true }
      )
      .setFooter({ text: "⚡ Made by Lorinplayz | Pterobot" })
      .setTimestamp();
  }

  // Update server status
  updateStatus(status) {
    this.status = status;
    this.updatedAt = new Date();
  }
}
