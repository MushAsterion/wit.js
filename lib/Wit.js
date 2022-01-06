const fetch = require('isomorphic-fetch');

class Wit {
    /**
     * Creates a Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {Object} options The options to start the Wit.ai client with.
     * @param {Wit.token} options.token Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it publicly.
     * @param {Wit.version} options.version Wit.ai API version to use.
     * @param {Wit.context} options.context Context is key in natural language. For instance, at the same absolute instant, "today" will be resolved to a different value depending on the timezone of the user.
     */
    constructor(options = { 'token': '', 'version': '', 'context': { } }) {
        /**
         * @type {string} Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it publicly.
         * @link https://wit.ai/docs/http/#authentication_link
         */
        this.token = options && typeof options.token === 'string' ? options.token : '';

        this.apiurl = 'api.wit.ai';

        /**
         * @type {string} The current Wit.ai API version.
         * @link https://wit.ai/docs/http/#api_versioning_link
         */
        this.version = options && options.version && typeof options.version === 'string' ? options.version : '20211229';

        /**
         * @typedef {Object} WitContext
         * @property {string} reference_time Local date and time of the user in ISO8601 format (more specifically, RFC3339. Do not use UTC time, which would defeat the purpose of this field. Example: "2014-10-30T12:18:45-07:00"
         * @property {"Africa/Abidjan"|"Africa/Accra"|"Africa/Addis_Ababa"|"Africa/Algiers"|"Africa/Asmara"|"Africa/Asmera"|"Africa/Bamako"|"Africa/Bangui"|"Africa/Banjul"|"Africa/Bissau"|"Africa/Blantyre"|"Africa/Brazzaville"|"Africa/Bujumbura"|"Africa/Cairo"|"Africa/Casablanca"|"Africa/Ceuta"|"Africa/Conakry"|"Africa/Dakar"|"Africa/Dar_es_Salaam"|"Africa/Djibouti"|"Africa/Douala"|"Africa/El_Aaiun"|"Africa/Freetown"|"Africa/Gaborone"|"Africa/Harare"|"Africa/Johannesburg"|"Africa/Juba"|"Africa/Kampala"|"Africa/Khartoum"|"Africa/Kigali"|"Africa/Kinshasa"|"Africa/Lagos"|"Africa/Libreville"|"Africa/Lome"|"Africa/Luanda"|"Africa/Lubumbashi"|"Africa/Lusaka"|"Africa/Malabo"|"Africa/Maputo"|"Africa/Maseru"|"Africa/Mbabane"|"Africa/Mogadishu"|"Africa/Monrovia"|"Africa/Nairobi"|"Africa/Ndjamena"|"Africa/Niamey"|"Africa/Nouakchott"|"Africa/Ouagadougou"|"Africa/Porto-Novo"|"Africa/Sao_Tome"|"Africa/Timbuktu"|"Africa/Tripoli"|"Africa/Tunis"|"Africa/Windhoek"|"America/Adak"|"America/Anchorage"|"America/Anguilla"|"America/Antigua"|"America/Araguaina"|"America/Argentina/Buenos_Aires"|"America/Argentina/Catamarca"|"America/Argentina/ComodRivadavia"|"America/Argentina/Cordoba"|"America/Argentina/Jujuy"|"America/Argentina/La_Rioja"|"America/Argentina/Mendoza"|"America/Argentina/Rio_Gallegos"|"America/Argentina/Salta"|"America/Argentina/San_Juan"|"America/Argentina/San_Luis"|"America/Argentina/Tucuman"|"America/Argentina/Ushuaia"|"America/Aruba"|"America/Asuncion"|"America/Atikokan"|"America/Atka"|"America/Bahia"|"America/Bahia_Banderas"|"America/Barbados"|"America/Belem"|"America/Belize"|"America/Blanc-Sablon"|"America/Boa_Vista"|"America/Bogota"|"America/Boise"|"America/Buenos_Aires"|"America/Cambridge_Bay"|"America/Campo_Grande"|"America/Cancun"|"America/Caracas"|"America/Catamarca"|"America/Cayenne"|"America/Cayman"|"America/Chicago"|"America/Chihuahua"|"America/Coral_Harbour"|"America/Cordoba"|"America/Costa_Rica"|"America/Creston"|"America/Cuiaba"|"America/Curacao"|"America/Danmarkshavn"|"America/Dawson"|"America/Dawson_Creek"|"America/Denver"|"America/Detroit"|"America/Dominica"|"America/Edmonton"|"America/Eirunepe"|"America/El_Salvador"|"America/Ensenada"|"America/Fort_Nelson"|"America/Fort_Wayne"|"America/Fortaleza"|"America/Glace_Bay"|"America/Godthab"|"America/Goose_Bay"|"America/Grand_Turk"|"America/Grenada"|"America/Guadeloupe"|"America/Guatemala"|"America/Guayaquil"|"America/Guyana"|"America/Halifax"|"America/Havana"|"America/Hermosillo"|"America/Indiana/Indianapolis"|"America/Indiana/Knox"|"America/Indiana/Marengo"|"America/Indiana/Petersburg"|"America/Indiana/Tell_City"|"America/Indiana/Vevay"|"America/Indiana/Vincennes"|"America/Indiana/Winamac"|"America/Indianapolis"|"America/Inuvik"|"America/Iqaluit"|"America/Jamaica"|"America/Jujuy"|"America/Juneau"|"America/Kentucky/Louisville"|"America/Kentucky/Monticello"|"America/Knox_IN"|"America/Kralendijk"|"America/La_Paz"|"America/Lima"|"America/Los_Angeles"|"America/Louisville"|"America/Lower_Princes"|"America/Maceio"|"America/Managua"|"America/Manaus"|"America/Marigot"|"America/Martinique"|"America/Matamoros"|"America/Mazatlan"|"America/Mendoza"|"America/Menominee"|"America/Merida"|"America/Metlakatla"|"America/Mexico_City"|"America/Miquelon"|"America/Moncton"|"America/Monterrey"|"America/Montevideo"|"America/Montreal"|"America/Montserrat"|"America/Nassau"|"America/New_York"|"America/Nipigon"|"America/Nome"|"America/Noronha"|"America/North_Dakota/Beulah"|"America/North_Dakota/Center"|"America/North_Dakota/New_Salem"|"America/Nuuk"|"America/Ojinaga"|"America/Panama"|"America/Pangnirtung"|"America/Paramaribo"|"America/Phoenix"|"America/Port_of_Spain"|"America/Port-au-Prince"|"America/Porto_Acre"|"America/Porto_Velho"|"America/Puerto_Rico"|"America/Punta_Arenas"|"America/Rainy_River"|"America/Rankin_Inlet"|"America/Recife"|"America/Regina"|"America/Resolute"|"America/Rio_Branco"|"America/Rosario"|"America/Santa_Isabel"|"America/Santarem"|"America/Santiago"|"America/Santo_Domingo"|"America/Sao_Paulo"|"America/Scoresbysund"|"America/Shiprock"|"America/Sitka"|"America/St_Barthelemy"|"America/St_Johns"|"America/St_Kitts"|"America/St_Lucia"|"America/St_Thomas"|"America/St_Vincent"|"America/Swift_Current"|"America/Tegucigalpa"|"America/Thule"|"America/Thunder_Bay"|"America/Tijuana"|"America/Toronto"|"America/Tortola"|"America/Vancouver"|"America/Virgin"|"America/Whitehorse"|"America/Winnipeg"|"America/Yakutat"|"America/Yellowknife"|"Antarctica/Casey"|"Antarctica/Davis"|"Antarctica/DumontDUrville"|"Antarctica/Macquarie"|"Antarctica/Mawson"|"Antarctica/McMurdo"|"Antarctica/Palmer"|"Antarctica/Rothera"|"Antarctica/South_Pole"|"Antarctica/Syowa"|"Antarctica/Troll"|"Antarctica/Vostok"|"Arctic/Longyearbyen"|"Asia/Aden"|"Asia/Almaty"|"Asia/Amman"|"Asia/Anadyr"|"Asia/Aqtau"|"Asia/Aqtobe"|"Asia/Ashgabat"|"Asia/Ashkhabad"|"Asia/Atyrau"|"Asia/Baghdad"|"Asia/Bahrain"|"Asia/Baku"|"Asia/Bangkok"|"Asia/Barnaul"|"Asia/Beirut"|"Asia/Bishkek"|"Asia/Brunei"|"Asia/Calcutta"|"Asia/Chita"|"Asia/Choibalsan"|"Asia/Chongqing"|"Asia/Chungking"|"Asia/Colombo"|"Asia/Dacca"|"Asia/Damascus"|"Asia/Dhaka"|"Asia/Dili"|"Asia/Dubai"|"Asia/Dushanbe"|"Asia/Famagusta"|"Asia/Gaza"|"Asia/Harbin"|"Asia/Hebron"|"Asia/Ho_Chi_Minh"|"Asia/Hong_Kong"|"Asia/Hovd"|"Asia/Irkutsk"|"Asia/Istanbul"|"Asia/Jakarta"|"Asia/Jayapura"|"Asia/Jerusalem"|"Asia/Kabul"|"Asia/Kamchatka"|"Asia/Karachi"|"Asia/Kashgar"|"Asia/Kathmandu"|"Asia/Katmandu"|"Asia/Khandyga"|"Asia/Kolkata"|"Asia/Krasnoyarsk"|"Asia/Kuala_Lumpur"|"Asia/Kuching"|"Asia/Kuwait"|"Asia/Macao"|"Asia/Macau"|"Asia/Magadan"|"Asia/Makassar"|"Asia/Manila"|"Asia/Muscat"|"Asia/Nicosia"|"Asia/Novokuznetsk"|"Asia/Novosibirsk"|"Asia/Omsk"|"Asia/Oral"|"Asia/Phnom_Penh"|"Asia/Pontianak"|"Asia/Pyongyang"|"Asia/Qatar"|"Asia/Qostanay"|"Asia/Qyzylorda"|"Asia/Rangoon"|"Asia/Riyadh"|"Asia/Saigon"|"Asia/Sakhalin"|"Asia/Samarkand"|"Asia/Seoul"|"Asia/Shanghai"|"Asia/Singapore"|"Asia/Srednekolymsk"|"Asia/Taipei"|"Asia/Tashkent"|"Asia/Tbilisi"|"Asia/Tehran"|"Asia/Tel_Aviv"|"Asia/Thimbu"|"Asia/Thimphu"|"Asia/Tokyo"|"Asia/Tomsk"|"Asia/Ujung_Pandang"|"Asia/Ulaanbaatar"|"Asia/Ulan_Bator"|"Asia/Urumqi"|"Asia/Ust-Nera"|"Asia/Vientiane"|"Asia/Vladivostok"|"Asia/Yakutsk"|"Asia/Yangon"|"Asia/Yekaterinburg"|"Asia/Yerevan"|"Atlantic/Azores"|"Atlantic/Bermuda"|"Atlantic/Canary"|"Atlantic/Cape_Verde"|"Atlantic/Faeroe"|"Atlantic/Faroe"|"Atlantic/Jan_Mayen"|"Atlantic/Madeira"|"Atlantic/Reykjavik"|"Atlantic/South_Georgia"|"Atlantic/St_Helena"|"Atlantic/Stanley"|"Australia/ACT"|"Australia/Adelaide"|"Australia/Brisbane"|"Australia/Broken_Hill"|"Australia/Canberra"|"Australia/Currie"|"Australia/Darwin"|"Australia/Eucla"|"Australia/Hobart"|"Australia/LHI"|"Australia/Lindeman"|"Australia/Lord_Howe"|"Australia/Melbourne"|"Australia/North"|"Australia/NSW"|"Australia/Perth"|"Australia/Queensland"|"Australia/South"|"Australia/Sydney"|"Australia/Tasmania"|"Australia/Victoria"|"Australia/West"|"Australia/Yancowinna"|"Brazil/Acre"|"Brazil/DeNoronha"|"Brazil/East"|"Brazil/West"|"Canada/Atlantic"|"Canada/Central"|"Canada/Eastern"|"Canada/Mountain"|"Canada/Newfoundland"|"Canada/Pacific"|"Canada/Saskatchewan"|"Canada/Yukon"|"CET"|"Chile/Continental"|"Chile/EasterIsland"|"CST6CDT"|"Cuba"|"EET"|"Egypt"|"Eire"|"EST"|"EST5EDT"|"Etc/GMT"|"Etc/GMT-0"|"Etc/GMT-1"|"Etc/GMT-2"|"Etc/GMT-3"|"Etc/GMT-4"|"Etc/GMT-5"|"Etc/GMT-6"|"Etc/GMT-7"|"Etc/GMT-8"|"Etc/GMT-9"|"Etc/GMT-10"|"Etc/GMT-11"|"Etc/GMT-12"|"Etc/GMT-13"|"Etc/GMT-14"|"Etc/GMT+0"|"Etc/GMT+1"|"Etc/GMT+2"|"Etc/GMT+3"|"Etc/GMT+4"|"Etc/GMT+5"|"Etc/GMT+6"|"Etc/GMT+7"|"Etc/GMT+8"|"Etc/GMT+9"|"Etc/GMT+10"|"Etc/GMT+11"|"Etc/GMT+12"|"Etc/GMT0"|"Etc/Greenwich"|"Etc/UCT"|"Etc/Universal"|"Etc/UTC"|"Etc/Zulu"|"Europe/Amsterdam"|"Europe/Andorra"|"Europe/Astrakhan"|"Europe/Athens"|"Europe/Belfast"|"Europe/Belgrade"|"Europe/Berlin"|"Europe/Bratislava"|"Europe/Brussels"|"Europe/Bucharest"|"Europe/Budapest"|"Europe/Busingen"|"Europe/Chisinau"|"Europe/Copenhagen"|"Europe/Dublin"|"Europe/Gibraltar"|"Europe/Guernsey"|"Europe/Helsinki"|"Europe/Isle_of_Man"|"Europe/Istanbul"|"Europe/Jersey"|"Europe/Kaliningrad"|"Europe/Kiev"|"Europe/Kirov"|"Europe/Lisbon"|"Europe/Ljubljana"|"Europe/London"|"Europe/Luxembourg"|"Europe/Madrid"|"Europe/Malta"|"Europe/Mariehamn"|"Europe/Minsk"|"Europe/Monaco"|"Europe/Moscow"|"Europe/Nicosia"|"Europe/Oslo"|"Europe/Paris"|"Europe/Podgorica"|"Europe/Prague"|"Europe/Riga"|"Europe/Rome"|"Europe/Samara"|"Europe/San_Marino"|"Europe/Sarajevo"|"Europe/Saratov"|"Europe/Simferopol"|"Europe/Skopje"|"Europe/Sofia"|"Europe/Stockholm"|"Europe/Tallinn"|"Europe/Tirane"|"Europe/Tiraspol"|"Europe/Ulyanovsk"|"Europe/Uzhgorod"|"Europe/Vaduz"|"Europe/Vatican"|"Europe/Vienna"|"Europe/Vilnius"|"Europe/Volgograd"|"Europe/Warsaw"|"Europe/Zagreb"|"Europe/Zaporozhye"|"Europe/Zurich"|"Factory"|"GB"|"GB-Eire"|"GMT"|"GMT-0"|"GMT+0"|"GMT0"|"Greenwich"|"Hongkong"|"HST"|"Iceland"|"Indian/Antananarivo"|"Indian/Chagos"|"Indian/Christmas"|"Indian/Cocos"|"Indian/Comoro"|"Indian/Kerguelen"|"Indian/Mahe"|"Indian/Maldives"|"Indian/Mauritius"|"Indian/Mayotte"|"Indian/Reunion"|"Iran"|"Israel"|"Jamaica"|"Japan"|"Kwajalein"|"Libya"|"MET"|"Mexico/BajaNorte"|"Mexico/BajaSur"|"Mexico/General"|"MST"|"MST7MDT"|"Navajo"|"NZ"|"NZ-CHAT"|"Pacific/Apia"|"Pacific/Auckland"|"Pacific/Bougainville"|"Pacific/Chatham"|"Pacific/Chuuk"|"Pacific/Easter"|"Pacific/Efate"|"Pacific/Enderbury"|"Pacific/Fakaofo"|"Pacific/Fiji"|"Pacific/Funafuti"|"Pacific/Galapagos"|"Pacific/Gambier"|"Pacific/Guadalcanal"|"Pacific/Guam"|"Pacific/Honolulu"|"Pacific/Johnston"|"Pacific/Kanton"|"Pacific/Kiritimati"|"Pacific/Kosrae"|"Pacific/Kwajalein"|"Pacific/Majuro"|"Pacific/Marquesas"|"Pacific/Midway"|"Pacific/Nauru"|"Pacific/Niue"|"Pacific/Norfolk"|"Pacific/Noumea"|"Pacific/Pago_Pago"|"Pacific/Palau"|"Pacific/Pitcairn"|"Pacific/Pohnpei"|"Pacific/Ponape"|"Pacific/Port_Moresby"|"Pacific/Rarotonga"|"Pacific/Saipan"|"Pacific/Samoa"|"Pacific/Tahiti"|"Pacific/Tarawa"|"Pacific/Tongatapu"|"Pacific/Truk"|"Pacific/Wake"|"Pacific/Wallis"|"Pacific/Yap"|"Poland"|"Portugal"|"PRC"|"PST8PDT"|"ROC"|"ROK"|"Singapore"|"Turkey"|"UCT"|"Universal"|"US/Alaska"|"US/Aleutian"|"US/Arizona"|"US/Central"|"US/East-Indiana"|"US/Eastern"|"US/Hawaii"|"US/Indiana-Starke"|"US/Michigan"|"US/Mountain"|"US/Pacific"|"US/Samoa"|"UTC"|"W-SU"|"WET"|"Zulu"} timezone Local timezone of the user. Must be a valid IANA timezone. Used only if no reference_time is provided. In this case, we will compute reference_time from timezone and the UTC time of the API server. If neither reference_time nor timezone are provided (or a fortiori if no context at all is provided), we will use the default timezone of your app, which you can set in 'Settings' in the web console. Example: "America/Los_Angeles"
         * @property {string} locale Locale of the user. The first 2 letters must be a valid ISO639-1 language, followed by an underscore, followed by a valid ISO3166 alpha2 country code. locale is used to resolve the entities powered by our open-source linguistic parser, Duckling (e.g. wit/datetime, wit/amount_of_money). If you have locale-specific needs for dates and times, please contribute directly to Duckling. If a locale is not yet available in Duckling, it will default to the "parent" language, with no locale-specific customization. Example: "en_GB".
         * @property {{ lat: number, long: number }} coords Coordinates of the user. Must be in the form of an object with {"lat": float, "long": float}. coords is used to improve ranking for wit/location's resolved values. Learn more here. Example: {"lat": 37.47104, "long": -122.14703}.
         */

        /**
         * @type {WitContext} Context is key in natural language. For instance, at the same absolute instant, "today" will be resolved to a different value depending on the timezone of the user.
         * @link https://wit.ai/docs/http/#context_link
         */
        this.context = {
            'reference_time': options && options.context && options.context.reference_time && typeof options.context.reference_time === 'string' ? options.context.reference_time : '',
            'timezone': options && options.context && options.context.timezone && typeof options.context.timezone === 'string' ? options.context.timezone : '',
            'locale': options && options.context && options.context.locale && typeof options.context.locale === 'string' ? options.context.locale : '',
            'coords': options && options.context && options.context.coords && typeof options.context.coords.lat === 'number' && typeof options.context.coords.long === 'number' ?
                { 'lat': options.context.coords.lat, 'long': options.context.coords.long }
                : { }
        };

        const WitIntentsManager = require('./WitIntentsManager');
        const WitEntitiesManager = require('./WitEntitiesManager');
        const WitTraitsManager = require('./WitTraitsManager');
        const WitUtterancesManager = require('./WitUtterancesManager');
        const WitAppsManager = require('./WitAppsManager');

        /** @type {WitIntentsManager} A manager for the client intents. */
        this.intents = new WitIntentsManager(this);

        /** @type {WitEntitiesManager} A manager for the client entities. */
        this.entities = new WitEntitiesManager(this);

        /** @type {WitTraitsManager} A manager for the client traits. */
        this.traits = new WitTraitsManager(this);

        /** @type {WitUtterancesManager} A manager for the client utterances. */
        this.utterances = new WitUtterancesManager(this);

        /** @type {WitAppsManager} A manager for the client apps. */
        this.apps = new WitAppsManager(this);

        /** @type {{ intents: { name: string, desc: string }[], entities: { name: string, desc: string }[], traits: { name:string, desc: string }[] }} All built-in intents, entities and traits. */
        this.builtin = {
            'intents': require('../data/intents.json'),
            'entities': require('../data/entities.json'),
            'traits': require('../data/traits.json')
        }
    }

