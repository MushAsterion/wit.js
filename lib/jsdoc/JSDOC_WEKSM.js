const WitEntityKeyword = require('../WitEntityKeyword');

class JSDOC_WEKSM {
    #keyword;

    /**
     * Manager for the keyword synonyms.
     * @param {WitEntityKeyword} keyword Keyword the synonym belongs to.
     * @param {string[]} synonyms List of synonyms to init the manager with.
     */
    constructor(keyword, synonyms) { }

    /**
     * Creates a new synonym of the canonical value of the keywords entity. This API is limited to synonyms shorter than 280 characters.
     * @param {string} synonym New synonym for the keyword of the entity. Must be shorter than 280 characters.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities__entity_keywords__keyword_synonyms_link
     */
    async create(synonym) { }

    /**
     * Deletes a synonym of the keyword of the entity.
     * @param {string} synonym Name of the synonym to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_synonyms__synonym_link
     */
    async delete(synonym) { }
}

module.exports = JSDOC_WEKSM;