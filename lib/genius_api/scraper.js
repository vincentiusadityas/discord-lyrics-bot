const axios = require('axios');
const cheerio = require('cheerio');

const scrapLyric = async (url) => {
    try {
        let { data } = await axios.get(url);
        const $ = await cheerio.load(data);

        let lyric = await $('div[class="lyrics"]').text().trim();
        if (!lyric) {
			lyric = ''
			$('div[class^="Lyrics__Container"]').each((i, elem) => {
				if($(elem).text().length !== 0) {
					let snippet = $(elem).html()
					.replace(/<br>/g, '\n')
					.replace(/<(?!\s*br\s*\/?)[^>]+>/gi, '');
					lyric += $('<textarea/>').html(snippet).text().trim() + '\n\n';
				}
    	    })
		}

        if (!lyric) return null;

        console.log("lyric", lyric)
		return lyric.trim();
        
    } catch (error) {
        throw error
    }
}

module.exports = { scrapLyric };