// ======================================================

// ➕ Lorinplayz - /createuser Command (WORLD BEST)

// ⚡ Made by Lorinplayz | Pterobot 👑

// ======================================================

import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

import fetch from "node-fetch";

import dotenv from "dotenv";

dotenv.config();

export default {

  data: new SlashCommandBuilder()

    .setName("createuser")

    .setDescription("➕ Create a new user in the panel")

    .addStringOption(option =>

      option.setName("email")

        .setDescription("User email")

        .setRequired(true)

    )

    .addStringOption(option =>

      option.setName("username")

        .setDescription("Username for the panel")

        .setRequired(true)

    )

    .addStringOption(option =>

      option.setName("first_name")

        .setDescription("First name")

        .setRequired(true)

    )

    .addStringOption(option =>

      option.setName("last_name")

        .setDescription("Last name")

        .setRequired(true)

    )

    .addStringOption(option =>

      option.setName("password")

        .setDescription("Password for the user")

        .setRequired(true)

    )

    .addStringOption(option =>

      option.setName("administrator")

        .setDescription("Give admin permissions? yes/no")

        .setRequired(true)

        .addChoices(

          { name: "YES (Admin)", value: "true" },

          { name: "NO (Normal user)", value: "false" }

        )

    )

    .addUserOption(option =>

      option.setName("notify")

        .setDescription("Tag the user to DM account details")

        .setRequired(false)

    ),

  async execute(interaction) {

    await interaction.deferReply({ ephemeral: true });

    try {

      const email = interaction.options.getString("email");

      const username = interaction.options.getString("username");

      const firstName = interaction.options.getString("first_name");

      const lastName = interaction.options.getString("last_name");

      const password = interaction.options.getString("password");

      const admin = interaction.options.getString("administrator") === "true";

      const notifyUser = interaction.options.getUser("notify");

      const body = {

        email,

        username,

        first_name: firstName,

        last_name: lastName,

        password,

        root_admin: admin   // ← ADMIN FLAG

      };

      const res = await fetch(`${process.env.PTERO_URL}/api/application/users`, {

        method: "POST",

        headers: {

          "Authorization": `Bearer ${process.env.PTERO_API_KEY}`,

          "Content-Type": "application/json",

          "Accept": "Application/vnd.pterodactyl.v1+json"

        },

        body: JSON.stringify(body)

      });

      if (res.status !== 201) {

        const errorData = await res.json();

        throw new Error(errorData.errors ? JSON.stringify(errorData.errors) : "Unknown error");

      }

      const data = await res.json();

      // SUCCESS EMBED

      const embed = new EmbedBuilder()

        .setColor("Green")

        .setTitle("✅ User Created Successfully")

        .setDescription(`User **${username}** has been created on Pterodactyl.`)

        .addFields(

          { name: "🧾 Email", value: `\`${email}\``, inline: true },

          { name: "👤 Username", value: `\`${username}\``, inline: true },

          { name: "🔑 Password", value: `\`${password}\``, inline: true },

          { name: "📝 Full Name", value: `\`${firstName} ${lastName}\``, inline: true },

          { name: "⚡ Administrator", value: admin ? "`YES`" : "`NO`", inline: true }

        )

        .setFooter({ text: "⚡ Made by Lorinplayz | Pterobot 👑" })

        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

      // DM the created details to the tagged user

      if (notifyUser) {

        const dmEmbed = new EmbedBuilder()

          .setColor("Aqua")

          .setTitle("🔐 Your Hosting Panel Account")

          .setDescription("Your account has been created on **Vortex Host Panel** 🎉\nHere are your login details:")

          .addFields(

            { name: "🌐 Panel URL", value: `${process.env.PTERO_URL}/`, inline: false },

            { name: "🧾 Email", value: `\`${email}\``, inline: false },

            { name: "👤 Username", value: `\`${username}\``, inline: false },

            { name: "🔑 Password", value: `\`${password}\``, inline: false },

            { name: "⚡ Administrator", value: admin ? "`YES`" : "`NO`", inline: false }

          )

          .setFooter({ text: "⚡Made by Lorinplayz | Pterobot👑" })

          .setTimestamp();

        await notifyUser.send({ embeds: [dmEmbed] }).catch(() => {});

      }

    } catch (err) {

      const embed = new EmbedBuilder()

        .setColor("Red")

        .setTitle("❌ Failed to Create User")

        .setDescription(`Error: ${err.message}`)

        .setFooter({ text: "⚡ Made by Lorinplayz | Pterobot👑" })

        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });

    }

  },

};
