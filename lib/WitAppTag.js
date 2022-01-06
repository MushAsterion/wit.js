const WitApp = require('./WitApp');

class WitTag {
    #app;

    /**
     * Tag from Wit.ai by Facebook Inc.
     * @param {WitApp} app App the tags belongs to.
     * @param {WitTag} tag API tag to convert to a WitTag.
     */
    constructor(app, tag) {
        /** @type {WitApp} The app this tag belongs to. */
        this.#app = app;

        /** @type {string} Name of the version. */
        this.name = tag && typeof tag.name === 'string' ? tag.name : '';

        /** @type {string} Date and time of the tag creation (ISO8601). */
        this.created_at = tag && typeof tag.created_at === 'string' ? tag.created_at : '';

        /** @type {string} Date and time of the last update (move, rename or update description) (ISO8601). */
        this.updated_at = tag && typeof tag.updated_at === 'string' ? tag.updated_at : '';

        /** @type {string} Short sentence describing the version. */
        this.desc = tag && typeof tag.desc === 'string' ? tag.desc : '';
    }

    /**
     * Updates the attributes of the tag.
     * @param {Object} options Attributes to update the new tag with.
     * @param {string} options.tag New name of the tag.
     * @param {string} options.desc New description of the tag.
     * @param {string} options.move_to Tag name of the tag you want to move to.
     * @returns {Promise<WitTag>}
     * @link https://wit.ai/docs/http/#put__tags__tag_link
     */
     async update(options) {
        const WT = this;
        return new Promise(function(resolve, reject) { WT.#app.tags.update(WT.name, options).then(resolve).catch(reject); });
    }

    /**
     * Permanently deletes the tag.
     * @returns {Promise<WitAppTagsManager>}
     * @link https://wit.ai/docs/http/#delete__apps__app_tags__tag_link
     */
    async delete() {
        const WT = this;
        return new Promise(function(resolve, reject) { WT.#app.tags.delete(WT.name).then(resolve).catch(reject); });
    }
}

module.exports = WitTag;