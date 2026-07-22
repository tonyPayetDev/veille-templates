// Template prompts for /veille-to-video (Autoboost Neon Video)
// Each prompt is paste-ready: replace {{VARS}} then send to Claude Code.
window.TEMPLATES = [
  {
    id: "tuto-avatar",
    name: "Tuto Avatar (base)",
    tag: "Tutoriel",
    desc: "Le format de référence : avatar + b-roll, on montre comment faire une chose précise.",
    prompt: `/veille-to-video

Format : TUTO AVATAR (référence).
Sujet : {{SUJET}}
Workflow / outil montré : {{OUTIL_OU_WORKFLOW_N8N}}
Screen record dispo : {{LIEN_SCREEN_RECORD}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots, 25-35s) :
1. Hook 3s — le problème concret que ça résout ("Tu perds X heures à ...").
2. Corps — les 3 étapes du workflow, une phrase par étape, avec le nom réel des outils.
3. Preuve — un chiffre ou un résultat mesurable.
4. CTA — le modèle est gratuit, commente le mot {{MOT_CLE_CTA}}.

Visuels : avatar en bas + b-roll screen record du workflow en fond, schémas de flux, panneaux UI.
Palette néon Autoboost (jaune #FFE600, violet #A855F7, orange #FF8A3D), captions TikTok 27px.`
  },
  {
    id: "avant-apres",
    name: "Avant / Après",
    tag: "Tutoriel",
    desc: "Split visuel : la galère manuelle vs l'automatisation.",
    prompt: `/veille-to-video

Format : AVANT / APRÈS.
Sujet : {{SUJET}}
Tâche manuelle remplacée : {{TACHE_MANUELLE}}
Automatisation : {{OUTIL_OU_WORKFLOW_N8N}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — "Avant, je faisais {{TACHE_MANUELLE}} à la main : {{TEMPS_PERDU}}."
2. AVANT — 2 phrases sur la douleur, visuel rouge/orange désaturé, compteur de temps qui monte.
3. Bascule — transition nette sur le mot pivot ("Maintenant").
4. APRÈS — le workflow tourne seul, visuel néon jaune, compteur qui tombe.
5. CTA — commente {{MOT_CLE_CTA}}.

Visuels : écran coupé en deux, avatar en bas, b-roll du workflow côté APRÈS.`
  },
  {
    id: "erreur-a-eviter",
    name: "L'erreur à éviter",
    tag: "Pédago",
    desc: "On montre la faute que tout le monde fait, puis le correctif.",
    prompt: `/veille-to-video

Format : ERREUR À ÉVITER.
Sujet : {{SUJET}}
Erreur ciblée : {{ERREUR}}
Correctif : {{CORRECTIF}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — "90% des gens qui font {{SUJET}} font cette erreur."
2. L'erreur — la montrer à l'écran, croix rouge/orange, 2 phrases sur la conséquence.
3. Pourquoi ça casse — 1 phrase technique crédible.
4. Le correctif — {{CORRECTIF}}, montré dans l'outil, check néon jaune.
5. CTA — commente {{MOT_CLE_CTA}}.

Visuels : avatar en bas, zoom sur le paramètre fautif dans l'UI, annotation flèche néon.`
  },
  {
    id: "top-3-outils",
    name: "Top 3 outils",
    tag: "Liste",
    desc: "Trois cartes rythmées, une par outil, avec un gagnant.",
    prompt: `/veille-to-video

Format : TOP 3.
Thème : {{THEME}}
Outils : 1) {{OUTIL_1}} 2) {{OUTIL_2}} 3) {{OUTIL_3}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — "3 outils pour {{THEME}}, le 3e est celui que j'utilise tous les jours."
2. Trois blocs de ~6s : nom, ce qu'il fait, pour qui, un chiffre (prix ou temps gagné).
3. Verdict — pourquoi {{OUTIL_3}} gagne.
4. CTA — commente {{MOT_CLE_CTA}}.

Visuels : avatar en bas, une carte néon numérotée par outil (logo/UI réelle en b-roll), transition slide à chaque numéro. Le numéro actif en jaune #FFE600.`
  },
  {
    id: "etude-de-cas",
    name: "Étude de cas chiffrée",
    tag: "Preuve",
    desc: "Client réel, chiffres avant/après, compteurs animés.",
    prompt: `/veille-to-video

Format : ÉTUDE DE CAS.
Client / secteur : {{CLIENT_SECTEUR}}
Problème : {{PROBLEME}}
Solution livrée : {{SOLUTION}}
Résultats chiffrés : {{KPI_1}}, {{KPI_2}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — le résultat en premier ("{{KPI_1}} en 3 semaines pour {{CLIENT_SECTEUR}}").
2. Contexte — le problème en 2 phrases.
3. Ce qu'on a mis en place — {{SOLUTION}}, montré à l'écran.
4. Résultats — {{KPI_1}} et {{KPI_2}} en compteurs animés néon.
5. CTA — commente {{MOT_CLE_CTA}}.

Visuels : avatar en bas, dashboard/graphe réel en b-roll, compteurs qui montent sur le mot clé.`
  },
  {
    id: "demo-n8n",
    name: "Démo n8n live",
    tag: "Tutoriel",
    desc: "On déroule le workflow node par node sur le screen record.",
    prompt: `/veille-to-video

Format : DÉMO N8N LIVE.
Workflow : {{NOM_WORKFLOW}} ({{LIEN_N8N}})
Screen record : {{LIEN_SCREEN_RECORD}}
Nodes clés : {{NODE_1}}, {{NODE_2}}, {{NODE_3}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — ce que le workflow produit, pas comment il marche.
2. Le trigger — {{NODE_1}}, quand il part.
3. Le traitement — {{NODE_2}}, la logique en une phrase.
4. La sortie — {{NODE_3}}, où ça atterrit.
5. CTA — le workflow JSON est gratuit, commente {{MOT_CLE_CTA}}.

Visuels : b-roll du canvas n8n en fond, un halo néon jaune sur le node en cours de narration, avatar en bas droite sans chevaucher les captions.`
  },
  {
    id: "storytime",
    name: "Storytime freelance",
    tag: "Narratif",
    desc: "Anecdote perso → leçon → outil. Plus de temps caméra sur l'avatar.",
    prompt: `/veille-to-video

Format : STORYTIME.
Anecdote : {{ANECDOTE}}
Leçon : {{LECON}}
Outil / système qui a réglé ça : {{OUTIL_OU_WORKFLOW_N8N}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — l'anecdote lancée au milieu de l'action, sans intro.
2. Le mur — ce qui a foiré, ce que ça a coûté.
3. Le déclic — {{LECON}}.
4. Le système — {{OUTIL_OU_WORKFLOW_N8N}}, montré 4-5s en b-roll.
5. CTA — commente {{MOT_CLE_CTA}}.

Visuels : avatar plus grand et plus longtemps à l'écran, b-roll léger, texte qui slide sur les mots forts.`
  },
  {
    id: "comparatif",
    name: "Comparatif A vs B",
    tag: "Liste",
    desc: "Deux colonnes, critères qui s'allument, verdict.",
    prompt: `/veille-to-video

Format : COMPARATIF A vs B.
A : {{OPTION_A}} — B : {{OPTION_B}}
Critères : {{CRITERE_1}}, {{CRITERE_2}}, {{CRITERE_3}}
Verdict : {{GAGNANT}} pour {{CAS_D_USAGE}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — "{{OPTION_A}} ou {{OPTION_B}} ? J'ai testé les deux."
2. Trois passes de critère, une phrase chacune, le gagnant du critère s'allume en jaune.
3. Verdict — {{GAGNANT}}, et le cas où l'autre reste meilleur.
4. CTA — commente {{MOT_CLE_CTA}}.

Visuels : deux colonnes néon (violet vs orange), coche animée par critère, avatar en bas.`
  },
  {
    id: "checklist",
    name: "Checklist en 5 points",
    tag: "Liste",
    desc: "Cinq items qui se cochent au rythme de la voix.",
    prompt: `/veille-to-video

Format : CHECKLIST 5 POINTS.
Sujet : {{SUJET}}
Points : {{POINT_1}}, {{POINT_2}}, {{POINT_3}}, {{POINT_4}}, {{POINT_5}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — "La checklist que je passe avant chaque {{SUJET}}."
2. Cinq points, ~4s chacun, une phrase actionnable par point (pas de définition).
3. CTA — la checklist complète est gratuite, commente {{MOT_CLE_CTA}}.

Visuels : liste néon verticale, chaque ligne se coche en jaune #FFE600 sur le mot clé de la caption, b-roll de l'outil en fond, avatar en bas.`
  },
  {
    id: "veille-ia",
    name: "Veille IA (news du jour)",
    tag: "Narratif",
    desc: "Une actu IA → ce que ça change concrètement pour un freelance.",
    prompt: `/veille-to-video

Format : VEILLE IA.
Actu : {{ACTU}} (source : {{SOURCE}})
Impact concret : {{IMPACT_FREELANCE}}
Mot-clé CTA : {{MOT_CLE_CTA}}

Structure narration (100-115 mots) :
1. Hook — l'annonce brute, en une phrase, sans "aujourd'hui je vais vous parler de".
2. Ce que c'est vraiment — 2 phrases, sans hype.
3. Ce que ça change pour toi — {{IMPACT_FREELANCE}}, exemple concret de tâche.
4. Ce que je fais avec — mon workflow / mon usage.
5. CTA — commente {{MOT_CLE_CTA}}.

Visuels : captures de l'annonce officielle en b-roll, avatar en bas, chiffres clés en néon violet.`
  }
];

