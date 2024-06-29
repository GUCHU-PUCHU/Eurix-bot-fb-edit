const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
    eurix: {
        name: "stalk",
        version: "1.0.0",
        permission: 0,
        credits: "Eugene Aguilar",
        description: "Get info using UID/mention/reply to a message.",
        usages: "stalk [uid/mention/reply]",
        cooldown: 9,
        category: "info",
    },
    execute: async function ({ api, event, args, reply }) {
        try {
            const { threadID, senderID, messageID, messageReply, mentions, type } = event;

            let id;
            if (args.join().indexOf("@") !== -1) {
                id = Object.keys(mentions)[0];
            } else {
                id = args[0] || senderID;
            }

            if (type === "message_reply") {
                id = messageReply.senderID;
            }

            const res = await axios.post(
                `https://eugene-restapi.onrender.com/api/stalk`,
                { uid: id }
            );

            const {
                name,
                gender,
                relationship_status: relationship,
                significant_other: love,
                link_profile: link,
                followers,
                birthday,
                hometown,
                avatar,
                created_time
            } = res.data.result;

            const responseMessage = `❯ Name: ${name}\n❯ ID: ${id}\n❯ Birthday: ${birthday}\n❯ Gender: ${gender}\n❯ Hometown: ${hometown}\n❯ Relationship: ${relationship} with ${love}\n❯ Followers: ${followers}\n❯ Link: ${link}\n❯ Account created at: ${created_time}`;

            const imagePath = `${__dirname}/cache/image.png`;
            const imageStream = fs.createWriteStream(imagePath);

            request(encodeURI(avatar)).pipe(imageStream);
            imageStream.on("close", () => {
                reply(
                    {
                        body: responseMessage,
                        attachment: fs.createReadStream(imagePath)
                    },
                    () => fs.unlinkSync(imagePath)
                );
            });
        } catch (error) {
            console.error(error);
            reply("An error occurred while fetching the data.");
        }
    },
};