'use strict';

/*
    *
    * api.js
    * set of objects and functions designed to communicate with the deezer API
    * Exports the DeezerConnection objects, which stores all the functions needed
    * Author : Grégoire
    * 
*/

const https = require('https');
const download = require('./downloader')

/**
 * A shorthand function used to make async request to Deezer's API
 * 
 * @function get
 * @async
 * @param {Object} param
 * @param {string} [param.hostname='www.deezer.com']
 * @param {string} param.path
 * @param {Object} [param.cookies={}]
 * @param {string} [param.body='']
 * @param {boolean} [param.parse=true] - should the function return raw data or parse it to SJON ?
 * @param {string} [param.method='POST'] 
 * @returns {Promise} - The response promised by the requesy
 */
const get = async ({ hostname = 'www.deezer.com', path, cookies = {}, body = '', parse = true, method = 'POST' }) => {
    if (typeof body == 'object') body = JSON.stringify(body);

    // Parsing the cookies, which came in the form of a JSON {"name1": "value1", "name2", "value2"} into name1=value1;name2=value2;
    let parsedCookies = '';
    for (const key in cookies) {
        if (Object.hasOwnProperty.call(cookies, key)) {
            const element = cookies[key];
            parsedCookies += `${key}=${element};`;
        }
    }
    // Parses options
    let options = {
        hostname,
        path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Lenght': body.length,
            'Cookie': parsedCookies
        }
    }

    // Wrapping the request inside a Promise

    return new Promise((resolve, reject) => {
        // Performing the request
        let req = https.request(options, res => {
            let sum = '';
            res.on('data', data => {
                sum += data;
            })
            res.on('end', () => {
                if (parse) sum = JSON.parse(sum);
                resolve(sum)
            });

        });

        req.on('error', err => {
            reject(err)
        })

        req.write(body);
        req.end();
    })
}

/**
 * @class
 * @classdesc The connection object, storing credentials and requests
 */
class DeezerConnection {
    
    // TODO : Should be replaced with legit API tokens

    /**
     * Generates API token
     * 
     * @returns {this}
     */
    async auth() {
        let json = await get({
            path: '/ajax/gw-light.php?method=deezer.getUserData&input=3&api_version=1.0&api_token='
        })
        let credentials = {
            sid: json.results.SESSION_ID,
            api_token: json.results.checkForm,
            license_token: json.results.USER.OPTIONS.license_token
        };
        this.credentials = credentials
        return this;
    }

    /**
     * Makes text search queries
     * 
     * @param {string} text
     * @returns {Object}
     */
    async query(text) {
        let results = await get({
            path: `/ajax/gw-light.php?method=deezer.pageSearch&input=3&api_version=1.0&api_token=${this.credentials.api_token}`,
            cookies: { 'sid': this.credentials.sid },
            body: { "query": text, "start": 0, "nb": 40, "suggest": true, "artist_suggest": true, "top_tracks": true }
        });

        results = results.results;

        // let artists = []

        // for (let i = 0; i < results.ARTIST.data.length; i++) {
        //     const a = results.ARTIST.data[i];
        //     let artist = {
        //         name: a.ART_NAME,
        //         picture: a.ART_PICTURE,
        //         id: a.ART_ID,
        //     }
        //     artists.push(artist);
        // }

        let tracks = []

        for (let i = 0; i < results.TRACK.data.length; i++) {
            const t = results.TRACK.data[i];
            let artist = {
                name: t.ART_NAME,
                picture: t.ART_PICTURE,
                id: t.ART_ID,
            }
            let album = {
                title: t.ALB_TITLE,
                id: t.ALB_TITLE,
                picture: t.ALB_PICTURE,
            }
            let track = {
                title: t.SNG_TITLE,
                artist: artist,
                album: album,
                id: t.SNG_ID,
                token: t.TRACK_TOKEN
            }
            tracks.push(track);
        }

        return tracks;
    };

    /**
     * Gets a list of text autocompletion based on a provided text
     * 
     * @param {string} text 
     * @returns {Object}
     */
    async suggest(text) {
        return await get({
            path: `/ajax/gw-light.php?method=search_getSuggestedQueries&input=3&api_version=1.0&api_token=${this.credentials.api_token}`,
            cookies: { 'sid': this.credentials.sid },
            body: { "QUERY": text }
        });
    };

    /**
     * Gets a mix from a track
     * 
     * @param {string} songID 
     * @param {boolean} [startWithInputTrack=true] 
     * @returns {Object}
     */
    async mix(songID, startWithInputTrack = true) {
        return await get({
            path: `/ajax/gw-light.php?method=song.getSearchTrackMix&input=3&api_version=1.0&api_token=${this.credentials.api_token}`,
            body: { "sng_id": songID, "start_with_input_track": startWithInputTrack }
        })
    };

    /**
     * Return a buffer containing MP3 file of the track
     * 
     * @todo Change the return value to be a Track object
     * @param {string} trackID 
     * @param {string} trackToken 
     * @returns {Buffer}
     */
    async track(trackID, trackToken) {
        let data =  await get({
            hostname: 'media.deezer.com',
            path: `/v1/get_url`,
            body: {
                "license_token": this.credentials.license_token,
                "media": [{
                    "type": "FULL",
                    "formats": [{ "cipher": "BF_CBC_STRIPE", "format": "MP3_128" }, { "cipher": "BF_CBC_STRIPE", "format": "MP3_64" }, { "cipher": "BF_CBC_STRIPE", "format": "MP3_MISC" }]
                }],
                "track_tokens": [trackToken]
            }
        })
        let url = data.data[0].media[0].sources[0].url;
        let decodedTrack = await download(url, trackID);
        return decodedTrack;
    };

    /**
     * Gets the data of a list of tracks (artist, album...)
     * 
     * @param {String[]} tracksIDs 
     * @returns {Object}
     */
    async tracksData(tracksIDs) {
        return await get({
            path: `/ajax/gw-light.php?method=song.getListData&input=3&api_version=1.0&api_token=${this.credentials.api_token}`,
            body: { "sng_ids": tracksIDs }
        })
    };

    /**
     * Gets the data of an artist
     * 
     * @param {string} artistID 
     * @returns {Object}
     */
    async artistData(artistID) {
        return await get({
            path: `/ajax/gw-light.php?method=deezer.pageArtist&input=3&api_version=1.0&api_token=${this.credentials.api_token}`,
            body: { "art_id": artistID, "lang": "us", "tab": 0 }
        })
    };

    /**
     * Gets the data of an album
     * 
     * @param {string} albumID 
     * @returns {Object}
     */
    async albumData(albumID) {
        return await get({
            path: `/ajax/gw-light.php?method=deezer.pageArtist&input=3&api_version=1.0&api_token=${this.credentials.api_token}`,
            body: { "alb_id": albumID, "lang": "us", "tab": 0, "header": true }
        })
    };

    /**
     * Gets the songs from a playlist
     * 
     * @param {string} playlistID 
     */
    async playlistData(playlistID) {
        return await get({
            path: `/ajax/gw-light.php?method=deezer.pagePlaylist&input=3&api_version=1.0&api_token=${this.credentials.api_token}`,
            body: { "nb": 2000, "start": 0, "playlist_id": playlistID, "lang": "us", "tab": 0, "tags": true, "header": true }
        })
    };
}

module.exports = new DeezerConnection;