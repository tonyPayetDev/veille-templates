---
name: shortforge
description: ShortForge — transforme un script ou un brief texte en vidéo sociale 9:16 (1080x1920) avec voix clonée, avatar fixe en overlay, captions animées mot-à-mot et rendu MP4. Palette et identité configurables via config.json.
---

# shortforge

**Input :** un script ou un brief texte fourni par l'utilisateur + un échantillon de voix + un clip avatar
**Output :** un projet HyperFrames (`public/index.html`) + un MP4 rendu 1080x1920, prêt à publier

> ShortForge est un pipeline de production, pas un outil de publication. Il s'arrête au MP4 vérifié.
> Le branchement vers un outil de programmation sociale est laissé à l'utilisateur (voir Étape 8).

---

## Goal

Créer une vidéo sociale verticale à partir d'un script ou d'un brief. Sortie : un projet HyperFrames
+ un MP4 rendu, avec voix clonée, avatar persistant, captions mot-à-mot et sound design.

---

## Configuration — `config.json`

À la racine du skill, un `config.json` porte tout ce qui est propre à ta marque. Le lire au début de
chaque vidéo ; ne jamais coder ces valeurs en dur dans le composition HTML sans les avoir relues.

```json
{
  "voiceReferencePath": "assets/voice-reference-clean.wav",
  "brandColors": {
    "background": "#060606",
    "accentPrimary": "#FFE600",
    "accentSecondary": "#A855F7",
    "accentTertiary": "#FF8A3D"
  },
  "defaultCtaKeyword": "GUIDE",
  "sheetUrl": null
}
```

| Clé | Rôle |
|---|---|
| `voiceReferencePath` | Chemin (relatif au projet) vers l'échantillon WAV/MP3 propre utilisé pour le clonage de voix. 20-40 s de parole claire, sans musique ni bruit de fond. |
| `brandColors.background` | Couleur de base des scènes. Sert de point de départ aux dégradés (voir « Le look de référence »). |
| `brandColors.accentPrimary` | Accent global : bordure avatar, mots forts des captions, contours de cartes. |
| `brandColors.accentSecondary` | Accent « transformation / IA » : kickers, mots de bascule dans les captions. |
| `brandColors.accentTertiary` | Accent « action / CTA » : le mot-clé final, les boutons, les flèches de fin. |
| `defaultCtaKeyword` | Mot-clé prononcé dans le CTA quand l'utilisateur n'en fournit pas (voir « Mécanique du CTA »). |
| `sheetUrl` | **Optionnel, `null` par défaut.** Si tu tiens un tableur de suivi de production (une ligne = une vidéo), mets son URL ici ; le skill pourra y lire le script et y reporter le statut. Sans valeur, l'input est simplement le brief donné en conversation. |

Les valeurs de `brandColors` ci-dessus sont la **direction par défaut** (fond très sombre + accents
néon jaune/violet/orange). Elle est éprouvée et lisible en feed mobile, mais elle est remplaçable :
changer les quatre valeurs suffit à rehabiller toute la vidéo, aucune autre partie de la méthode
n'en dépend.

### Prérequis — clés d'API (variables d'environnement)

ShortForge est **autonome** : il ne dépend d'aucun serveur ni webhook tiers hébergé par quelqu'un
d'autre. Il appelle seulement des API que tu configures toi-même avec tes propres clés, passées en
variables d'environnement (jamais en dur dans un fichier, jamais journalisées) :

| Variable | Sert à | Étape |
|---|---|---|
| `WAVESPEED_API_KEY` | Clonage de voix (WaveSpeed Qwen3 TTS) → génère `voice.mp3`. | Étape 4 |
| `OPENAI_API_KEY` | Transcription mot-à-mot (Whisper API) pour caler les captions. **Optionnel** si tu utilises un Whisper local ou le calage manuel. | Étape 4 |

Le reste du pipeline (HyperFrames, rendu, ffmpeg) tourne **en local**, sans réseau. Aucun autre
secret n'est requis.

---

## Style de sortie

- **Format** : 1080x1920 vertical, 30 fps sauf indication contraire.
- **Durée** : 25 à 35 secondes. Ne jamais livrer sous les 25 s. Si le script source ne tient qu'en
  ~15 s de narration au débit normal, l'étoffer (plus de détail, un exemple, un bénéfice
  supplémentaire) **avant** de générer la voix. Voir Étape 1 pour le calcul du nombre de mots.
- **Palette** : accent global `brandColors.accentPrimary`, plus `accentSecondary` et
  `accentTertiary` en highlights. **Le fond n'est PAS un aplat** : chaque scène porte son propre
  dégradé (linéaire ou radial, en alternance) — voir « Le look de référence ».
- **Voix** : voix clonée depuis `voiceReferencePath`, uniquement après consentement explicite
  (Étape 3).
- **Captions** : style court mot-à-mot, **27px**, centrées dans la bande de sécurité médiane quand
  le bas de l'écran contient l'avatar, une seule ligne, trois mots maximum si possible. Exactement
  un mot actif surligné par caption. Pas de boîte/fond visible derrière le texte : texte blanc,
  contour noir, glow coloré sur le mot actif.
- **Avatar** : pas de filtres vert/noir résiduels, pas de flou latéral. L'avatar ne doit jamais
  cligner des yeux sur la première frame et ne doit jamais chevaucher les captions ni le texte de
  scène.