    /**
     * @typedef {Object} RequestHeaders
     * @property {"gzip"|"deflate"|"br"} Accept-Encoding (when options.compress === true)
     * @property {string|"\*\/\*"} Accept \*\/\*
     * @property {"close"} Connection (when no options.agent is present)
     * @property {string} Content-Type Type of content to send and retrieve.
     * @property {number} Content-Length (automatically calculated, if possible)
     * @property {string} Host (host and port information from the target URI)
     * @property {*} Transfer-Encoding chunked (when req.body is a stream)
     * @property {*} User-Agent node-fetch
     */

    /**
     * Perform an HTTP(S) fetch.
     * @param {string} url A string representing the URL for fetching. url should be an absolute URL, such as https://example.com/. A path-relative URL (/file/under/root) or protocol-relative URL (//can-be-http-or-https.com/) will result in a rejected Promise.
     * @param {Object} options Options for the HTTP(S) request
     * @param {"GET"|"POST"|"PUT"|"DELETE"} options.method Request method.
     * @param {RequestHeaders} options.headers Request headers.
     * @param {null|ReadableStream} options.body Request body.
     * @param {"manual"|"follow"|"error"} options.redirect Set to `manual` to extract redirect headers, `error` to reject redirect.
     * @param {null|AbortSignal} options.signal Pass an instance of AbortSignal to optionally abort requests.
     * @param {number} options.follow Maximum redirect count. 0 to not follow redirect
     * @param {boolean} options.compress Support gzip/deflate content encoding. false to disable.
     * @param {number} options.psize Maximum response body size in bytes. 0 to disable.
     * @param {null} options.agent Http(s).Agent instance or function that returns an instance.
     * @param {number} options.highWaterMark Maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource.
     * @param {boolean} options.insecureHTTPParser Use an insecure HTTP parser that accepts invalid HTTP headers when `true`.
     * @return {Promise<>}
     */
    async fetch(url, options = {}) {
        const W = this;

        return new Promise(function(resolve, reject) {
            options = Object.assign({}, options && typeof options === 'object' ? options : {});
            options.headers = Object.assign({}, options.headers ? options.headers : {}, { 'Authorization': `Bearer ${W.token}` });
            options.headers['Accept'] = options.headers['Accept'] ? options.headers['Accept'] : 'application/json';
            options.headers['Content-Type'] = options.headers['Content-Type'] ? options.headers['Content-Type'] : 'application/json';

            fetch(
                [
                    'https://',
                    W.apiurl,
                    !W.apiurl.endsWith('/') && !url.startsWith('/') ? '/' : '',
                    url.includes('?') ? url.replace('?', `?v=${W.version}&`) : `${url}?v=${W.version}`
                ].join(''),
                options
            )
            .then(function(response) { return response.json(); })
            .then(function(response) {
                if (response.error) { return reject(response.error); }
                else { resolve(response); }
            })
            .catch(reject);
        });
    }

