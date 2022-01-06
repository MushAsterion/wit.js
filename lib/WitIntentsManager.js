const Wit = require('./Wit');
const WitIntent = require('./WitIntent');

class WitIntentsManager {
    #client;

    /**
     * Manager for the client intents.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {[ string, WitIntent ][]} intents List of intents to init the manager with.
     */
    constructor(client, intents) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {Map.<string, WitIntent>} Cache for intents to reduce API calls. */
        this.cache = new Map(intents ? intents.map(function(i) { return [ i[0], new WitIntent(client, i[1]) ]; }) : []);    
    }

    /**
     * Returns the list of intents for the app. If no name property is set it will fetch all intents. Default is fetched from client cache, use cache attribute to fetch from API. It returns an array even when you look for a single entity.
     * @param {Object} options Options for fetching a single intent. If no options parsed it will fetch all intents.
     * @param {string} options.name Name for the intent to fetch. If no name is provided it will return all intents fetched from the API and cache will be ignored.
     * @param {boolean} options.cache Whether or not ignore cache when looking for an unique intent name. All intents are already fetched from API. Default is true (fetch names from cache).
     * @returns {Promise<WitIntent[]>}
     * @link https://wit.ai/docs/http/#get__intents_link
     * @link https://wit.ai/docs/http/#get__intents__intent_link
     */
    async fetch(options = { 'name': '', 'cache': true }) {
        const WIM = this;

        return new Promise(function(resolve, reject) {
            if (typeof options === 'string') {
                if (options.startsWith('wit/')) { options = options.replace('wit/', 'wit$'); }

                if (WIM.cache.has(options)) { resolve(WIT.cache.get(options)); }
                else {
                    WIM.#client.fetch(`/intents/${encodeURI(options)}`).then(function(intent) {
                        WIM.cache.set(intent.name, new WitIntent(WIM.#client, intent));
                        resolve([ WIM.cache.get(intent.name) ]);
                    }).catch(reject);
                }
            }
            else {
                options = options && typeof options === 'object' ? options : {};
                options.name = typeof options.name === 'string' ? options.name : '';
                options.cache = options.cache === false ? false : true;

                if (typeof options.name === 'string' && options.name.startsWith('wit/')) { options.name = options.name.replace('wit/', 'wit$'); }

                if (options.name && options.cache && WIM.cache.has(options.name)) { resolve(WIT.cache.get(options.name)); }
                else if (options.name) {
                    WIM.cache.delete(options.name);
                    WIM.#client.fetch(`/intents/${encodeURI(options.name)}`).then(function(intent) {
                        WIM.cache.set(intent.name, new WitIntent(WIM.#client, intent));
                        resolve([ WIM.cache.get(intent.name) ]);
                    }).catch(reject);
                }
                else {
                    WIM.cache.clear();
                    WIM.#client.fetch('/intents').then(function(intents) {
                        Promise.all(intents.map(function(intent) {
                            return WIM.fetch({ 'name': intent.name, 'cache': false });
                        })).then(function(intents) { resolve([ ...WIM.cache.values() ]); }).catch(reject);
                    }).catch(reject);
                }
            }
        });
    }

    /**
     * Creates a new intent with the given attributes.
     * @param {Object} options Attributes to create the new intent with.
     * @param {string} options.name Name for the intent.
     * @returns {Promise<WitIntent>}
     * @link https://wit.ai/docs/http/#post__intents_link
     */
    async create(options) {
        const WIM = this;

        return new Promise(function(resolve, reject) {
            if (options && typeof options.name === 'string' && options.name.startsWith('wit/')) { options.name = options.name.replace('wit/', 'wit$'); }

            WIM.#client.fetch('/intents', {
                'method': 'POST',
                'body': JSON.stringify(options && typeof options === 'object' ? options : {})
            }).then(function(intent) {
                WIM.cache.set(intent.name, new WitIntent(WIM.#client, intent));
                resolve(WIM.cache.get(intent.name));
            }).catch(reject);
        });
    }

    /**
     * Permanently deletes the intent.
     * @param {string} name Name of the intent to delete.
     * @returns {Promise<WitIntentsManager>}
     * @link https://wit.ai/docs/http/#delete__intents__intent_link
     */
    async delete(name) {
        const WIM = this;

        return new Promise(function(resolve, reject) {
            if (typeof name === 'string' && name.startsWith('wit/')) { name = name.replace('wit/', 'wit$'); }

            WIM.cache.delete(name);
            WIM.#client.fetch(`/intents/${encodeURI(name)}`, { 'method': 'DELETE' }).then(function() { resolve(WIM); }).catch(reject);
        });
    }
}

module.exports = WitIntentsManager;