const axios = require('axios');
const cheerio = require('cheerio');

const linkTool = async (url) => {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        // Extract relevant information
        const title = $('head > title').text();
        const description = $('meta[name="description"]').attr('content');
        const ogTitle = $('meta[property="og:title"]').attr('content');
        const ogDescription = $('meta[property="og:description"]').attr('content');
        const ogImage = $('meta[property="og:image"]').attr('content');

        return {
            success: 1,
            meta: {
                title: ogTitle || title,
                description: ogDescription || description,
                image: {
                    url: ogImage,
                },
                url
            },
        }
    } catch (error) {
        console.log("Error while fetching data", error);
        return null;
    }
}

module.exports = { linkTool };