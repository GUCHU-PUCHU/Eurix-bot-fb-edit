const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports = {
  eurix: {
    name: "tiksearch",
    version: "9.0.1",
    permission: 0,
    credits: "Eugene Aguilar",
    description: "Search for TikTok videos",
    usages: "[search]",
    cooldown: 10,
  },

  execute: async function ({ api, event, args, reply }) {
    try {
      const search = args.join(" ");
      if (!search) {
        reply(`${global.config.prefix}tiksearch [search]`);
        return;
      }

      reply(`🕥 Searching TikTok for ${search}`);

      const response = await axios.get(`https://eugene-restapi.onrender.com/tiksearch?search=${encodeURIComponent(search)}`);

      if (response.data && response.data.data && response.data.data.videos && response.data.data.videos.length > 0) {
        const video = response.data.data.videos[0];
        const videoUrl = video.play;
        const username = video.author.unique_id;
        const nickname = video.author.nickname;
        const title = video.title;

        const videoPath = path.join(__dirname, "cache", "tiksearch.mp4");

        const videoResponse = await axios.get(videoUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(videoPath, Buffer.from(videoResponse.data, "binary"));

        await reply({ body: `Username: ${username}\nNickname: ${nickname}\nTitle: ${title}`, attachment: fs.createReadStream(videoPath) });
      } else {
        reply("No video found.");
      }
    } catch (error) {
      reply(`Error: ${error.message}`);
      console.error(error);
    }
  }
};
