const axios = require("axios");

module.exports = {
    eurix: {
        name: "google",
        version: "1.0.0",
        credits: "Eugene Aguilar",
        description: "Searches Google for the provided query.",
        permission: 0,
        usages: "[query]",
        cooldown: 5,
    },

    execute: async function ({ api, event, args, reply }) {
        if (args.length === 0) {
            return reply("Please provide a search query.");
        }

        const query = args.join(" ");
        const searchUrl = `https://eugene-restapi.onrender.com/api/google/search?search=${encodeURIComponent(query)}`;

        try {
            const response = await axios.get(searchUrl);
            const data = response.data;

            if (data && data.organic && data.organic.length > 0) {
                let message = `Search results for "${query}":\n\n`;
                data.organic.slice(0, 5).forEach((result, index) => {
                    message += `${index + 1}. ${result.title}\n${result.link}\n${result.description}\n\n`;
                });

                reply(message);
            } else {
                reply("No results found.");
            }
        } catch (error) {
            console.error("Error fetching search results: ", error);
            reply("There was an error fetching the search results.");
        }
    }
};
