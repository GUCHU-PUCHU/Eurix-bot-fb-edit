const axios = require("axios");

module.exports = {
    eurix: {
        name: "test",
        version: "1.0.0",
        description: "Evaluates JavaScript code.",
        permission: 2,
        credits: "Eugene Aguilar",
        usages: "<method> <url> [data]",
        cooldown: 0,
    },
    execute: async function ({ api, event, args, reply }) {
        if (args.length < 2) {
            return reply("Usage: <method> <url> [data]");
        }

        const method = args[0].toLowerCase();
        const url = args[1];

        let data;
        if (method === 'post' && args[2]) {
            try {
                data = JSON.parse(args[3]);
            } catch (error) {
                return reply("Invalid JSON format for POST data.");
            }
        }

        try {
            let response;
            if (method === 'get') {
                response = await axios.get(url);
            } else if (method === 'post') {
                response = await axios.post(url, data);
            } else {
                return reply("Invalid HTTP method. Use 'get' or 'post'.");
            }
            reply(`Status: ${response.status}\nData: ${JSON.stringify(response.data, null, 2)}`);
        } catch (error) {
            reply(`Error: ${error.message}`);
        }
    }
};

// Example use body post https://example.com { "uid": "4" }