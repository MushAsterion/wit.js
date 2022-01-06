const WitEntity = require('../WitEntity');

class JSDOC_WERM {
    #entity;

    /**
     * Manager for the entity roles.
     * @param {WitEntity} entity Entity the roles belongs to.
     * @param {string[]} roles List of roles to init the manager with.
     */
    constructor(entity, roles = []) { }

    /**
     * Creates a new role for the entity.
     * @param {string} name Name of the role to create.
     * @returns {Promise<WitEntity>}
     */
    async create(name) { }

    /**
     * Permanently deletes the role associated with the entity. When the role is the last one of the entity, the entity is also deleted.
     * @param {string} name Name of the role to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_role_link
     */
    async delete(name) { }
}

module.exports = JSDOC_WERM;