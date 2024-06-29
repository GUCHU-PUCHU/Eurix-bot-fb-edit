module.exports = {
eurix: {
  name: "pending",
  description: "Get the list of pending users and groups",
  credits: "Eugene Aguilar",
  usages: "[]",
  permission: 1,
},

execute: async function ({ api, event }) {
  const pendingGroups = await api.getThreadList(100, null, ['PENDING']);
  const pendingUsers = [];
  const pendingGroupsList = [];

  pendingGroups.forEach(group => {
    if (group.isGroup) {
      pendingGroupsList.push(`Group Name: ${group.name}\nGroup ID: ${group.threadID}`);
    } else {
      pendingUsers.push(`User Name: ${group.name}\nUser ID: ${group.threadID}`);
    }
  });

  if (pendingGroupsList.length > 0 || pendingUsers.length > 0) {
    let message = "";
    if (pendingUsers.length > 0) {
      message += `List of pending users:\n\n${pendingUsers.join("\n")}\n\n`;
    }
    if (pendingGroupsList.length > 0) {
      message += `List of pending groups:\n\n${pendingGroupsList.join("\n")}\n\n`;
    }

    message += "Use command "+global.config.prefix+"approve [group id] or [user id] to approve group/user.";

    api.sendMessage(message, event.threadID, event.messageID);
  } else {
    api.sendMessage("There are no pending users or groups.", event.threadID, event.messageID);
  }
}
}
