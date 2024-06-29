const { readdirSync } = require("fs-extra");
const path = require("path");

module.exports = {
    eurix: {
        name: "help",
        description: "Shows the command list and their descriptions",
        usages: "<command name> | <page number> | all",
        credits: "Eugene Aguilar",
        permission: 0,
        version: "9.0.2",
        cooldown: 6,
        category: "system"
    },
    execute: async function ({ api, event, args }) {
        try {
            const cmdsDir = path.join(process.cwd(), "src", "cmds");
            const commandFiles = readdirSync(cmdsDir).filter(file => file.endsWith(".js"));
            const commandConfigs = commandFiles.map(file => {
                const script = require(path.join(cmdsDir, file));
                return script.eurix || {};
            });

            const totalCommands = commandConfigs.length;
            const commandsPerPage = 10;
            const totalPages = Math.ceil(totalCommands / commandsPerPage);

            if (args.length === 0 || !isNaN(parseInt(args[0]))) {
                const pageNumber = parseInt(args[0]) || 1;
                const start = (pageNumber - 1) * commandsPerPage;
                const end = start + commandsPerPage;

                if (pageNumber < 1 || pageNumber > totalPages) {
                    return api.sendMessage(`Invalid page number. Please use a number between 1 and ${totalPages}`, event.threadID, event.messageID);
                }

                const slicedCommands = commandConfigs.slice(start, end);
                const commandList = slicedCommands.map((command, index) => `『 ${start + index + 1} 』 ${global.config.prefix}${command.name} - ${command.description}`).join("\n");
                const rand = [
                    `» Use ${global.config.prefix}${this.eurix.name} [command name] to display the details of the command`,
                    `» Use ${global.config.prefix}${this.eurix.name} [page number] to display the information on the additional pages`,
                    `» Use ${global.config.prefix}${this.eurix.name} all to display all the details of the command`,
                ];
                const helpMessage = `✨ Commands List\n\n${commandList}\n\n» Page: ${pageNumber}/${totalPages}\n${rand[Math.floor(Math.random() * rand.length)]}`;

                return api.sendMessage(helpMessage, event.threadID, event.messageID);
            }

            if (args[0] === "all" || args[0] === "-all" || args[0] === "-a") {
                const allCommands = commandConfigs.map((command, index) => `『 ${index + 1} 』 ${global.config.prefix}${command.name} - ${command.description}`).join("\n");
                return api.sendMessage(allCommands, event.threadID, event.messageID);
            }

            if (args.length === 1 && isNaN(parseInt(args[0]))) {
                const commandName = args[0].toLowerCase();
                const command = commandConfigs.find(cmd => cmd.name && cmd.name.toLowerCase() === commandName);
                if (command) {
                    const { name, description, usages, credits, permission, cooldown, category } = command;
                    const commandInfo = `『 ${name} 』\n${description}\n\n⦿ Usage: ${global.config.prefix}${name} ${usages}\n⦿ Credits: ${credits || "Unknown"}\n⦿ Permission: ${permission === 0 ? "User" : permission === 1 ? "Group admin" : permission === 2 ? "Admin bot" : permission === "botadmin" ? "Bot admin" : "Unknown"}\n⦿ Cooldown: ${cooldown || "None"} seconds\n⦿ Category: ${category || "Unknown"}`;
                    return api.sendMessage(commandInfo, event.threadID, event.messageID);
                } else {
                    return api.sendMessage(`Command "${commandName}" not found.`, event.threadID, event.messageID);
                }
            }

            return api.sendMessage("Invalid argument. Please specify a command name or page number.", event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while running the command.", event.threadID, event.messageID);
        }
    },
};