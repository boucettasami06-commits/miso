# Mijo — menus de la semaine selon ton budget et ton objectif

Mijo génère chaque semaine un menu personnalisé (petit-déj, midi, soir) en fonction de :

- **l'objectif** : Healthy (déficit de 15 %), Musculation (surplus de 12 %, 1,9 g de protéines/kg), Équilibré, Gourmand ;
- **le corps et le foyer** : sexe, âge, poids, taille, activité (Mifflin-St Jeor), adultes et enfants ;
- **le régime** : omnivore → vegan, sans porc / gluten / lactose, allergies, aliments détestés ;
- **le budget hebdo et les enseignes** : 16 enseignes — hard-discount (Aldi, Lidl, Netto, Leader Price), hypers (E.Leclerc, Auchan, Hyper U, Carrefour), supermarchés (Intermarché, Super U, Carrefour Market, Casino), proximité (Franprix, Monoprix) et spécialistes (Grand Frais, Biocoop), avec des écarts de prix par rayon ;
- **le temps en cuisine** : plus souple le week-end.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run smoke    # teste le moteur sur 7 profils types
PEXELS_API_KEY=xxx npm run photos   # une photo libre de droits par recette
```

### Photos des recettes

102 recettes (19 petits-déjeuners, 83 plats). Chaque recette a une photo d'illustration par défaut. `npm run photos` interroge l'API Pexels (clé gratuite, photos utilisables commercialement) et enregistre une photo dédiée par recette dans `src/lib/data/photos.json`, avec le crédit du photographe affiché sur la fiche. Vérifie visuellement le résultat, puis commite le fichier.

Variable d'environnement : `NEXT_PUBLIC_SITE_URL` (URL canonique pour le SEO, par défaut `https://mijo-nu.vercel.app`).

## Architecture

| Dossier | Rôle |
|---|---|
| `src/lib/data/` | Catalogue d'ingrédients (prix par conditionnement + macros), recettes, enseignes, menus types SEO |
| `src/lib/engine/nutrition.ts` | Besoins caloriques et protéiques, macros des recettes, mise à l'échelle des portions |
| `src/lib/engine/pricing.ts` | Paniers vectorisés et coût réel par enseigne (on achète des **paquets entiers**) |
| `src/lib/engine/generator.ts` | Optimiseur hebdomadaire et remplacement d'un repas |
| `src/components/planner/` | Parcours en 6 étapes et tableau de bord « Ma semaine » |
| `src/app/` | Pages (App Router), sitemap, robots, manifest, images OG |

### Le moteur de génération

1. **Filtrage strict** des recettes : régime, restrictions, allergènes, aliments détestés.
2. **Sélection gloutonne** créneau par créneau. Le score combine l'adéquation à l'objectif, la couverture protéique, le temps de préparation, la variété (plafond strict de répétitions, protéine et cuisine différentes d'un jour à l'autre) et le **coût marginal** du plat dans le panier en cours. Ce coût marginal favorise naturellement l'anti-gaspi : un plat qui finit un paquet déjà ouvert coûte presque rien.
3. **Mode « restes du midi »** : le dîner d'un plat qui se réchauffe bien est cuisiné en double pour le midi du lendemain.
4. **Réparation du budget** : tant que le panier dépasse le budget, on remplace le repas qui offre le meilleur rapport économie / perte de qualité. Si le budget est irréaliste, l'interface affiche le minimum atteignable plutôt que de tricher.
5. L'enseigne retenue est **la moins chère parmi celles choisies**. Les 16 enseignes sont comparées.

Le tout s'exécute en moins de 50 ms dans le navigateur, sans serveur ni compte. Les données restent dans le `localStorage`.

### SEO

- 47 fiches recettes et 9 pages « menu type » (pas cher, musculation, healthy, végétarien, famille, étudiant…) générées statiquement. Les menus types sont produits par le vrai moteur au build.
- JSON-LD : `Recipe`, `BreadcrumbList`, `FAQPage`, `ItemList`, `Organization`, `WebSite` + `SearchAction`, `WebApplication`.
- Métadonnées, URL canoniques, Open Graph, `sitemap.xml`, `robots.txt`, manifest PWA, image OG et icône générées.
- Images Unsplash servies en AVIF/WebP jusqu'à 3840 px via `next/image`, avec un dégradé de secours si une photo ne charge pas.

## Limites actuelles et feuille de route

**Prix** : ce sont des prix de référence × l'indice moyen de chaque enseigne, avec une variation par produit. Ils sont réalistes mais **indicatifs**. Prochaines étapes, par ordre de priorité :

1. **Vrais prix** : flux de prix des drives (partenariats ou relevés), stockés en base (Postgres / Supabase) et mis à jour chaque semaine, avec les promotions de la semaine injectées dans le score.
2. **Comptes et historique** : authentification, synchronisation multi-appareils, notes des recettes réutilisées pour apprendre les goûts.
3. **Catalogue de recettes** : passer de 47 à plus de 300 recettes, avec un back-office et les photos de chaque recette.
4. **Génération par IA** (API Claude) de variantes de recettes à partir des promotions et du contenu du frigo, validées par le moteur nutritionnel.
5. **Panier drive** : envoi en un clic de la liste vers le drive de l'enseigne.
6. App mobile (PWA puis Expo), notifications « ta semaine est prête » le dimanche.

> Les informations nutritionnelles sont des estimations et ne remplacent pas l'avis d'un professionnel de santé.
