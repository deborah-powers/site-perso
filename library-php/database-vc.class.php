<?php
function printP ($message){ if ($message) echo "<p>$message</p>"; }
function printCouou(){ echo "<p>coucou</p>"; }
// choisir la bdd locale ou ovh: dans le constucteur
class database{
	public $DBhost = 'localhost';
	public $DBuser = 'root';
	public $DBpassword = 'root';
	public $DBname = 'site';
	public $tableName = Null;
	public $mysqli = Null;
	// choix d'une bdd et connection
	public function connect(){
		$this->mysqli = new mysqli ($this->DBhost, $this->DBuser, $this->DBpassword, $this->DBname) or die ($this->mysqli->error);
		// indiquer que les elements envoyes sont en utf8, adapte a la langue francaise
		$this->mysqli->set_charset ('utf8');
	}
	public function setDb ($DBname, $DBhost, $DBuser, $DBpassword){
		$this->DBname = $DBname;		
		$this->DBhost = $DBhost;
		$this->DBuser = $DBuser;
		$this->DBpassword = $DBpassword;
	}
	public function setDbLocal ($DBname='site'){
		$DBhost = 'localhost';
		$DBuser = 'root';
		$DBpassword = 'root';
		$this->setDb ($DBname, $DBhost, $DBuser, $DBpassword);
	}
	public function setDbOvh(){
		$DBname = 'deborahprrdebbie';
		$DBhost = 'deborahprrdebbie.mysql.db';
		$DBuser = 'deborahprrdebbie';
		$DBpassword = 'Noisette416';
		$this->setDb ($DBname, $DBhost, $DBuser, $DBpassword);
	}
	public function __construct ($tableName){
		$this->setDbLocal();
		$this->tableName = $tableName;
		$this->connect();
	}
	//								fonctions utilisees par les autres
	// transforme une liste d'array simple (et le nom des colonnes) en liste d'arrays associatifs
	public function toArray ($listFields, $tableData){
		$nbFields = count ($listFields);
		$listArrays =[];
		foreach ($tableData as $value){
			$rowsData =[];
			for ($i=0; $i< $nbFields; $i++){
				$rowsData [$listFields[$i]] = $value[$i];
			}
			$listArrays[] = $rowsData;
		}
		return $listArrays;
	}
	// executer une requête qui ne renvoi rien
	public function execRequest ($request){
		$nb =1;
		$response = $this->mysqli->query ($request);
		if (! $response) $nb =0;
		return $nb;
	}
	// recuperer les infos recherchees a partir d'une string request
	public function fromSelect ($request){
		$response = $this->mysqli->query ($request);
		if (! $response) return Null;
		$tableData = mysqli_fetch_all ($response);
		// recuperer le noms des colonnes de la table
		// fetch_fields renvoit pleins d'infos sur les champs de la table, il faut extraire le nom
		$listFieldsWithAllInfos = mysqli_fetch_fields ($response);
		$listFields = [];
		foreach ($listFieldsWithAllInfos as $key => $field){
			$listFields[] = $field->name;
		}
		$listArrays = $this->toArray ($listFields, $tableData);
		return $listArrays;
	}
	// creer une string utilisee pour rechercher des objets
	// glue peut valoir " AND " ou ", "
	public function createListValues ($arrayValues, $glue=' AND '){
		$listValues =[];
		foreach ($arrayValues as $field => $value){
			$text = "$field=$value";
			// reperer les strings, devant etre entre guillemets. elles seront echappees
			$typeValue = gettype ($value);
			if ($typeValue == string){
				$tmpValue = $this->mysqli->escape_string ($value);
				$text = "$field='$tmpValue'";
			}
			array_push ($listValues, $text);
		}
		$strListValues = implode ($glue, $listValues);
		return $strListValues;
	}
	//								fonctions essentielles
	// recuperer le contenu de la table
	public function getAll(){
		$request = "SELECT * FROM ". $this->tableName;
		$listArrays = $this->fromSelect ($request);
		return $listArrays;
	}
	// recuperer une liste d'objets par une liste de valeurs
	// arrayValues est un array associatif (champ:valeur)
	public function getList ($arrayValues){
		$listValues = $this->createListValues ($arrayValues);
		$request = "SELECT * FROM $this->tableName WHERE $listValues";
		$listArrays = $this->fromSelect ($request);
		return $listArrays;
	}
	// recuperer un objet
	public function getObjById ($idObj){
		$request = "SELECT * FROM $this->tableName WHERE id=$idObj";
		$listArrays = $this->fromSelect ($request);
		$object =[];
		$nbObj = count ($listArrays);
		if ($nbObj >0){
			$object = $listArrays[0];
			$object['id'] = intval ($object['id']);
		}
		return $object;
	}
	public function getObjByValues ($arrayValues){
		$listArrays = $this->getList ($this->tableName, $arrayValues);
		$object =[];
		$nbObj = count ($listArrays);
		if ($nbObj >0){
			$object = $listArrays[0];
			$object['id'] = intval ($object['id']);
		}
		return $object;
	}
	// enregistrer un nouvel objet
	public function postObj ($arrayObj){
		// liste des champs
		$listFields = array_keys ($arrayObj);
		$strFields = implode (', ', $listFields);
		// liste des valeurs. echapper, mettre entre guillemets les strings
		$listValues =[];
		foreach ($arrayObj as $key => $value){
			$newValue = $this->mysqli->escape_string ($value);
			array_push ($listValues, $newValue);
		}
		$strValues = implode ("', '", $listValues);
		$strValues = "'". $strValues ."'";
		// la requete
		$request = "INSERT INTO $this->tableName ($strFields) VALUES ($strValues)";
		$nb = $this->execRequest ($request);
		return $nb;
	}
	// supprimer un objet
	public function deleteObjById ($idObj){
		$request = "DELETE FROM $this->tableName WHERE id=$idObj";
		$nb = $this->execRequest ($request);
		return $nb;
	}
	public function deleteObjByValues ($arrayObj){
		$listValues = $this->createListValues ($arrayObj);
		$request = "DELETE FROM $this->tableName WHERE $listValues";
		$nb = $this->execRequest ($request);
		return $nb;
	}
	// modifier un objet
	public function updateObjById ($arrayObj, $idObj){
		$strToset = $this->createListValues ($arrayObj, ', ');
		$request = "UPDATE $this->tableName SET $strToset WHERE id=$idObj";
		$nb = $this->execRequest ($request);
		return $nb;
	}
	public function updateObjByValues ($arrayObj, $arrayValues){
		$strToset = $this->createListValues ($arrayObj, ', ');
		$listValues = $this->createListValues ($arrayValues);
		$request = "UPDATE $this->tableName SET $strToset WHERE $listValues";
		$nb = $this->execRequest ($request);
		return $nb;
	}
	// echanger avec un fichier json
	public function toJson(){
		// bel affichage, enregistrer le resultat au format json
		header ('Content-Type: application/json');
		// recuperer les objets
		$listArrays = $this->getAll ($this->tableName);
		$listObj = json_encode ($listArrays);
		echo $listObj;
	}
	public function fromJson(){}
	public function createTable ($pkName, $fieldList){
		// fieldList: [ 'name' => 'varchar(200) not null,' ];
		$request = "select * FROM $this->tableName limit 1;";
		$response = $this->mysqli->query ($request);
		if ($response) $response =2;
		else{
			$request = "create table `$this->tableName` (";
			foreach ($fieldList as $key => $value) $request = $request. " `$key` $value,";
			$request = $request. " primary key (`$pkName`)) engine=InnoDB default charset=utf8;";
			$response = $this->mysqli->query ($request);
			if ($response) $response =1;
			else $response =0;
		}
		return $response;
	}
}
?>
