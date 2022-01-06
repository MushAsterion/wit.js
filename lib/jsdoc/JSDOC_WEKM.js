const WitEntity = require('../WitEntity');
const WitEntityKeyword = require('../WitEntityKeyword');

class JSDOC_WEKM {
    #entity;

    /**
     * Manager for the entity keywords.
     * @param {WitEntity} entity Entity the keywords belongs to.
     * @param {WitEntityKeyword[]} keywords List of keywords to init the manager with.
     */
    constructor(entity, keywords) { }

    /**
     * Adds a possible value into the list of keywords for the entity.
     * @param {Object} options Options to create the keyword with.
     * @param {string} options.keyword Canonical value of the keyword.
     * @param {string[]} options.synonyms Ways of expressing, or aliases for this canonical value.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities__entity_keywords_link
     */
    async create(options) { }

    /**
     * Deletes a keyword from the entity.
     * @param {string} name Name of the keyword to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_link
     */
    async delete(name) { }

    /**
     * Create a new synonym of the canonical value of the keywords entity. This API is limited to synonyms shorter than 280 characters.
     * @param {string} keyword Name of keyword to own the synonym.
     * @param {string} synonym New synonym for the keyword of the entity. Must be shorter than 280 characters.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities__entity_keywords__keyword_synonyms_link
     */
    async createSynonym(keyword, synonym) { }

    /**
     * Delete a synonym of the keyword of the entity.
     * @param {string} keyword Name of keyword owning the synonym.
     * @param {string} synonym Name of the synonym to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_synonyms__synonym_link
     */
    async deleteSynonym(keyword, synonym) { }
}

module.exports = JSDOC_WEKM;