const version = 'v1.1';
// gérer le cache. il contient l'index et tous les fichiers appelés par celui-ci.
const cacheName = 'pwa-2023';
const filesToCache =[
	'/',
	'/index.html',
	'/code.js',
	'/style.css'
];
// mettre en cache le contenu de l'app
self.addEventListener ('install', function (event){
	event.waitUntil (caches.open (cacheName).then (function (cache){
		return cache.addAll (filesToCache);
}));});
// supprimer les caches inutiles
self.addEventListener ('activate', function (event){
	event.waitUntil (caches.keys().then (function (keys){
		console.log (keys);
}));});
// rendre le contenu de l'app hors-ligne
self.addEventListener ('fetch', function (event){
	event.respondWith (caches.match (event.request.url).then (function (response){
		return response || fetch (event.request);
}));});