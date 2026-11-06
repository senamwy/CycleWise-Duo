import { EducationArticle, Quiz } from '../types';

export const EDUCATION_ARTICLES: EducationArticle[] = [
  {
    id: 'cycle-basics',
    title: 'Was ist der weibliche Menstruationszyklus eigentlich?',
    category: 'basics',
    categoryLabel: 'Grundlagen',
    readingTimeMinutes: 4,
    summary: 'Der Menstruationszyklus ist ein faszinierendes Zusammenspiel aus Hormonen, das weit über die Periode hinausgeht.',
    isFeatured: true,
    sections: [
      {
        heading: 'Mehr als nur die Blutungstage',
        body: 'Viele Männer reduzieren den Zyklus auf die Tage der Periode. In Wirklichkeit handelt es sich um einen kontinuierlichen, monatlichen Rhythmus, gesteuert von Botenstoffen wie Östrogen und Progesteron. Dieser Rhythmus beeinflusst nicht nur die Fortpflanzungsfähigkeit, sondern auch Energielevel, Stoffwechsel, Schlaf und Wohlbefinden.',
        boyfriendTip: 'Denke nicht in "Periode vs. normale Tage", sondern verstehe den Zyklus als vier Jahreszeiten, die sich jeden Monat wiederholen.'
      },
      {
        heading: 'Die vier hormonellen Phasen',
        body: 'Ein typischer Zyklus dauert zwischen 21 und 35 Tagen (im Schnitt ca. 28 Tage). Er unterteilt sich in vier Hauptphasen:',
        bulletPoints: [
          '1. Menstruationsphase (Tage 1–5): Die Gebärmutterschleimhaut wird abgestoßen. Niedriger Hormonspiegel, Körper verlangt oft nach Ruhe.',
          '2. Follikelphase (Tage 6–13): Östrogen steigt an. Neuer Energieschub, erhöhte Motivation und Konzentrationsfähigkeit.',
          '3. Eisprung / Ovulation (Tag 14): Der Höhepunkt von Östrogen und LH. Höchste Fruchtbarkeit, oft gesteigertes Selbstvertrauen.',
          '4. Lutealphase (Tage 15–28): Progesteron dominiert. Vorbereitung auf eine mögliche Einnistung; sinkt der Hormonspiegel am Ende, kann es zu PMS kommen.'
        ]
      },
      {
        heading: 'Individuelle Einzigartigkeit',
        body: 'Kein Körper funktioniert wie ein Schweizer Uhrwerk. Zykluslänge, Symptome und Intensität variieren von Frau zu Frau – und sogar von Monat zu Monat. Stress, Schlafmangel, Ernährung und Reisen können den Ablauf verschieben.',
        boyfriendTip: 'Vermeide starre Verallgemeinerungen. Die beste Informationsquelle darüber, wie sich deine Partnerin fühlt, ist immer ihr eigenes Feedback.'
      }
    ],
    keyTakeaways: [
      'Der Zyklus umfasst vier Phasen, nicht nur die Periode.',
      'Östrogen und Progesteron steuern Energie, Stimmung und Körpergefühl.',
      'Jede Frau erlebt ihren Zyklus individuell unterschiedlich.',
      'Zyklusschwankungen durch Stress oder Krankheit sind völlig normal.'
    ]
  },
  {
    id: 'phase-1-menstruation',
    title: 'Phase 1: Die Menstruation – Der innere Winter',
    category: 'phases',
    categoryLabel: 'Zyklusphasen',
    phaseNumber: 1,
    phaseDays: 'Tage 1 – 5',
    readingTimeMinutes: 4,
    summary: 'Der Beginn des neuen Zyklus. Warum jetzt Ruhe, Wärme und praktische Entlastung der Schlüssel sind.',
    isFeatured: true,
    sections: [
      {
        heading: 'Was im Körper passiert',
        body: 'Mit dem ersten Tag der Blutung beginnt offiziell ein neuer Zyklus. Da keine Befruchtung stattgefunden hat, sinken Östrogen und Progesteron auf ihren Tiefststand. Die Gebärmutterschleimhaut wird durch Muskelkontraktionen abgestoßen, was die typischen Krämpfe verursachen kann.',
        bulletPoints: [
          'Hormone auf dem Tiefpunkt: Oft spürbar niedrigere körperliche Energie.',
          'Krämpfe durch Prostaglandine: Kontraktionen der Gebärmutter zur Entleerung.',
          'Erhöhter Eisenbedarf und mögliches Frösteln.'
        ]
      },
      {
        heading: 'Wie du sie aufmerksam unterstützen kannst',
        body: 'In dieser Phase schätzen viele Frauen gemütliche Geborgenheit und weniger äußeren Druck. Kleine Handlungen sprechen oft lauter als Worte.',
        bulletPoints: [
          'Wärme anbieten: Eine Wärmflasche oder ein Kirschkernkissen vorbereiten.',
          'Körperliche Aufgaben abnehmen: Schweres Tragen, Kochen oder Hausarbeit unaufgefordert erledigen.',
          'Nährstoffreiches Essen: Gerichte mit Eisen, gesunden Fetten und wärmenden Suppen zubereiten.',
          'Kein Freizeitstress: Wenn sie Verabredungen absagen möchte, zeige volles Verständnis statt Enttäuschung.'
        ],
        boyfriendTip: 'Frage sie nicht: "Was soll ich tun?", sondern mache ein konkretes Angebot: "Ich koche heute Abend etwas Warmes, leg du dich entspannt aufs Sofa."'
      }
    ],
    keyTakeaways: [
      'Tag 1 der Blutung ist Tag 1 des neuen Zyklus.',
      'Niedrige Hormone bedeuten oft echtes Ruhebedürfnis – keine Faulheit.',
      'Wärme und praktische Entlastung lindern Schmerzen am effektivsten.',
      'Sanfte Rücksichtnahme stärkt eure Bindung enorm.'
    ]
  },
  {
    id: 'phase-2-follicular',
    title: 'Phase 2: Die Follikelphase – Der innere Frühling',
    category: 'phases',
    categoryLabel: 'Zyklusphasen',
    phaseNumber: 2,
    phaseDays: 'Tage 6 – 13',
    readingTimeMinutes: 3,
    summary: 'Die Blutung ist vorbei, Östrogen klettert: Zeit für neue Pläne, Dates und frische Energie.',
    sections: [
      {
        heading: 'Der Aufschwung',
        body: 'Nach der Periode reifen in den Eierstöcken Follikel heran. Dabei schüttet der Körper stetig mehr Östrogen aus. Östrogen wirkt oft wie ein natürlicher Stimmungsaufheller und Energiebooster: Es regt die Dopamin- und Serotoninproduktion an.',
        boyfriendTip: 'Dies ist oft eine wunderbare Zeit für gemeinsame Unternehmungen, spontane Dates oder neue gemeinsame Projekte.'
      },
      {
        heading: 'Mögliche Merkmale & Unterstützung',
        body: 'Viele Frauen fühlen sich in diesen Tagen mental besonders klar, kontaktfreudig und unternehmungslustig.',
        bulletPoints: [
          'Neue Aktivitäten planen: Ausflüge, Restaurants oder Sport gemeinsam ausprobieren.',
          'Begeisterung teilen: Unterstütze sie bei Ideen, Projekten oder Zielen.',
          'Leichte, frische Mahlzeiten: Viel Gemüse, bunte Bowls und leichte Energie.'
        ]
      }
    ],
    keyTakeaways: [
      'Steigendes Östrogen sorgt häufig für ein natürliches Energie- und Stimmungshoch.',
      'Ideale Phase für gemeinsame Aktivitäten, Reisen und neue Erfahrungen.',
      'Jede Frau reagiert jedoch in ihrem eigenen Rhythmus.'
    ]
  },
  {
    id: 'phase-3-ovulation',
    title: 'Phase 3: Der Eisprung – Der innere Sommer',
    category: 'phases',
    categoryLabel: 'Zyklusphasen',
    phaseNumber: 3,
    phaseDays: 'Tage 13 – 15',
    readingTimeMinutes: 3,
    summary: 'Der biologische Höhepunkt des Zyklus: Die Eizelle verlässt den Follikel. Maximale Fruchtbarkeit und Ausstrahlung.',
    sections: [
      {
        heading: 'Das Fruchtbarkeitsfenster',
        body: 'Ein steiler Anstieg des Luteinisierenden Hormons (LH) löst den Eisprung aus. Die Eizelle ist etwa 12 bis 24 Stunden befruchtungsfähig. Da Spermien jedoch bis zu 5 Tage im weiblichen Körper überleben können, umfasst das fertile Fenster insgesamt etwa 6 Tage.',
        boyfriendTip: 'Achtung: Zykluswissen ersetzt keine Verhütung! Eine App-Berechnung ist niemals ein Garant für fruchtfreie Tage.'
      },
      {
        heading: 'Wohlbefinden & Mittelschmerz',
        body: 'Viele Frauen fühlen sich um den Eisprung herum besonders vital und anziehend. Manche spüren jedoch auch einen kurzen, einseitigen Unterleibsschmerz, den sogenannten "Mittelschmerz".',
        bulletPoints: [
          'Wertschätzung zeigen: Sag ihr, was du an ihr liebst und bewunderst.',
          'Gemeinsame Qualitätszeit genießen.',
          'Symptome beachten: Mittelschmerz ist meist harmlos, kann sich aber wie ein Ziehen anfühlen.'
        ]
      }
    ],
    keyTakeaways: [
      'Der Eisprung ist der Moment höchster Fruchtbarkeit.',
      'Hormonelles Maximum an Östrogen und Testosteron.',
      'Einseitiger "Mittelschmerz" ist bei vielen Frauen normal.',
      'Keine Verhütungsdiagnose aus allgemeinen Zyklustagen ableiten.'
    ]
  },
  {
    id: 'phase-4-luteal-pms',
    title: 'Phase 4: Die Lutealphase & PMS – Der innere Herbst',
    category: 'phases',
    categoryLabel: 'Zyklusphasen',
    phaseNumber: 4,
    phaseDays: 'Tage 16 – 28',
    readingTimeMinutes: 5,
    summary: 'Progesteron dominiert. Verständnis, emotionale Sicherheit und geduldiges Zuhören sind jetzt Gold wert.',
    isFeatured: true,
    sections: [
      {
        heading: 'Was geschieht in der zweiten Zyklushälfte?',
        body: 'Nach dem Eisprung bildet sich aus der Hülle der Eizelle der Gelbkörper (Corpus Luteum). Dieser produziert Progesteron. Progesteron wirkt beruhigend, kann aber auch Müdigkeit, Heißhunger, Wassereinlagerungen und empfindliche Brüste begünstigen. Wenn keine Schwangerschaft vorliegt, fällt der Progesteron- und Östrogenspiegel gegen Ende steil ab.',
        boyfriendTip: 'Dieser abrupte Hormonabfall vor der nächsten Periode ist die biologische Ursache für das sogenannte Prämenstruelle Syndrom (PMS).'
      },
      {
        heading: 'PMS ist real – keine Ausrede',
        body: 'PMS ist kein "eingebildetes Drama", sondern eine neurochemische Reaktion: Der plötzliche Hormonabfall beeinflusst direkt Neurotransmitter wie Serotonin im Gehirn. Symptome können sein: Reizbarkeit, plötzliche Traurigkeit, Schlafprobleme, Kopfschmerzen oder starkes Bedürfnis nach Rückzug.',
        bulletPoints: [
          'Nicht persönlich nehmen: Wenn sie gereizt reagiert, gilt das oft nicht dir, sondern dem inneren Stresspegel ihres Körpers.',
          'Wichtigster Satz: "Möchtest du, dass ich dir helfe, oder möchtest du einfach erzählen und ich höre dir zu?"',
          'Niemals sagen: "Hast du etwa deine Tage?" – das entwertet jedes echte Gefühl.',
          'Ruhezonen respektieren: Wenn sie Zeit für sich braucht, gib ihr das Gefühl, dass das absolut in Ordnung ist.'
        ]
      }
    ],
    keyTakeaways: [
      'Progesteron steigt zuerst an und fällt kurz vor der Periode steil ab.',
      'Der Hormonabfall beeinflusst messbar Serotonin und das Nervensystem.',
      'Geduld, offenes Zuhören und Sicherheit sind die besten Hilfen.',
      'Gefühle niemals mit Zyklus-Klischees abtun.'
    ]
  },
  {
    id: 'understanding-cramps',
    title: 'Regelschmerzen & Krämpfe: Die biologischen Fakten',
    category: 'symptoms',
    categoryLabel: 'Symptome',
    readingTimeMinutes: 4,
    summary: 'Warum Periodenkrämpfe so schmerzhaft sein können wie eine Nierenkolik – und was wirklich hilft.',
    sections: [
      {
        heading: 'Die Rolle der Prostaglandine',
        body: 'Um die Schleimhaut abzustoßen, schüttet der Körper Gewebshormone namens Prostaglandine aus. Diese sorgen dafür, dass sich die Gebärmuttermuskeln rhythmisch zusammenziehen. Bei starken Kontraktionen wird die Blutzufuhr im Gewebe kurzzeitig gedrosselt – genau dieser Sauerstoffmangel verursacht die dumpfen, oft heftigen Schmerzen.',
        bulletPoints: [
          'Ärztliche Studien vergleichen starke Regelschmerzen (Dysmenorrhoe) mitunter mit den Schmerzen eines leichten Herzinfarkts.',
          'Zusätzliche Symptome: Übelkeit, Rückenschmerzen, Durchfall oder Schwindel.'
        ]
      },
      {
        heading: 'Das boyfriend-freundliche SOS-Kit',
        body: 'Wenn deine Partnerin unter Krämpfen leidet, kannst du sofort wirksam unterstützen:',
        bulletPoints: [
          'Lokale Wärme: Wärmflasche auf den Unterbauch oder unteren Rücken legen (erweitert Gefäße und entspannt Muskeln).',
          'Magnesium und Tee: Kamille, Schafgarbe oder Ingwertee beruhigen den Magen-Darm-Trakt.',
          'Ruhige Atmosphäre: Sanftes Licht, kein Lärm, bequeme Kissen.',
          'Schmerzmittel bereitstellen: Paracetamol oder Ibuprofen (nur nach ihrer eigenen gewohnten Einnahme, niemals eigenmächtig dosieren).'
        ],
        boyfriendTip: 'Biete ihr eine sanfte Massage am unteren Rücken an – viele Frauen empfinden leichten Druck dort als große Entlastung.'
      }
    ],
    keyTakeaways: [
      'Prostaglandine ziehen Muskeln zusammen und verursachen Sauerstoffmangel im Gewebe.',
      'Regelschmerzen sind ein reales körperliches Symptom, keine Empfindlichkeit.',
      'Wärme erweitert die Gefäße und lindert Krämpfe nachweislich.',
      'Sanfte Massagen und Ruheangebote zeigen echte Fürsorge.'
    ]
  },
  {
    id: 'respectful-communication',
    title: 'Respektvolle Kommunikation: Was hilft und was verletzt',
    category: 'communication',
    categoryLabel: 'Kommunikation',
    readingTimeMinutes: 4,
    summary: 'Wie du empathisch kommunizierst, ohne sie zu bevormunden oder in Rollenklischees zu verfallen.',
    sections: [
      {
        heading: 'Der goldene Leitfaden für sensible Tage',
        body: 'Das Ziel dieses Wissens ist nicht, ihre Gefühle zu analysieren oder vorauszusagen, sondern ein sicherer, verlässlicher Hafen zu sein.',
        bulletPoints: [
          'Tabu-Frage: "Bist du wieder in deiner Phase?" – Das wirkt herablassend und entmündigend.',
          'Besser: "Ich merke, dass heute ein anstrengender Tag war. Wie kann ich dir heute den Rücken freihalten?"',
          'Nicht sofort lösen wollen: Männer neigen dazu, sofort Reparatur-Tipps zu geben ("Nimm doch einfach eine Tablette"). Frauen suchen oft erst einmal emotionale Resonanz.',
          'Validieren statt relativieren: Ein einfaches "Das tut mir leid, dass es dir heute so wehtut" wirkt Wunder.'
        ],
        boyfriendTip: 'Frage: "Brauchst du eine Umarmung, einen Tee oder einfach eine Stunde absolute Ruhe?" Das gibt ihr die Kontrolle über ihre Bedürfnisse zurück.'
      }
    ],
    keyTakeaways: [
      'Gefühle niemals auf Hormone oder den Zyklus reduzieren.',
      'Zuhören vor Problemlösung stellen.',
      'Konkrete Auswahlmöglichkeiten für Unterstützung anbieten.',
      'Empathie bedeutet, ihre Wahrnehmung bedingungslos ernst zu nehmen.'
    ]
  },
  {
    id: 'common-myths-debunked',
    title: 'Häufige Mythen rund um den Zyklus entlarvt',
    category: 'myths',
    categoryLabel: 'Mythen & Fakten',
    readingTimeMinutes: 3,
    summary: 'Von der 28-Tage-Norm bis zur Launen-Schublade: Was die Wissenschaft wirklich sagt.',
    sections: [
      {
        heading: 'Mythos 1: Jeder gesunde Zyklus dauert genau 28 Tage',
        body: 'Falsch. Nur ca. 13% aller Frauen haben einen exakt 28-tägigen Zyklus. Alles zwischen 21 und 35 Tagen gilt medizinisch als völlig normal und gesund.',
        boyfriendTip: 'Erwarte keine mathematische Präzision. Kalender-Apps können den Tag nur schätzen.'
      },
      {
        heading: 'Mythos 2: Während der Periode kann man nicht schwanger werden',
        body: 'Falsch. Bei kurzen Zyklen und frühzeitigem Eisprung können überlebende Spermien aus den letzten Tagen der Blutung eine Eizelle befruchten. Verhütung ist in jeder Phase relevant, wenn keine Schwangerschaft gewünscht ist.',
        boyfriendTip: 'Verlasse dich niemals auf Hörensagen in Sachen Verhütung.'
      },
      {
        heading: 'Mythos 3: Hormone bestimmen ihren gesamten Charakter',
        body: 'Falsch. Hormone modulieren Stressresistenz und Energie, aber sie verändern nicht, wer ein Mensch ist. Wenn deine Partnerin verärgert ist, gibt es dafür fast immer einen realen Auslöser.',
        boyfriendTip: 'Nimm ihre Kritik immer inhaltlich ernst, ganz unabhängig davon, welcher Zyklustag gerade ist.'
      }
    ],
    keyTakeaways: [
      'Zyklen variieren natürlicherweise zwischen 21 und 35 Tagen.',
      'Spermien überleben bis zu 5 Tage – Fruchtbarkeit ist kein isolierter Einzeltag.',
      'Gefühle und Konflikte haben reale Ursachen und verdienen Respekt.'
    ]
  }
];

