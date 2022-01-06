const Wit = require('./Wit');
const WitEntity = require('./WitEntity');

class WitEntitiesManager {
    #client;

    /**
     * Manager for the client entities.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {[ string, WitEntity ][]} entities List of entities to init the manager with.
     */
    constructor(client, entities) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {Map.<string, WitEntity>} Cache for entities to reduce API calls. */
        this.cache = new Map(entities ? entities.map(function(e) { return [ e[0], new WitEntity(client, e[1]) ] }) : []);
    }

    /**
     * Returns the list of entities for the app. If no name property is set it will fetch all entities. Default is fetched from client cache, use cache attribute to fetch from API. It returns an array even when you look for a single entity.
     * @param {Object} options Options for fetching a single entity. If no options parsed it will fetch all entities.
     * @param {string} options.name Name for the entity to fetch. If no name is provided it will return all entities fetched from the API and cache will be ignored.
     * @param {boolean} options.cache Whether or not ignore cache when looking for an unique entity name. All entities are already fetched from API. Default is true (fetch names from cache).
     * @returns {Promise<WitEntity[]>}
     * @link https://wit.ai/docs/http/#get__entities_link
     * @link https://wit.ai/docs/http/#get__entities__entity_link
     */
    async fetch(options = { 'name': '', 'cache': true }) {
        const WEM = this;

        return new Promise(function(resolve, reject) {
            if (typeof options === 'string') {
                if (options.startsWith('wit/')) { options = options.replace('wit/', 'wit$'); }

                if (WEM.cache.has(options)) { resolve(WEM.cache.get(options)); }
                else {
                    WEM.#client.fetch(`/entities/${encodeURI(options)}`).then(function(entity) {
                        WEM.cache.set(entity.name, new WitEntity(WEM.#client, entity));
                        resolve([ WEM.cache.get(entity.name) ]);
                    }).catch(reject);
                }
            }
            else {
                options = options && typeof options === 'object' ? options : {};
                options.name = typeof options.name === 'string' ? options.name : '';
                options.cache = options.cache === false ? false : true;

                if (typeof options.name === 'string' && options.name.startsWith('wit/')) { options.name = options.name.replace('wit/', 'wit$'); }
    
                if (options.name && options.cache && WEM.cache.has(options.name)) { resolve(WEM.cache.get(options.name)); }
                else if (options.name) {
                    WEM.cache.delete(options.name);
                    WEM.#client.fetch(`/entities/${encodeURI(options.name)}`).then(function(entity) {
                        WEM.cache.set(entity.name, new WitEntity(WEM.#client, entity));
                        resolve([ WEM.cache.get(entity.name) ]);
                    }).catch(reject);
                }
                else {
                    WEM.cache.clear();
                    WEM.#client.fetch('/entities').then(function(entities) {
                        Promise.all(entities.map(function(entity) {
                            return WEM.fetch({ 'name': entity.name, 'cache': false });
                        })).then(function(entities) { resolve([ ...WEM.cache.values() ]); }).catch(reject);
                    }).catch(reject);
                }
            }
        });
    }

    /**
     * Creates a new entity with the given attributes.
     * @param {Object} options Attributes to create the new entity with.
     * @param {string} options.name Name for the entity. For built-in entities, use the wit$ prefix.
     * @param {string[]} options.roles List of roles you want to create for the entity. A default role will always be created.
     * @param {[ "free-text"|"keywords" ]} options.lookups List of lookup strategies (free-text, keywords).
     * @param {{ keyword: string, synonyms: [ string ] }[]} options.keywords List of keywords.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities_link
     */
    async create(options) {
        const WEM = this;

        return new Promise(function(resolve, reject) {
            options && typeof options === 'object' ? options : {};
            options.name = options.name && typeof options.name === 'string' ? options.name : 'new_entity';
            options.roles = options.roles && typeof options.roles === 'object' ? options.roles : [];

            if (typeof options.name === 'string' && options.name.startsWith('wit/')) { options.name = options.name.replace('wit/', 'wit$'); }

            WEM.#client.fetch('/entities', {
                'method': 'POST',
                'body': JSON.stringify(options)
            }).then(function(entity) {
                WEM.cache.set(entity.name, new WitEntity(WEM.#client, entity));
                resolve(WEM.cache.get(entity.name));
            }).catch(reject);
        });
    }

    /**
     * Updates the attributes of an entity.
     * @param {string} name Name of the entity to update
     * @param {Object} options Attributes to update the new entity with.
     * @param {string[]} options.roles List of roles you want to create for the entity. A default role will always be created.
     * @param {[ "free-text"|"keywords" ]} options.lookups List of lookup strategies (free-text, keywords).
     * @param {{ keyword: string, synonyms: [ string ] }[]} options.keywords List of keywords.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#put__entities__entity_link
     */
    async update(name, options) {
        const WEM = this;

        return new Promise(function(resolve, reject) {
            if (typeof name === 'string' && name.startsWith('wit/')) { name = name.replace('wit/', 'wit$'); }

            WEM.cache.delete(name);
            WEM.#client.fetch(`/entities/${encodeURI(name)}`, {
                'method': 'PUT',
                'body': JSON.stringify(Object.assign({}, options && typeof options === 'object' ? options : {}, { 'name': name }))
            }).then(function(entity) {
                WEM.cache.set(entity.name, new WitEntity(WEM.#client, entity));
                resolve(WEM.cache.get(entity.name));
            }).catch(reject);
        });
    }

    /**
     * Permanently deletes the entity.
     * @param {string} name Name of the entity to delete.
     * @returns {Promise<WitEntitiesManager>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_link
     */
    async delete(name) {
        const WEM = this;

        return new Promise(function(resolve, reject) {
            if (typeof name === 'string' && name.startsWith('wit/')) { name = name.replace('wit/', 'wit$'); }

            WEM.cache.delete(name);
            WEM.#client.fetch(`/entities/${encodeURI(name)}`, { 'method': 'DELETE' }).then(function(e) { resolve(WEM); }).catch(reject);
        });
    }
}

module.exports = WitEntitiesManager;