    /**
     * Assigns a new token to the client.
     * @param {Wit.token} token Wit.ai uses OAuth2 as an authorization layer. As such, every API request must contain an Authorize HTTP header with a token. Access tokens are app and user specific. Please do not share the token with anyone, nor post it publicly.
     * @returns {Wit}
     */
    login(token = '') {
        this.destroy();
        this.token = typeof token === 'string' ? token : '';
        return this;
    }

    /**
     * Logs the client out and reset its context.
     * @returns {Wit}
     */
    destroy() {
        this.token = '';

        this.context = {
            'reference_time': '',
            'timezone': '',
            'locale': '',
            'coords': {}
        };

        this.intents.cache.clear();
        this.entities.cache.clear();
        this.traits.cache.clear();

        return this;
    }

    /**
     * Assigns a new context to the client.
     * @param {Wit.context} context Context is key in natural language. For instance, at the same absolute instant, "today" will be resolved to a different value depending on the timezone of the user.
     */
    setContext(context) {
        this.context = {
            'reference_time': context && typeof context.reference_time === 'string' ? context.reference_time : this.context.reference_time,
            'timezone': context && typeof context.timezone === 'string' ? context.timezone : this.context.timezone,
            'locale': context && typeof context.locale === 'string' ? context.locale : this.context.locale,
            'coords': context && context.coords ? typeof context.coords.lat === 'number' && typeof context.coords.long === 'number' ?
                { 'lat': context.coords.lat, 'long': context.coords.long } : {}
                : this.context.coords
        };

        return this;
    }

