"use strict";

const englishDictionary = require("./strings/en-us.json");

let dictionary = englishDictionary;

const i18n = {
    setLocale: function (locale) {
        try {
            dictionary = require("./strings/" + locale + ".json");
        } catch (e) {
            dictionary = englishDictionary;
        }
    },
    localize: function (key) {
        if(key in dictionary) {
            return dictionary[key];
        }
        if(key in englishDictionary) {
            return englishDictionary[key];
        }
        throw new Error("No localization found for " + key);
    }
};

module.exports = i18n;
