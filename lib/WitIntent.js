const Wit = require('./Wit');
const WitUtterance = require('./WitUtterance');

class WitIntent {
    #client;

    /**
     * Intent from Wit.ai by Facebook Inc.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {WitIntent} intent API intent to convert to a WitIntent.
     */
    constructor(client, intent) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {string} ID of the intent. */
        this.id = intent && typeof intent.id === 'string' ? intent.id : '';

        /** @type {string} Name. */
        this.name = intent && typeof intent.name === 'string' ? intent.name : '';

        // For JSDoc.
        const WitEntity = require('./WitEntity');
        /** @type {WitEntity[]} List of entities. */
        this.entities = intent && intent.entities && intent.entities.length ? intent.entities.map(function(e) { return new WitEntity(client, e); }) : [];
    }

    /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
    get client() { return this.#client; }

    /**
     * Retrieve all the utterances that match this intent.
     * @param {Object} options Option to filter results.
     * @param {number} options.limit Max number of utterances to return. Must be between 1 and 10000 inclusive.
     * @param {number} options.offset Number of utterances to skip. Must be ≥ 0. Default is 0.
     * @returns {Promise<WitUtterance[]>}
     */
     async utterances(options) {
        const WI = this;

        return new Promise(function(resolve, reject) {
            WI.#client.utterances.fetch({
                'limit': options && typeof options === 'object' ? options.limit : undefined,
                'offset': options && typeof options === 'object' ? options.offset : undefined,
                'intents': [ WI.name ]
            }).then(resolve).catch(reject);
        });
    }

    /**
     * Permanently deletes the intent.
     * @returns {Promise<Wit.intents>}
     * @link https://wit.ai/docs/http/#delete__intents__intent_link
     */
    async delete() {
        const WI = this;
        return new Promise(function(resolve, reject) { WI.#client.intents.delete(WI.name).then(resolve).catch(reject); });
    }
}

module.exports = WitIntent;