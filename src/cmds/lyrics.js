module.exports = {
  eurix: {
    name: "lyrics",
    version: "2.0.4",
    permission: 0,
    credits: "Eugene Aguilar",
    description: "Play a song with lyrics",
    usages: "[title]",
    cooldown: 5,
  },

  execute: async ({ api, event, args, reply }) => {
    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("ytdl-core");
    const yts = require("yt-search");

    if (args.length < 1) {
      return reply("Please provide a song title.");
    }

    const song = args.join(" ");

    try {
      reply(`Finding lyrics for "${song}". Please wait...`);

      const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(song)}`);
      const lyrics = res.data.lyrics || "Not found!";
      const title = res.data.title || "Not found!";
      const artist = res.data.artist || "Not found!";

      const searchResults = await yts(song);
      if (!searchResults.videos.length) {
        return reply("Error: No videos found for the given song.");
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });

      const fileName = `${event.senderID}.mp3`;
      const filePath = `${__dirname}/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return reply('[ERR] The file could not be sent because it is larger than 25MB.');
        }

        const message = {
          body: `Here's your music, enjoy!🥰\n\nTitle: ${title}\nArtist: ${artist}\n\nLyrics: ${lyrics}`,
          attachment: fs.createReadStream(filePath)
        };

        reply(message, () => {
          fs.unlinkSync(filePath);
        });
      });

    } catch (error) {
      console.error('[ERROR]', error);
      reply('An error occurred while processing the command.');
    }
  }
};