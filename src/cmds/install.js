const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
    eurix: {
        name: "install",
        version: "1.0.0",
        description: "Installs a new command.",
        permission: "botadmin", 
        credits: "Eugene Aguilar",
        usages: "/install <cmdname> <link>",
        cooldown: 10,
    },
    execute: async function ({ api, event, args }) {
        const senderID = event.senderID;

        if (!global.config.admins.includes(senderID)) {
            return api.sendMessage("You do not have permission to use this command.", event.threadID, event.messageID);
        }

        if (args.length < 2) {
            return api.sendMessage("Invalid usage. Please provide a command name and a link.", event.threadID, event.messageID);
        }

        const cmdName = args[0];
        const link = args[1];

        try {
            const { data } = await axios.get(link);

            const cmdsDir = path.join(__dirname, "../cmds");

            fs.writeFileSync(path.join(cmdsDir, `${cmdName}.js`), data);

            reloadCommands();

            api.sendMessage(`✅ | Command "${cmdName}" installed successfully.`, event.threadID);
        } catch (error) {
            console.error(error);
            api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
        }
    }
};

function reloadCommands() {
    global.commands.clear();

    const commandsPath = path.join(__dirname, "../cmds");
    fs.readdirSync(commandsPath).forEach((file) => {
        if (file.endsWith(".js")) {
            const command = require(path.join(commandsPath, file));
            global.commands.set(command.eurix.name, command);
        }
    });
}