    /**
     * @typedef {{ values: { name: string, domain: string, coords?: { lat: string, long: string }, external?: Object.<string, string>, timezone?: string, attributes: Object.<string, string> }[] }} WitAnalysisEntityResolved
     * @typedef {{ unit?: string, grain?: string, product?: string, value: string|number }} WitAnalysisEntityInterval
     * 
     * @typedef {Object} WitAnalysisEntity
     * @property {number} id
     * @property {string} name
     * @property {string} role
     * @property {number} start
     * @property {number} end
     * @property {string} body
     * @property {number} confidence
     * @property {WitAnalysisEntity[]} entities
     * @property {boolean} [suggested]
     * @property {"value"|"interval"|"resolved"} type
     * @property {string} [grain]
     * @property {string} [unit]
     * @property {string} [product]
     * @property {string} [domain]
     * @property {string|number} value
     * @property {{ type: "value"|"interval"|"resolved", value?: string|number, from?: WitAnalysisEntityInterval, to?: WitAnalysisEntityInterval, resolved?: WitAnalysisEntityResolved }[]} [values]
     * @property {{ unit: string, value: number }} [normalized]
     * @property {number} [second]
     * @property {WitAnalysisEntityInterval} [from]
     * @property {WitAnalysisEntityInterval} [to]
     * @property {WitAnalysisEntityResolved} [resolved]
     * 
     * @typedef {Object} WitAnalysis
     * @property {string} text Either the text sent or the transcript of the speech input. This value should be used only for debug as Wit.ai focuses on entities.
     * @property {{ id: string, name: string, confidence: number }[]} intents Array of intents sorted by decreasing order of confidence.
     * @property {Object.<string, WitAnalysisEntity>} entities Object of entities. Where each key is name:role.
     * @property {Object.<string, { id: string, value: string, confidence: number }>} traits Object of traits where keys are names. Names are only in keys.
     */

