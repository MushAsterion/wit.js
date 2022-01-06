const Wit = require('./Wit');
const WitUtteranceIntent = require('./WitUtteranceIntent');
const WitUtteranceEntity = require('./WitUtteranceEntity');
const WitUtteranceTrait = require('./WitUtteranceTrait');

class WitUtterance {
    #client;

    /**
     * Utterance from Wit.ai by Facebook Inc.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {WitUtterance} utterance API utterance to convert to a WitUtterance.
     */
    constructor(client, utterance) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {string} The text of the utterance. */
        this.text = utterance && typeof utterance.text === 'string' ? utterance.text : '';

        /** @type {WitUtteranceIntent} The annotated user intent behind the utterance. */
        this.intent = utterance && typeof utterance.intent === 'object' ? new WitUtteranceIntent(this.#client, utterance.intent) : null;

        /** @type {WitUtteranceEntity[]} The list of entities annotated in the utterance. */
        this.entities = utterance && typeof utterance.entities === 'object' ? utterance.entities.map(function(e) { return new WitUtteranceEntity(client, e); }) : [];

        /** @type {WitUtteranceTrait[]} The list of annotated traits for the utterance. */
        this.traits = utterance && typeof utterance.traits === 'object' ? utterance.traits.map(function(t) { return new WitUtteranceTrait(client, t); }) : [];
    }

    /**
     * Delete validated utterance from your app. The processing is done asynchronously. Depending on the size of the training queue, it might take a few minutes before your utterances get deleted from your app.
     * @returns {Promise<{ sent: boolean, n: number }>}
     * @link https://wit.ai/docs/http/#delete__utterances_link
     */
    async delete() {
        const WU = this;
        return new Promise(function(resolve, reject) { WU.#client.utterances.delete(WU.text).then(resolve).catch(reject); });
    }
}

module.exports = WitUtterance