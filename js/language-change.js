const LANGUAGES = {
    'en': 'English',
    'ua': 'Українська'
};

window.i18nextify.init({
    fallbackLng: "en",
    load: 'languageOnly', // will load 'en' instead of 'en-US'
    autorun: true,
    keyAttr: 'translate-key', // 'i18next-key' is the default
    defaultNS: 'translation',
    ele: document.body,
    // ignoreWithoutKey: true, // only support nodes having a key

    // attributes to translate
    translateAttributes: ['placeholder', 'title', 'alt', 'value#input.type=button', 'value#input.type=submit', 'href#a'],

    backend: {
        loadPath: './locales/{{ns}}-{{lng}}.json',
    }
});

const changeLanguage = (lang) => {
    window.i18nextify.i18next.changeLanguage(lang)
        .then(() => window.i18nextify.forceRerender());
}

const updateLanguageButtons = (languageChoice, languages, currentLanguage, closeLanguageChoice) => {
    const createButton = (lang, languageName, selected) => {
        let button = document.createElement("button");
        button.classList.add('language-choice__button');
        if (selected) {
            button.classList.add("selected");
        }
        button.innerHTML = `
                <svg class="language-choice__flag" viewBox="0 0 15 10">
                  <use href="./images/svgimages/flags.svg#${lang}" />
                </svg>
                <p class="language-choice__name"> ${languageName} </p>
        `;
        button.addEventListener("click", () => {
            changeLanguage(lang);
            closeLanguageChoice();
        });
        return button;
    };
    languageChoice.innerHTML = '';
    Object.keys(languages)
        .map(lang => createButton(lang, languages[lang], lang === currentLanguage))
        .forEach(b => languageChoice.appendChild(b));
}

let languageChoice = null;
let closeLanguageChoice = null;

window.i18nextify.i18next.on('languageChanged', (desiredLang) => {
    // We want to get the fallback language if desired language is not supported
    const lang = i18nextify.i18next.languages.filter(l => LANGUAGES[l])[0];

    console.log("Language changed to", lang);
    const languageButton = document.querySelector("#language-button");
    const languageButtonFlagUse = document.querySelector("#language-button__flag use");
    if (languageButtonFlagUse) {
        const href = languageButtonFlagUse.getAttribute("href");
        languageButtonFlagUse.setAttribute("href", `${href.split("#")[0]}#${lang}`);
    }

    if (languageChoice === null) {
        const languageChoiceContainer = document.createElement("div");
        languageChoiceContainer.id = "language-choice__container";
        languageChoiceContainer.style.display = "none";

        languageChoice = document.createElement("div");
        languageChoice.id = "language-choice";
        languageChoiceContainer.appendChild(languageChoice);

        const languageButtonContainer = document.querySelector("#language-button-container");
        languageButtonContainer.appendChild(languageChoiceContainer);
    
        closeLanguageChoice = () => {
            languageChoiceContainer.style.display = 'none';
        }
        const toggleLanguageChoice = () => {
            languageChoiceContainer.style.display = 
                languageChoiceContainer.style.display === 'block' ? 'none' : 'block';
        }
        languageButton.addEventListener("click", toggleLanguageChoice.bind(this));
    }

    updateLanguageButtons(languageChoice, LANGUAGES, lang, closeLanguageChoice);
});
    
