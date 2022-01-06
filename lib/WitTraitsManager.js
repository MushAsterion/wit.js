const Wit = require('./Wit');
const WitTrait = require('./WitTrait');

class WitTraitsManager {
    #client;

    /**
     * Manager for the client traits.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {[ string, WitTrait ][]} traits List of traits to init the manager with.
     */
    constructor(client, traits) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {Map.<string, WitTrait>} Cache for traits to reduce API calls. */
        this.cache = new Map(traits ? traits.map(function(e) { return [ e[0], new WitTrait(client, e[1]) ] }) : []);
    }

    /**
     * Returns the list of traits for the app. If no name property is set it will fetch all traits. Default is fetched from client cache, use cache attribute to fetch from API. It returns an array even when you look for a single trait.
     * @param {Object} options Options for fetching a single trait. If no options parsed it will fetch all traits.
     * @param {string} options.name Name for the trait to fetch. If no name is provided it will return all traits fetched from the API and cache will be ignored.
     * @param {boolean} options.cache Whether or not ignore cache when looking for an unique trait name. All traits are already fetched from API. Default is true (fetch names from cache).
     * @returns {Promise<WitTrait[]>}
     * @link https://wit.ai/docs/http/#get__traits_link
     * @link https://wit.ai/docs/http/#get__traits__trait_link
     */
    async fetch(options = { 'name': '', 'cache': true }) {
        const WTM = this;

        return new Promise(function(resolve, reject) {
            if (typeof options === 'string') {
                if (options.startsWith('wit/')) { options = options.replace('wit/', 'wit$'); }

                if (WTM.cache.has(options)) { resolve(WTM.cache.get(options)); }
                else {
                    WTM.#client.fetch(`/traits/${encodeURI(options)}`).then(function(trait) {
                        WTM.cache.set(trait.name, new WitTrait(WTM.#client, trait));
                        resolve([ WTM.cache.get(trait.name) ]);
                    }).catch(reject);
                }
            }
            else {
                options = options && typeof options === 'object' ? options : {};
                options.name = typeof options.name === 'string' ? options.name : '';
                options.cache = options.cache === false ? false : true;

                if (typeof options.name === 'string' && options.name.startsWith('wit/')) { options.name = options.name.replace('wit/', 'wit$'); }

                if (options.name && options.cache && WTM.cache.has(options.name)) { resolve(WTM.cache.get(options.name)); }
                else if (options.name) {
                    WTM.cache.delete(options.name);
                    WTM.#client.fetch(`/traits/${encodeURI(options.name)}`).then(function(trait) {
                        WTM.cache.set(trait.name, new WitTrait(WTM.#client, trait));
                        resolve([ WTM.cache.get(trait.name) ]);
                    }).catch(reject);
                }
                else {
                    WTM.cache.clear();
                    WTM.#client.fetch('/traits').then(function(traits) {
                        Promise.all(traits.map(function(trait) {
                            return WTM.fetch({ 'name': trait.name, 'cache': false });
                        })).then(function(traits) { resolve([ ...WTM.cache.values() ]); }).catch(reject);
                    }).catch(reject);
                }
            }
        });
    }

    /**
     * Creates a new trait with the given attributes.
     * @param {Object} options Attributes to create the new trait with.
     * @param {string} options.name Name for the trait. For built-in traits, use the wit$ prefix.
     * @param {string[]} options.values List of values you want to create for the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#post__traits_link
     */
    async create(options) {
        const WTM = this;

        return new Promise(function(resolve, reject) {
            options && typeof options === 'object' ? options : {};
            options.name = options.name && typeof options.name === 'string' ? options.name : 'new_trait';
            options.values = options.values && typeof options.values === 'object' ? options.values : [];

            if (typeof options.name === 'string' && options.name.startsWith('wit/')) { options.name = options.name.replace('wit/', 'wit$'); }

            WTM.#client.fetch('/traits', {
                'method': 'POST',
                'body': JSON.stringify(options)
            }).then(function(trait) {
                WTM.cache.set(trait.name, new WitTrait(WTM.#client, trait));
                resolve(WTM.cache.get(trait.name));
            }).catch(reject);
        });
    }

    /**
     * Permanently deletes the trait.
     * @param {string} name Name of the trait to delete.
     * @returns {Promise<WitTraitsManager>}
     * @link https://wit.ai/docs/http/#delete__traits__trait_link
     */
    async delete(name) {
        const WTM = this;

        return new Promise(function(resolve, reject) {
            if (typeof name === 'string' && name.startsWith('wit/')) { name = name.replace('wit/', 'wit$'); }

            WTM.cache.delete(name);
            WTM.#client.fetch(`/traits/${encodeURI(name)}`, { 'method': 'DELETE' }).then(function(e) { resolve(WTM); }).catch(reject);
        });
    }

    /**
     * Creates a new value for the trait.
     * @param {string} name Name of the trait to add the value to.
     * @param {string} value Canonical value of the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#post__traits__trait_values_link
     */
    async createValue(trait, value) {
        const WTM = this;

        return new Promise(function(resolve, reject) {
            if (typeof trait === 'string' && trait.startsWith('wit/')) { trait = trait.replace('wit/', 'wit$'); }

            WTM.#client.fetch(`/traits/${encodeURI(trait)}/values`, {
                'method': 'POST',
                'body': JSON.stringify({ 'value': value })
            }).then(function() {
                WTM.fetch({ 'name': trait, 'cache': false })
                .then(function(e) { return resolve(e[0]); }).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Permanently deletes the trait value.
     * @param {string} name Name of the trait to remove the value from.
     * @param {string} value Canonical value of the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#delete__traits__trait_values_link
     */
    async deleteValue(trait, value) {
        const WTM = this;

        return new Promise(function(resolve, reject) {
            if (typeof trait === 'string' && trait.startsWith('wit/')) { trait = trait.replace('wit/', 'wit$'); }

            WTM.#client.fetch(`/traits/${encodeURI(trait)}/values/${encodeURI(value)}`, { 'method': 'DELETE' }).then(function() {
                WTM.fetch({ 'name': trait, 'cache': false })
                .then(function(e) { return resolve(e[0]); }).catch(reject);
            }).catch(reject);
        });
    }
}

module.exports = WitTraitsManager;