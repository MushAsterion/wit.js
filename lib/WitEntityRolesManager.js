const WitEntity = require('./WitEntity');

class WitEntityRolesManager extends Array {
    #entity;

    /**
     * Manager for the entity roles.
     * @param {WitEntity} entity Entity the roles belongs to.
     * @param {string[]} roles List of roles to init the manager with.
     */
    constructor(entity, roles = []) {
        super(...roles);

        /** @type {WitEntity} Entity the roles belongs to. */
        this.#entity = entity;
    }

    /**
     * Creates a new role for the entity.
     * @param {string} name Name of the role to create.
     * @returns {Promise<WitEntity>}
     */
    async create(name) {
        const WERM = this;

        return new Promise(function(resolve, reject) {
            WERM.#entity.update({ 'roles': [ ...WERM, name && typeof name === 'string' ? name : '' ] })
            .then(resolve).catch(reject);
        });
    }

    /**
     * Permanently deletes the role associated with the entity. When the role is the last one of the entity, the entity is also deleted.
     * @param {string} name Name of the role to delete.
     * @returns {Promise<WitEntity>}
     * @link https://wit.ai/docs/http/#delete__entities__entity_role_link
     */
    async delete(name) {
        const WERM = this;

        return new Promise(function(resolve, reject) {
            WERM.#entity.client.fetch(`/entities/${encodeURI(WERM.#entity.name)}:${encodeURI(typeof name === 'string' ? name : '')}`, { 'method': 'DELETE' })
            .then(function() {
                WERM.#entity.client.entities.fetch({ 'name': WERM.#entity.name, 'cache': false })
                .then(function(e) { return resolve(e[0]); }).catch(reject);
            }).catch(reject);
        });
    }
}

module.exports = WitEntityRolesManager;