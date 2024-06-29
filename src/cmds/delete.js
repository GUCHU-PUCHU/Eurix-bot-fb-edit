const fs = require("fs");
const path = require("path");

module.exports = {
    eurix: {
        name: "delete",
        version: "1.0.0",
        description: "Deletes an existing command.",
        permission: "botadmin", 
        credits: "Eugene Aguilar",
        usages: "/delete <commandname>",
        cooldown: 10,
    },
    execute: async function ({ api, event, args, reply }) {
        const senderID = event.senderID;

    const god = "61558014946967";
    if (!god.includes(senderID))
    return reply(`You are not allowed to use this commands.`);


        if (args.length !== 1) {
            return reply("Invalid usage. Please provide the command name you want to delete.");
        }

        const cmdName = args[0];

        try {
            const cmdsDir = path.join(__dirname, "../cmds");

            // Check if the command file exists
            const cmdFilePath = path.join(cmdsDir, `${cmdName}.js`);
            if (!fs.existsSync(cmdFilePath)) {
                return reply(`Command "${cmdName}" does not exist.`);
            }

            // Delete the command file
            fs.unlinkSync(cmdFilePath);

            // Reload the commands
            reloadCommands();

            reply(`Command "${cmdName}" deleted successfully.`);
        } catch (error) {
            console.error(error);
            reply(`Error: ${error.message}`);
        }
    }
};

function reloadCommands() {
    // Clear the existing commands map
    global.commands.clear();

    // Load commands again
    const commandsPath = path.join(__dirname, "../cmds");
    fs.readdirSync(commandsPath).forEach((file) => {
        if (file.endsWith(".js")) {
            const command = require(path.join(commandsPath, file));
            global.commands.set(command.eurix.name, command);
        }
    });
}