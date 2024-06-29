const fs = require('fs');
const path = require('path');

module.exports = {
    eurix: {
        name: "load",
        version: "1.0.0",
        description: "Reload a command file without restarting the bot.",
        permission: "botadmin", 
        credits: "Eugene Aguilar",
        usages: "/load <commandName>",
        cooldown: 5,
    },
    execute: async function ({ api, event, args }) {
        try {
            if (args.length === 0) {
                return api.sendMessage("Please provide a command name to reload.", event.threadID, event.messageID);
            }

            const commandName = args[0].toLowerCase();
            const commandsPath = path.join(__dirname, commandName + '.js');

            if (!fs.existsSync(commandsPath)) {
                return api.sendMessage(`The command "${commandName}" does not exist.`, event.threadID, event.messageID);
            }

            delete require.cache[require.resolve(commandsPath)];

            try {
                const newCommand = require(commandsPath);
                if (!newCommand.eurix || !newCommand.execute) {
                    throw new Error("Invalid command structure.");
                }

                global.commands.set(newCommand.eurix.name, newCommand);

                return api.sendMessage(`✅ | The command "${commandName}" has been reloaded successfully.`, event.threadID, event.messageID);
            } catch (err) {
                console.error(err);
                return api.sendMessage(`❌ | There was an error reloading the command "${commandName}"\n\nissue ${err.message}`, event.threadID, event.messageID);
            }
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while executing the command.", event.threadID, event.messageID);
        }
    }
};