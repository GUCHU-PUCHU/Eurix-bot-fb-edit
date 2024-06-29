const path = require("path");
const fs = require("fs");
const axios = require("axios");

module.exports = {
  eurix: {
    name: "leave",
    credits: "Eugene Aguilar",
    description: "Handle leave events in a chat application.",
  },
  handleEvent: async function ({ api, event }) {
    try {
      if (event.type === "event" && event.logMessageType === "log:unsubscribe") {
        const threadID = event.threadID;
        const leftParticipantID = event.logMessageData.leftParticipantFbId;
        const adminID = event.author;
        const botID = api.getCurrentUserID();

        const userInfo = await api.getUserInfo(leftParticipantID);
        const adminInfo = await api.getUserInfo(adminID);

        const userName = userInfo[leftParticipantID]?.name || 'Unknown User';
        const adminName = adminInfo[adminID]?.name || 'Unknown Admin';

        const threadInfo = await api.getThreadInfo(threadID);

        let leaveMessage;
        if (adminID === leftParticipantID) {
          leaveMessage = `${userName} has left the ${threadInfo.threadName}. Goodbye! 👋`;
        } else {
          leaveMessage = `${userName} was removed by ${adminName} from ${threadInfo.threadName}.`;
        }

        const memberCount = threadInfo.participantIDs.length;

        if (leftParticipantID === botID) {
          api.sendMessage(`Bot was removed by ${adminName}`, global.config.admins[0]);
        }

        const response = await axios.get(`https://tanjiro-api.onrender.com/goodbyev2?uid=${leftParticipantID}&name=${encodeURIComponent(userName)}%20Senpai&member=${memberCount}&bg=https://i.imgur.com/qschtOP.jpg&api_key=tanjiro`, { responseType: "arraybuffer" });
        const img = response.data;

        const imgPath = path.join(__dirname, "cache", `leave.png`);

        fs.writeFileSync(imgPath, img);

        api.sendMessage({ body: leaveMessage, attachment: fs.createReadStream(imgPath) }, threadID);
      }
    } catch (error) {
      console.error("Error in handleEvent: ", error);
    }
  }
};