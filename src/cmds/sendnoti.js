const path = require("path");
const fs = require("fs");
const axios = require("axios");

module.exports = {
  eurix: {
    name: "sendnoti",
    version: "9.0.2",
    credits: "Eugene Aguilar",
    description: "Send notifications to all thread users",
    permission: "botadmin",
    usages: "sendnoti [text]",
    cooldown: 8,
    category: "system",
  },
  execute: async function ({ api, event, args }) {
    try {
      const threadList = await api.getThreadList(20, null, ["INBOX"]);

      if (args.length === 0) {
        return api.sendMessage(
          "Please provide a message to send.",
          event.threadID
        );
      }

      const message = args.join(" ");
      const attachments = event.messageReply ? event.messageReply.attachments : [];

      let img, video, audio;

      for (let attachment of attachments) {
        if (attachment.type === "photo") {
          img = attachment.url;
        } else if (attachment.type === "video") {
          video = attachment.url;
        } else if (attachment.type === "audio") {
          audio = attachment.url;
        }
      }

      const files = {
        img: path.join(__dirname, "cache", "sendnoti.png"),
        video: path.join(__dirname, "cache", "sendnoti.mp4"),
        audio: path.join(__dirname, "cache", "sendnoti.mp3"),
      };

      if (img) fs.writeFileSync(files.img, await axios.get(img, { responseType: 'arraybuffer' }).then(res => res.data));
      if (video) fs.writeFileSync(files.video, await axios.get(video, { responseType: 'arraybuffer' }).then(res => res.data));
      if (audio) fs.writeFileSync(files.audio, await axios.get(audio, { responseType: 'arraybuffer' }).then(res => res.data));

    

      for (let thread of threadList) {
        let attachment;
        if (video) {
          attachment = fs.createReadStream(files.video);
        } else if (img) {
          attachment = fs.createReadStream(files.img);
        } else if (audio) {
          attachment = fs.createReadStream(files.audio);
        }

        await api.sendMessage({
          body: `Notification from admin\n\n${message}\n\nThread: ${thread.name}`,
          attachment: attachment
        }, thread.threadID);
      }

      api.sendMessage("Notification sent to all threads.", event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(`${error.message}`, event.threadID);
    }
  }
};