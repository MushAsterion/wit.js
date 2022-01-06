const WitTrait = require('../WitTrait');
const WitTraitValue = require('../WitTraitValue');

class JSDOC_WTVM {
    #trait;

    /**
     * Manager for the trait values.
     * @param {WitTrait} trait Trait the values belongs to.
     * @param {WitTraitValue[]} values List of values to init the manager with.
     */
    constructor(trait, values) { }

    /**
     * Creates a new value for the trait.
     * @param {string} name Name of the trait to add the value to.
     * @param {string} value Canonical value of the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#post__traits__trait_values_link
     */
    async create(value) { }

    /**
     * Permanently deletes the trait value.
     * @param {string} value Canonical value of the trait.
     * @returns {Promise<WitTrait>}
     * @link https://wit.ai/docs/http/#delete__traits__trait_values_link
     */
    async delete(value) { }
}

module.exports = JSDOC_WTVM;