const messageAppInstalled = "texte installé";
// vérifier si le service-worker est installable
window.onload = function(){
	'use strict';
	if ('serviceWorker' in navigator) navigator.serviceWorker.register ('./service-worker.js');
}
// rendre mon application installable
var installButton = document.getElementById ('install-pwa');
var deferredPrompt;
window.addEventListener ('beforeinstallprompt', function (event){
	// empêcher l'affichage de la popup d'installation
	event.preventDefault();
	deferredPrompt = event;
	if (! deferredPrompt) installButton.innerHTML = messageAppInstalled;
	else installButton.innerHTML = "téléchargez sur votre smartphone";
});
installButton.addEventListener ('click', function(){
	if (! deferredPrompt) installButton.innerHTML = messageAppInstalled;
	else{
		deferredPrompt.prompt();
		deferredPrompt.userChoice.then (function (choiceResult){
			if (choiceResult.outcome === 'accepted') installButton.innerHTML = messageAppInstalled;
			else installButton.innerHTML = 'installation ratée';
});}});
// vérifier si l'appli est installée
window.addEventListener ('appinstalled', function (event){
	var installButton = document.getElementById ('install-pwa');
	installButton.innerHTML = messageAppInstalled;
});