const WitTrait = require('./WitTrait');
const WitTraitValue = require('./WitTraitValue');

class WitTraitValuesManager extends Array {
    #trait;

    /**
     * Manager for the trait values.
     * @param {WitTrait} trait Trait the values belongs to.
     * @param {WitTraitValue[]} values List of values to init the manager with.
     */
    constructor(trait, values) {
        super(...values.map(function(k) { return new WitTraitValue(trait, k); }));

        /** @type {WitTrait} Trait the values belongs to. */
        this.#trait = trait;
    }

    /**
     * Creates a new value for the trait.
     * @param {string} name Name of the trait to add the value to.
     * @param {string} value Canonical value of the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#post__traits__trait_values_link
     */
    async create(value) {
        const WTVM = this;
        return new Promise(function(resolve, reject) { WTVM.#trait.createValue(value).then(resolve).catch(reject); });
    }

    /**
     * Permanently deletes the trait value.
     * @param {string} value Canonical value of the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#delete__traits__trait_values_link
     */
    async delete(value) {
        const WTVM = this;
        return new Promise(function(resolve, reject) { WTVM.#trait.deleteValue(value).then(resolve).catch(reject); });
    }
}

module.exports = WitTraitValuesManager;