import {

  SlashCommandBuilder,

  EmbedBuilder,

  ActionRowBuilder,

  ButtonBuilder,

  ButtonStyle

} from "discord.js";

export default {

  data: new SlashCommandBuilder()

    .setName("botdetails")

    .setDescription("Shows complete details about the bot & developer."),

  async execute(interaction, client) {

    const embed = new EmbedBuilder()

      .setColor("#5865F2")

      .setTitle("🤖 BOT DETAILS")

      .setThumbnail(client.user.displayAvatarURL())

      .addFields(

        {

          name: "🪄 Bot Name",

          value: client.user.username,

          inline: true

        },

        {

          name: "📦 Version",

          value: "v1.0.0 (Lorinplayz Premium Build)",

          inline: true

        },

        {

          name: "👑 Developer (Owner)",

          value:

            "**Name:** Lorinplayz\n" +

            "**Role:** Founder & Developer\n" +

            "**Speciality:** Hosting, Automation, Discord Bots 🔥",

          inline: false

        },

        {

          name: "🌐 Support Server",

          value: "[Join Support Server](https://discord.gg/lorinplayz)",

          inline: false

        }

      )

      .setFooter({ text: "Made with ❤️ by Lorinplayz" })

      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(

      new ButtonBuilder()

        .setLabel("Support Server")

        .setStyle(ButtonStyle.Link)

        .setURL("https://discord.gg/lorinplayz")

    );

    await interaction.reply({ embeds: [embed], components: [row] });

  }

};
