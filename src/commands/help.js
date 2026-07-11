// ======================================================

// 🆘 Lorinplayz DEPLOY - /help Command (WORLD-BEST)

// ⚡ Made by Lorinplayz | Asia/Kolkata

// ======================================================

import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";

import dotenv from "dotenv";

dotenv.config();

export default {

  data: new SlashCommandBuilder()

    .setName("help")

    .setDescription("🆘 Shows all available commands with categories"),

  async execute(interaction) {

    await interaction.deferReply({ ephemeral: true });

    try {

      // Main Help Embed

      const embed = new EmbedBuilder()

        .setColor("Blue")

        .setTitle("🆘 Lorinplayz - Command Help")

        .setDescription("Here’s a list of all available commands organized by category 📂\nSelect a category from the menu below for details.")

        .setFooter({ text: "⚡ Made by Lorinplayz | Pterobot 👑" })

        .setTimestamp();

      // Dropdown Menu

      const row = new ActionRowBuilder().addComponents(

        new StringSelectMenuBuilder()

          .setCustomId("help_categories")

          .setPlaceholder("Select a category")

          .addOptions([

            { label: "Bot Details", value: "botdetails", description: "All info about the bot", emoji: "🤖" },

            { label: "Bot Status", value: "bot", description: "Bot status commands", emoji: "⚡" },

            { label: "Panel Status", value: "panel", description: "Panel & Nodes commands", emoji: "🗂️" },

            { label: "Server Management", value: "server", description: "Create, list, delete servers", emoji: "🛠️" },

            { label: "User Management", value: "user", description: "Delete & change user passwords", emoji: "❌" },

            { label: "Users List", value: "userslist", description: "List all panel users with server counts", emoji: "👥" }

          ])

      );

      await interaction.editReply({ embeds: [embed], components: [row] });

      // Collector

      const filter = i => i.customId === "help_categories" && i.user.id === interaction.user.id;

      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

      collector.on("collect", async i => {

        let categoryEmbed;

        switch(i.values[0]) {

          case "botdetails":

            categoryEmbed = new EmbedBuilder()

              .setColor("Gold")

              .setTitle("🤖 BOT DETAILS COMMAND")

              .setDescription("Information related to the bot and the developer ✨")

              .addFields(

                { name: "/botdetails", value: "Shows complete bot info, support links, and developer profile", inline: false }

              );

            break;

          case "bot":

            categoryEmbed = new EmbedBuilder()

              .setColor("Aqua")

              .setTitle("⚡ Bot Status Commands")

              .setDescription("Commands to check the bot's status and info")

              .addFields(

                { name: "/botstatus", value: "Shows live bot status with uptime, ping and activity", inline: false }

              );

            break;

          case "panel":

            categoryEmbed = new EmbedBuilder()

              .setColor("Purple")

              .setTitle("🗂️ Panel & Nodes Commands")

              .setDescription("Commands for panel and nodes monitoring")

              .addFields(

                { name: "/panelstatus", value: "Live panel + node stats", inline: false },

                { name: "/nodeslist", value: "Lists all nodes with details", inline: false }

              );

            break;

          case "server":

            categoryEmbed = new EmbedBuilder()

              .setColor("Green")

              .setTitle("🛠️ Server Management Commands")

              .setDescription("Manage servers: create, list, delete")

              .addFields(

                { name: "/createserver", value: "Create a new server with egg, RAM, Disk, CPU, description, email", inline: false },

                { name: "/serverlist", value: "List all your servers with live status", inline: false },

                { name: "/deleteserver", value: "Delete a server by ID", inline: false }

              );

            break;

          case "user":

            categoryEmbed = new EmbedBuilder()

              .setColor("Red")

              .setTitle("❌ User Management Commands")

              .setDescription("Manage users")

              .addFields(

                { name: "/deleteuser", value: "Delete a user by ID or email", inline: false },

                { name: "/changepass", value: "Change a user's panel password via email and DM them new details", inline: false }

              );

            break;

          case "userslist":

            categoryEmbed = new EmbedBuilder()

              .setColor("Blue")

              .setTitle("👥 USERS LIST COMMAND")

              .setDescription("Displays all panel users with server counts in an organized list")

              .addFields(

                { name: "/userslist", value: "Fetches and shows all panel users, emails, and owned servers", inline: false }

              );

            break;

        }

        if(categoryEmbed) {

          categoryEmbed.setFooter({ text: "⚡ Made by Lorinplayz | Pterobot 👑" }).setTimestamp();

          await i.update({ embeds: [categoryEmbed], components: [row] });

        }

      });

      collector.on("end", async () => {

        const disabledRow = new ActionRowBuilder().addComponents(

          new StringSelectMenuBuilder()

            .setCustomId("help_categories")

            .setPlaceholder("Help menu expired")

            .setDisabled(true)

        );

        const msg = await interaction.fetchReply();

        await msg.edit({ components: [disabledRow] });

      });

    } catch(err) {

      const embed = new EmbedBuilder()

        .setColor("Red")

        .setTitle("❌ Failed to Load Help")

        .setDescription(`Error: ${err.message}`)

        .setFooter({ text: "⚡ Made by Lorinplayz | Pterobot 👑" })

        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    }

  },

};
