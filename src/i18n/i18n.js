"use strict";

const englishDictionary = require("./strings/en-us.json");
const _once = require("lodash/once");


//---------------------------
// Localization style element
//---------------------------
/*
Quill has a number of strings hardcoded in CSS: currently the only way to translate those is
via CSS overrides.  So we insert an element in the head and update it whenever the locale changes
*/
const getTranslationStyleElement = _once(() => {
    const translationStyleElement = document.createElement("style");
    //class just for information purposes
    translationStyleElement.class="quilljs-translations";
    document.head.appendChild(translationStyleElement);

    return translationStyleElement;
});

function updateTranslationStyleElement () {
    const translationStyleElement = getTranslationStyleElement();
    translationStyleElement.innerText = `
.ql-snow .ql-tooltip[data-mode="link"]::before      { content: "${i18n.localize("tooltip.link.label")}"; }
.ql-snow .ql-tooltip            a.ql-action::after  { content: "${i18n.localize("tooltip.edit")}"; }
.ql-snow .ql-tooltip            a.ql-remove::before { content: "${i18n.localize("tooltip.remove")}"; }
.ql-snow .ql-tooltip.ql-editing a.ql-action::after  { content: "${i18n.localize("tooltip.save")}"; }
.ql-snow .ql-tooltip::before                        { content: "${i18n.localize("tooltip.link.visit")}"; }
    `;
}

let dictionary = englishDictionary;

const i18n = {
    setLocale: function (locale) {
        try {
            dictionary = require("./strings/" + locale + ".json");
        } catch (e) {
            dictionary = englishDictionary;
        }
        updateTranslationStyleElement();
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
