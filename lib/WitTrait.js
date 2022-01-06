const Wit = require('./Wit');

class WitTrait {
    #client;

    /**
     * Trait from Wit.ai by Facebook Inc.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {WitTrait} trait API trait to convert to a WitTrait.
     */
    constructor(client, trait) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {string} ID of the trait. */
        this.id = trait && typeof trait.id === 'string' ? trait.id : '';

        /** @type {string} Name. For built-in traits, use the wit$ prefix. */
        this.name = trait && typeof trait.name === 'string' ? trait.name : '';

        const WitTraitValue = require('./WitTraitValue');
        const JSDOC_WTVM = require('./jsdoc/JSDOC_WTVM');
        const WitTraitValuesManager = require('./WitTraitValuesManager');
        /** @type {WitTraitValue[]&JSDOC_WTVM} List of trait values. */
        this.values = new WitTraitValuesManager(this, trait && trait.values && trait.values.length ? trait.values : []);
    }

    /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
    get client() { return this.#client; }

    /**
     * Permanently deletes the trait.
     * @returns {Promise<Wit.traits>}
     * @link https://wit.ai/docs/http/#delete__traits__trait_link
     */
    async delete() {
        const WT = this;
        return new Promise(function(resolve, reject) { WT.#client.traits.delete(WT.name).then(resolve).catch(reject); });
    }

    /**
     * Creates a new value for the trait.
     * @param {string} value Canonical value of the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#post__traits__trait_values_link
     */
    async createValue(value) {
        const WT = this;
        return new Promise(function(resolve, reject) { WT.#client.traits.createValue(WT.name, value).then(resolve).catch(reject); });
    }

    /**
     * Permanently deletes the trait value.
     * @param {string} value Canonical value of the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#delete__traits__trait_values_link
     */
    async deleteValue(value) {
        const WT = this;
        return new Promise(function(resolve, reject) { WT.#client.traits.deleteValue(WT.name, value).then(resolve).catch(reject); });
    }
}

module.exports = WitTrait