    /**
     * Returns the extracted meaning from a sentence, based on the app data.
     * @param {string} q User's query, between 0 and 280 characters.
     * @param {Object} options The options for your request.
     * @param {string} options.tag A specific tag you want to use for the query.
     * @param {Wit.context} options.context A specific context you want to use for the query. If no context is inputed it will use client context.
     * @param {number} options.n The maximum number of n-best intents and traits you want to get back. The default is 1, and the maximum is 8.
     * @param {Object.<string, { keyword: string, synonyms: string[] }[]>} options.entities A list of Dynamic Entities. Some entities can be different for each request. Maybe they are personalized and depend on the user issuing the query. Maybe they evolve dynamically based on the state of the environment at the time of the request.
     * @returns {Promise<WitAnalysis>}
     * @link https://wit.ai/docs/http/#get__message_link
     */
    async message(q, options = { 'tag': '', 'context': null, 'n': 1, 'entities': [] }) {
        const W = this;

        return new Promise(function(resolve, reject) {
            W.fetch(
                `/message?`
                + `q=${encodeURI(typeof q === 'string' ? q : '')}`
                + (options.tag && typeof options.tag === 'string' ? `&tag=${encodeURI(options.tag)}` : '')
                + `&context=${encodeURI(JSON.stringify(typeof options.context === 'object' ? Object.assign({}, options.context) : W.context))}`
                + `&n=${typeof options.n === 'number' && isFinite(options.n) ? Math.max(1, Math.min(options.n, 8)) : 1}`
                + (options.entities && Object.keys(typeof options.entities === 'object' ? options.entities : {}).length ? `&entities=${encodeURI(JSON.stringify(options.entities))}` : '')
            ).then(resolve).catch(reject);
        });
    }

