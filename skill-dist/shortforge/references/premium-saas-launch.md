# Premium SaaS Launch — preset visuel (shortforge)

Utilisé quand la demande évoque : premium SaaS, style Apple/Linear/Arc/Vercel/Raycast, explainer
d'automatisation, vrais schémas/icônes/dashboards/graphes, ou explainer produit haut de gamme.

**Couleurs** : reprendre `brandColors` du `config.json` du skill — `accentPrimary` comme accent
global, `accentSecondary` pour tout ce qui est IA/transformation, `accentTertiary` pour les
CTA/actions. Fond sombre mat, jamais blanc pur. Un seul accent dominant : ne pas laisser une couleur
secondaire prendre le dessus d'une scène à l'autre.

## Structure d'écran (split vertical)

```
┌──────────────────────────────┐
│  Zone d'explication (haut)   │  ~55–60% de la hauteur
│  - titre court (2-4 mots)    │
│  - schéma / dashboard / icônes
├──────────────────────────────┤
│  Bande de sécurité captions  │  ~10% — rien d'autre ici
├──────────────────────────────┤
│  Avatar (bas)                │  ~30-35% de la hauteur
└──────────────────────────────┘
```

- Ne jamais laisser une caption ou un texte de slide descendre dans la zone avatar.
- Le schéma/dashboard vit uniquement dans la zone haute.

## Slide « flow » (le plus utilisé)

Toujours un **schéma horizontal stable**, jamais diagonal :

```
[Source] --arrow--> [Traitement] --arrow--> [Automatisation] --arrow--> [Base] --arrow--> [Dashboard]
```

- Chaque nœud = une carte icône : fond légèrement plus clair que le fond de scène, bord 1px dans
  l'accent primaire à ~25% d'opacité, icône simple en trait blanc ou accent.
- Flèches : trait fin blanc/gris avec un **point pulsé animé** (glow accent) qui voyage le long de la
  flèche pour suggérer le flux de données en temps réel — pas d'animation clignotante agressive.
- Petit panneau data/schéma en overlay discret (mini JSON, mini table, mini graphe en barres) proche
  du dernier nœud, pour ancrer le « réel » plutôt qu'une icône abstraite.
- Espacement horizontal égal entre les nœuds (5 maximum), alignés sur une seule ligne médiane —
  évite tout chevauchement à l'inspection HyperFrames.

## Dashboards / graphes

- Cartes UI avec de vrais chiffres plausibles (%, compteurs, mini sparklines) plutôt que des blocs
  vides.
- Un seul accent chromatique par graphe, pas de dégradé multicolore façon confetti.
- Contours fins, coins arrondis modérés (8–12px), pas de skeuomorphisme.

## À éviter systématiquement

- Slides façon PowerPoint (titre + puces + rien d'autre).
- Cartes seules sans contexte (icône flottante sur fond sombre, sans schéma ni flèche).
- Filtres noirs opaques posés sur du texte pour « assurer la lisibilité » — préférer un léger scrim
  `rgba(0,0,0,0.35)` maximum, ou repositionner le texte.
- Double exposition, écrans statiques sans micro-mouvement : au moins un élément vivant par scène
  (pulse dot, compteur, curseur).
- Layouts diagonaux pour les flows — toujours horizontal ou vertical stable.

## Checklist rapide preset

- [ ] Accent global = `accentPrimary`, pas de couleur concurrente dominante
- [ ] Flow horizontal, 5 nœuds max, flèches + pulse dot
- [ ] Dashboard/graphe avec de vrais chiffres, un seul accent par graphe
- [ ] Zone avatar jamais envahie par un schéma ou une caption
- [ ] Au moins un élément animé vivant par scène
