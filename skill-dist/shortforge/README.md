# ShortForge

**Script ou brief → vidéo sociale 9:16 avec voix clonée, avatar fixe, captions animées, rendu MP4
1080x1920.**

ShortForge est un skill Claude Code. Tu lui donnes un script (ou juste un brief), il calibre la
durée, génère la voix clonée, construit une composition HyperFrames complète — scènes, avatar en
overlay persistant, captions mot-à-mot, sound design — puis rend et vérifie le MP4 vertical.

Ce n'est pas un générateur « une invite → une vidéo ». C'est une **méthode de production** encodée :
les valeurs de style (taille des captions, dégradés de scène, niveaux audio), les formules de timing
et surtout la liste des pièges qui produisent un MP4 silencieusement cassé — texte invisible, SFX
muet, avatar figé — sont écrites noir sur blanc pour que l'agent ne les redécouvre pas à chaque fois.

---

## Installation

Copier le dossier `shortforge/` dans un des deux emplacements :

```bash
# Skill du projet (versionné avec le repo, disponible pour ce projet seulement)
mkdir -p .claude/skills
cp -r shortforge .claude/skills/

# ou skill global (disponible dans tous tes projets)
mkdir -p ~/.claude/skills
cp -r shortforge ~/.claude/skills/
```

Arborescence attendue après copie :

```
.claude/skills/shortforge/
├── SKILL.md
├── README.md
├── config.json
└── references/
    └── premium-saas-launch.md
```

Puis **redémarrer Claude Code** (les skills sont chargés au démarrage) et lancer :

```
/shortforge
```

Vérifier que le skill est bien détecté avec `/skills` (ou en tapant `/short` : la complétion doit
proposer `shortforge`).

---

## Prérequis

| Élément | Pourquoi | Vérification |
|---|---|---|
| **Node.js ≥ 20** | Requis par HyperFrames | `node -v` |
| **HyperFrames** | Moteur de rendu HTML → MP4 | `npx hyperframes doctor` |
| **ffmpeg / ffprobe** | Détourage avatar, trim broll, extraction de frames, vérification du rendu | `ffmpeg -version` |
| **Clé API WaveSpeed** | Clonage de voix (Qwen3 TTS voice-clone) | `echo $WAVESPEED_API_KEY` |
| **Chrome / Chromium headless** | Rasterisation des frames. `hyperframes doctor` sait le télécharger. | `npx hyperframes doctor` |
| **Configuration fontconfig** | **Sans elle, Chrome headless ne rend aucun texte** — le MP4 sort avec le décor et zéro caption, sans aucun message d'erreur. | `fc-list \| head` |

### Variables d'environnement

```bash
export WAVESPEED_API_KEY="…"       # jamais en dur dans un fichier du projet
export FONTCONFIG_PATH="/etc/fonts" # adapter au système ; obligatoire si fc-list est vide
```

Ajouter ces exports à ton shell profile, ou les passer via le mécanisme d'env de Claude Code. Le
skill n'affiche ni ne journalise jamais la valeur d'une clé.

### Installation locale de HyperFrames (recommandée)

Dans certains environnements réseau, `npx hyperframes@X` échoue **silencieusement** (exit 1, aucune
sortie) parce qu'un postinstall tente de télécharger un binaire natif. Fix :

```bash
npm install hyperframes gsap --no-audit --no-fund --ignore-scripts
node node_modules/.bin/hyperframes doctor
```

Et vendoriser GSAP plutôt que de dépendre d'un CDN :

```bash
cp node_modules/gsap/dist/gsap.min.js public/assets/gsap.min.js
```

---

## Préparation des assets

Deux assets à préparer une seule fois. Ils sont réutilisés pour toutes les vidéos suivantes.

### 1. La voix de référence

C'est l'échantillon qui sera cloné. Sa qualité détermine à elle seule la qualité de toutes tes voix
off.

- **Durée** : 20 à 40 secondes de parole continue.
- **Contenu** : du texte neutre, lu au débit et sur le ton que tu veux entendre dans tes vidéos. Si
  tu lis l'échantillon lentement, toutes tes vidéos seront lentes.
- **Qualité** : mono, 44,1 kHz, WAV non compressé de préférence. **Aucune musique, aucun bruit de
  fond, aucune réverbération de pièce**, pas de coupure au milieu d'un mot.
- **Nettoyage** minimal :