    /**
     * Returns the meaning extracted from an audio file or stream. We do recommend you to stream the audio input as it will reduce the latency, hence improve the user experience.
     * @param {*} bin The binary data to send
     * @param {{ format: "wav"|"mpeg3"|"ogg"|"ulaw"|"raw", encoding: "signed-integer"|"unsigned-integer"|"floating-point"|"mu-law"|"a-law"|"ima-adpcm"|"ms-adpcm"|"gsm-full-rate", bits: 8|16|32, rate: number, endian: "big"|"little" }} type The type of binary your are willing to send.
     * @param {Object} options The options for your request.
     * @param {string} options.tag A specific tag you want to use for the query.
     * @param {Wit.context} options.context A specific context you want to use for the query. If no context is inputed it will use client context.
     * @param {number} options.n The maximum number of n-best intents and traits you want to get back. The default is 1, and the maximum is 8.
     * @param {Object.<string, { keyword: string, synonyms: string[] }[]>} options.entities A list of Dynamic Entities. Some entities can be different for each request. Maybe they are personalized and depend on the user issuing the query. Maybe they evolve dynamically based on the state of the environment at the time of the request.
     * @returns {Promise<WitAnalysis>}
     * @link https://wit.ai/docs/http/#post__speech_link
     */
    async speech(bin, type, options = { 'tag': '', 'context': null, 'n': 1, 'entities': [] }) {
        const W = this;

        return new Promise(function(resolve, reject) {
            W.fetch(
                `/speech?`
                + `n=${typeof options.n === 'number' && isFinite(options.n) ? Math.max(1, Math.min(options.n, 8)) : 1}`
                + (options.tag && typeof options.tag === 'string' ? `&tag=${encodeURI(options.tag)}` : '')
                + `&context=${encodeURI(JSON.stringify(typeof options.context === 'object' ? Object.assign({}, options.context) : W.context))}`
                + (options.entities && Object.keys(typeof options.entities === 'object' ? options.entities : {}).length ? `&entities=${encodeURI(JSON.stringify(options.entities))}` : '')
            , {
                'method': 'POST',
                'headers': {
                    'Content-Type':
                        `audio/${type.format}`
                        + type.encoding ? `;encoding=${type.encoding}` : ''
                        + type.bits ? `;bits=${type.bits}` : ''
                        + type.rate ? `;rate=${type.rate}` : ''
                        + type.endian ? `;endian${type.endian}` : ''
                },
                'body': bin
            }).then(resolve).catch(reject);
        });
    }

