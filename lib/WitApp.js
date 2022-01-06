const Wit = require('./Wit');

class WitApp {
    #client;

    /**
     * App from Wit.ai by Facebook Inc.
     * @param {Wit} client Wit client to interact with the Wit.ai API by Facebook Inc.
     * @param {WitApp} app API app to convert to a WitApp.
     */
    constructor(client, app) {
        /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
        this.#client = client;

        /** @type {string} A unique identifier for your app. */
        this.id = app && typeof app.id === 'string' ? app.id : '';

        /** @type {string} The name of your app. */
        this.name = app && typeof app.name === 'string' ? app.name : '';

        /** @type {"ab"|"aa"|"af"|"ak"|"sq"|"am"|"ar"|"an"|"hy"|"as"|"av"|"ae"|"ay"|"az"|"bm"|"ba"|"eu"|"be"|"bn"|"bh"|"bi"|"nb"|"bs"|"br"|"bg"|"my"|"es"|"ca"|"km"|"ch"|"ce"|"ny"|"ny"|"zh"|"za"|"cu"|"cu"|"cv"|"kw"|"co"|"cr"|"hr"|"cs"|"da"|"dv"|"dv"|"nl"|"dz"|"en"|"eo"|"et"|"ee"|"fo"|"fj"|"fi"|"nl"|"fr"|"ff"|"gd"|"gl"|"lg"|"ka"|"de"|"ki"|"el"|"kl"|"gn"|"gu"|"ht"|"ht"|"ha"|"he"|"hz"|"hi"|"ho"|"hu"|"is"|"io"|"ig"|"id"|"ia"|"ie"|"iu"|"ik"|"ga"|"it"|"ja"|"jv"|"kl"|"kn"|"kr"|"ks"|"kk"|"ki"|"rw"|"ky"|"kv"|"kg"|"ko"|"kj"|"ku"|"kj"|"ky"|"lo"|"la"|"lv"|"lb"|"li"|"li"|"li"|"ln"|"lt"|"lu"|"lb"|"mk"|"mg"|"ms"|"ml"|"dv"|"mt"|"gv"|"mi"|"mr"|"mh"|"ro"|"ro"|"mn"|"na"|"nv"|"nv"|"nd"|"nr"|"ng"|"ne"|"nd"|"se"|"no"|"nb"|"nn"|"ii"|"ny"|"nn"|"ie"|"oc"|"oj"|"cu"|"cu"|"cu"|"or"|"om"|"os"|"os"|"pi"|"pa"|"ps"|"fa"|"pl"|"pt"|"pa"|"ps"|"qu"|"ro"|"rm"|"rn"|"ru"|"sm"|"sg"|"sa"|"sc"|"gd"|"sr"|"sn"|"ii"|"sd"|"si"|"si"|"sk"|"sl"|"so"|"st"|"nr"|"es"|"su"|"sw"|"ss"|"sv"|"tl"|"ty"|"tg"|"ta"|"tt"|"te"|"th"|"bo"|"ti"|"to"|"ts"|"tn"|"tr"|"tk"|"tw"|"ug"|"uk"|"ur"|"ug"|"uz"|"ca"|"ve"|"vi"|"vo"|"wa"|"cy"|"fy"|"wo"|"xh"|"yi"|"yo"|"za"|"zu"} Language code, in the ISO 639-1 format. */
        this.lang = app && typeof app.lang === 'string' ? app.lang : '';

        /** @type {boolean} Private if true. */
        this.private = app && app.private ? true : false;

        /** @type {string} Date and time of your app creation (ISO8601). */
        this.created_at = app && typeof app.created_at === 'string' ? app.created_at : '';

        /** @type {string} Date and time of the next machine learning training for your app (ISO8601). */
        this.will_train_at = app && typeof app.will_train_at === 'string' ? app.will_train_at : '';

        /** @type {string} Date and time of the last machine learning training for your app (ISO8601). */
        this.last_trained_at = app && typeof app.last_trained_at === 'string' ? app.last_trained_at : '';

        /** @type {number} Duration of the last training for your app (in seconds). */
        this.last_training_duration_secs = app && typeof app.last_training_duration_secs === 'number' ? app.last_training_duration_secs : 0;

        /** @type {"done"|"scheduled"|"ongoing"} The current training status of your app. */
        this.training_status = app && [ 'done', 'scheduled', 'ongoing' ].includes(app.training_status) ? app.training_status : 'done';

        const WitAppTagsManager = require('./WitAppTagsManager');
        /** @type {WitAppTagsManager} All versions of your app. */
        this.tags = new WitAppTagsManager(this, app && typeof app.tags === 'object' ? app.tags : []);
    }

