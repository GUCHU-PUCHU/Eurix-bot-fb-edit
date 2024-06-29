const path = require("path");
const axios = require("axios");
const fs = require("fs");

module.exports = {
  eurix: {
    name: "eabab",
    version: "9",
    credits: "Eugene Aguilar",
    description: "Generate random shoti 😝",
    permission: "user",
    usages: "[eabab]",
    cooldown: 10,
    category: "other",
  },
  execute: async function ({ api, event, react, reply }) {
   
      try {
        react("🕥");

        const response = await axios.post("https://shoti-cutieapi.onrender.com/api/request/f");
        if (response.data && response.data.data) {
          const video = response.data.data.eurixmp4;
          const username = response.data.data.username;
          const nickname = response.data.data.nickname;
          const title = response.data.data.title;

          const videoPath = path.join(__dirname, "cache", "eabab.mp4");

          const videoResponse = await axios.get(video, { responseType: "arraybuffer" });

          fs.writeFileSync(videoPath, Buffer.from(videoResponse.data));

          react("✅");

          await reply({
            body: `nag liliyab na bilat 💥\nUsername: ${username}\nNickname: ${nickname}\nTitle: ${title}`,
            attachment: fs.createReadStream(videoPath),
          });
        } else {
          reply("No eabab found");
        }
      } catch (error) {
      reply(`${error.message}`);
      }
    }
  };