- **Visuels** : de vrais schémas, icônes, dashboards, graphes, flèches de flux, panneaux UI. Éviter
  les slides façon PowerPoint, les cartes de texte seules, les filtres noirs opaques sur le texte,
  la double exposition et les écrans statiques.

### Mécanique du CTA

Le CTA ne donne **pas** une URL à l'oral (illisible, non cliquable, oublié). Il demande une action
mesurable dans les commentaires, en échange d'une ressource gratuite :

> « Commente le mot **`<MOTCLÉ>`** et je t'envoie le modèle, c'est gratuit. »

- Un mot-clé **unique par vidéo** : c'est lui qui permet de router la ressource envoyée en DM.
- Un seul mot, en majuscules, sans accent, prononçable sans ambiguïté.
- Valeur par défaut : `defaultCtaKeyword` du `config.json`. L'utilisateur peut en fournir un autre
  par vidéo.
- Toujours formuler **« Commente le mot X »**, jamais « Commente X » — voir le piège TTS en
  Étape 1.

---

## Workflow

### Étape 0 — Récupérer l'input

L'input est un **script ou un brief texte fourni par l'utilisateur**. Trois formes acceptées :

1. Un script de narration déjà rédigé → aller directement à l'Étape 1.
2. Un brief (« explique tel outil / tel bénéfice, ton direct, CTA sur tel mot-clé ») → rédiger le
   script en respectant les contraintes de durée de l'Étape 1, puis le faire valider.
3. Une ligne d'un tableur de suivi, **si et seulement si** `config.json.sheetUrl` est renseigné.
   Dans ce cas : lire la feuille, filtrer les lignes non produites, proposer la suivante à
   l'utilisateur, et récupérer script + légende + mot-clé CTA. Reporter le statut et l'URL du MP4
   dans la feuille une fois la vidéo rendue.

