// gérer le cache
const cacheName = 'pwa-test';
const filesToCache =[
	'/pwa/pwa-test/index.html',
	'/pwa/pwa-test/service-launcher.js',
	'/pwa/pwa-test/database.js',
	'/pwa/pwa-test/static/',
	'/pwa/pwa-test/static/perso.css',
	'/pwa/pwa-test/static/structure.css'
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
