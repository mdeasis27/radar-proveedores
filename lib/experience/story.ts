import type { Heading } from "@/design-system/demo/project-story";

type Tally = { read: number; missed: number };

export interface RadarStory {
  name: string;
  oneLiner: string;
  chips: string[];
  analogy: { heading: Heading; paragraphs: string[]; dictionaryLabel: string; dictionary: { term: string; means: string }[] };
  why: { title: string; text: string };
  tryIt: { heading: Heading; lead: string; question: (cutoff: number) => string; yes: string; no: string; cutoffLabel: string; cutoffHint: string; note: string; simulate: string; cancel: string; reset: string; error: string; idle: string };
  compare: { heading: Heading; lead: string; mine: string; all: string; missed: string; read: (n: number) => string; sentence: (mine: Tally, all: Tally) => string };
  fit: { heading: Heading; worthLabel: string; worth: string; notLabel: string; not: string };
  proves: { heading: Heading; text: string };
  engineers: { summary: string; points: string[]; repoLabel: string };
  scene: { title: string; caption: string; order: string; callsFrom: (cutoff: number) => string; notCalled: string; bubble: string; legend: { ok: string; found: string; lost: string }; called: (n: number) => string; uncalled: (n: number) => string; describe: (cutoff: number, read: number, missed: number) => string; tapeLabel: string; tape: { served: string; rerouted: string; lost: string }; missedOf: (n: number) => string };
}