```bash
ffmpeg -i raw-voice.wav \
  -af "highpass=f=80,afftdn=nf=-25,loudnorm=I=-16:TP=-1.5:LRA=11" \
  -ar 44100 -ac 1 assets/voice-reference-clean.wav
```

Placer le fichier au chemin déclaré par `voiceReferencePath` dans `config.json` (par défaut
`assets/voice-reference-clean.wav`).

> **Consentement.** Le skill exige une autorisation écrite explicite avant tout envoi de
> l'échantillon à un service de clonage. C'est volontaire : ne le contourne pas, et n'utilise jamais
> la voix d'un tiers sans son accord.

### 2. Le clip avatar

Un clip de toi (ou de ton présentateur) qui sera affiché en cercle, en bas de l'écran, pendant la
majeure partie de la vidéo.

- **Tournage** : cadre serré buste/visage, regard caméra, **fond vert** si tu veux un détourage
  propre. Bouger un peu (respiration, micro-hochements) : un plan totalement figé se voit.
- **Durée** : au moins 15-20 s. Le skill le met en boucle si la composition est plus longue.
- **Première frame** : ne pas cligner des yeux au tout début — la frame 0 sert souvent de miniature
  par défaut.

Détourage fond vert avec `geq` (meilleur bord que `chromakey`), crop carré depuis le haut du cadre :

```bash
ffmpeg -i avatar-raw.mp4 \
  -vf "crop=ih:ih:(iw-ih)/2:0,scale=560:560,\
geq=r='r(X,Y)':g='g(X,Y)':b='b(X,Y)':a='if(gt(g(X,Y),1.3*r(X,Y))*gt(g(X,Y),1.3*b(X,Y)),0,255)',\
format=yuva420p" \
  -c:v qtrle -an public/assets/avatar-keyed.mov
```

Puis, si la composition dure plus longtemps que le clip :

```bash
ffmpeg -stream_loop -1 -t <durée comp> -i avatar-keyed.mov -c copy avatar-loop.mov
```

Ordre des opérations à respecter : **crop carré → masque → despill du canal vert**. Inverser crop et
masque déforme le masque ; sauter le despill laisse une frange verte visible sur le contour.

Sans fond vert, un clip déjà détouré (ou simplement cadré rond sur fond sombre) fonctionne aussi —
il faut juste qu'il n'y ait ni filtre latéral vert/noir ni flou de bord.

---

## Configuration

Tout ce qui est propre à ta marque vit dans `config.json`, à la racine du skill :

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

- `brandColors` : la direction par défaut est un fond très sombre avec des accents néon
  jaune / violet / orange — éprouvée pour la lisibilité en feed mobile. Elle est **entièrement
  remplaçable** : changer ces quatre valeurs rehabille toute la vidéo, aucune autre partie de la
  méthode n'en dépend.
- `defaultCtaKeyword` : le mot prononcé dans le CTA (« Commente le mot **GUIDE** et je t'envoie… »)
  quand tu n'en fournis pas un par vidéo. Un mot par vidéo, en majuscules, sans accent.
- `sheetUrl` : **optionnel**. Laisse `null` si tu donnes tes scripts directement en conversation. Si
  tu tiens un tableur de suivi de production (une ligne = une vidéo), mets son URL ici et le skill
  pourra y lire les scripts à produire et y reporter le statut.

---

## Utilisation

```
/shortforge
```

Puis donne ton script, ou juste ton brief :

> « Fais-moi une vidéo sur les 3 erreurs de facturation des freelances, ton direct, CTA sur le mot
> DEVIS. »

Le skill enchaîne : calibrage de la durée (~3,3 mots/s → 100-115 mots pour 25-35 s), demande de
consentement pour la voix, génération TTS, construction de `public/index.html`, `validate` +
`inspect`, rendu, puis vérification visuelle sur des frames extraites.

Sortie : `public/renders/<nom>.mp4` en 1080x1920, plus une frame de couverture recommandée.

---

## Licence et attribution

Les sources de médias mentionnées dans le skill (Mixkit et assimilés) ont leurs propres licences.
La licence « Mixkit Free » autorise l'usage commercial sans attribution ; vérifie toujours la licence
de la piste ou du clip que tu utilises avant publication. N'utilise jamais une URL de *preview* d'une
bibliothèque sur abonnement comme substitut dans une vidéo publiée.
