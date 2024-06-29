module.exports = {
eurix : {
  name: "listadmin",
  version: '1.0.0',
  permission: 0,
  credits: "Eugenee Aguilar",
  description: "List of group administrators",
  usages: "dsqtv",
  cooldown: 5,
},

execute: async function({ api, event, args }) {
  var threadInfo = await api.getThreadInfo(event.threadID);
  let qtv = threadInfo.adminIDs.length;
  var listad = '';
  var qtv2 = threadInfo.adminIDs;
  var fs = require("fs-extra");
  dem = 1;
  for (let i = 0; i < qtv2.length; i++) {
      const info = (await api.getUserInfo(qtv2[i].id));
      const name = info[qtv2[i].id].name;
      listad += '' + `${dem++}` + '. ' + name + '\n';
  }

  api.sendMessage(
      `The list of ${qtv} administrators includes:\n${listad}`,
      event.threadID,
      event.messageID
  );
}
};
