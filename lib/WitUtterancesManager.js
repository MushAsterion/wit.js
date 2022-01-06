const Wit = require('./Wit');
const WitUtterance = require('./WitUtterance');

class WitUtterancesManager {
    #client;

    /**
     * Manager for the client utterances.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     */
    constructor(client) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;
    }

    /**
     * Returns the list of utterances for the app.
     * @param {Object} options Option to filter results.
     * @param {number} options.limit Max number of utterances to return. Must be between 1 and 10000 inclusive.
     * @param {number} options.offset Number of utterances to skip. Must be ≥ 0. Default is 0.
     * @param {string[]} options.intents List of intents to filter the utterances.
     * @returns {Promise<WitUtterance[]>}
     * @link https://wit.ai/docs/http/#get__utterances_link
     */
    async fetch(options) {
        const WUM = this;

        return new Promise(function(resolve, reject) {
            WUM.#client.fetch(
                `/utterances?`
                + `&limit=${options && typeof options.limit === 'number' && isFinite(options.limit) ? Math.max(1, Math.min(options.limit, 10000)) : 10000}`
                + (options && options.offset && typeof options.offset === 'number' && isFinite(options.offset) ? `&offset=${Math.max(0, options.offset)}` : '')
                + (options && options.intents && Object.keys(typeof options.intents === 'object' && typeof options.intents.join === 'function' ? options.intents : []).length ? `&intents=${encodeURI(options.intents.join(','))}` : '')
            ).then(function(utterances) {
                resolve(utterances.map(function(u) { return new WitUtterance(WUM.#client, u); }));
            }).catch(reject);
        });
    }

    /**
     * Check the format of an utterance.
     * @param {Object} utterance Elements of the utterance.
     * @param {string} utterance.text The text (sentence) you want your app to understand.
     * @param {string} utterance.intent The user intent for the utterance. Out-of-scope utterances would leave off this field.
     * @param {{ entity: string, start?: number, end?: number, body?: string, entities: { entity: string, start?: number, end?: number, body?: string }[] }[]} utterance.entities The list of entities appearing in this sentence, that you want your app to extract once it is trained.
     * @param {{ trait: string, value: string }[]} utterance.traits The list of traits that are relevant for the utterance.
     */
    #validateUtteranceFormat(utterance, needArray) {
        const WUM = this;

        if (typeof utterance === 'object' && JSON.stringify(utterance)[0] === '[') {
            utterance = utterance.map(function(u) { return WUM.validateUtteranceFormat(u, false); });
            return needArray ? utterance : utterance[0];
        }
        else {
            utterance && typeof utterance === 'object' ? utterance : {};
            utterance.text = utterance.text && typeof utterance.text === 'string' ? utterance.text : '';
            utterance.intent = utterance.intent && typeof utterance.intent === 'string' ? utterance.intent : '';
            utterance.entities = utterance.entities && typeof utterance.entities === 'object' ? utterance.entities.map(function(e) {
                const body = typeof e.start === 'number' && isFinite(e.start) && typeof e.end === 'number' && isFinite(e.end) ? utterance.text.slice(e.start, e.end) : e.body && typeof e.body === 'string' && e.body.length >= 1 ? e.body : '';
                return {
                    'entity': e.entity && typeof e.entity === 'string' ? e.entity : '',
                    'start': typeof e.start === 'number' && isFinite(e.start) ? e.start : utterance.text.indexOf(body),
                    'end': typeof e.end === 'number' && isFinite(e.end) ? e.end : utterance.text.indexOf(body) + body.length,
                    'body': body,
                    'entities': e.entities && typeof e.entities === 'object' ? e.entities.map(function(ee) {
                        const bbody = typeof ee.start === 'number' && isFinite(ee.start) && typeof ee.end === 'number' && isFinite(ee.end) ? body.slice(ee.start, ee.end) : ee.body && typeof ee.body === 'string' && ee.body.length >= 1 ? ee.body : '';
                        return {
                            'entity': ee.entity && typeof ee.entity === 'string' ? ee.entity : '',
                            'start': typeof ee.start === 'number' && isFinite(ee.start) ? ee.start : body.indexOf(bbody),
                            'end': typeof ee.end === 'number' && isFinite(ee.end) ? ee.end : body.indexOf(bbody) + bbody.length,
                            'body': bbody
                        };
                    }) : []
                };
            }) : [];
            utterance.traits = utterance.traits && typeof utterance.traits === 'object' ? utterance.traits.map(function(t) {
                return {
                    'trait': t.trait && typeof t.trait === 'string' ? t.trait : '',
                    'value': t.value && typeof t.value === 'string' ? t.value : ''
                };
            }) : [];

            if (!utterance.intent) { delete utterance.intent; }
            return needArray ? [ utterance ] : utterance;
        }
    }

    /**
     * Annotate and validate utterances using intents, entities and traits to train your app programmatically. The processing is done asynchronously. Depending on the size of the training queue, it might take a few minutes before your utterances are added to your app.
     * @param {Object} utterance Elements of the utterance.
     * @param {string} utterance.text The text (sentence) you want your app to understand.
     * @param {string} utterance.intent The user intent for the utterance. Out-of-scope utterances would leave off this field.
     * @param {{ entity: string, start?: number, end?: number, body?: string, entities: { entity: string, start?: number, end?: number, body?: string }[] }[]} utterance.entities The list of entities appearing in this sentence, that you want your app to extract once it is trained.
     * @param {{ trait: string, value: string }[]} utterance.traits The list of traits that are relevant for the utterance.
     * @returns {Promise<{ sent: boolean, n: number }>}
     * @link https://wit.ai/docs/http/#post__utterances_link
     */
    async create(utterance) {
        const WUM = this;

        return new Promise(function(resolve, reject) {
            WUM.#client.fetch('/utterances', {
                'method': 'POST',
                'body': JSON.stringify(WUM.#validateUtteranceFormat(utterance, true))
            }).then(resolve).catch(reject);
        });
    }

    /**
     * Delete validated utterances from your app. The processing is done asynchronously. Depending on the size of the training queue, it might take a few minutes before your utterances get deleted from your app.
     * @param {string|string[]|{ text: string }|{ text: string }[]} text The text of the utterance you would like deleted. Texts are case SeNsItIvE.
     * @returns {Promise<{ sent: boolean, n: number }>}
     * @link https://wit.ai/docs/http/#delete__utterances_link
     */
    async delete(text) {
        const WUM = this;

        return new Promise(function(resolve, reject) {
            WUM.#client.fetch(`/utterances`, {
                'method': 'DELETE',
                'body': JSON.stringify(
                    typeof text === 'string' ? [ { 'text': text } ]
                    : typeof text === 'object' && JSON.stringify(text)[0] === '[' ? text.map(function(t) {
                        return typeof t === 'string' ? { 'text': t }
                             : typeof t === 'object' && typeof t.text === 'string' ? { 'text': t.text }
                             : { 'text': '' }
                    })
                    : typeof text === 'object' && typeof text.text === 'string' ? [ { 'text': text.text } ]
                    : [ { 'text': '' } ]
                )
            }).then(resolve).catch(reject);
        });
    }
}

module.exports = WitUtterancesManager;