Récupérer aussi, si disponibles : la légende + hashtags pour la publication, le mot-clé CTA, et
tout média de référence (capture d'écran, clip broll, logo).

### Étape 1 — Parser le script et calibrer la durée

Découper en **hook / corps / CTA**. Supprimer les blocs de script collés en double.

**Débit réel d'une voix clonée en français : ~3,3 mots/seconde**, mesuré sur l'audio réellement
rendu (et non sur une lecture à voix haute, qui est plus rapide). Les estimations à 3,7-4,1 mots/s
que l'on trouve ailleurs sont trop optimistes et font systématiquement dépasser les 35 s.

```
durée_estimée (s) = nombre_de_mots / 3.3
```

Cible **25-35 s → viser 100-115 mots**.

- Script trop court → étoffer le corps (détail du process, exemple concret, bénéfice, preuve
  sociale). **Ne pas ralentir le débit vocal.**
- Script trop long → le resserrer et **régénérer la voix**. Ne jamais accélérer l'audio après coup
  (`atempo` s'entend immédiatement).

Répartition indicative sur 30 s :

| Bloc | Part | Rôle |
|---|---|---|
| Hook | 0-4 s | Une promesse ou une tension, jamais une présentation de soi. |
| Corps | 4-25 s | 2 à 4 beats. Un beat = une idée = une scène. |
| CTA | 25-30 s | Le mot-clé, une fois, énoncé lentement. |

**Piège TTS sur le CTA** : `Commente VOIX` est prononcé « Commande voix » par la plupart des
moteurs TTS (liaison + ambiguïté commente/commande). Toujours écrire **`Commente le mot <MOTCLÉ>`** —
ça lève l'ambiguïté et ça sonne mieux.

Autres pièges TTS à corriger dans le texte source avant génération :
- Les sigles se lisent lettre à lettre de façon aléatoire → les écrire phonétiquement si besoin.
- Les nombres écrits en chiffres sont parfois lus dans la mauvaise langue → les écrire en toutes
  lettres pour les valeurs clés.
- Les « ... » et les tirets cadratins créent des pauses trop longues → préférer des phrases courtes
  séparées par des points.

### Étape 2 — Réécrire la narration si besoin

Réécrire **uniquement** pour le timing et la prononciation TTS. Garder le sens et les mots de
l'utilisateur partout où c'est possible. Le texte de slide reste dans la langue du script.

### Étape 3 — Consentement voix clonée

**Avant tout envoi de l'échantillon de voix à un service de clonage**, exiger un texte explicite de
l'utilisateur, du type :

> « J'autorise l'envoi de mon échantillon de voix à <service> pour générer l'audio de cette vidéo. »

Sans ce texte, ne pas appeler l'API de voice-clone. Ne jamais lire, afficher ni journaliser les
clés d'API.

### Étape 4 — Générer l'audio

Modèle de référence : WaveSpeed Qwen3 TTS voice-clone.

```bash
curl -s -X POST "https://api.wavespeed.ai/api/v3/wavespeed-ai/qwen3-tts/voice-clone" \
  -H "Authorization: Bearer ${WAVESPEED_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
        "audio": "<url publique ou base64 de voiceReferencePath>",
        "text": "<narration>",
        "language": "French"
      }'
```

- L'API est asynchrone : la réponse contient un id de tâche, il faut poller le résultat jusqu'à
  obtenir l'URL du MP3.
- **Un HTTP 200 ne garantit pas un vrai MP3.** Toujours vérifier la taille du fichier téléchargé
  (`ls -la`, `ffprobe`) avant de continuer : certains proxys renvoient un corps vide avec un
  `Content-Type: audio/mpeg` bien formé.
- Si le client time out, l'audio est en général quand même généré côté fournisseur : re-poller la
  tâche au lieu de tout relancer (et de repayer).

Sauvegarder le MP3 dans le projet sous `public/assets/voice.mp3`.

**Transcription mot-à-mot (pour des captions calées au mot).** Le pipeline est **autonome** : il
n'appelle aucun service tiers hébergé par un autre que toi. La transcription se fait directement,
par ordre de préférence :

**1. API Whisper (méthode principale, la plus fiable).** Envoyer le MP3 à l'API OpenAI `whisper-1`
en demandant les timestamps au mot. Ne nécessite qu'une clé API en variable d'environnement
(`OPENAI_API_KEY`), jamais un serveur intermédiaire.

```bash
curl -s -X POST "https://api.openai.com/v1/audio/transcriptions" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}" \
  -F file="@public/assets/voice.mp3" \
  -F model="whisper-1" \
  -F language="fr" \
  -F "response_format=verbose_json" \
  -F "timestamp_granularities[]=word"
```

La réponse contient un tableau `words` avec un `word` + `start` + `end` (en secondes) par mot.
Regrouper ensuite les mots par paquets de 2-3, en prenant le `start` du premier mot et le `end` du
dernier de chaque paquet → une entrée de caption. C'est cette liste `{text, start, end}` que la
timeline GSAP consomme pour révéler chaque caption pile sur la voix.

**2. Whisper local (optionnel, si déjà installé — évite l'appel API).**
`npx hyperframes transcribe public/assets/voice.mp3 --language fr --json` — nécessite un backend
Whisper local (`whisper-cpp` ou `parakeet-mlx`). S'il est absent, la commande échoue proprement avec
`{"ok":false,"skipped":true,"reason":"whisper_unavailable"}` : ce n'est pas une erreur, bascule
simplement sur la méthode 1.

**3. Calage manuel (dernier recours).** À défaut de timestamps réels, synchroniser les captions à la
main en écoutant l'audio et en estimant au débit (voir Étape 1) — mais les timestamps réels valent
largement l'aller-retour.

### Étape 5 — Construire `public/index.html` (HyperFrames)

- Racine explicite `width:1080px; height:1920px;` et `data-duration` correspondant au plan final
  vidéo/audio.
- `<audio id="voice" src="assets/voice.mp3" data-start="0" data-duration="...">` en enfant direct de
  la racine.
- Une seule timeline GSAP **en pause**, enregistrée dans `window.__timelines[compositionId]`.

**Captions** — spans mot-à-mot : mots neutres en texte plein sans rectangle ni fond visible ; un
seul mot actif (`.hot`, `.alt`, `.cta`) en texte coloré + glow, jamais en pastille dure sauf demande
explicite. Garder les captions loin des lignes de séparation et de la zone avatar. Si `inspect`
signale un dépassement, réduire la taille de police avant de faire du wrap.

**Structure de scène** : zone d'explication en haut, avatar en bas. Texte court. Pour un schéma de
flux, préférer un enchaînement **horizontal stable** (`Source -> Traitement -> Stockage -> Sortie`)
avec cartes-icônes, flèches et point pulsé animé. Éviter les layouts diagonaux qui se chevauchent.

Quand la demande est « premium SaaS », style Apple/Linear/Arc/Vercel/Raycast, explainer produit ou
explainer d'automatisation avec de vrais schémas/icônes/dashboards/graphes → lire
`references/premium-saas-launch.md`.

### Étape 6 — Valider avant rendu

```bash
npx hyperframes validate public --json
npx hyperframes inspect public
```

Confirmer 0 problème de layout, en particulier captions vs ligne de séparation / avatar / texte de
scène.

Ci-dessous les pièges d'environnement et de contrat qui coûtent le plus cher — tous ont été
diagnostiqués à cause d'un rendu raté, pas d'un message d'erreur.

**L'environnement varie d'une machine à l'autre.** Toujours lancer `npx hyperframes doctor` en début
de session pour diagnostiquer l'environnement réel plutôt que de recopier des exports d'une session
précédente. `doctor` sait aussi télécharger le Chrome dont il a besoin.

**Texte invisible = `FONTCONFIG_PATH` manquant.** Si Chrome headless tourne sans configuration
fontconfig accessible, il ne rasterise **aucun texte** — même les polices embarquées en base64 —
alors que les formes, boîtes et images s'affichent normalement. Le bug est silencieux :
`validate`/`inspect` passent `ok:true` quand même. Symptôme : un MP4 avec le décor mais zéro
caption. Fix : exporter `FONTCONFIG_PATH` vers un répertoire `etc/fonts` valide avant toute commande
`hyperframes`, et **vérifier visuellement** une frame avant de lancer un rendu long.

```bash
# adapter les chemins à la machine ; ne pas les recopier à l'aveugle
export FONTCONFIG_PATH="/etc/fonts"
npx hyperframes validate public --json
```

**`npx hyperframes@X ...` peut échouer silencieusement (exit 1, aucune sortie)** quand
l'installation npm déclenche un postinstall qui télécharge un binaire natif (typiquement
`onnxruntime-node`, dépendance optionnelle pour la transcription locale) depuis un hôte inaccessible
(`ECONNRESET`). Fix : installer `hyperframes` comme vraie dépendance du projet, scripts d'install
désactivés, puis appeler le binaire local.

```bash
npm install hyperframes --no-audit --no-fund --ignore-scripts
node node_modules/.bin/hyperframes validate public --json
```

Ajouter `node_modules/` au `.gitignore` du projet.

**GSAP via CDN peut être bloqué** par une politique réseau restrictive — `validate` échoue alors
avec `net::ERR_TUNNEL_CONNECTION_FAILED` puis `gsap is not defined`. Fix : vendoriser GSAP en local
plutôt que de dépendre du CDN.

```bash
npm install gsap --ignore-scripts
cp node_modules/gsap/dist/gsap.min.js public/assets/gsap.min.js
# puis <script src="assets/gsap.min.js"></script> au lieu du tag CDN
```

**Chaque `<audio>` DOIT avoir un `id` unique, même les SFX/BGM auxquels on ne se réfère nulle part
ailleurs.** Sans `id`, le renderer lève `media_missing_id` et **rend l'élément silencieux** : seuls
les `<audio>` qui ont déjà un `id` (`#voice`, `#bgm`) s'entendent, les whooshs/chimes anonymes ne
jouent pas du tout dans le MP4 final, sans avertissement visible ailleurs que dans le log de lint.
Toujours nommer explicitement chaque piste (`id="sfx-whoosh-1"`, `id="sfx-chime-1"`…).

**Chevauchements de clips dus à l'arrondi flottant** : quand deux clips sont calés bout-à-bout par
addition de flottants (`data-start="9.30"` + `data-duration="2.90"` = `12.200000000000001` alors que
le clip suivant démarre à `12.2`), `validate` lève une erreur bloquante
`StaticGuard: Invalid HyperFrame contract`. Fix simple et imperceptible : raccourcir de `0.01 s` la
durée du clip qui se termine en trop (`2.90` → `2.89`) plutôt que de recalculer toute la timeline.

**Emoji = à éviter.** Sur une machine sans police emoji couleur (cas fréquent des conteneurs Linux,
qui n'embarquent que DejaVu), tout emoji utilisé comme icône s'affiche en tofu `NO GLYPH` dans le
rendu final — et ni `validate` ni `inspect` ne le détectent. Utiliser de vraies icônes SVG inline
(`viewBox="0 0 24 24" fill="none" stroke="currentColor"`) : plus fiable de toute façon, ne dépend
d'aucune police, rendu identique partout. Les flèches/symboles Unicode simples (`→`, `✓`) passent en
général bien, mais en cas de doute préférer aussi un SVG.

### Étape 7 — Rendre et vérifier

Rendre avec HyperFrames, **avec les mêmes variables d'environnement qu'à l'Étape 6** — sans elles,
le rendu final échoue silencieusement au niveau du texte, pas au niveau du process.

Compter ~3-4 min de rendu pour une comp de ~17 s sur une machine modeste : lancer en arrière-plan
(`nohup … &`, `disown`) et surveiller le log plutôt que d'attendre en bloquant.

**`hyperframes render --out <path>` peut ignorer l'option `--out`** et écrire quand même dans
`<projet>/renders/<entryFile>_<timestamp>.mp4` (racine du projet, pas `public/renders/`). Toujours
vérifier où le fichier est réellement apparu avant de conclure à un échec :

```bash
find . -iname "*.mp4" -newer public/index.html
```

puis le déplacer vers `public/renders/<nom-final>.mp4`.

**Toujours vérifier visuellement après rendu, pas seulement avec `ffprobe`.** Extraire quelques
frames aux timestamps clés et les regarder :

```bash
ffprobe -v error -show_entries format=duration,size -show_streams <out.mp4>
ffmpeg -ss 4.6 -i <out.mp4> -frames:v 1 -q:v 2 check-04.jpg
```

`ffprobe` confirme la durée / la résolution / les codecs mais ne dit rien sur le texte, les captions
ou les icônes, qui peuvent être totalement invisibles à cause du piège fontconfig ci-dessus.

Si l'espace disque bloque le rendu, ne nettoyer QUE : le cache Chrome de Puppeteer/HyperFrames, les
anciens MP4 générés par ce même projet, les anciens dossiers de frames de contrôle. Ne jamais
supprimer les échantillons de voix source, les uploads de l'utilisateur, ni les assets de référence.

### Étape 8 — Livrer

ShortForge s'arrête au MP4 vérifié. Deux règles de livraison, indépendantes de l'outil de
publication utilisé :

**1. La miniature — obligatoire, sinon toutes les vidéos se ressemblent.**
La **frame 0 d'une vidéo de ce type est quasi identique d'une vidéo à l'autre** : fond sombre + le
cercle avatar, zéro texte, parce que tout le contenu des scènes arrive en animation depuis
`opacity: 0`. Les plateformes prennent cette frame par défaut → dans le feed, les vidéos sont
indistinguables et le hook n'est pas lisible.

Pas besoin de re-rendre : extraire une frame où le **hook texte est gros et lisible**, et la fournir
explicitement comme cover.

```bash
ffmpeg -ss <t> -i <out.mp4> -frames:v 1 -q:v 2 cover.jpg   # sortie 1080x1920
```

- Choisir un instant **différent d'une vidéo à l'autre** et vérifier visuellement que les covers ne
  se ressemblent pas.
- La plupart des API de publication acceptent soit une image de cover uploadée, soit un timestamp de
  cover **en millisecondes** — vérifier laquelle attend le service ciblé.

**2. Vérifier tout upload au `content-length`, jamais au code HTTP.** Comparer la taille servie par
le stockage distant à la taille du fichier local. Un `HTTP 200` ne prouve rien : un upload tronqué
répond 200 tout aussi bien.

Avant toute publication publique, **confirmer le compte et la plateforme avec l'utilisateur** — la
publication est visible publiquement et souvent irréversible.

### Étape 9 — Reporter (optionnel)

Si `config.json.sheetUrl` est renseigné, mettre à jour la ligne correspondante : statut, URL du MP4,
date de publication. Sinon, simplement rapporter à l'utilisateur : chemin du MP4, durée réelle,
mot-clé CTA employé, et l'instant retenu pour la miniature.

---

## Le look de référence — valeurs mesurées, ne pas réinventer

Ces trois valeurs sont issues d'une comparaison directe entre des vidéos qui « passaient » bien et
des vidéos qui avaient dérivé. Elles ne se rediscutent pas.

| | Référence | Dérive à ne PAS refaire |
|---|---|---|
| Taille des captions | **27px** | 68px — 2,5× trop gros, lourdaud à l'écran |
| Fond de la zone haute | **dégradé par scène** | aplat `#060606` |
| Contenu des scènes | **vrais panneaux UI, mockups, flux à icônes** | piles de cartes de texte |

**1. Captions à 27px.** Pas 68. Le bloc tel quel :

```css
.caption {
  position: absolute; left: 50%; top: 0; transform: translateX(-50%); white-space: nowrap;
  font-size: 27px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; line-height: 1.2;
  text-shadow: -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000,
               -3px 0 0 #000, 3px 0 0 #000, 0 -3px 0 #000, 0 3px 0 #000;
  opacity: 0;
}
```

La bande reste à `top: 960px; height: 140px` (voir Règles Captions).

**2. La zone haute porte un dégradé — jamais un aplat.** Chaque scène a le sien, en **alternant
linéaire et radial** d'une scène à l'autre : c'est cette alternance qui fait « respirer » le
montage. Exemple avec la direction par défaut (à ré-dériver de `brandColors` si tu changes de
palette) :

```css
.scene-1 { background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2a 100%); }
.scene-2 { background: radial-gradient(circle at 50% 40%, #12081f 0%, #050505 74%); }
.scene-3 { background: linear-gradient(135deg, #0a0a0a 0%, #12081f 100%); }
.scene-4 { background: radial-gradient(circle at 50% 40%, #1a0a2a 0%, #050505 70%); }
```

**3. Vrais panneaux UI, pas des cartes de texte.** Le vocabulaire visuel qui marche :
- **kicker** court et coloré (`accentSecondary`) → **titre** avec un mot en couleur → **le visuel**
- fenêtre avec barre de titre + 3 points + un nom de domaine/fichier
- flux horizontal : `.node` de 168px reliés par des `.link` (52px, flèche CSS + point pulsé)
- mockup d'interface réaliste (bulle de messagerie avec « envoyé ✓ », sidebar d'app, dashboard)

**Avant de rendre, comparer une frame à une vidéo précédente validée** :

```bash
ffmpeg -i ancienne.mp4 -i nouvelle.mp4 -filter_complex "[0:v][1:v]hstack" -frames:v 1 compare.jpg
```

C'est le seul moyen fiable d'attraper ce genre de dérive — aucun `validate`/`inspect` ne la détecte.

---

## Règles Captions

- **27px** — jamais 68px.
- Maximum trois mots par caption si possible.
- Un seul mot actif surligné par caption.
- Code couleur : `accentPrimary` pour les mots de force/valeur, `accentSecondary` pour
  transformation/IA, `accentTertiary` pour actions/CTA.
- Doit rester lisible sur mobile et passer `hyperframes inspect` avec 0 dépassement / 0 occlusion.
- Style validé : `text-transform: uppercase`, `font-size: 27px`, `letter-spacing: 2px`,
  `font-weight: 700`. Positionner la bande de captions **plus haut que le centre bas de l'écran**
  (`top: 960px; height: 140px` sur une comp 1080×1920) plutôt que juste au-dessus de l'avatar : plus
  lisible et mieux séparé visuellement du cadre avatar. Toujours revalider `inspect` après un
  changement de taille ou de position — l'uppercase et une police plus grosse peuvent faire déborder
  les captions les plus longues.
- **Ne JAMAIS combiner `-webkit-text-stroke` avec un contour en `text-shadow` sur le même texte.**
  Les deux techniques superposées produisent un effet de double contour / lettres dédoublées,
  visible à l'œil sur le rendu final sous le rasterizer logiciel de Chrome headless (SwiftShader) —
  invisible en inspectant le CSS ou le DOM, seulement visible en vérifiant des frames réelles du MP4.
  Utiliser **une seule** des deux méthodes : soit `-webkit-text-stroke` seul, soit un `text-shadow`
  8 directions (`-Npx -Npx`, `Npx -Npx`, `-Npx Npx`, `Npx Npx`, `-Npx 0`, `Npx 0`, `0 -Npx`,
  `0 Npx`, tous `0 #000`) plus une ombre douce pour la profondeur. Le `text-shadow` seul suffit
  largement et rend proprement en headless.

---

## Sound design (BGM + SFX)

**Niveaux `data-volume` de référence** — le sound design doit rester **derrière** la voix, jamais au
même niveau :

| Piste | Volume |
|---|---|
| `#voice` | `1` |
| `#bgm` | `0.09` |
| `sfx-whoosh-*` | `0.15` |
| `sfx-chime` | `0.20` |

**Le volume BGM dépend de la piste, pas d'une constante.** Mesurer le LUFS avant de choisir : une
piste à -12,4 LUFS demande `0.05` là où une piste à -19,1 LUFS demande `0.09`. 7 dB d'écart — sans
mesure, la musique passe devant la voix.

```bash
ffmpeg -i bgm.mp3 -af loudnorm=print_format=json -f null -
```

**Whooshes** : un whoosh brut dure souvent ~5,5 s avec son pic vers 2,5 s. Le recouper pour que le
pic tombe *pile* sur la coupe visuelle — donc démarrer le SFX ~1,2 s **avant** la coupe, pas dessus.

**Palette SFX réutilisable.** Constituer une fois une palette de SFX (whooshes, chimes, impacts,
risers) rangée dans un dossier partagé versionné (`assets/sfx/v1/`) avec un README décrivant rôle,
volume et piège de chaque fichier. Pour chaque nouvelle vidéo : copier les fichiers dans
`public/assets/`, reprendre les rôles/volumes, et **re-caler les `data-start` sur les coupes de la
nouvelle vidéo** — les rôles se transposent, jamais les timestamps. Figer `v1/` : toute évolution du
mix crée `v2/`, on ne modifie ni ne supprime les versions précédentes, pour que chaque vidéo déjà
rendue garde sa palette d'origine.

**Sourcing :**
- **Ne jamais synthétiser le sound design par défaut** (sinusoïdes ffmpeg, bruit filtré) si une
  vraie source libre de droits est accessible — un pad/whoosh/chime « fait maison » est
  perceptiblement moins bon qu'une vraie piste, même courte. Dernier recours documenté uniquement.
- **Piste fournie par l'utilisateur** : toujours prioritaire sur une source tierce. Télécharger,
  retirer la cover art (`ffmpeg -vn`), trim + fade sur la durée de la vidéo.
- **Bibliothèques sur abonnement (type Epidemic Sound)** : la recherche et le téléchargement sont
  deux permissions distinctes côté API. Vérifier qu'un téléchargement réussit réellement avant de
  s'appuyer dessus, et ne jamais utiliser une URL de **preview** basse qualité comme substitut dans
  une vidéo publiée — les previews ne sont pas licenciées pour du contenu final.
- **Mixkit — méthode vérifiée, sans clé API** (musique, SFX et vidéo stock). Licence « Mixkit
  Free » : usage commercial libre, sans attribution requise.
  1. `curl -s -A "Mozilla/5.0" "https://mixkit.co/free-stock-music/<tag>/"` (ou
     `free-sound-effects/<tag>/`) → parser le JSON-LD `<script type="application/ld+json">` embarqué
     dans le HTML. Chaque entrée `MusicRecording` a un champ `"url"` = lien MP3 direct, déjà
     téléchargeable tel quel.
  2. Pour un SFX, la page catégorie n'expose que l'URL de preview (souvent suffisante) ; pour le
     fichier « download » officiel (souvent `.wav`), appeler
     `curl "https://mixkit.co/free-sound-effects/download/<id>/?context=item+grid"` et lire
     `data-download--modal-url-value="…"` dans la réponse — c'est le vrai fichier.
  3. Retirer toute pochette embarquée avec `ffmpeg -vn` avant d'utiliser le fichier comme `<audio>` :
     une cover mjpeg attachée ajoute un flux vidéo parasite.
- **Pexels bloque le scraping direct** (`403`, protection anti-bot). Ne pas perdre de temps sans clé
  API officielle. Mixkit reste la source par défaut.

---

## Piège CSS : `video { display: none }` cache l'avatar silencieusement

Beaucoup de comps ont une règle générique `audio, video { display: none; }` pour masquer les
éléments `<audio>` (légitime : on ne veut pas de UI native). Si `<video id="avatar">` matche aussi ce
sélecteur, le cercle avatar reste **vide sur tout le rendu final** — et ni `validate` ni `inspect`
ne le détectent ; même l'inspection visuelle ne montre qu'un cercle noir, sans message d'erreur.

Cause : `#avatar-frame video { … }` ne déclare pas `display`, donc la propriété se résout via l'autre
règle qui, elle, la déclare — indépendamment de la spécificité de `#avatar-frame video` sur les
AUTRES propriétés.

Avant d'ajouter l'overlay avatar, toujours vérifier :

```bash
grep -n "video\s*{" public/index.html
```

et restreindre la règle à `audio { display: none; }` seul si besoin.

---

## Règles Avatar — pattern obligatoire

**Ceci n'est pas optionnel.** Un avatar limité à une seule scène de fin (typiquement la scène CTA)
est un défaut, pas une variante acceptable. L'avatar doit être visible **sur la majorité de la
vidéo**, masqué uniquement pendant les scènes broll plein écran.

**Architecture — l'avatar n'est PAS un enfant de `.scene`.** C'est un overlay persistant, sibling
des `.scene`, ancré au canevas entier (`#root`, 1080×1920). Trois éléments :

```html
<!-- Sibling des .scene, PAS imbriqué dedans -->
<div id="avatar-frame">
  <video id="avatar" src="assets/avatar-keyed.mp4" data-start="0" data-duration="<durée totale comp>"
         data-layout-allow-overflow="true" muted playsinline></video>
</div>
<div id="avatar-ring"  data-start="0" data-duration="<durée totale comp>" class="clip"></div>
<div id="avatar-orbit" data-start="0" data-duration="<durée totale comp>" class="clip"></div>
```

```css
:root {
  --bg: #060606;
  --accent: #FFE600;          /* = brandColors.accentPrimary */
  --accent-rgb: 255, 230, 0;  /* même couleur en composantes, pour les rgba() */
}
#avatar-frame {
  position: absolute; bottom: 70px; left: 50%;
  width: 560px; height: 560px; margin-left: -280px;
  border-radius: 50%; overflow: hidden; background: var(--bg);
  border: 5px solid var(--accent);
  box-shadow: 0 0 0 2px rgba(6,6,6,0.9),
              0 0 36px 4px rgba(var(--accent-rgb), 0.55),
              0 0 90px 20px rgba(var(--accent-rgb), 0.22);
  z-index: 5;
}
#avatar-frame video {
  position: absolute; top: 50%; left: 50%;
  width: 560px; height: 706px; transform: translate(-50%, -46%);
  object-fit: cover; object-position: center top;
}
#avatar-ring {
  position: absolute; bottom: 58px; left: 50%;
  width: 584px; height: 584px; margin-left: -292px;
  border-radius: 50%; border: 3px solid var(--accent); opacity: 0; pointer-events: none;
  box-shadow: 0 0 40px rgba(var(--accent-rgb), 0.35); z-index: 5;
}
#avatar-orbit {
  position: absolute; bottom: 52px; left: 50%;
  width: 596px; height: 596px; margin-left: -298px;
  border-radius: 50%; pointer-events: none;
  background: conic-gradient(from 0deg, transparent 0deg, transparent 280deg,
    rgba(var(--accent-rgb), 0.12) 320deg, var(--accent) 353deg, #fff8d6 360deg);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 calc(100% - 8px));
  filter: drop-shadow(0 0 12px rgba(var(--accent-rgb), 0.9)); z-index: 5;
}
```

GSAP (adapter les timestamps aux fenêtres broll de la comp) :

```js
// Masquer seulement pendant les scènes broll plein écran
tl.to(["#avatar-frame", "#avatar-orbit"], { opacity: 0, duration: 0.3, ease: "power2.out" }, BROLL_START);
tl.to(["#avatar-frame", "#avatar-orbit"], { opacity: 1, duration: 0.3, ease: "power2.out" }, BROLL_END);

// Respiration continue de l'anneau — repeat FINI dimensionné pour couvrir chaque fenêtre visible
tl.to("#avatar-ring", { opacity: 0.8, scale: 1.06, duration: 0.5, ease: "sine.inOut", repeat: N1, yoyo: true }, 0);
tl.to("#avatar-ring", { opacity: 0.8, scale: 1.06, duration: 0.5, ease: "sine.inOut", repeat: N2, yoyo: true }, BROLL_END);

// Orbit — comète qui tourne en continu
tl.to("#avatar-orbit", { rotation: "+=360", duration: 2.2, repeat: M, ease: "none" }, 0);

// Beat CTA — pulse + spin plus fort quand le mot-clé apparaît
tl.to("#avatar-ring", { opacity: 1, scale: 1.08, duration: 0.5, ease: "power2.out" }, CTA_START);
tl.to("#avatar-ring", { rotation: "+=360", duration: <temps restant>, ease: "none" }, CTA_START);
```

`N1`/`N2`/`M` = `Math.ceil(durée_fenêtre / durée_tween) - 1` (ex. fenêtre 12,93 s / 0,5 s →
`repeat: 25`). **Jamais `repeat: -1`** dans une timeline seek-based / déterministe.

**Piège : ne PAS mettre `#avatar-ring` dans un seul tween continu qui couvre toute la comp.** Si son
repeat dépasse la fenêtre broll, l'anneau continue de pulser — donc de redevenir visible —
par-dessus le broll, même avec avatar et orbit correctement masqués. Symptôme : un cercle vide qui
flotte sur la vidéo broll. Toujours calculer `N1`/`N2` pour que chaque tween s'arrête **avant** le
début du broll suivant ; jamais un seul tween qui traverse la coupure.

**Piège : `repeat` doit être IMPAIR pour que le ring retombe à `opacity: 0` avant le broll.** Un
tween `yoyo: true` fait `repeat + 1` allers-retours de `duration` chacun ; le dernier ramène
l'anneau à son état de repos (`opacity: 0`) seulement si `repeat + 1` est PAIR, donc si `repeat` est
IMPAIR. Avec un `repeat` pair, le tween se termine sur un aller « montant » et l'anneau reste figé
visible à `opacity: 0.8` pendant tout le broll — bug confirmé par extraction de frame, invisible
dans `validate`/`inspect`. Fix : après avoir calculé `N` avec la formule ci-dessus, si `N` est pair,
décrémenter de 1 (le buffer avant le broll suivant augmente légèrement, sans risque). Seule une
fenêtre suivie d'un masquage a besoin de cette parité ; la dernière fenêtre avant la fin de la vidéo
n'a pas ce risque.

**Vidéo avatar plus courte que la comp** : si `avatar-keyed.mp4` dure moins que `data-duration`
(fréquent — l'asset source fait souvent ~17 s), l'étendre en boucle **avant** de le référencer,
sinon l'avatar gèle ou disparaît dès que la source est épuisée, silencieusement (seul `validate`
avertit : « Video is Xs but its slot is Ys ») :

```bash
ffmpeg -stream_loop -1 -t <durée comp> -i avatar-keyed.mp4 -c copy avatar-loop.mp4
```

Même chose pour le BGM si le morceau est plus court que la comp.

**Scène = 1120px de haut, PAS 1920px.** `.scene { height: 1120px; … }` est correct et voulu : le
contenu de chaque scène (texte, cartes, icônes) occupe le haut du canevas, et l'avatar overlay
occupe le bas. Ne PAS passer `.scene` à 1920px pour « combler le vide en bas » : c'est l'avatar qui
doit combler cet espace, pas le texte de scène repositionné.

**Captions à `top: 960px`** (pas `bottom: …`) pour rester au-dessus du cercle avatar — sinon les
captions tombent dans la zone avatar et se chevauchent.

### Détourage de l'avatar (fond vert)

Si le clip avatar est tourné sur fond vert, utiliser le filtre `geq` plutôt que `chromakey` : il
donne un bord nettement plus propre en headless. Ordre des opérations qui fonctionne :

1. Crop **carré** avant d'appliquer le masque (sinon le masque se déforme).
2. Cropper **depuis `y=0`** (haut du cadre), pas depuis le centre.
3. Despiller le canal vert après le masque pour supprimer la frange verte résiduelle.

Vérifier ensuite qu'aucun filtre latéral vert/noir ne subsiste, et que l'avatar ne recouvre jamais
les captions ni le texte important de la scène.

### Broll plein écran (pattern pour varier, avatar masqué)

Scènes dédiées avec leur propre classe (`.scene-broll`), explicitement `height: 1920px` (override du
1120px par défaut : ces scènes-là n'ont pas besoin de laisser de la place à l'avatar puisqu'il est
masqué). Refaire apparaître l'avatar en fondu à la fin de la fenêtre broll — jamais `display: none`,
qui casse les transitions d'opacité.

**Broll = vrai clip vidéo, pas seulement un schéma motion design.** Mixkit
(`https://mixkit.co/free-stock-video/<tag>/`) est scrapable comme la musique et les SFX (JSON-LD,
champ `"contentUrl"`, licence Mixkit Free, usage commercial libre sans attribution).

- **Vérifier par thumbnail** (`thumbnailUrl` du JSON-LD) AVANT de télécharger le MP4 complet : les
  résultats sont parfois hors-sujet malgré un nom de fichier trompeur.
- Trim + downscale immédiatement — un clip brut fait 30 à 70 Mo pour quelques secondes utiles :

```bash
ffmpeg -ss <in> -t <durée scène> -i raw.mp4 -vf "scale=1080:-2" -an -c:v libx264 -crf 23 broll.mp4
```

- Poser en `<video>` plein cadre (`object-fit: cover`, `muted`, `data-start`/`data-duration` sur la
  fenêtre de la scène), assombri (`filter: brightness(0.5-0.6)`) + dégradé sombre en overlay pour que
  les captions restent lisibles par-dessus.
- Proposer 1-2 clips broll par défaut sur toute vidéo à plusieurs scènes narratives distinctes — ne
  pas attendre que l'utilisateur le redemande.

---

## Checklist finale

- [ ] Script/brief récupéré, mot-clé CTA défini
- [ ] Script calibré à 100-115 mots (25-35 s à ~3,3 mots/s)
- [ ] CTA formulé « Commente le mot X », jamais « Commente X »
- [ ] Consentement voix clonée obtenu explicitement avant tout appel au service de TTS
- [ ] Palette issue de `config.json` — et **fond en dégradé par scène**, jamais un aplat
- [ ] Captions mot-à-mot en **27px** (jamais 68), 0 dépassement `inspect`
- [ ] Un seul type de contour sur les captions (`text-shadow` OU `-webkit-text-stroke`)
- [ ] Avatar sans filtre vert/noir résiduel, ne recouvre jamais captions ni texte
- [ ] Avatar en overlay persistant (sibling des `.scene`) — visible sur la majorité de la vidéo,
      masqué seulement pendant le broll
- [ ] `repeat` des tweens `yoyo` impair avant chaque masquage broll
- [ ] Chaque `<audio>` a un `id` unique (SFX et BGM compris)
- [ ] Au moins 1-2 broll si la vidéo a plusieurs scènes narratives distinctes
- [ ] **Vrais panneaux UI / mockups / flux à icônes** — pas des piles de cartes de texte
- [ ] Frame comparée côte à côte à une vidéo précédente validée avant de rendre
- [ ] `validate` + `inspect` = 0 problème avant rendu
- [ ] Rendu vérifié à la fois par `ffprobe` (durée, résolution, taille) **et** visuellement sur des
      frames extraites
- [ ] **Miniature explicite** sur une frame où le hook texte est lisible, et différente des autres
      vidéos
- [ ] Compte et plateforme confirmés avec l'utilisateur avant toute publication
- [ ] Upload vérifié au `content-length` (taille servie = taille locale), pas au code HTTP
