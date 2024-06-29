const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
eurix: {
  name: "cupcutdl",
  credits: "Eugene Aguilar",
  description: "Cupcut downloader",
  usages: "cupcutdl [link]",
  permission: "user",
  version: "9.0.2",
  cooldown: 9,
},
execute: async function ({ api, event, args }) {
  try {
    const link = args.join(" ");
    if (!link) {
      return api.sendMessage("Please enter a link", event.threadID, event.messageID);
    }

    const response = await axios.get(`https://eugene-restapi.onrender.com/cupcutdl?link=${encodeURIComponent(link)}`);
    const { eurixmp4: video, title, description, like } = response.data;

    const videoPath = path.join(__dirname, "cache", "cupcut.mp4");

    const videoRes = await axios.get(video, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(videoPath, Buffer.from(videoRes.data));

    await api.sendMessage(
      {
        body: `Downloaded successfully\n\nTitle: ${title}\nDescription: ${description}\nLike: ${like}`,
        attachment: fs.createReadStream(videoPath),
      },
      event.threadID,
      event.messageID
    );
  } catch (error) {
    api.sendMessage(error.message, event.threadID, event.messageID);
    console.error(error);
  }
}
};
