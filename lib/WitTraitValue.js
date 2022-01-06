const WitTrait = require('./WitTrait');

class WitTraitValue {
    #trait;

    /**
     * Keyword from Wit.ai by Facebook Inc.
     * @param {WitTrait} trait Trait the values belongs to.
     * @param {WitTraitValue} value API value to convert to a WitTraitValue.
     */
    constructor(trait, value) {
        /** @type {WitTrait} The trait this value belongs to. */
        this.#trait = trait;

        /** @type {string} ID of the value. */
        this.id = value && typeof value.id === 'string' ? value.id : '';

        /** @type {string} Value. */
        this.value = value && typeof value.value === 'string' ? value.value : '';
    }

    /**
     * Permanently deletes the trait value.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#delete__traits__trait_values_link
     */
    async delete() {
        const WTV = this;
        return new Promise(function(resolve, reject) { WTV.#trait.deleteValue(WTV.value).then(resolve).catch(reject); });
    };
}

module.exports = WitTraitValue;