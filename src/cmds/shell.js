

module.exports = {
    eurix: {
        name: "shell",
        description: "Execute shell commands",
        credits: "Eugene Aguilar",
        usages: "shell <command>",
        version: "1.0",
        permission: "botadmin",
        cooldown: 8,
    },

    execute: async function({ api, args, reply }) {
         

        if (args.length === 0) {
            return reply("Please provide a shell command to execute.");
        }

        const { exec } = require('child_process');

        const command = args.join(" ");

        exec(command, (error, stdout, stderr) => {
            if (error) {

                reply(`Error executing command: ${error.message}`);
                return;
            }

            if (stdout) {
                reply(`Command output: \n${stdout}`);
            }
            if (stderr) {
                reply(`Command error: \n${stderr}`);
            }
        });
    }
};