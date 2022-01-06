# Wit.js
Wit.js is a powerful JavaScript module that allows you to easilly interact with [Wit.ai API](https://wit.ai/docs/http/)
* Object oriented
* 100% coverage of the [Wit.ai API](https://wit.ai/docs/http/)
* JSDoc to help you using it
 
Please note that I initally made this module for myself so might not keep it up to date as long as I don't need a refresh but everything is incorporated for an easy use for everyone. File an issue if you need an update.
 
**Most of JSDoc texts are directly copied from the API documentation.**
 
# Installation
**Node.JS 14.0.0 or newer is required. If you wish to use only message and speech endpoints you are encouraged to use the official [node-wit](https://github.com/wit-ai/node-wit) module.**
```
npm install MushAsterion/wit.js
```
 
# Initialization
```JavaScript
const Wit = require('wit.js');
const WitClient = new Wit({ 'token': YOUR_TOKEN });
```
 
When initializing you can use 3 properties as follow:
```JavaScript
new Wit({ 'token': YOUR_TOKEN, 'version': API_VERSION, 'context': CONTEXT })
```
 
Where:
* `YOUR_TOKEN` is a string for your [app token](https://wit.ai/docs/http/#authentication_link).
* `API_VERSION` is a string for the [API version](https://wit.ai/docs/http/#api_versioning_link) that you want to use.
* `CONTEXT` is an object representing the [context](https://wit.ai/docs/http/#context_link) to be used by default when fetching a message or speech.
 
Once the client is running you can still change your token and the default context by using
```JavaScript
WitClient.login(YOUR_TOKEN);
WitClient.setContext(CONTEXT);
```

# Usage
All names used are the same as the HTTP API and you even have JSDOC to help you on every single function and parameter. Please note that **most of methods are asynchronous**. Rate limits are not written anywhere in this module, please refer to official [HTTP API](https://wit.ai/docs/http/) if you need to.
 
Have a [look at the wiki](https://github.com/MushAsterion/wit.js/wiki) for how to use each class.
* [Wit](https://github.com/MushAsterion/wit.js/wiki/Wit#wit-class)
  * [Wit.intents](https://github.com/MushAsterion/wit.js/wiki/Wit#witintents)
  * [Wit.entities](https://github.com/MushAsterion/wit.js/wiki/Wit#witentities)
  * [Wit.traits](https://github.com/MushAsterion/wit.js/wiki/Wit#wittraits)
  * [Wit.utterances](https://github.com/MushAsterion/wit.js/wiki/Wit#witutterances)
  * [Wit.apps](https://github.com/MushAsterion/wit.js/wiki/Wit#witapps)
* [WitAnalysis](https://github.com/MushAsterion/wit.js/wiki/WitAnalysis#witanalysis)
  * [WitAnalysisIntent](https://github.com/MushAsterion/wit.js/wiki/WitAnalysis#witanalysisintent)
  * [WitAnalysisEntity](https://github.com/MushAsterion/wit.js/wiki/WitAnalysis#witanalysisentity)
    * [WitAnalysisEntityInterval](https://github.com/MushAsterion/wit.js/wiki/WitAnalysis#witanalysisentityinterval)
    * [WitAnalysisEntityResolved](https://github.com/MushAsterion/wit.js/wiki/WitAnalysis#witanalysisentityresolved)
  * [WitAnalysisTrait](https://github.com/MushAsterion/wit.js/wiki/WitAnalysis#witanalysistrait)
* [WitIntent](https://github.com/MushAsterion/wit.js/wiki/WitIntent#witintent-class)
* [WitEntity](https://github.com/MushAsterion/wit.js/wiki/WitEntity#witentity-class)
  * [WitEntity.roles](https://github.com/MushAsterion/wit.js/wiki/WitEntity#witentityroles)
  * [WitEntity.keywords](https://github.com/MushAsterion/wit.js/wiki/WitEntity#witentitykeywords)
  * [WitEntityKeyword](https://github.com/MushAsterion/wit.js/wiki/WitEntity#witentitykeyword)
  * [WitEntityKeyword.synonyms](https://github.com/MushAsterion/wit.js/wiki/WitEntity#witentitykeywordsynonyms)
* [WitTrait](https://github.com/MushAsterion/wit.js/wiki/WitTrait#wittrait-class)
  * [WitTrait.values](https://github.com/MushAsterion/wit.js/wiki/WitTrait#wittraitvalues)
  * [WitTraitValue](https://github.com/MushAsterion/wit.js/wiki/WitTrait#wittraitvalue)
* [WitUtterance](https://github.com/MushAsterion/wit.js/wiki/WitUtterance#witutterance-class)
  * [WitUtteranceIntent](https://github.com/MushAsterion/wit.js/wiki/WitUtterance#witutteranceintent)
  * [WitUtteranceEntity](https://github.com/MushAsterion/wit.js/wiki/WitUtterance#witutteranceentity)
  * [WitUtteranceTrait](https://github.com/MushAsterion/wit.js/wiki/WitUtterance#witutterancetrait)
* [WitApp](https://github.com/MushAsterion/wit.js/wiki/WitApp#witapp-class)
  * [WitApp.tags](https://github.com/MushAsterion/wit.js/wiki/WitApp#witapptags)
  * [WitAppTag](https://github.com/MushAsterion/wit.js/wiki/WitApp#witapptag)
