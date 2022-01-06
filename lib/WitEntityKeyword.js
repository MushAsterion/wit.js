const WitEntity = require('./WitEntity');

class WitEntityKeyword {
    #entity;

    /**
     * Keyword from Wit.ai by Facebook Inc.
     * @param {WitEntity} entity Entity the keywords belongs to.
     * @param {WitEntityKeyword} keyword API keyword to convert to a WitEntityKeyword.
     */
    constructor(entity, keyword) {
        /** @type {WitEntity} The entity this keyword belongs to. */
        this.#entity = entity;

        /** @type {string} Name. */
        this.keyword = keyword && typeof keyword.keyword === 'string' ? keyword.keyword : '';

        const JSDOC_WEKSM = require('./jsdoc/JSDOC_WEKSM');
        const WitEntityKeywordSynonymsManager = require('./WitEntityKeywordSynonymsManager');
        /** @type {string[]&JSDOC_WEKSM} Keyword synonyms. */
        this.synonyms = new WitEntityKeywordSynonymsManager(this, keyword && typeof keyword.synonyms === 'object' && typeof keyword.synonyms.length ? keyword.synonyms : []);
    }

    /**
     * @type {function} Deletes a keyword from the entity.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_link
     */
    async delete() {
        const WK = this;
        return new Promise(function(resolve, reject) { WK.#entity.deleteKeyword(WK.keyword).then(resolve).catch(reject); });
    };

    /**
     * @type {function} Create a new synonym of the canonical value of the keywords entity. This API is limited to synonyms shorter than 280 characters.
     * @param {string} synonym New synonym for the keyword of the entity. Must be shorter than 280 characters.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#post__entities__entity_keywords__keyword_synonyms_link
     */
    async createSynonym(synonym) {
        const WK = this;
        return new Promise(function(resolve, reject) { WK.#entity.createSynonym(WK.keyword, synonym).then(resolve).catch(reject); });
    };

    /**
     * @type {function} Delete a synonym of the keyword of the entity.
     * @param {string} synonym Name of the synonym to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_keywords__keyword_synonyms__synonym_link
     */
    async deleteSynonym(synonym) {
        const WK = this;
        return new Promise(function(resolve, reject) { WK.#entity.deleteSynonym(WK.keyword, synonym).then(resolve).catch(reject); });
    };
}

module.exports = WitEntityKeyword;