    /**
     * Returns the list of the top detected locales for the text message.
     * @param {string} q User's query, between 0 and 280 characters.
     * @param {number} n The maximum number of top detected locales you want to get back. The default is 1, and the maximum is 8.
     * @returns {Promise<{ detected_locales: { locale: string, confidence: number }[] }>}
     * @link https://wit.ai/docs/http/#get__language_link
     */
    async language(q, n = 1) {
        const W = this;

        return new Promise(function(resolve, reject) {
            W.fetch(
                `/language?`
                + `q=${encodeURI(typeof q === 'string' ? q : '')}`
                + `&n=${typeof n === 'number' && isFinite(n) ? Math.max(1, Math.min(n, 8)) : 1}`
            ).then(resolve).catch(reject);
        });
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
    async train(utterance) {
        const W = this;
        return new Promise(function(resolve, reject) { W.utterances.create(utterance).then(resolve).catch(reject); });
    }

    /**
     * Get a URL where you can download a ZIP file containing all of your app data. This ZIP file can be used to create a new app with the same data.
     * @returns {Promise<string>}
     * @link https://wit.ai/docs/http/#get__export_link
     */
    async export() {
        const W = this;
        return new Promise(function(resolve, reject) { W.fetch('/export').then(function(url) { resolve(url.uri); }).catch(reject); });
    }

    /**
     * Create a new app with all the app data from the exported app.
     * @param {*} backup The zip file representing the backup.
     * @param {Object} options Options to create the new app with.
     * @param {string} options.name Name of the new app.
     * @param {boolean} options.private Private if true.
     * @returns {Promise<{ name: string, access_token: string, app_id: string }>}
     * @link https://wit.ai/docs/http/#post__import_link
     */
    async import(backup, options) {
        const W = this;

        return new Promise(function(resolve, reject) {
            W.fetch(
                `/import?`
                + `name=${encodeURI(options && typeof options.name === 'string' ? options.name : '')}`
                + `&private=${encodeURI(options && options.private ? true : false)}`
            , {
                'method': 'POST',
                'headers': { 'Content-Type': 'application/zip' },
                'body': backup
            }).then(resolve).catch(reject);
        });
    }
}

module.exports = Wit;