export const STORY: Record<"en" | "es", RadarStory> = {
  en: {
    name: "Supplier due diligence",
    oneLiner: "Reviews the signals about a supplier before you sign with them.",
    chips: ["Supplier risk", "2 min", "Live demo"],
    analogy: {
      heading: { before: "The", accent: "analogy" },
      paragraphs: [
        "Before you hire someone, you call their references. If you only call the first two on the list, the one that mattered might have been the third.",
        "Supplier due diligence gathers what is said about a supplier, from news to public records, and ranks it by relevance. The analyst decides how far down the list to read.",
      ],
      dictionaryLabel: "In the diagram below",
      dictionary: [
        { term: "a reference", means: "a signal about the supplier" },
        { term: "a bad reference", means: "a serious signal" },
        { term: "the call you didn't make", means: "a signal nobody read" },
        { term: "how many you call", means: "the relevance the analyst reads from" },
      ],
    },
    why: { title: "Why I built it", text: "" },
    tryIt: {
      heading: { before: "Try", accent: "it" },
      lead: "Ten signals about one supplier, ranked from 10 to 100 in relevance. Two of them are serious.",
      question: (c) => `Before you run it, place a bet: if the analyst reads from relevance ${c} up, does a serious signal go unread?`,
      yes: "Yes, at least one slips by",
      no: "No, both are found",
      cutoffLabel: "Analyst reads from relevance",
      cutoffHint: "Higher means fewer signals to read.",
      note: "Each square is one signal, from least to most relevant. Blue is a serious signal the analyst found. Red is a serious one nobody read.",
      simulate: "Run it",
      cancel: "Cancel",
      reset: "Start over",
      error: "The signals could not be reviewed.",
      idle: "Place your bet and press Run it.",
    },
    compare: {
      heading: { before: "Your cutoff", accent: "or reading everything" },
      lead: "Same ten signals. The only change is how far down the analyst reads.",
      mine: "Your cutoff",
      all: "Reading everything",
      missed: "serious signals unread",
      read: (n) => `${n} of 10 signals read`,
      sentence: (mine, all) => {
        if (mine.read === all.read) return "With your cutoff the analyst already reads everything, so both results are the same.";
        if (mine.missed === 0) return `With your cutoff the analyst read ${mine.read} of 10 signals and still found both serious ones.`;
        return `Reading ${mine.read} ${mine.read === 1 ? "signal" : "signals"}, the analyst missed ${mine.missed === 1 ? "a serious one" : `${mine.missed} serious ones`}. Reading all ${all.read}, nothing slipped by.`;
      },
    },
    fit: {
      heading: { before: "Where it", accent: "fits" },
      worthLabel: "Worth it",
      worth: "When a purchasing team signs with dozens of suppliers a year and someone has to decide how much reading each one deserves.",
      notLabel: "Not needed",
      not: "For a one-off purchase from a supplier you already know well.",
    },
    proves: {
      heading: { before: "What it", accent: "proves" },
      text: "I turned \"how much should we read\" into a number the team can see and argue about. The cost of reading less shows up as a red square, before the contract is signed.",
    },
    engineers: {
      summary: "For engineers",
      points: [
        "The ten signals are a fixed fictional set, relevance 10 to 100, serious at 40 and 80. The full product builds them from web search and a language model; this demo calls no API.",
        "Triage reads every signal at or above the cutoff. A serious signal below it counts as missed.",
        "Tests pin the counts at cutoffs 0, 40 and 50 and sweep the slider to prove the bet can go either way.",
        "Stack: Next.js 16, TypeScript, node:test.",
      ],
      repoLabel: "Source code",
    },
    scene: {
      title: "Calling the references",
      caption: "The phone calls only the references at or above the cut. Each answer colors the card: green when all is well, blue when they warn you. A red card with a cross is a bad reference you never called.",
      order: "from least to most relevant",
      callsFrom: (c) => `You call from relevance ${c} up`,
      notCalled: "not called",
      bubble: "“We had problems”",
      legend: { ok: "good reference", found: "bad reference you heard", lost: "bad reference you never called" },
      called: (n) => `You called ${n} of 10`,
      uncalled: (n) => (n === 0 ? "No bad reference was left uncalled" : n === 1 ? "1 bad reference was never called" : `${n} bad references were never called`),
      describe: (c, read, missed) => `Ten references ranked from least to most relevant. You call from relevance ${c} up and make ${read} ${read === 1 ? "call" : "calls"}. ${missed === 0 ? "No bad reference was left uncalled." : missed === 1 ? "1 bad reference was never called." : `${missed} bad references were never called.`}`,
      tapeLabel: "Ten signals, from least to most relevant",
      tape: { served: "no problem", rerouted: "serious, found", lost: "serious, never read" },
      missedOf: (n) => (n === 0 ? "No serious signal went unread" : n === 1 ? "1 serious signal went unread" : `${n} serious signals went unread`),
    },
  },
  es: {
    name: "Radar de Proveedores",
    oneLiner: "Revisa las señales sobre un proveedor antes de firmar con él.",
    chips: ["Riesgo de proveedores", "2 min", "Demo en vivo"],
    analogy: {
      heading: { before: "La", accent: "analogía" },
      paragraphs: [
        "Antes de contratar a alguien pides referencias. Si solo llamas a las dos primeras de la lista, puede que la que importaba fuera la tercera.",
        "El radar junta lo que se dice de un proveedor, desde noticias hasta registros públicos, y lo ordena por relevancia. El analista decide hasta dónde de la lista lee.",
      ],
      dictionaryLabel: "En el diagrama de abajo",
      dictionary: [
        { term: "una referencia", means: "una señal sobre el proveedor" },
        { term: "una mala referencia", means: "una señal grave" },
        { term: "la llamada que no hiciste", means: "una señal que nadie leyó" },
        { term: "a cuántos llamas", means: "desde qué relevancia lee el analista" },
      ],
    },
    why: { title: "Por qué lo hice", text: "" },
    tryIt: {
      heading: { accent: "Pruébalo" },
      lead: "Diez señales sobre un proveedor, ordenadas de 10 a 100 en relevancia. Dos de ellas son graves.",
      question: (c) => `Antes de correrlo, apuesta: si el analista lee desde relevancia ${c} hacia arriba, ¿se queda sin leer alguna señal grave?`,
      yes: "Sí, se le pasa al menos una",
      no: "No, encuentra las dos",
      cutoffLabel: "El analista lee desde relevancia",
      cutoffHint: "Más alto significa menos señales que leer.",
      note: "Cada cuadrito es una señal, de la menos a la más relevante. Una azul es grave y el analista la encontró. Una roja es grave y nadie la leyó.",
      simulate: "Correr",
      cancel: "Cancelar",
      reset: "Empezar de nuevo",
      error: "No se pudieron revisar las señales.",
      idle: "Haz tu apuesta y presiona Correr.",
    },
    compare: {
      heading: { before: "Tu corte", accent: "o leer todo" },
      lead: "Las mismas diez señales. Solo cambia hasta dónde lee el analista.",
      mine: "Tu corte",
      all: "Leer todo",
      missed: "señales graves sin leer",
      read: (n) => `${n} de 10 señales leídas`,
      sentence: (mine, all) => {
        if (mine.read === all.read) return "Con tu corte el analista ya lee todo, así que los dos resultados son iguales.";
        if (mine.missed === 0) return `Con tu corte el analista leyó ${mine.read} de 10 señales y aun así encontró las dos graves.`;
        return `Leyendo ${mine.read} ${mine.read === 1 ? "señal" : "señales"}, al analista se le ${mine.missed === 1 ? "pasó una grave" : `pasaron ${mine.missed} graves`}. Leyendo las ${all.read}, no se le pasó ninguna.`;
      },
    },
    fit: {
      heading: { before: "¿Dónde", accent: "sirve?" },
      worthLabel: "Vale la pena",
      worth: "Cuando un área de compras firma con decenas de proveedores al año y alguien tiene que decidir cuánta lectura merece cada uno.",
      notLabel: "No hace falta",
      not: "En una compra única a un proveedor que ya conoces bien.",
    },
    proves: {
      heading: { before: "Lo que", accent: "demuestra" },
      text: "Convertí \"cuánto deberíamos leer\" en un número que el equipo puede ver y discutir. El costo de leer menos aparece como un cuadrito rojo, antes de firmar el contrato.",
    },
    engineers: {
      summary: "Para ingenieros",
      points: [
        "Las diez señales son un lote ficticio fijo, con relevancia de 10 a 100 y graves en 40 y 80. El producto completo las arma con búsqueda web y un modelo de lenguaje; este demo no llama a ninguna API.",
        "El triage lee toda señal con relevancia igual o mayor al corte. Una señal grave por debajo cuenta como no leída.",
        "Los tests fijan los conteos con cortes 0, 40 y 50, y recorren el slider para comprobar que la apuesta puede salir para los dos lados.",
        "Stack: Next.js 16, TypeScript, node:test.",
      ],
      repoLabel: "Código fuente",
    },
    scene: {
      title: "Las llamadas a las referencias",
      caption: "El teléfono llama solo a las referencias desde el corte hacia arriba. Cada respuesta pinta la tarjeta: verde si todo bien, azul si te advierten de un problema. Una tarjeta roja con una cruz es una mala referencia que nunca llamaste.",
      order: "de la menos relevante a la más relevante",
      callsFrom: (c) => `Llamas desde la relevancia ${c}`,
      notCalled: "no llamas",
      bubble: "“Tuvimos problemas”",
      legend: { ok: "buena referencia", found: "mala referencia que escuchaste", lost: "mala referencia que nunca llamaste" },
      called: (n) => `Llamaste a ${n} de 10`,
      uncalled: (n) => (n === 0 ? "No quedó sin llamar ninguna mala referencia" : n === 1 ? "Quedó sin llamar 1 mala referencia" : `Quedaron sin llamar ${n} malas referencias`),
      describe: (c, read, missed) => `Diez referencias ordenadas de la menos a la más relevante. Llamas desde la relevancia ${c} y haces ${read} ${read === 1 ? "llamada" : "llamadas"}. ${missed === 0 ? "No quedó sin llamar ninguna mala referencia." : missed === 1 ? "Quedó sin llamar 1 mala referencia." : `Quedaron sin llamar ${missed} malas referencias.`}`,
      tapeLabel: "Diez señales, de la menos a la más relevante",
      tape: { served: "sin problema", rerouted: "grave, encontrada", lost: "grave, nunca leída" },
      missedOf: (n) => (n === 0 ? "No quedó sin leer ninguna señal grave" : n === 1 ? "Quedó sin leer 1 señal grave" : `Quedaron sin leer ${n} señales graves`),
    },
  },
};
