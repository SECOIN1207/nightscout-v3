
// NightScout V3 Multilingual AI + Voice Detection Layer
// Drop this file into your project and include it in index.html:
// <script src="multilingual-layer.js"></script>

const NightScoutLang = {
  supported: {
    en: "English",
    es: "Español",
    pt: "Português",
    it: "Italiano",
    fr: "Français"
  },
  current: "en"
};

// Basic UI translations
const translations = {
  en: {
    search: "Find a place",
    cheapDrinks: "Cheap Drinks",
    meetMiddle: "Meet in the Middle",
    groupPlan: "Group Plan",
    voice: "Speak"
  },
  es: {
    search: "Buscar lugar",
    cheapDrinks: "Bebidas Baratas",
    meetMiddle: "Encontrarse en el medio",
    groupPlan: "Plan de grupo",
    voice: "Hablar"
  },
  pt: {
    search: "Encontrar lugar",
    cheapDrinks: "Bebidas Baratas",
    meetMiddle: "Encontrar no meio",
    groupPlan: "Plano de grupo",
    voice: "Falar"
  },
  it: {
    search: "Trova locale",
    cheapDrinks: "Drink economici",
    meetMiddle: "Incontrarsi a metà",
    groupPlan: "Piano di gruppo",
    voice: "Parla"
  },
  fr: {
    search: "Trouver un lieu",
    cheapDrinks: "Boissons pas chères",
    meetMiddle: "Se rencontrer au milieu",
    groupPlan: "Plan de groupe",
    voice: "Parler"
  }
};

function setLanguage(lang) {
  if (!translations[lang]) return;
  NightScoutLang.current = lang;
  applyTranslations();
}

function applyTranslations() {
  const lang = NightScoutLang.current;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });
}

// Auto-detect browser language
function detectLanguage() {
  const lang = navigator.language.slice(0,2);
  if (translations[lang]) {
    setLanguage(lang);
  }
}

// Voice detection using Web Speech API
function startVoiceInput(callback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Voice recognition not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = NightScoutLang.current;
  recognition.start();

  recognition.onresult = function(event) {
    const text = event.results[0][0].transcript;
    if (callback) callback(text);
  };
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", () => {
  detectLanguage();
});
