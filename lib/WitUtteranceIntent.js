const Wit = require('./Wit');
const WitIntent = require('./WitIntent');

class WitUtteranceIntent {
    #client;

    /**
     * Intent from Wit.ai by Facebook Inc.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {WitUtteranceIntent} intent API utterance intent to convert to a WitUtteranceIntent.
     */
    constructor(client, intent) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {string} A unique identifier for the intent. */
        this.id = intent && typeof intent.id === 'string' ? intent.id : '';

        /** @type {string} The intent name. Out-of-scope utterances won't have the intent field set. */
        this.name = intent && typeof intent.name === 'string' ? intent.name : '';
    }

    /**
     * Retrieve the app intent behind this utterance intent.
     * @returns {Promise<WitIntent>}
     */
    async original() {
        const WI = this;

        return new Promise(function(resolve, reject) {
            WI.#client.intents.fetch({ 'name': WI.name, 'cache': false })
            .then(function(e) { resolve(e[0]); }).catch(reject);
        });
    }
}

module.exports = WitUtteranceIntent