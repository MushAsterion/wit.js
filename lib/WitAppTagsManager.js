const WitApp = require('./WitApp');
const WitAppTag = require('./WitAppTag');

class WitAppTagsManager extends Array {
    #app;

    /**
     * Manager for the app tags.
     * @param {WitApp} app App the tags belongs to.
     * @param {WitAppTag[]} tags List of tags to init the manager with.
     */
    constructor(app, tags) {
        super(...tags.map(function(k) { return new WitAppTag(app, k); }));

        /** @type {WitApp} App the tags belongs to. */
        this.#app = app;
    }

    /**
     * Returns an array of all tag groups for an app. Within a group, all tags point to the same app state (as a result of moving tags). If no name property is set it will fetch all tags. Default is fetched from tags cache, use cache attribute to fetch from API. It returns an array even when you look for a single tag.
     * @param {Object} options Options for fetching a single tag. If no options parsed it will fetch all tags.
     * @param {string} options.name Name for the tag to fetch. If no name is provided it will return all tags fetched from the API and cache will be ignored.
     * @param {boolean} options.cache Whether or not ignore cache when looking for an unique tag name. All tags are already fetched from API. Default is true (fetch names from cache).
     * @returns {Promise<WitAppTag[]>}
     * @link https://wit.ai/docs/http/#get__apps__app_tags_link
     * @link https://wit.ai/docs/http/#get__apps__app_tags__tag_link
     */
    async fetch(options = { 'name': '', 'cache': true }) {
        const WATM = this;

        return new Promise(function(resolve, reject) {
            if (typeof options === 'string') {
                if (WATM.cache.has(options)) { resolve(WATM.cache.get(options)); }
                else {
                    WATM.#app.fetch(`/apps/${WATM.#app.id}/tags/${encodeURI(options)}`).then(function(tag) {
                        WATM.cache.set(tag.name, new WitAppTag(WATM.#app, tag));
                        resolve([ WATM.cache.get(tag.name) ]);
                    }).catch(reject);
                }
            }
            else {
                options = options && typeof options === 'object' ? options : {};
                options.name = typeof options.name === 'string' ? options.name : '';
                options.cache = options.cache === false ? false : true;
    
                if (options.name && options.cache && WATM.cache.has(options.name)) { resolve(WATM.cache.get(options.name)); }
                else if (options.name) {
                    WATM.cache.delete(options.name);
                    WATM.#app.fetch(`/apps/${WATM.#app.id}/tags/${encodeURI(options.name)}`).then(function(tag) {
                        WATM.cache.set(tag.name, new WitAppTag(WATM.#app, tag));
                        resolve([ WATM.cache.get(tag.name) ]);
                    }).catch(reject);
                }
                else {
                    WATM.cache.clear();
                    WATM.#app.fetch(`/apps/${WATM.#app.id}/tags`).then(function(tags) {
                        Promise.all(tags.map(function(tag) {
                            return WATM.fetch({ 'name': tag.name, 'cache': false });
                        })).then(function(tags) { resolve([ ...WATM.cache.values() ]); }).catch(reject);
                    }).catch(reject);
                }
            }
        });
    }

    /**
     * Take a snapshot of the current app state, save it as a tag (version) of the app.
     * @param {string} tag Name of the new version.
     * @returns {Promise<WitAppTag>}
     * @link https://wit.ai/docs/http/#post__apps__app_tags_link
     */
    async create(tag) {
        const WATM = this;

        return new Promise(function(resolve, reject) {
            WATM.#app.fetch(`/tags`, {
                'method': 'POST',
                'body': JSON.stringify({ 'tag': tag })
            })
            .then(function(tag) { WATM.fetch(tag.tag).then(function(t) { resolve(t[0]); }).catch(reject); })
            .catch(reject);
        });
    }

    /**
     * Updates the attributes of a tag.
     * @param {string} name Name of the tag to update
     * @param {Object} options Attributes to update the new tag with.
     * @param {string} options.tag New name of the tag.
     * @param {string} options.desc New description of the tag.
     * @param {string} options.move_to Tag name of the tag you want to move to.
     * @returns {Promise<WitAppTag>}
     * @link https://wit.ai/docs/http/#put__tags__tag_link
     */
    async update(name, options) {
        const WATM = this;

        return new Promise(function(resolve, reject) {
            WATM.cache.delete(name);
            WATM.#app.fetch(`/apps/${WATM.#app.id}/tags/${encodeURI(name)}`, {
                'method': 'PUT',
                'body': JSON.stringify(Object.assign({}, options && typeof options === 'object' ? options : {}))
            }).then(function(tag) {
                WATM.fetch({ 'name': tag.tag, 'cache': false })
                .then(function(t) { resolve(t[0]); }).catch(reject);
            }).catch(reject);
        });
    }

    /**
     * Permanently deletes the tag.
     * @param {string} name Name of the tag to delete.
     * @returns {Promise<WitAppTagsManager>}
     * @link https://wit.ai/docs/http/#delete__apps__app_tags__tag_link
     */
    async delete(name) {
        const WATM = this;

        return new Promise(function(resolve, reject) {
            WATM.cache.delete(name);
            WATM.#app.client.fetch(`/apps/${WATM.#app.id}/tags/${encodeURI(name)}`, { 'method': 'DELETE' }).then(function(e) { resolve(WATM); }).catch(reject);
        });
    }
}

module.exports = WitAppTagsManager;