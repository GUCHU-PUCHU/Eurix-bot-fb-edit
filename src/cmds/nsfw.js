const fs = require("fs");
const path = require("path");

const nsfwFilePath = path.join(__dirname, "../../EugeneHandle/nsfw.json");

function loadNSFWSettings() {
    if (!fs.existsSync(nsfwFilePath)) {
        fs.writeFileSync(nsfwFilePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(nsfwFilePath);
    return JSON.parse(data);
}

function saveNSFWSettings(settings) {
    fs.writeFileSync(nsfwFilePath, JSON.stringify(settings, null, 2));
}

module.exports = {
    eurix: {
        name: "nsfw",
        description: "Enable or disable NSFW commands in this group chat.",
        permission: 0,
        category: "admin",
        usages: "nsfw [on/off]",
        cooldown: 0,
        version: "1.0.0",
        credits: "Eugene Aguilar",
    },
    async execute({ api, event, args, reply }) {
        const threadID = event.threadID;
        const senderID = event.senderID;

        const threadInfo = await api.getThreadInfo(threadID);
        const adminGroup = threadInfo.adminIDs.map((admin) => admin.id);

        if (!adminGroup.includes(senderID)) {
            return reply("Only group admins can change NSFW settings.");
        }

        if (args.length === 0) {
            return reply("Usage: nsfw <on|off>");
        }

        const settings = loadNSFWSettings();
        const option = args[0].toLowerCase();

        if (option === "on") {
            settings[threadID] = true;
            saveNSFWSettings(settings);
            return reply("NSFW commands have been enabled in this group chat.");
        } else if (option === "off") {
            settings[threadID] = false;
            saveNSFWSettings(settings);
            return reply(
                "NSFW commands have been disabled in this group chat.",
            );
        } else {
            return reply("Usage: nsfw <on|off>");
        }
    },
};
