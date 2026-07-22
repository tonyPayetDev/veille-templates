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
