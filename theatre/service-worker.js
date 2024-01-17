// gérer le cache
const cacheName = 'theatre';
const filesToCache =[
	'service-launcher.js',
	'index.html',
	'deborah.html',
	'nounours.svg',
	'style.css'
];
// mettre en cache le contenu de l'app
self.addEventListener ('install', function (event){
	event.waitUntil (caches.open (cacheName).then (function (cache){
		return cache.addAll (filesToCache);
}));});
// rendre le contenu de l'app hors-ligne
self.addEventListener ('fetch', function (event){
	event.respondWith (
		caches.match (event.request).then (function (response){
			return response || fetch (event.request);
}));});
