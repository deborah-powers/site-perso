CREATE TABLE depense (
	id character varying(7) not null,
	date date,
	lieu character varying(50),
	categorie character varying(50),
	commentaire character varying(200),
	montant character varying(7),
	primary key (id)
);