export const QUIZZES: Quiz[] = [
  {
    id: 'quiz-basics',
    title: 'Zyklus-Grundlagen für aufmerksame Partner',
    description: 'Teste dein Wissen über die vier Phasen und die hormonellen Grundlagen.',
    category: 'Grundlagen',
    questions: [
      {
        id: 'q1',
        quizId: 'quiz-basics',
        question: 'Mit welchem Ereignis beginnt offiziell der erste Tag eines neuen Zyklus?',
        options: [
          'Mit dem Ende der Blutung',
          'Mit dem ersten Tag der Menstruationsblutung',
          'Am Tag des Eisprungs (Ovulation)',
          'Am Tag nach der Lutealphase'
        ],
        correctIndex: 1,
        explanation: 'Tag 1 der Menstruationsblutung ist medizinisch immer Tag 1 des neuen Zyklus.',
        takeaway: 'Tag 1 der Blutung markiert den Start des Zyklus.'
      },
      {
        id: 'q2',
        quizId: 'quiz-basics',
        question: 'Wie viele Tage dauert ein gesunder Menstruationszyklus typischerweise im Normalbereich?',
        options: [
          'Immer exakt 28 Tage',
          'Zwischen 10 und 20 Tagen',
          'Zwischen 21 und 35 Tagen',
          'Genau 30 Tage wie ein Kalendermonat'
        ],
        correctIndex: 2,
        explanation: 'Ein Zyklus zwischen 21 und 35 Tagen gilt medizinisch als völlig gesund und normal. Nur ca. 13% haben exakt 28 Tage.',
        takeaway: 'Natürliche Zyklen schwanken zwischen 21 und 35 Tagen.'
      },
      {
        id: 'q3',
        quizId: 'quiz-basics',
        question: 'Welches Hormon steigt in der Follikelphase an und sorgt häufig für frische Energie?',
        options: [
          'Östrogen',
          'Melatonin',
          'Adrenalin',
          'Kortison'
        ],
        correctIndex: 0,
        explanation: 'Östrogen steigt nach der Periode kontinuierlich an und fördert Vitalität, Konzentration und Wohlbefinden.',
        takeaway: 'Östrogen ist der natürliche Energielieferant der ersten Zyklushälfte.'
      }
    ]
  },
  {
    id: 'quiz-support',
    title: 'Empathie & Kommunikation im Beziehungsalltag',
    description: 'Wie reagierst du feinfühlig und respektvoll auf Herausforderungen?',
    category: 'Beziehung & Empathie',
    questions: [
      {
        id: 'q1',
        quizId: 'quiz-support',
        question: 'Deine Partnerin erzählt dir frustriert von einem anstrengenden Tag und Bauchschmerzen. Welche Reaktion ist am hilfreichsten?',
        options: [
          '"Hast du deine Tage? Nimm einfach eine Tablette."',
          '"Das tut mir leid. Möchtest du einfach erzählen und ich höre zu, oder soll ich dir eine Wärmflasche machen?"',
          '"Du steigerst dich da zu sehr rein, morgen ist es wieder gut."',
          'Sofort das Zimmer verlassen, um keinen Streit zu provozieren.'
        ],
        correctIndex: 1,
        explanation: 'Zuhören und ein konkretes, sanftes Hilfeangebot ohne Vorurteile geben ihr Geborgenheit und Selbstbestimmung.',
        takeaway: 'Zuhören und konkrete Wärme anbieten schlägt jeden ungebetenen Ratschlag.'
      },
      {
        id: 'q2',
        quizId: 'quiz-support',
        question: 'Warum hilft eine Wärmflasche oder ein Kirschkernkissen biologisch bei Regelschmerzen?',
        options: [
          'Weil Wärme den Schmerz nur einbildet',
          'Weil lokale Wärme die Gefäße erweitert, die Durchblutung verbessert und die Gebärmuttermuskeln entspannt',
          'Weil Wärme den Hormonspiegel sofort senkt',
          'Es hilft medizinisch eigentlich gar nicht'
        ],
        correctIndex: 1,
        explanation: 'Wärme erweitert verengte Gefäße, lindert die durch Prostaglandine ausgelösten Muskelkrämpfe und führt dem Gewebe wieder Sauerstoff zu.',
        takeaway: 'Wärme ist eine biologisch wirksame Schmerzlinderung.'
      },
      {
        id: 'q3',
        quizId: 'quiz-support',
        question: 'Wie solltest du mit Stimmungsschwankungen in der Lutealphase (vor der Periode) umgehen?',
        options: [
          'Alles als reine Hormone abtun und ihre Sorgen ignorieren',
          'Ihre Gefühle ernst nehmen, ihr Raum geben und emotionale Sicherheit vermitteln',
          'Mit ihr eine Grundsatzdiskussion über die Beziehung anfangen',
          'Ihr sagen, sie soll sich zusammenreißen'
        ],
        correctIndex: 1,
        explanation: 'Nervensysteme reagieren sensibel auf sinkende Hormone. Geduld, emotionale Stabilität des Partners und Ruhe sind jetzt am wertvollsten.',
        takeaway: 'Emotionale Verlässlichkeit und Respekt sind die beste Unterstützung.'
      }
    ]
  }
];
