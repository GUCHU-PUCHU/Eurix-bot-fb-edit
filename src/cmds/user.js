const fs = require("fs");
const path = require("path");

const bannedUsersFilePath = path.join(
    __dirname,
    "../../EugeneHandle/bannedUsers.json"
);

// Helper function to load banned users
async function loadBannedUsers() {
    if (!fs.existsSync(bannedUsersFilePath)) {
        fs.writeFileSync(bannedUsersFilePath, JSON.stringify([]));
    }
    const data = fs.readFileSync(bannedUsersFilePath);
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error parsing bannedUsers.json:", error);
        return [];
    }
}

// Helper function to save banned users
async function saveBannedUsers(bannedUsers) {
    try {
        fs.writeFileSync(
            bannedUsersFilePath,
            JSON.stringify(bannedUsers, null, 2)
        );
    } catch (error) {
        console.error("Error saving bannedUsers.json:", error);
    }
}

module.exports = {
    eurix: {
        name: "user",
        credits: "Eugene Aguilar",
        version: "1.0.0",
        description: "Manages user bans and unbans",
        permission: 2,
        usages: "/user [ban|unban] [userID]",
        cooldown: 0,
        category: "system",
    },
    execute: async function ({ api, event, args }) {
        const command = args[0];

        let id;
        if (args.join().indexOf("@") !== -1) {
            id = Object.keys(event.mentions)[0];
        } else {
            id = args[1] || event.senderID;
        }

        if (event.type === "message_reply") {
            id = event.messageReply.senderID;
        }

        const reason = args.slice(3).join(" ") || "null";

        if (!command || !id) {
            return api.sendMessage(
                "Usage: /user [ban|unban] [userID]",
                event.threadID,
                event.messageID
            );
        }

        let bannedUsers = await loadBannedUsers();

        if (command === "ban") {
            if (bannedUsers.some((user) => user.id === id)) {
                return api.sendMessage(
                    `User ${id} is already banned.`,
                    event.threadID,
                    event.messageID
                );
            }

            bannedUsers.push({ id: id, reason: reason });
            await saveBannedUsers(bannedUsers);
            return api.sendMessage(
                `User ${id} has been banned.`,
                event.threadID,
                event.messageID
            );
        } else if (command === "unban") {
            if (!bannedUsers.some((user) => user.id === id)) {
                return api.sendMessage(
                    `User ${id} is not banned.`,
                    event.threadID,
                    event.messageID
                );
            }

            bannedUsers = bannedUsers.filter((user) => user.id !== id);
            await saveBannedUsers(bannedUsers);
            return api.sendMessage(
                `User ${id} has been unbanned.`,
                event.threadID,
                event.messageID
            );
        } else {
            return api.sendMessage(
                "Invalid command. Usage: /user [ban|unban] [userID]",
                event.threadID,
                event.messageID
            );
        }
    },
};