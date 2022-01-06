const Wit = require('./Wit');

class WitEntity {
    #client;

    /**
     * Entity from Wit.ai by Facebook Inc.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {WitEntity} entity API entity to convert to a WitEntity.
     */
    constructor(client, entity) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {string} ID of the entity. */
        this.id = entity && typeof entity.id === 'string' ? entity.id : '';

        /** @type {string} Name. For built-in entities, use the wit$ prefix. */
        this.name = entity && typeof entity.name === 'string' ? entity.name : '';

        /** @type {[ "free-text", "keywords" ]} List of lookup strategies (free-text, keywords). */
        this.lookups = entity && entity.lookups && entity.lookups.length ? entity.lookups : [];

        const JSDOC_WERM = require('./jsdoc/JSDOC_WERM');
        const WitEntityRolesManager = require('./WitEntityRolesManager');
        /** @type {string[]&JSDOC_WERM} List of roles. A default role is always created at entity creation. */
        this.roles = new WitEntityRolesManager(this, entity && entity.roles && entity.roles.length ? entity.roles : []);

        const WitEntityKeyword = require('./WitEntityKeyword');
        const JSDOC_WEKM = require('./jsdoc/JSDOC_WEKM');
        const WitEntityKeywordsManager = require('./WitEntityKeywordsManager');
        /** @type {WitEntityKeyword[]&JSDOC_WEKM} List of keywords and synonyms. */
        this.keywords = new WitEntityKeywordsManager(this, entity && entity.keywords && entity.keywords.length ? entity.keywords : []);
    }

    /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
    get client() { return this.#client; }

    /**
     * Updates the attributes of the entity.
     * @param {Object} options Attributes to update the new entity with.
     * @param {[ string ]} options.roles List of roles you want to create for the entity. A default role will always be created.
     * @param {[ "free-text"|"keywords" ]} options.lookups List of lookup strategies (free-text, keywords).
     * @param {[ { keyword: string, synonyms: [ string ] } ]} options.keywords List of keywords.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#put__entities__entity_link
     */
    async update(options) {
        const WE = this;

        return new Promise(function(resolve, reject) {
            options = options && typeof options === 'object' ? options : {};
            options.roles = options.roles && typeof options.roles === 'object' ? options.roles : [ ...WE.roles ];
            options.lookups = options.lookups && typeof options.lookups === 'object' ? options.lookups : [ ...WE.lookups ];
            options.keywords = options.keywords && typeof options.keywords === 'object' ? options.keywords : [ ...WE.keywords ];

            WE.#client.entities.update(WE.name, options).then(resolve).catch(reject);
        });
    }

    /**
     * Permanently deletes the entity.
     * @returns {Promise<Wit.entities>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_link
     */
    async delete() {
        const WE = this;
        return new Promise(function(resolve, reject) { WE.#client.entities.delete(WE.name).then(resolve).catch(reject); });
    }

    /**
     * Creates a new role for the entity.
     * @param {string} name Name of the role to create.
     * @returns {Promise<WitEntity>}
     */
     async createRole(name) {
        const WE = this;
        return new Promise(function(resolve, reject) { WE.roles.create(name).then(resolve).catch(reject); });
    }

    /**
     * Permanently deletes the role associated with the entity. When the role is the last one of the entity, the entity is also deleted.
     * @param {Object} name Name of the role to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_role_link
     */
    async deleteRole(name) {
        const WE = this;
        return new Promise(function(resolve, reject) { WE.roles.delete(name).then(resolve).catch(reject); });
    }

    /**
     * Adds a possible value into the list of keywords for the entity.
     * @param {Object} options Options to create the keyword with.
     * @param {string} options.keyword Canonical value of the keyword.
     * @param {[ string ]} options.synonyms Ways of expressing, or aliases for this canonical value.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities__entity_keywords_link
     */
    async createKeyword(options) {
        const WE = this;
        return new Promise(function(resolve, reject) { WE.keywords.create(options).then(resolve).catch(reject); });
    }

    /**
     * Deletes a keyword from the entity.
     * @param {string} name Name of the keyword to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_link
     */
    async deleteKeyword(name) {
        const WE = this;
        return new Promise(function(resolve, reject) { WE.keywords.delete(name).then(resolve).catch(reject); });
    }

    /**
     * Create a new synonym of the canonical value of the keywords entity. This API is limited to synonyms shorter than 280 characters.
     * @param {string} keyword Name of keyword to own the synonym.
     * @param {string} synonym New synonym for the keyword of the entity. Must be shorter than 280 characters.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities__entity_keywords__keyword_synonyms_link
     */
    async createSynonym(keyword, synonym) {
        const WE = this;
        return new Promise(function(resolve, reject) { WE.keywords.createSynonym(keyword, synonym).then(resolve).catch(reject); });
    }

    /**
     * Delete a synonym of the keyword of the entity.
     * @param {string} keyword Name of keyword owning the synonym.
     * @param {string} synonym Name of the synonym to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_synonyms__synonym_link
     */
    async deleteSynonym(keyword, synonym) {
        const WE = this;
        return new Promise(function(resolve, reject) { WE.keywords.deleteSynonym(keyword, synonym).then(resolve).catch(reject); });
    }
}

module.exports = WitEntity