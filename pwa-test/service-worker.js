// gérer le cache
const cacheName = 'pwa-test';
const filesToCache =[
	'/site-dp/pwa-test/index.html',
	'/site-dp/pwa-test/service-launcher.js',
	'/site-dp/pwa-test/database.js',
	'/site-dp/pwa-test/static/',
	'/site-dp/pwa-test/static/perso.css',
	'/site-dp/pwa-test/static/structure.css'
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
