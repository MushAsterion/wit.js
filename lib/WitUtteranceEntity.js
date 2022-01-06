const Wit = require('./Wit');
const WitEntity = require('./WitEntity');

class WitUtteranceEntity {
    #client;

    /**
     * Entity from Wit.ai by Facebook Inc.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {WitUtteranceEntity} entity API utterance entity to convert to a WitUtteranceEntity.
     */
    constructor(client, entity) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {string} A unique identifier for the entity. */
        this.id = entity && typeof entity.id === 'string' ? entity.id : '';

        /** @type {string} The entity name. This can be an entity you created, or a built-in entity, i.e. food or wit$datetime. */
        this.name = entity && typeof entity.name === 'string' ? entity.name : '';

        /** @type {string} The role for the entity in the utterance, e.g. from. */
        this.role = entity && typeof entity.role === 'string' ? entity.role : '';

        /** @type {number} The starting index within the text of the entity span. */
        this.start = entity && typeof entity.start === 'number' && isFinite(entity.start) ? entity.start : -1;

        /** @type {number} The ending index within the text of the entity span. */
        this.end = entity && typeof entity.end === 'number' && isFinite(entity.end) ? entity.end : -1;

        /** @type {string} The span of the entity in the text. */
        this.body = entity && typeof entity.body === 'string' ? entity.body : '';

        /** @type {WitUtteranceEntity[]} List of entities found within the composite entity. Entities can currently only go one-level deep, so subentities cannot have subentities. The index within subentities starts from the overarching entity. */
        this.entities = entity && typeof entity.entities === 'object' ? entity.entities.map(function(e) { return new WitUtteranceEntity(client, e); }) : [];
    }

    /**
     * Retrieve the app entity this utterance entity is referring to.
     * @returns {Promise<WitEntity>}
     */
    async original() {
        const WE = this;

        return new Promise(function(resolve, reject) {
            WE.#client.entities.fetch({ 'name': WE.name, 'cache': false })
            .then(function(e) { resolve(e[0]); }).catch(reject);
        });
    }
}

module.exports = WitUtteranceEntity