// Exemple d'un template rempli, tel qu'on l'envoie réellement.
window.EXAMPLE = {
  title: "Top 3 × Pastel doux",
  note: "Le template « Top 3 » avec ses variables remplies et la direction artistique « Pastel doux ». C'est exactement ce qu'on colle dans Claude Code.",
  prompt: `/shortforge

Format : TOP 3.
Thème : automatiser sa prospection en freelance
Outils : 1) Apollo 2) Lemlist 3) n8n
Mot-clé CTA : PROSPECT

Structure narration (100-115 mots) :
1. Hook — "3 outils pour automatiser sa prospection, le 3e est celui que j'utilise tous les jours."
2. Trois blocs de ~6s : nom, ce qu'il fait, pour qui, un chiffre (prix ou temps gagné).
   - Apollo : base de 275 millions de contacts, pour trouver les emails. 49 $/mois.
   - Lemlist : séquences d'emails à froid avec relances automatiques. 69 $/mois.
   - n8n : relie les deux et déclenche tout seul. Gratuit en auto-hébergé.
3. Verdict — n8n gagne parce qu'il remplace les abonnements au lieu de s'ajouter à eux : une fois le
   workflow branché, la prospection tourne sans que tu ouvres un onglet. 6 heures par semaine récupérées.
4. CTA — le workflow est gratuit, commente le mot PROSPECT.

DIRECTION ARTISTIQUE : PASTEL DOUX.
Palette : fonds pastel #fdf2f8 / #eef2ff, accents lavande #a78bfa et miel #fbbf24, ombres colorées très diffuses.
Police : sans-serif ronde (Nunito / Poppins), graisse 600, coins arrondis 24px partout.
Captions : pilule arrondie pastel, texte gris foncé, mot actif en lavande.
Animation : easing moelleux (spring, damping élevé), échelle 0.9 → 1, éléments qui flottent doucement en boucle, transitions par fondu croisé. Rien d'agressif, rien de rapide.
Numéro actif de chaque carte en lavande #a78bfa (remplace le jaune du style par défaut).`
};

