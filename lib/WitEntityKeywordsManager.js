const WitEntity = require('./WitEntity');
const WitEntityKeyword = require('./WitEntityKeyword');

class WitEntityKeywordsManager extends Array {
    #entity;

    /**
     * Manager for the entity keywords.
     * @param {WitEntity} entity Entity the keywords belongs to.
     * @param {WitEntityKeyword[]} keywords List of keywords to init the manager with.
     */
    constructor(entity, keywords) {
        super(...keywords.map(function(k) { return new WitEntityKeyword(entity, k); }));

        /** @type {WitEntity} Entity the keywords belongs to. */
        this.#entity = entity;
    }

    /**
     * Adds a possible value into the list of keywords for the entity.
     * @param {Object} options Options to create the keyword with.
     * @param {string} options.keyword Canonical value of the keyword.
     * @param {string[]} options.synonyms Ways of expressing, or aliases for this canonical value.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities__entity_keywords_link
     */
    async create(options) {
        const WEKM = this;

        return new Promise(function(resolve, reject) {
            options = options && typeof options === 'object' && typeof options.keyword === 'string' ? options : { 'keyword': '', 'synonyms': [ '' ] };
            if (!options.synonyms.includes(options.keyword)) { options.synonyms = [ options.keyword ].concat(options.synonyms); }

            WEKM.#entity.client.fetch(`/entities/${encodeURI(WEKM.#entity.name)}/keywords`, {
                'method': 'POST',
                'body': JSON.stringify(Object.assign({}, options))
            }).then(function() {
                WEKM.#entity.client.entities.fetch({ 'name': WEKM.#entity.name, 'cache': false })
                .then(function(e) { return resolve(e[0]); }).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Deletes a keyword from the entity.
     * @param {string} name Name of the keyword to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_link
     */
    async delete(name) {
        const WEKM = this;

        return new Promise(function(resolve, reject) {
            WEKM.#entity.client.fetch(`/entities/${encodeURI(WEKM.#entity.name)}/keywords/${encodeURI(name)}`, { 'method': 'DELETE' }).then(function() {
                WEKM.#entity.client.entities.fetch({ 'name': WEKM.#entity.name, 'cache': false })
                .then(function(e) { return resolve(e[0]); }).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Create a new synonym of the canonical value of the keywords entity. This API is limited to synonyms shorter than 280 characters.
     * @param {string} keyword Name of keyword to own the synonym.
     * @param {string} synonym New synonym for the keyword of the entity. Must be shorter than 280 characters.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities__entity_keywords__keyword_synonyms_link
     */
    async createSynonym(keyword, synonym) {
        const WEKM = this;

        return new Promise(function(resolve, reject) {
            WEKM.#entity.client.fetch(`/entities/${encodeURI(WEKM.#entity.name)}/keywords/${encodeURI(keyword)}/synonyms`, {
                'method': 'POST',
                'body': JSON.stringify({ 'synonym': synonym })
            }).then(function() {
                WEKM.#entity.client.entities.fetch({ 'name': WEKM.#entity.name, 'cache': false })
                .then(function(e) { return resolve(e[0]); }).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Delete a synonym of the keyword of the entity.
     * @param {string} keyword Name of keyword owning the synonym.
     * @param {string} synonym Name of the synonym to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_synonyms__synonym_link
     */
    async deleteSynonym(keyword, synonym) {
        const WEKM = this;

        return new Promise(function(resolve, reject) {
            WEKM.#entity.client.fetch(`/entities/${encodeURI(WEKM.#entity.name)}/keywords/${encodeURI(keyword)}/synonyms/${encodeURI(synonym)}`, { 'method': 'DELETE' }).then(function() {
                WEKM.#entity.client.entities.fetch({ 'name': WEKM.#entity.name, 'cache': false })
                .then(function(e) { return resolve(e[0]); }).catch(reject);
            }).catch(reject);
        });
    }
}

module.exports = WitEntityKeywordsManager;