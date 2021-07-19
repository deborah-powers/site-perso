debbyPlay.linkList =[];
debbyPlay.options = "";
debbyPlay.option = localStorage.getItem ('option');
var toShow = 'all-unlogged';
if (! debbyPlay.option) debbyPlay.option = 'utile';

function getLinks (option){
	debbyPlay.option = option;
	localStorage.setItem ('option', debbyPlay.option);
	var backUrl = pathBackend + 'liens/show-action-links.php';
	var params ={ choice: debbyPlay.option };
	debbyPlay.linkList = fromBackend (backUrl, params);

	if (debbyPlay.option == 'musique' && debbyPlay.userLoged == 'true') toShow = 'music-logged';
	else if (debbyPlay.option == 'musique') toShow = 'music-unlogged';
	else if (debbyPlay.userLoged == 'true') toShow = 'all-logged';
	else toShow = 'all-unlogged';
	if (debbyPlay.option == 'musique') debbyPlay.linkList.sort (sortMusic);
	else{
		for (var l=0; l< debbyPlay.linkList.length; l++) debbyPlay.linkList[l].links.sort (sortLink);
		debbyPlay.linkList.sort (sortLinkList);
	}
}
function modLink (button){
	var link ={
		category: document.getElementsByTagName ('p')[0].innerText.toLowerCase(),
		subcategory: button.parentElement.parentElement.children[0].innerText.toLowerCase(),
		id: button.parentElement.getElementsByTagName ('a')[0].getAttribute ('id'),
		name: button.parentElement.getElementsByTagName ('a')[0].innerText.toLowerCase(),
		link: button.parentElement.getElementsByTagName ('a')[0].getAttribute ('href')
	};
	var url = paramToUrl ('ajout.html', link);
	window.location.href = url;
}
function modLinkMusic (button){
	var link ={
		category: 'musique',
		subcategory: button.parentElement.children[0].innerText.toLowerCase(),
		id: button.parentElement.getElementsByTagName ('a')[0].getAttribute ('id'),
		name: button.parentElement.getElementsByTagName ('a')[0].innerText.toLowerCase(),
		link: button.parentElement.getElementsByTagName ('a')[0].getAttribute ('href')
	//	link: button.parentElement.getElementsByTagName ('a')[0].getAttribute ('href').slice (32)
	};
	var url = paramToUrl ('ajout.html', link);
	window.location.href = url;
}
function delLink (button){
	var user ={
		id: button.parentElement.getElementsByTagName ('a')[0].getAttribute ('id')
	};
	var backUrl = pathBackend + 'liens/delete-action.php';
	debbyPlay.tmp = fromBackend (backUrl, user);
	window.location.href = '.';
}
function sortLinkList (linkListA, linkListB){ return linkListA.title > linkListB.title; }
function sortLink (linkA, linkB){ return linkA.name < linkB.name; }
function sortMusic (musicA, musicB){ return musicA.subcategory +' '+ musicA.name > musicB.subcategory +' '+ musicB.name; }
// récupérer les options
var backUrl = pathBackend + 'liens/show-action-choices.php';
debbyPlay.options = fromBackend (backUrl);
debbyPlay.options.sort();
var p= debbyPlay.options.indexOf (debbyPlay.option);
var linkList = debbyPlay.options.splice (p,1);
debbyPlay.options.unshift (linkList[0]);
getLinks (debbyPlay.options[0]);
document.body.init();