// Directions artistiques interchangeables.
// Le bloc `prompt` se colle À LA SUITE d'un template de format et remplace ses consignes visuelles.
window.STYLES = [
  {
    id: "neon-autoboost",
    name: "Neon Autoboost",
    swatch: ["#0b0b0d", "#FFE600", "#A855F7"],
    desc: "La charte maison. Matte black dégradé, accents néon, captions TikTok.",
    prompt: `DIRECTION ARTISTIQUE : NEON AUTOBOOST (charte maison).
Palette : fond gris/violet dégradé (jamais noir plat), accent jaune #FFE600, secondaires violet #A855F7 et orange #FF8A3D.
Police : Sora / Inter, graisses 700-900, tracking serré, majuscules sur les titres.
Captions : TikTok mot-à-mot, 27px, une ligne, 3 mots max, un seul mot actif en néon avec glow.
Animation : slide + scale rapide (0.25s, ease-out), glow pulse sur le mot actif, transitions par wipe latéral.`
  },
  {
    id: "editorial",
    name: "Éditorial print",
    swatch: ["#f4f1ea", "#111111", "#c0392b"],
    desc: "Magazine papier : serif, crème, filets fins, tout respire.",
    prompt: `DIRECTION ARTISTIQUE : ÉDITORIAL PRINT.
Palette : fond crème #f4f1ea, texte encre #111, un seul accent rouge brique #c0392b. Pas de glow, pas de néon.
Police : serif éditoriale (Playfair Display / Instrument Serif) pour les titres, sans-serif fine (Inter 400) pour le corps. Grandes marges, filets 1px.
Captions : bas de cadre, sans-serif 24px, minuscules, pas de contour — un simple fond crème translucide.
Animation : lente et sobre — fade + montée 12px (0.6s, ease-in-out), mots des titres qui arrivent un par un, aucune rotation ni rebond.`
  },
  {
    id: "brutalist",
    name: "Brutalist mono",
    swatch: ["#ffffff", "#000000", "#0000ff"],
    desc: "Grille apparente, monospace, blocs noirs, zéro décoration.",
    prompt: `DIRECTION ARTISTIQUE : BRUTALIST MONO.
Palette : blanc pur, noir pur, un bleu système #0000ff. Bordures noires 3px, aucun arrondi, aucune ombre.
Police : monospace (JetBrains Mono / Courier), MAJUSCULES, tracking large sur les labels.
Captions : bloc noir plein, texte blanc mono, aligné à gauche, collé au bord.
Animation : coupes sèches, aucun easing progressif — apparitions en 1 frame, décalages de grille, effet "typewriter" sur les titres, compteurs qui défilent en chiffres bruts.`
  },
  {
    id: "swiss",
    name: "Swiss minimal",
    swatch: ["#ffffff", "#1a1a1a", "#ff3b30"],
    desc: "Helvetica, grille stricte, beaucoup de blanc, un seul rouge.",
    prompt: `DIRECTION ARTISTIQUE : SWISS MINIMAL.
Palette : blanc, gris #1a1a1a, accent rouge #ff3b30 utilisé une fois par scène maximum.
Police : Helvetica Now / Inter Tight, graisse 500-700, alignement à gauche, grille 12 colonnes visible dans la composition.
Captions : haut de cadre ou tiers inférieur strict, texte noir sur blanc, pas d'effet.
Animation : masques rectangulaires qui révèlent le texte (0.4s, cubic-bezier(.2,.8,.2,1)), déplacements toujours sur un seul axe, rien ne tourne, rien ne rebondit.`
  },
  {
    id: "terminal",
    name: "Dark terminal",
    swatch: ["#0d1117", "#3ddc84", "#ff6b6b"],
    desc: "Console dev : fond charbon, vert phosphore, curseur clignotant.",
    prompt: `DIRECTION ARTISTIQUE : DARK TERMINAL.
Palette : fond #0d1117, texte gris clair #c9d1d9, accent vert #3ddc84, erreurs en rouge #ff6b6b.
Police : monospace (JetBrains Mono), prompts \`$\` devant les titres, numéros de ligne dans la marge.
Captions : en bas, style ligne de commande, curseur bloc qui clignote en fin de phrase.
Animation : frappe caractère par caractère sur les titres, scroll de logs en fond, apparitions par ligne, glitch très bref (2 frames) sur les transitions. Pas de fondu doux.`
  },
  {
    id: "y2k",
    name: "Y2K chrome",
    swatch: ["#c9d6ff", "#e2e2e2", "#ff2fb9"],
    desc: "Chrome liquide, dégradés bleutés, gros titres bombés.",
    prompt: `DIRECTION ARTISTIQUE : Y2K CHROME.
Palette : dégradés bleu-argent #c9d6ff → #e2e2e2, accent rose fluo #ff2fb9, reflets métalliques.
Police : grotesque très grasse (Anton / Archivo Black) avec effet chrome (dégradé vertical + contour blanc), légères déformations bombées.
Captions : centrées, texte chrome avec contour, léger tremblement permanent.
Animation : rebond élastique (overshoot 15%), rotations 3D légères des cartes, étoiles/scintillements ponctuels, transitions par zoom avant rapide.`
  },
  {
    id: "vhs",
    name: "VHS rétro",
    swatch: ["#1b1b2f", "#ff4d6d", "#4deeea"],
    desc: "Bande analogique : scanlines, aberration chromatique, timecode.",
    prompt: `DIRECTION ARTISTIQUE : VHS RÉTRO.
Palette : bleu nuit #1b1b2f, magenta #ff4d6d, cyan #4deeea. Grain, scanlines fines, léger vignettage.
Police : sans-serif condensée façon OSD caméscope, plus un timecode \`00:00:12:04\` en haut à droite et un label \`REC ●\`.
Captions : blanches avec ombre portée dure, légère aberration chromatique rouge/cyan.
Animation : tracking jitter vertical toutes les 2-3s, transitions par déchirure horizontale, images qui "s'accrochent" une frame, aucun mouvement parfaitement lisse.`
  },
  {
    id: "pastel",
    name: "Pastel doux",
    swatch: ["#fdf2f8", "#a78bfa", "#fbbf24"],
    desc: "Fonds pastel, formes rondes, motion moelleux. Ton pédago et accessible.",
    prompt: `DIRECTION ARTISTIQUE : PASTEL DOUX.
Palette : fonds pastel #fdf2f8 / #eef2ff, accents lavande #a78bfa et miel #fbbf24, ombres colorées très diffuses.
Police : sans-serif ronde (Nunito / Poppins), graisse 600, coins arrondis 24px partout.
Captions : pilule arrondie pastel, texte gris foncé, mot actif en lavande.
Animation : easing moelleux (spring, damping élevé), échelle 0.9 → 1, éléments qui flottent doucement en boucle, transitions par fondu croisé. Rien d'agressif, rien de rapide.`
  },
  {
    id: "luxe",
    name: "Luxe or & noir",
    swatch: ["#0a0a0a", "#c9a227", "#f5f5f0"],
    desc: "Haut de gamme : noir profond, filets or, typo fine espacée.",
    prompt: `DIRECTION ARTISTIQUE : LUXE OR & NOIR.
Palette : noir profond #0a0a0a, or #c9a227 en filets et bordures uniquement, ivoire #f5f5f0 pour le texte.
Police : serif haute (Cormorant / Didot) en titres, tracking très large (0.25em) sur les sous-titres en petites capitales.
Captions : discrètes, ivoire, sans fond, en bas de cadre.
Animation : très lente — révélations par masque horizontal (0.9s), filets or qui se tracent, léger parallax des fonds, aucun rebond, aucune vitesse.`
  },
  {
    id: "papercut",
    name: "Papier découpé",
    swatch: ["#fef6e4", "#f582ae", "#001858"],
    desc: "Collage : couches de papier, ombres portées nettes, textures.",
    prompt: `DIRECTION ARTISTIQUE : PAPIER DÉCOUPÉ.
Palette : papier crème #fef6e4, rose #f582ae, bleu encre #001858. Textures papier visibles, ombres portées dures et décalées (4px).
Police : sans-serif géométrique grasse (Poppins 800), titres posés de travers de 2-3°.
Captions : étiquette papier avec ombre portée, texte bleu encre.
Animation : les éléments sont "posés" (chute courte + petit rebond, 0.3s), découpes qui glissent depuis le hors-champ, transitions par superposition de couches. Motion stop-motion : privilégier des paliers plutôt qu'un mouvement continu.`
  }
];

