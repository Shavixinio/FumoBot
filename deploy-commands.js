require("dotenv").config();
const { REST, Routes } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const token = process.env.TOKEN;
const clientId = process.env.APPLICATION_ID;
const guildId = process.env.GUILD_ID;

function removeCommands() {
  // for guild commands
  rest
    .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
    .then(() => console.log("Successfully deleted all guild commands."))
    .catch(console.error);

  // for global commands
  rest
    .put(Routes.applicationCommands(clientId), { body: [] })
    .then(() => console.log("Successfully deleted all global commands."))
    .catch(console.error);
}

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all the command files from the commands directory you created earlier
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} slash commands.`);
    // removeCommands();

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(`Successfully reloaded ${data.length} slash commands.`);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(
      `There was an error while reloading the slash commands: ${error}`
    );
  }
})();
