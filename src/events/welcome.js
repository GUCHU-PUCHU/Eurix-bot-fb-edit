const path = require("path");
const fs = require("fs");
const axios = require("axios");

module.exports = {
    eurix: {
        name: "joinnoti",
        credits: "Eugene Aguilar",
        description:
            "Handles notifications for new participants joining a chat",
    },
    async handleEvent({ api, event }) {
        try {
            if (
                event.type === "event" &&
                event.logMessageType === "log:subscribe"
            ) {
                const threadID = event.threadID;
                const addedParticipants =
                    event.logMessageData.addedParticipants;

                if (
                    addedParticipants.some(
                        (participant) =>
                            participant.userFbId === api.getCurrentUserID(),
                    )
                ) {
                    await api.changeNickname(
                        `》 ${global.config.prefix} 《 ❃ ➠ ${global.config.botname}`,
                        threadID,
                        api.getCurrentUserID(),
                    );
                    await api.sendMessage(
                        `❑ Prefix: ${global.config.prefix}\n❑ Commands: ${global.client.commands.size}\n❑ Events: ${global.client.events.size}\nThank you for using this bot, have fun using it.`,
                        threadID,
                    ); 
                } else {
                    const newParticipantID = addedParticipants[0].userFbId;
                    const threadInfo = await api.getThreadInfo(threadID);
                    const userInfo = await api.getUserInfo(newParticipantID);
                    const name = userInfo[newParticipantID].name;
                    const memberCount = threadInfo.participantIDs.length;

                    const welcomeMessage = `Hello, ${name},\nWelcome to ${threadInfo.threadName}.\nYou are the ${memberCount}th member of our community; please enjoy! 🥳♥`;

                    const response = await axios.get(
                        `https://tanjiro-api.onrender.com/welcomev2?uid=${newParticipantID}&name=${encodeURIComponent(name)}%20Senpai&member=${memberCount}&bg=https://i.imgur.com/qschtOP.jpg&threadname=${encodeURIComponent(threadInfo.threadName)}&api_key=tanjiro`,
                        { responseType: "arraybuffer" },
                    );
                    const avatar = response.data;

                    const imagePath = path.join(
                        __dirname,
                        "cache",
                        `welcome${newParticipantID}.png`,
                    );
                    fs.writeFileSync(imagePath, avatar);

                    await api.sendMessage(
                        {
                            body: welcomeMessage,
                            attachment: fs.createReadStream(imagePath),
                        },
                        threadID,
                    );
                }
            }
        } catch (error) {
            console.error("Error in joinnoti event handler: ", error);
        }
    },
};
