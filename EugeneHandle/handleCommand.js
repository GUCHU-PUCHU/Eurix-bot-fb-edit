const axios = require("axios");
const path = require("path");
const moment = require("moment-timezone");
const fs = require("fs");
const cooldowns = new Map();
const chalk = require("chalk");

const autobanPhrases = [ "bobong bot to nag mana sa owner niya", "bobo owner mo", "bobo siguro owner nito", "Eugene bakla", "eugene bakla", "dump bot", "nonskilled owner mo", "bakla owner mo", "Eugene bayot","bot biot", "bot bakla", "robot bakla", "robot biot", "bot tanga", "bot bobo", "botngu", "stupid bots", "chicken bot", "bots lol", "stupid bots lol", "dog bot", "dm bot", "fuck bots", "dmm bot", "dam bot", "mmm bot", "đb bot", "crazy bots", "bobo bot", "bot dở", "bot khùng", "đĩ bot", "bot paylac rồi", "con bot lòn", "cmm bot", "clap bot", "bot ncc", "bot oc", "bot óc", "bot óc chó", "cc bot", "bot tiki", "lozz bottt", "lol bot", "loz bot", "lồn bot", "bot lồn", "bot lon", "bot cac", "bot nhu lon", "bot như cc", "bot như bìu", "Bot sida", "bot sida", "bot fake", "Bảo ngu", "bot shoppee", "bad bots", "bot cau"];

function loadNSFWSettings() {
    const nsfwFilePath = path.join(__dirname, "nsfw.json");
    if (!fs.existsSync(nsfwFilePath)) {
        fs.writeFileSync(nsfwFilePath, JSON.stringify({}));
    }
    const data = fs.readFileSync(nsfwFilePath);
    try {
        return JSON.parse(data);
    } catch (error) {
        console.error("Error parsing nsfw.json:", error);
        return {};
    }
}




async function loadBannedUsers() {
    const bannedUsersFilePath = path.join(__dirname, "bannedUsers.json");
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

async function saveBannedUsers(bannedUsers) {
    const bannedUsersFilePath = path.join(__dirname, "bannedUsers.json");
    try {
        fs.writeFileSync(bannedUsersFilePath, JSON.stringify(bannedUsers, null, 2));
    } catch (error) {
        console.error("Error saving bannedUsers.json:", error);
    }
}



function anonymizeID(id) {
    return id.substring(0, Math.min(5, id.length)) + "*".repeat(Math.max(0, id.length - 5));
}


function getBanReason(bannedUsers, senderID) {
    const bannedUser = bannedUsers.find(user => user.id === senderID);
    return bannedUser ? bannedUser.reason : "null";
}

async function handleCommand(api, event) {
const senderID = event.senderID;
    const message = event.body;

    try {
        const userInfo = await api.getUserInfo(senderID) || { [senderID]: { name: "Facebook User" } };
        const name = userInfo[senderID]?.name;
        const threadID = event.threadID;
        const n = moment().format('MMMM Do YYYY, h:mm:ss a');

        const groupInfo = await api.getThreadInfo(threadID);
        const groupName = groupInfo.threadName ? groupInfo.threadName: name || "Facebook User";


        console.log(chalk.hex("#FF66FF")("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"));
        console.log(chalk.hex("#9966FF")(`┣➤ Name: ${groupName}`)); 
        console.log(chalk.hex("#3366FF")(`┣➤ User ID: ${event.senderID}`));
        console.log(chalk.hex("#0066FF")(`┣➤ Content: ${event.body || (event.attachments[0]?.type ? event.attachments[0]?.type : "No content available")}`));
        console.log(chalk.hex("#0000FF")(`┣➤ Time: ${n}`));
        console.log(chalk.hex("#0000FF")("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"));

    const isAdmin = global.config.admins.includes(senderID)

        const bannedUsers = await loadBannedUsers();

        if (!isAdmin && autobanPhrases.some(phrase => message.includes(phrase))) {
            if (!bannedUsers.some(user => user.id === senderID)) {
                const reason = autobanPhrases.find(phrase => message.includes(phrase));
                bannedUsers.push({ id: senderID, reason: reason });
                await saveBannedUsers(bannedUsers);
              return  api.sendMessage(`»Notice from Admin«\n\n${name}, You are banned for cursing bots.`, event.threadID, event.messageID);
            }
        }




    if (!message.startsWith(global.config.prefix)) {
        commands.forEach((cmd) => {
            if (typeof cmd.onChat === "function") {
                cmd.onChat({ api, event });
            }
        });
        return;
    }



        const args = message.slice(global.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = commands.get(commandName);

        if (!command) {
            return api.sendMessage(
                `Command not found. Use ${global.config.prefix}help to display all commands.`,
                event.threadID,
                event.messageID
            );
        }


        const nsfwSettings = loadNSFWSettings();
        const nsfwEnabled = nsfwSettings[event.threadID];

        if (command.eurix.category === "nsfw" && !global.config.admins.includes(senderID) && !nsfwEnabled) {
            return api.sendMessage(
                `This command is marked as NSFW and is currently disabled in this group chat.`,
                event.threadID,
                event.messageID
            );
        }


  var threadInfo = await api.getThreadInfo(event.threadID);
  let qtv = threadInfo.adminIDs;

        if (
            (command.eurix.permission === "botadmin" && !global.config.admins.includes(senderID)) ||
            (command.eurix.permission === "user" && !senderID) ||
            (command.eurix.permission === 0 && !senderID) ||
            (command.eurix.permission === 2 && !global.config.admins.includes(senderID)) ||
            (command.eurix.permission === 1 && !qtv.includes(senderID) && !global.config.admins.includes(senderID))
)  {
            return api.sendMessage(
                `You don't have permission to use this command ${commandName}`,
                event.threadID,
                event.messageID
            );
        }

        if (!cooldowns.has(commandName)) {
            cooldowns.set(commandName, new Map());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(commandName);

        if (timestamps.has(senderID)) {
            const expirationTime = timestamps.get(senderID) + command.eurix.cooldown * 1000;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return api.sendMessage(
                    `Please wait ${timeLeft.toFixed(0)} seconds. 🕖`,
                    event.threadID,
                    event.messageID
                );
            }
        }

        timestamps.set(senderID, now);
        setTimeout(() => timestamps.delete(senderID), command.eurix.cooldown * 1000);

        command.execute({
            api,
            event,
            args,
            reply: (msg) => api.sendMessage(msg, event.threadID, event.messageID),
            react: (emoji) => api.setMessageReaction(emoji, event.messageID, (err) => {}, true),
            anonymous: anonymizeID,
        });

    } catch (error) {
        console.error("Error in command execution:", error);
        api.sendMessage("An error occurred while executing the command.", event.threadID);
    }
}


module.exports = { handleCommand };