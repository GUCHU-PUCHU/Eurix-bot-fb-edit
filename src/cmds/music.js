module.exports = {
eurix: {
 name: "music",
 version: "1.0.0",
 permission: 0,
 credits: "Eugene Aguilar",
 description: "music from YouTube",
 usages: "music [ title ]",
 cooldown: 9,
},
execute: async ({ api, event }) => {
 const axios = require("axios");
 const fs = require("fs-extra");
 const ytdl = require("ytdl-core");
 const request = require("request");
 const yts = require("yt-search");

 const input = event.body;
 const text = input.substring(12);
 const data = input.split(" ");

 if (data.length < 2) {
 return api.sendMessage(`${global.config.prefix}music [ title ]`, event.threadID, event.messageID);
 }

 data.shift();
 const eugene = data.join(" ");

 try {
 api.sendMessage(`🔍 | searching music for ${eugene}`, event.threadID, event.messageID);

 const searchResults = await yts(eugene);
 if (!searchResults.videos.length) {
 return api.sendMessage("music", event.threadID, event.messageID);
 }

 const music = searchResults.videos[0];
 const musicUrl = music.url;

 const stream = ytdl(musicUrl, { filter: "audioonly" });

 const fileName = `${event.senderID}.mp3`;
 const filePath = __dirname + `/cache/${fileName}`;

 stream.pipe(fs.createWriteStream(filePath));

 stream.on('response', () => {
 console.info('[DOWNLOADER]', 'Starting download now!');
 });

 stream.on('info', (info) => {
 console.info('[DOWNLOADER]', `Downloading music: ${info.videoDetails.title}`);
 });

 stream.on('end', () => {
 console.info('[DOWNLOADER] Downloaded');

 if (fs.statSync(filePath).size > 26214400) {
 fs.unlinkSync(filePath);
 return api.sendMessage('❌ | The file could not be sent because it is larger than 25MB.', event.threadID, event.messageID);
 }
api.sendMessage(
  {
 body: `${music.title}`,
     attachment: fs.createReadStream(filePath)
  },
event.threadID,
event.messageID
);
 });

 } catch (error) {
 console.error('[ERROR]', error);
 api.sendMessage('An error occurred while processing the command.', event.threadID);
 }
}
};