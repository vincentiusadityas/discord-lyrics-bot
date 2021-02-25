const axios = require('axios');
const { scrapLyric } = require('./scraper')

const search_url = 'https://api.genius.com/search?q=';
const access_token = process.env.GENIUS_API_ACCESS_TOKEN;

const searchSong = async (query) => {
    try {
        const req_url = `${search_url}${encodeURIComponent(query)}`
        const headers = {
			Authorization: 'Bearer ' + access_token
		};
        let { data } = await axios.get(req_url, { headers });
        // console.log(data)
        if (data.response.hits.length === 0) return null
        const { full_title, song_art_image_url, id, url } = data.response.hits[0].result
        
        const result = { full_title, song_art_image_url, id, url }

        return result
    } catch (error) {
        throw error;
    }
}

const getLyric = async (url) => {
    return await scrapLyric(url)
}

module.exports = { searchSong, getLyric }