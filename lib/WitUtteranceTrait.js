const Wit = require('./Wit');
const WitTrait = require('./WitTrait');

class WitUtteranceTrait {
    #client;

    /**
     * Trait from Wit.ai by Facebook Inc.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {WitUtteranceTrait} trait API utterance trait to convert to a WitUtteranceTrait.
     */
    constructor(client, trait) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {string} A unique identifier for the trait. */
        this.id = trait && typeof trait.id === 'string' ? trait.id : '';

        /** @type {string} The name of the trait. This can a trait you created, or a built-in trait, i.e. faq or wit$sentiment. */
        this.name = trait && typeof trait.name === 'string' ? trait.name : '';

        /** @type {string} The value for the trait, e.g. positive. */
        this.value = trait && typeof trait.value === 'string' ? trait.value : '';
    }

    /**
     * Retrieve the app trait this utterance trait is referring to.
     * @returns {Promise<WitTrait>}
     */
    async original() {
        const WT = this;

        return new Promise(function(resolve, reject) {
            WT.#client.traits.fetch({ 'name': WT.name, 'cache': false })
            .then(function(t) { resolve(t[0]); }).catch(reject);
        });
    }
}

module.exports = WitUtteranceTrait