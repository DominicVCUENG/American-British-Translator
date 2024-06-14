const americanOnly = require('./american-only.js');
const britishOnly = require('./british-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");

class Translator {
    translate(text, locale) {
        if (text === undefined || locale === undefined) {
            return { error: 'Required field(s) missing' };
        }

        // Check if text is empty
        if (text.trim() === '') {
            return { error: 'No text to translate' };
        }

        if (locale !== 'american-to-british' && locale !== 'british-to-american') {
            return { error: 'Invalid value for locale field' };
        }

        let translatedText = text;

        if (locale === 'american-to-british') {
            translatedText = this.translateText(text, americanOnly, americanToBritishSpelling, americanToBritishTitles, /(\d{1,2}:\d{2})/g, ":");
        } else {
            // Convert British to American using inverse of mappings
            translatedText = this.translateText(text, britishOnly, this.invertObject(americanToBritishSpelling), this.invertObject(americanToBritishTitles), /(\d{1,2}\.\d{2})/g, ".");
        }

        if (translatedText === text) {
            return {
                text,
                translation: "Everything looks good to me!"
            };
        }

        return {
            text,
            translation: translatedText
        };
    }

    translateText(text, localeOnly, spelling, titles, timeRegex, timeSeparator) {
        let translatedText = text;

        // Titles translation
        for (let [key, value] of Object.entries(titles)) {
            const regex = new RegExp(`\\b${key.replace(/\./g, '\\.')}`, 'gi');
            translatedText = translatedText.replace(regex, match => {
                return `<span class="highlight">${value.charAt(0).toUpperCase() + value.slice(1)}</span>`;
            });
        }

        // Time translation
        translatedText = translatedText.replace(timeRegex, match => {
            const replacement = match.replace(timeSeparator, timeSeparator === ":" ? "." : ":");
            return `<span class="highlight">${replacement}</span>`;
        });

        // Spelling and word translation
        for (let [key, value] of Object.entries(spelling)) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            translatedText = translatedText.replace(regex, match => {
                return `<span class="highlight">${value}</span>`;
            });
        }

        // Locale specific words translation
        for (let [key, value] of Object.entries(localeOnly)) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            translatedText = translatedText.replace(regex, match => {
                return `<span class="highlight">${value}</span>`;
            });
        }

        return translatedText;
    }

    invertObject(obj) {
        const inverted = {};
        for (let [key, value] of Object.entries(obj)) {
            inverted[value] = key;
        }
        return inverted;
    }
}

module.exports = Translator;
