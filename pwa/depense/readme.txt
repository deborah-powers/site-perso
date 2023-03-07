CREATE TABLE depense (
	id character varying(7) not null,
	date date,
	lieu character varying(50),
	categorie character varying(50),
	commentaire character varying(200),
	montant character varying(7),
	primary key (id)
);
====== dépense ======

id
date du jour
lieu
catégorie
montant
commentaire facultatif

====== pages ======

créer une dépense
modifier une dépense
voir la liste des dépenses du jour
voir la liste des dépenses de la semaine
voir la liste de toutes les dépenses
voir une dépense et ses infos

****** création et modification ******

champs de la page index actuelle
même page pour les deux. dans un cas les champs sont vides au début.
comment faire la différence entre les deux cas ? transmission de l'id ou pas
navigation vers les listes

****** une dépense ******

infos
boutons supprimer, modifier
bouton retour à la liste
comment savoir quel type de liste ? drapeau passé entre les pages

****** une liste ******

quand je clique sur une dépense, j'arrive sur sa page.
navigation vers les autres listes
navigation vers la page de création
