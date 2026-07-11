// ======================================================
// ⚔️ LORINPLAYZ DEPLOY - Ultimate Slash Command Handler
// 🌐 Made by Lorinplayz | Pterobot
// ======================================================

import { REST, Routes, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

// ======================================================
// 🧩 GLOBAL VARIABLES
// ======================================================
const commands = [];
const commandCollection = new Collection();

// ======================================================
// 🚀 LOAD COMMANDS DYNAMICALLY
// ======================================================
export async function loadCommands(client) {
  try {
    const commandsPath = path.join(process.cwd(), "src", "commands");
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter(file => file.endsWith(".js"));

    console.log(chalk.cyanBright("\n📂 Scanning Commands Folder..."));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = (await import(filePath)).default;

      if (!command?.data || !command?.execute) {
        console.log(chalk.red(`⚠️  Invalid Command Skipped → ${file}`));
        continue;
      }

      commands.push(command.data.toJSON());
      commandCollection.set(command.data.name, command);

      console.log(chalk.greenBright(`✅ Loaded: /${command.data.name}`));
    }

    // Attach to client for later access
    client.commands = commandCollection;

    // ======================================================
    // 🌐 REGISTER WITH DISCORD
    // ======================================================
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);
    console.log(chalk.yellowBright("\n⚙️ Registering Slash Commands with Discord..."));

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log(chalk.greenBright("\n🚀 Slash Commands Registered Successfully!"));
    console.log(chalk.gray("─────────────────────────────────────────────"));
    console.log(chalk.blueBright(`🌐 Total Commands: ${commands.length}`));
    console.log(chalk.magenta(`⏰ Timezone: Asia/Kolkata`));
    console.log(chalk.cyan(`🧠 Handler Status: ACTIVE & SYNCHRONIZED`));
    console.log(chalk.gray("─────────────────────────────────────────────\n"));
  } catch (error) {
    console.error(chalk.redBright("💥 Command Loading Error:"), error);
  }
}

// ======================================================
// ⚡ HANDLE INTERACTIONS
// ======================================================
export async function handleInteraction(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    await interaction.reply({
      content: "⚠️ This command is outdated or unavailable.",
      ephemeral: true,
    });
    return;
  }

  try {
    console.log(
      chalk.yellow(
        `⚡ Executing: /${interaction.commandName} by ${interaction.user.tag}`
      )
    );
    await command.execute(interaction);
  } catch (error) {
    console.error(chalk.red(`💥 Error in /${interaction.commandName}:`), error);

    const replyMsg = {
      content: "❌ An unexpected error occurred while executing this command.",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(replyMsg);
    } else {
      await interaction.reply(replyMsg);
    }
  }
}
