import { SupportSuggestion } from '../types';

export const SUPPORT_SUGGESTIONS: SupportSuggestion[] = [
  // 1. Kleine Gesten
  {
    id: 'sug-tea',
    title: 'Ihren Lieblingstee unaufgefordert zubereiten',
    category: 'gesture',
    categoryLabel: 'Kleine Geste',
    description: 'Koche eine frische Tasse Kamillen-, Pfefferminz- oder Früchtetee, bringe sie ihr mit einer kleinen Notiz oder einem Lächeln und stelle sie ohne großes Aufheben an ihren Platz.',
    iconName: 'Coffee',
    timeToExecute: '5 Minuten',
    whyItHelps: 'Warmgetränke wirken krampflösend und signalisieren, dass du an sie denkst, ohne dass sie erst danach fragen muss.'
  },
  {
    id: 'sug-sweet-snack',
    title: 'Lieblingssnack oder dunkle Schokolade mitbringen',
    category: 'gesture',
    categoryLabel: 'Kleine Geste',
    description: 'Bringe vom Einkaufen ihre liebste Kleinigkeit mit (z.B. Nüsse, dunkle Schokolade mit hohem Kakaoanteil oder ihr Lieblingsobst) und lege sie auf ihren Schreibtisch.',
    iconName: 'Heart',
    timeToExecute: '10 Minuten',
    whyItHelps: 'Dunkle Schokolade enthält Magnesium, das Muskeln entspannt, und die Überraschung löst Glückshormone aus.'
  },
  {
    id: 'sug-handwritten-note',
    title: 'Eine liebevolle kurze Notiz hinterlassen',
    category: 'gesture',
    categoryLabel: 'Kleine Geste',
    description: 'Schreibe ein bis zwei aufrichtige Sätze auf einen Post-it (z.B. "Ich bin stolz auf dich und froh, dass es dich gibt") und klebe ihn an den Badezimmerspiegel.',
    iconName: 'FileText',
    timeToExecute: '2 Minuten',
    whyItHelps: 'Analoge, handgeschriebene Worte schaffen ein intensives Gefühl von emotionaler Geborgenheit.'
  },
  {
    id: 'sug-flowers-branch',
    title: 'Eine einzelne Blume oder ein frisches Detail mitbringen',
    category: 'gesture',
    categoryLabel: 'Kleine Geste',
    description: 'Es muss kein riesiger Strauß sein – eine einzelne schöne Blume auf dem Küchentisch zeigt, dass du ihren Tag erhellen möchtest.',
    iconName: 'Sparkles',
    timeToExecute: '10 Minuten',
    whyItHelps: 'Natur und Ästhetik im Wohnraum senken nachweislich das Stressniveau.'
  },

  // 2. Zuhören & Empathie
  {
    id: 'sug-listen-no-fix',
    title: '15 Minuten aktiv zuhören – ohne Problemlösungsmodus',
    category: 'listening',
    categoryLabel: 'Zuhören & Empathie',
    description: 'Setze dich zu ihr, lege das Smartphone komplett weg und frage: "Wie war dein Tag wirklich?" Höre einfach nur zu, nicke verständnisvoll und widerstehe dem Impuls, sofort Lösungen vorzuschlagen.',
    iconName: 'Ear',
    timeToExecute: '15 Minuten',
    whyItHelps: 'Oft brauchen Partner keine Ratschläge, sondern das Gefühl, mit ihren Gedanken und Gefühlen gesehen und validiert zu werden.'
  },
  {
    id: 'sug-offer-space',
    title: 'Raum für Alleinsein und Ruhe anbieten',
    category: 'listening',
    categoryLabel: 'Zuhören & Empathie',
    description: 'Sage ihr ruhig: "Wenn du heute Abend einfach Ruhe, ein Buch oder Schlaf brauchst, nimm dir alle Zeit. Ich bin nebenan und passe auf alles auf."',
    iconName: 'Shield',
    timeToExecute: '1 Minute',
    whyItHelps: 'Nimmt jegliches Schuldgefühl, Verabredungen oder Konversationen "liefern" zu müssen.'
  },
  {
    id: 'sug-validate-feelings',
    title: 'Ihre Empfindungen bedingungslos validieren',
    category: 'listening',
    categoryLabel: 'Zuhören & Empathie',
    description: 'Wenn sie sich unwohl oder niedergeschlagen fühlt, sage nicht "Kopf hoch", sondern "Das ist absolut verständlich, dass du dich so fühlst. Ich bin für dich da."',
    iconName: 'Smile',
    timeToExecute: '1 Minute',
    whyItHelps: 'Emotionale Bestätigung beruhigt das Nervensystem und stärkt das Vertrauen.'
  },

  // 3. Praktische Entlastung
  {
    id: 'sug-cook-dinner',
    title: 'Das Abendessen kochen oder planen',
    category: 'practical',
    categoryLabel: 'Praktische Entlastung',
    description: 'Überlege dir selbstständig, was es zu essen gibt, koche ohne ständiges Nachfragen ("Wo ist das Salz?") und decke den Tisch.',
    iconName: 'Utensils',
    timeToExecute: '30-40 Minuten',
    whyItHelps: 'Entscheidungs- und Organisationsmüdigkeit ("Mental Load") wird vollständig von ihren Schultern genommen.'
  },
  {
    id: 'sug-empty-dishwasher',
    title: 'Die Küche oder Spülmaschine unaufgefordert aufräumen',
    category: 'practical',
    categoryLabel: 'Praktische Entlastung',
    description: 'Räume die Küche blitzsauber auf, während sie duscht oder sich ausruht. Wische die Oberflächen ab und bringe den Müll raus.',
    iconName: 'CheckCircle',
    timeToExecute: '15 Minuten',
    whyItHelps: 'Visuelle Ordnung im Wohnraum reduziert das Kortisol-Level und erzeugt sofortige Erleichterung.'
  },
  {
    id: 'sug-grocery-run',
    title: 'Den Wocheneinkauf komplett übernehmen',
    category: 'practical',
    categoryLabel: 'Praktische Entlastung',
    description: 'Erstelle eine kurze Liste, frage nach besonderen Wünschen und gehe alleine einkaufen. Achte auf schwere Taschen und bringe alles an seinen Platz.',
    iconName: 'ShoppingBag',
    timeToExecute: '45 Minuten',
    whyItHelps: 'Körperliche Anstrengung und Gedränge im Supermarkt belasten an Tagen mit niedrigem Energielevel doppelt.'
  },
  {
    id: 'sug-pets-chores',
    title: 'Haustiere versorgen oder Botengänge erledigen',
    category: 'practical',
    categoryLabel: 'Praktische Entlastung',
    description: 'Gehe die Abendrunde mit dem Hund oder bringe Pakete weg, ohne dass sie dich darum bitten muss.',
    iconName: 'Package',
    timeToExecute: '20 Minuten',
    whyItHelps: 'Routineaufgaben im Voraus zu erledigen zeigt vorausschauende Fürsorge.'
  },

  // 4. Komfort & Wohlbefinden
  {
    id: 'sug-hot-water-bottle',
    title: 'Wärmflasche oder Kirschkernkissen vorbereiten',
    category: 'comfort',
    categoryLabel: 'Komfort & Erholung',
    description: 'Fülle eine Wärmflasche mit angenehm warmem (nicht kochendem) Wasser, ziehe den weichen Bezug drüber und bringe sie ihr aufs Sofa oder ins Bett.',
    iconName: 'Flame',
    timeToExecute: '5 Minuten',
    whyItHelps: 'Wärme erweitert verengte Blutgefäße, lindert Unterleibskrämpfe und erzeugt Geborgenheit.'
  },
  {
    id: 'sug-back-massage',
    title: 'Sanfte Massage für unteren Rücken oder Nacken',
    category: 'comfort',
    categoryLabel: 'Komfort & Erholung',
    description: 'Biete ihr eine sanfte Massage mit kreisenden Bewegungen an. Frage vorher genau nach dem gewünschten Druck.',
    iconName: 'Hand',
    timeToExecute: '15 Minuten',
    whyItHelps: 'Löst Verspannungen, senkt den Blutdruck und setzt beruhigendes Oxytocin frei.'
  },
  {
    id: 'sug-cozy-evening',
    title: 'Einen gemütlichen Film- oder Leseabend vorbereiten',
    category: 'comfort',
    categoryLabel: 'Komfort & Erholung',
    description: 'Dämme das Deckenlicht, schalte sanfte Lampen ein, lege warme Decken bereit und suche 2-3 entspannte Filme zur Auswahl heraus.',
    iconName: 'Tv',
    timeToExecute: '10 Minuten',
    whyItHelps: 'Schafft eine reizarme Umgebung, in der Körper und Geist zur Ruhe kommen können.'
  },
  {
    id: 'sug-water-bottle',
    title: 'Ein großes Glas frisches Wasser oder Kräutertee auffüllen',
    category: 'comfort',
    categoryLabel: 'Komfort & Erholung',
    description: 'Stelle ihr stilles Wasser mit einer Zitrone oder Gurkenscheibe an ihren Platz und erinnere sie liebevoll an ausreichende Flüssigkeit.',
    iconName: 'Droplet',
    timeToExecute: '2 Minuten',
    whyItHelps: 'Hydrierung verhindert Kopfschmerzen und unterstützt das Herz-Kreislauf-System.'
  },

  // 5. Ehrliche Wertschätzung
  {
    id: 'sug-specific-compliment',
    title: 'Ein konkretes, tiefgründiges Kompliment machen',
    category: 'appreciation',
    categoryLabel: 'Wertschätzung',
    description: 'Sag ihr nicht nur "Du siehst gut aus", sondern hebe eine Charaktereigenschaft oder eine kürzliche Tat hervor: "Ich bewundere so sehr, wie geduldig du gestern in der Situation geblieben bist."',
    iconName: 'Award',
    timeToExecute: '2 Minuten',
    whyItHelps: 'Spezifische Wertschätzung berührt tiefer als allgemeine Floskeln und festigt das emotionale Band.'
  },
  {
    id: 'sug-say-thank-you',
    title: 'Danke sagen für Dinge, die oft als selbstverständlich gelten',
    category: 'appreciation',
    categoryLabel: 'Wertschätzung',
    description: 'Nimm ihre Hand und bedanke dich aufrichtig für etwas, das sie regelmäßig tut: "Danke, dass du immer so liebevoll an Kleinigkeiten denkst."',
    iconName: 'HeartHandshake',
    timeToExecute: '2 Minuten',
    whyItHelps: 'Viele Menschen fühlen sich im Alltag ungesehen; ehrlicher Dank heilt dieses Gefühl sofort.'
  },
  {
    id: 'sug-hug-30s',
    title: 'Eine lange, ruhige Umarmung (mindestens 30 Sekunden)',
    category: 'appreciation',
    categoryLabel: 'Wertschätzung',
    description: 'Umarme sie fest und ruhig, atme gemeinsam tief durch und halte die Umarmung für 30 Sekunden ohne Hektik.',
    iconName: 'UserCheck',
    timeToExecute: '1 Minute',
    whyItHelps: 'Erst nach etwa 20 Sekunden ununterbrochener Umarmung schüttet das Gehirn signifikant Oxytocin aus.'
  }
];

export const DAILY_FACTS = [
  'Wusstest du? Nur etwa 13% aller Frauen haben einen exakt 28-tägigen Zyklus. Abweichungen sind völlig natürlich.',
  'Biologie-Tipp: Wärmflaschen wirken bei Krämpfen ähnlich effektiv wie leichte Schmerzmittel, weil sie die verkrampften Gefäße erweitern.',
  'Östrogen wirkt in der ersten Zyklushälfte oft wie ein natürlicher Stimmungsaufheller und fördert die Ausschüttung von Dopamin.',
  'Nach dem Eisprung steigt die Körperkerntemperatur um etwa 0,3 bis 0,5 Grad Celsius an – bedingt durch das Hormon Progesteron.',
  'Kommunikations-Fakt: Die Frage "Möchtest du Hilfe oder einfach nur erzählen?" senkt Beziehungsstress in über 80% aller Alltagskonflikte.',
  'Magnesium und ausreichend Flüssigkeit helfen dem Körper bei der Muskelentspannung während der Menstruation.',
  'Dunkle Schokolade mit über 70% Kakao enthält wertvolle Polyphenole und Magnesium – perfekt als kleine aufmerksame Geste.'
];
