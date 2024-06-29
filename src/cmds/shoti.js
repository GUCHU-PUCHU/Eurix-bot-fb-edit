const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
     eurix: {
          name: "shoti",
          version: "9.0.2",
          description: "Generate random shoti",
          permission: 0,
          credits: "Eugene Aguilar",
          usages: "[shoti]",
          cooldown: 10,
          category: "fun"
     },

     execute: async function ({ api, event }) {
          try {
               api.sendMessage(
                    `🕥 shoti is sending please wait master`,
                    event.threadID,
                    event.messageID,
               );

               const response = await axios.post(
                    `https://eugene-restapi.onrender.com/shoti`,
               );
               const username = response.data.data.username;
               const nickname = response.data.data.nickname;
               const url = response.data.data.url;
               const videoid = response.data.data.videoid;

               let shotiPath = path.join(__dirname, "cache", "shoti.mp4");

               const video = await axios.get(url, {
                    responseType: "arraybuffer",
               });

               fs.writeFileSync(shotiPath, Buffer.from(video.data, "utf-8"));

               await api.sendMessage(
                    {
                         body: `Here's your shoti master\n\nUsername: ${username}\nNickname: ${nickname}`,
                         attachment: fs.createReadStream(shotiPath),
                    },
                    event.threadID,
                    event.messageID,
               );
          } catch (error) {
               api.sendMessage(`${error}`, event.threadID, event.messageID);
          }
     },
};
