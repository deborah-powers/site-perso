CREATE TABLE depense (
	id integer not null,
	date date,
	lieu character varying(50),
	categorie character varying(50),
	commentaire character varying(200),
	montant character varying(7),
	primary key (id)
);