    /** @type {Wit} Wit client to interact with the Wit.ai API by Facebook Inc. */
    get client() { return this.#client; }

    /**
     * Generate a new client token or return the existing client token associated with the application.
     * @param {boolean} refresh Generate new token if true, or return the existing token if false. If not specified, assumed to be false. Generating a new client token invalidates existing client tokens for the application, so exercising caution is advised to avoid invalidating client tokens currently in use in production settings.
     * @returns {Promise<string>}
     */
    async token(refresh) {
        const WA = this;

        return new Promise(function(resolve, reject) {
            WA.#client.fetch(`/apps/${WA.id}/client_tokens`, {
                'method': 'POST',
                'body': JSON.stringify({ 'refresh': refresh === true ? true : false })
            }).then(function(token) { resolve(token.client_token); }).catch(reject);
        });
    }

    /**
     * Updates the app with the given attributes.
     * @param {Object} options Attributes to update the app with.
     * @param {string} options.name Name to rename the app to.
     * @param {"ab"|"aa"|"af"|"ak"|"sq"|"am"|"ar"|"an"|"hy"|"as"|"av"|"ae"|"ay"|"az"|"bm"|"ba"|"eu"|"be"|"bn"|"bh"|"bi"|"nb"|"bs"|"br"|"bg"|"my"|"es"|"ca"|"km"|"ch"|"ce"|"ny"|"ny"|"zh"|"za"|"cu"|"cu"|"cv"|"kw"|"co"|"cr"|"hr"|"cs"|"da"|"dv"|"dv"|"nl"|"dz"|"en"|"eo"|"et"|"ee"|"fo"|"fj"|"fi"|"nl"|"fr"|"ff"|"gd"|"gl"|"lg"|"ka"|"de"|"ki"|"el"|"kl"|"gn"|"gu"|"ht"|"ht"|"ha"|"he"|"hz"|"hi"|"ho"|"hu"|"is"|"io"|"ig"|"id"|"ia"|"ie"|"iu"|"ik"|"ga"|"it"|"ja"|"jv"|"kl"|"kn"|"kr"|"ks"|"kk"|"ki"|"rw"|"ky"|"kv"|"kg"|"ko"|"kj"|"ku"|"kj"|"ky"|"lo"|"la"|"lv"|"lb"|"li"|"li"|"li"|"ln"|"lt"|"lu"|"lb"|"mk"|"mg"|"ms"|"ml"|"dv"|"mt"|"gv"|"mi"|"mr"|"mh"|"ro"|"ro"|"mn"|"na"|"nv"|"nv"|"nd"|"nr"|"ng"|"ne"|"nd"|"se"|"no"|"nb"|"nn"|"ii"|"ny"|"nn"|"ie"|"oc"|"oj"|"cu"|"cu"|"cu"|"or"|"om"|"os"|"os"|"pi"|"pa"|"ps"|"fa"|"pl"|"pt"|"pa"|"ps"|"qu"|"ro"|"rm"|"rn"|"ru"|"sm"|"sg"|"sa"|"sc"|"gd"|"sr"|"sn"|"ii"|"sd"|"si"|"si"|"sk"|"sl"|"so"|"st"|"nr"|"es"|"su"|"sw"|"ss"|"sv"|"tl"|"ty"|"tg"|"ta"|"tt"|"te"|"th"|"bo"|"ti"|"to"|"ts"|"tn"|"tr"|"tk"|"tw"|"ug"|"uk"|"ur"|"ug"|"uz"|"ca"|"ve"|"vi"|"vo"|"wa"|"cy"|"fy"|"wo"|"xh"|"yi"|"yo"|"za"|"zu"} options.lang Language code, in the ISO 639-1 format.
     * @param {boolean} options.private Private if true.
     * @param {"Africa/Abidjan"|"Africa/Accra"|"Africa/Addis_Ababa"|"Africa/Algiers"|"Africa/Asmara"|"Africa/Asmera"|"Africa/Bamako"|"Africa/Bangui"|"Africa/Banjul"|"Africa/Bissau"|"Africa/Blantyre"|"Africa/Brazzaville"|"Africa/Bujumbura"|"Africa/Cairo"|"Africa/Casablanca"|"Africa/Ceuta"|"Africa/Conakry"|"Africa/Dakar"|"Africa/Dar_es_Salaam"|"Africa/Djibouti"|"Africa/Douala"|"Africa/El_Aaiun"|"Africa/Freetown"|"Africa/Gaborone"|"Africa/Harare"|"Africa/Johannesburg"|"Africa/Juba"|"Africa/Kampala"|"Africa/Khartoum"|"Africa/Kigali"|"Africa/Kinshasa"|"Africa/Lagos"|"Africa/Libreville"|"Africa/Lome"|"Africa/Luanda"|"Africa/Lubumbashi"|"Africa/Lusaka"|"Africa/Malabo"|"Africa/Maputo"|"Africa/Maseru"|"Africa/Mbabane"|"Africa/Mogadishu"|"Africa/Monrovia"|"Africa/Nairobi"|"Africa/Ndjamena"|"Africa/Niamey"|"Africa/Nouakchott"|"Africa/Ouagadougou"|"Africa/Porto-Novo"|"Africa/Sao_Tome"|"Africa/Timbuktu"|"Africa/Tripoli"|"Africa/Tunis"|"Africa/Windhoek"|"America/Adak"|"America/Anchorage"|"America/Anguilla"|"America/Antigua"|"America/Araguaina"|"America/Argentina/Buenos_Aires"|"America/Argentina/Catamarca"|"America/Argentina/ComodRivadavia"|"America/Argentina/Cordoba"|"America/Argentina/Jujuy"|"America/Argentina/La_Rioja"|"America/Argentina/Mendoza"|"America/Argentina/Rio_Gallegos"|"America/Argentina/Salta"|"America/Argentina/San_Juan"|"America/Argentina/San_Luis"|"America/Argentina/Tucuman"|"America/Argentina/Ushuaia"|"America/Aruba"|"America/Asuncion"|"America/Atikokan"|"America/Atka"|"America/Bahia"|"America/Bahia_Banderas"|"America/Barbados"|"America/Belem"|"America/Belize"|"America/Blanc-Sablon"|"America/Boa_Vista"|"America/Bogota"|"America/Boise"|"America/Buenos_Aires"|"America/Cambridge_Bay"|"America/Campo_Grande"|"America/Cancun"|"America/Caracas"|"America/Catamarca"|"America/Cayenne"|"America/Cayman"|"America/Chicago"|"America/Chihuahua"|"America/Coral_Harbour"|"America/Cordoba"|"America/Costa_Rica"|"America/Creston"|"America/Cuiaba"|"America/Curacao"|"America/Danmarkshavn"|"America/Dawson"|"America/Dawson_Creek"|"America/Denver"|"America/Detroit"|"America/Dominica"|"America/Edmonton"|"America/Eirunepe"|"America/El_Salvador"|"America/Ensenada"|"America/Fort_Nelson"|"America/Fort_Wayne"|"America/Fortaleza"|"America/Glace_Bay"|"America/Godthab"|"America/Goose_Bay"|"America/Grand_Turk"|"America/Grenada"|"America/Guadeloupe"|"America/Guatemala"|"America/Guayaquil"|"America/Guyana"|"America/Halifax"|"America/Havana"|"America/Hermosillo"|"America/Indiana/Indianapolis"|"America/Indiana/Knox"|"America/Indiana/Marengo"|"America/Indiana/Petersburg"|"America/Indiana/Tell_City"|"America/Indiana/Vevay"|"America/Indiana/Vincennes"|"America/Indiana/Winamac"|"America/Indianapolis"|"America/Inuvik"|"America/Iqaluit"|"America/Jamaica"|"America/Jujuy"|"America/Juneau"|"America/Kentucky/Louisville"|"America/Kentucky/Monticello"|"America/Knox_IN"|"America/Kralendijk"|"America/La_Paz"|"America/Lima"|"America/Los_Angeles"|"America/Louisville"|"America/Lower_Princes"|"America/Maceio"|"America/Managua"|"America/Manaus"|"America/Marigot"|"America/Martinique"|"America/Matamoros"|"America/Mazatlan"|"America/Mendoza"|"America/Menominee"|"America/Merida"|"America/Metlakatla"|"America/Mexico_City"|"America/Miquelon"|"America/Moncton"|"America/Monterrey"|"America/Montevideo"|"America/Montreal"|"America/Montserrat"|"America/Nassau"|"America/New_York"|"America/Nipigon"|"America/Nome"|"America/Noronha"|"America/North_Dakota/Beulah"|"America/North_Dakota/Center"|"America/North_Dakota/New_Salem"|"America/Nuuk"|"America/Ojinaga"|"America/Panama"|"America/Pangnirtung"|"America/Paramaribo"|"America/Phoenix"|"America/Port_of_Spain"|"America/Port-au-Prince"|"America/Porto_Acre"|"America/Porto_Velho"|"America/Puerto_Rico"|"America/Punta_Arenas"|"America/Rainy_River"|"America/Rankin_Inlet"|"America/Recife"|"America/Regina"|"America/Resolute"|"America/Rio_Branco"|"America/Rosario"|"America/Santa_Isabel"|"America/Santarem"|"America/Santiago"|"America/Santo_Domingo"|"America/Sao_Paulo"|"America/Scoresbysund"|"America/Shiprock"|"America/Sitka"|"America/St_Barthelemy"|"America/St_Johns"|"America/St_Kitts"|"America/St_Lucia"|"America/St_Thomas"|"America/St_Vincent"|"America/Swift_Current"|"America/Tegucigalpa"|"America/Thule"|"America/Thunder_Bay"|"America/Tijuana"|"America/Toronto"|"America/Tortola"|"America/Vancouver"|"America/Virgin"|"America/Whitehorse"|"America/Winnipeg"|"America/Yakutat"|"America/Yellowknife"|"Antarctica/Casey"|"Antarctica/Davis"|"Antarctica/DumontDUrville"|"Antarctica/Macquarie"|"Antarctica/Mawson"|"Antarctica/McMurdo"|"Antarctica/Palmer"|"Antarctica/Rothera"|"Antarctica/South_Pole"|"Antarctica/Syowa"|"Antarctica/Troll"|"Antarctica/Vostok"|"Arctic/Longyearbyen"|"Asia/Aden"|"Asia/Almaty"|"Asia/Amman"|"Asia/Anadyr"|"Asia/Aqtau"|"Asia/Aqtobe"|"Asia/Ashgabat"|"Asia/Ashkhabad"|"Asia/Atyrau"|"Asia/Baghdad"|"Asia/Bahrain"|"Asia/Baku"|"Asia/Bangkok"|"Asia/Barnaul"|"Asia/Beirut"|"Asia/Bishkek"|"Asia/Brunei"|"Asia/Calcutta"|"Asia/Chita"|"Asia/Choibalsan"|"Asia/Chongqing"|"Asia/Chungking"|"Asia/Colombo"|"Asia/Dacca"|"Asia/Damascus"|"Asia/Dhaka"|"Asia/Dili"|"Asia/Dubai"|"Asia/Dushanbe"|"Asia/Famagusta"|"Asia/Gaza"|"Asia/Harbin"|"Asia/Hebron"|"Asia/Ho_Chi_Minh"|"Asia/Hong_Kong"|"Asia/Hovd"|"Asia/Irkutsk"|"Asia/Istanbul"|"Asia/Jakarta"|"Asia/Jayapura"|"Asia/Jerusalem"|"Asia/Kabul"|"Asia/Kamchatka"|"Asia/Karachi"|"Asia/Kashgar"|"Asia/Kathmandu"|"Asia/Katmandu"|"Asia/Khandyga"|"Asia/Kolkata"|"Asia/Krasnoyarsk"|"Asia/Kuala_Lumpur"|"Asia/Kuching"|"Asia/Kuwait"|"Asia/Macao"|"Asia/Macau"|"Asia/Magadan"|"Asia/Makassar"|"Asia/Manila"|"Asia/Muscat"|"Asia/Nicosia"|"Asia/Novokuznetsk"|"Asia/Novosibirsk"|"Asia/Omsk"|"Asia/Oral"|"Asia/Phnom_Penh"|"Asia/Pontianak"|"Asia/Pyongyang"|"Asia/Qatar"|"Asia/Qostanay"|"Asia/Qyzylorda"|"Asia/Rangoon"|"Asia/Riyadh"|"Asia/Saigon"|"Asia/Sakhalin"|"Asia/Samarkand"|"Asia/Seoul"|"Asia/Shanghai"|"Asia/Singapore"|"Asia/Srednekolymsk"|"Asia/Taipei"|"Asia/Tashkent"|"Asia/Tbilisi"|"Asia/Tehran"|"Asia/Tel_Aviv"|"Asia/Thimbu"|"Asia/Thimphu"|"Asia/Tokyo"|"Asia/Tomsk"|"Asia/Ujung_Pandang"|"Asia/Ulaanbaatar"|"Asia/Ulan_Bator"|"Asia/Urumqi"|"Asia/Ust-Nera"|"Asia/Vientiane"|"Asia/Vladivostok"|"Asia/Yakutsk"|"Asia/Yangon"|"Asia/Yekaterinburg"|"Asia/Yerevan"|"Atlantic/Azores"|"Atlantic/Bermuda"|"Atlantic/Canary"|"Atlantic/Cape_Verde"|"Atlantic/Faeroe"|"Atlantic/Faroe"|"Atlantic/Jan_Mayen"|"Atlantic/Madeira"|"Atlantic/Reykjavik"|"Atlantic/South_Georgia"|"Atlantic/St_Helena"|"Atlantic/Stanley"|"Australia/ACT"|"Australia/Adelaide"|"Australia/Brisbane"|"Australia/Broken_Hill"|"Australia/Canberra"|"Australia/Currie"|"Australia/Darwin"|"Australia/Eucla"|"Australia/Hobart"|"Australia/LHI"|"Australia/Lindeman"|"Australia/Lord_Howe"|"Australia/Melbourne"|"Australia/North"|"Australia/NSW"|"Australia/Perth"|"Australia/Queensland"|"Australia/South"|"Australia/Sydney"|"Australia/Tasmania"|"Australia/Victoria"|"Australia/West"|"Australia/Yancowinna"|"Brazil/Acre"|"Brazil/DeNoronha"|"Brazil/East"|"Brazil/West"|"Canada/Atlantic"|"Canada/Central"|"Canada/Eastern"|"Canada/Mountain"|"Canada/Newfoundland"|"Canada/Pacific"|"Canada/Saskatchewan"|"Canada/Yukon"|"CET"|"Chile/Continental"|"Chile/EasterIsland"|"CST6CDT"|"Cuba"|"EET"|"Egypt"|"Eire"|"EST"|"EST5EDT"|"Etc/GMT"|"Etc/GMT-0"|"Etc/GMT-1"|"Etc/GMT-2"|"Etc/GMT-3"|"Etc/GMT-4"|"Etc/GMT-5"|"Etc/GMT-6"|"Etc/GMT-7"|"Etc/GMT-8"|"Etc/GMT-9"|"Etc/GMT-10"|"Etc/GMT-11"|"Etc/GMT-12"|"Etc/GMT-13"|"Etc/GMT-14"|"Etc/GMT+0"|"Etc/GMT+1"|"Etc/GMT+2"|"Etc/GMT+3"|"Etc/GMT+4"|"Etc/GMT+5"|"Etc/GMT+6"|"Etc/GMT+7"|"Etc/GMT+8"|"Etc/GMT+9"|"Etc/GMT+10"|"Etc/GMT+11"|"Etc/GMT+12"|"Etc/GMT0"|"Etc/Greenwich"|"Etc/UCT"|"Etc/Universal"|"Etc/UTC"|"Etc/Zulu"|"Europe/Amsterdam"|"Europe/Andorra"|"Europe/Astrakhan"|"Europe/Athens"|"Europe/Belfast"|"Europe/Belgrade"|"Europe/Berlin"|"Europe/Bratislava"|"Europe/Brussels"|"Europe/Bucharest"|"Europe/Budapest"|"Europe/Busingen"|"Europe/Chisinau"|"Europe/Copenhagen"|"Europe/Dublin"|"Europe/Gibraltar"|"Europe/Guernsey"|"Europe/Helsinki"|"Europe/Isle_of_Man"|"Europe/Istanbul"|"Europe/Jersey"|"Europe/Kaliningrad"|"Europe/Kiev"|"Europe/Kirov"|"Europe/Lisbon"|"Europe/Ljubljana"|"Europe/London"|"Europe/Luxembourg"|"Europe/Madrid"|"Europe/Malta"|"Europe/Mariehamn"|"Europe/Minsk"|"Europe/Monaco"|"Europe/Moscow"|"Europe/Nicosia"|"Europe/Oslo"|"Europe/Paris"|"Europe/Podgorica"|"Europe/Prague"|"Europe/Riga"|"Europe/Rome"|"Europe/Samara"|"Europe/San_Marino"|"Europe/Sarajevo"|"Europe/Saratov"|"Europe/Simferopol"|"Europe/Skopje"|"Europe/Sofia"|"Europe/Stockholm"|"Europe/Tallinn"|"Europe/Tirane"|"Europe/Tiraspol"|"Europe/Ulyanovsk"|"Europe/Uzhgorod"|"Europe/Vaduz"|"Europe/Vatican"|"Europe/Vienna"|"Europe/Vilnius"|"Europe/Volgograd"|"Europe/Warsaw"|"Europe/Zagreb"|"Europe/Zaporozhye"|"Europe/Zurich"|"Factory"|"GB"|"GB-Eire"|"GMT"|"GMT-0"|"GMT+0"|"GMT0"|"Greenwich"|"Hongkong"|"HST"|"Iceland"|"Indian/Antananarivo"|"Indian/Chagos"|"Indian/Christmas"|"Indian/Cocos"|"Indian/Comoro"|"Indian/Kerguelen"|"Indian/Mahe"|"Indian/Maldives"|"Indian/Mauritius"|"Indian/Mayotte"|"Indian/Reunion"|"Iran"|"Israel"|"Jamaica"|"Japan"|"Kwajalein"|"Libya"|"MET"|"Mexico/BajaNorte"|"Mexico/BajaSur"|"Mexico/General"|"MST"|"MST7MDT"|"Navajo"|"NZ"|"NZ-CHAT"|"Pacific/Apia"|"Pacific/Auckland"|"Pacific/Bougainville"|"Pacific/Chatham"|"Pacific/Chuuk"|"Pacific/Easter"|"Pacific/Efate"|"Pacific/Enderbury"|"Pacific/Fakaofo"|"Pacific/Fiji"|"Pacific/Funafuti"|"Pacific/Galapagos"|"Pacific/Gambier"|"Pacific/Guadalcanal"|"Pacific/Guam"|"Pacific/Honolulu"|"Pacific/Johnston"|"Pacific/Kanton"|"Pacific/Kiritimati"|"Pacific/Kosrae"|"Pacific/Kwajalein"|"Pacific/Majuro"|"Pacific/Marquesas"|"Pacific/Midway"|"Pacific/Nauru"|"Pacific/Niue"|"Pacific/Norfolk"|"Pacific/Noumea"|"Pacific/Pago_Pago"|"Pacific/Palau"|"Pacific/Pitcairn"|"Pacific/Pohnpei"|"Pacific/Ponape"|"Pacific/Port_Moresby"|"Pacific/Rarotonga"|"Pacific/Saipan"|"Pacific/Samoa"|"Pacific/Tahiti"|"Pacific/Tarawa"|"Pacific/Tongatapu"|"Pacific/Truk"|"Pacific/Wake"|"Pacific/Wallis"|"Pacific/Yap"|"Poland"|"Portugal"|"PRC"|"PST8PDT"|"ROC"|"ROK"|"Singapore"|"Turkey"|"UCT"|"Universal"|"US/Alaska"|"US/Aleutian"|"US/Arizona"|"US/Central"|"US/East-Indiana"|"US/Eastern"|"US/Hawaii"|"US/Indiana-Starke"|"US/Michigan"|"US/Mountain"|"US/Pacific"|"US/Samoa"|"UTC"|"W-SU"|"WET"|"Zulu"} options.timezone Default timezone of your app. Defaults to America/Los_Angeles.
     * @returns {Promise<WitApp>}
     * @link https://wit.ai/docs/http/#put__apps__app_link
     */
    async update(options) {
        const WA = this;
        return new Promise(function(resolve, reject) { WA.#client.apps.update(WA.id, options).then(resolve).catch(reject); });
    }

    /**
     * Permanently deletes the app. You must be the creator of the app to be able to delete it.
     * @returns {Promise<WitAppsManager>}
     * @link https://wit.ai/docs/http/#delete__apps__app_link
     */
    async delete() {
        const WA = this;
        return new Promise(function(resolve, reject) { WA.#client.apps.delete(WA.id).then(resolve).catch(reject); });
    }
}

module.exports = WitApp