# 911 Calls avec ElasticSearch

## Import du jeu de données

Pour importer le jeu de données, complétez le script `import.js` (ici aussi, cherchez le `TODO` dans le code :wink:).

Exécutez-le ensuite :

```bash
npm install
node import.js
```

Vérifiez que les données ont été importées correctement grâce au shell (le nombre total de documents doit être `153194`) :

```
GET <nom de votre index>/_count
```

## Requêtes

À vous de jouer ! Écrivez les requêtes ElasticSearch permettant de résoudre les problèmes posés.


* Lancer ```node import.js``` pour importer les données des appels d'urgence
* Lancer ```node calls_by_category.js``` pour obtenir les appels par catégories
* Lancer ```node get_city_max_calls.js``` pour obtenir les 3 villes ayant eu le maximum d'appels pour une overdose
* Lancer ```node number_calls_around_landsale.js``` pour obtenir le nombre d'appels autour de la ville de Landsale dans un rayon de 500m
* Lancer ```node get_months_max_calls.js``` pour obtenir les 3 mois durant lesquels il y a eu le nombre maximum d'appels

Note : pour voir précisément les requêtes pour résoudre ces problèmes, consulter les différents scripts associés.

Note2 : sur la branche frontend (https://github.com/naokha/911-calls/tree/frontend/elasticsearch), il existe une petite interface développée pour le fun. Pour l'utiliser :
* Lancer ```npm install``` pour installer les dépendances
* Lancer ```node server.js``` pour lancer le serveur (port 8000 par défaut)
* Accéder à localhost:8000 pour accéder à l'interface. Les scripts précédents (calls_by_category, ...) ont été légèrement modifiés pour les utiliser en tant que module.

## Kibana

Dans Kibana, créez un dashboard qui permet de visualiser :

* Une carte de l'ensemble des appels
* Un histogramme des appels répartis par catégories
* Un Pie chart réparti par bimestre, par catégories et par canton (township)

Pour nous permettre d'évaluer votre travail, ajoutez une capture d'écran du dashboard dans ce répertoire [images](images).

### Timelion
Timelion est un outil de visualisation des timeseries accessible via Kibana à l'aide du bouton : ![](images/timelion.png)

Réalisez le diagramme suivant :
![](images/timelion-chart.png)

Envoyer la réponse sous la forme de la requête Timelion ci-dessous:  

```
TODO : ajouter la requête Timelion ici
```
