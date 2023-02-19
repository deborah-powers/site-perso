// gérer le cache
const cacheName = 'depense';
const filesToCache =[
	'/pwa/depense/index.html',
	'/pwa/depense/service-launcher.js',
	'/pwa/depense/static/',
	'/pwa/depense/static/database.js',
	'/pwa/depense/static/library.js',
	'/pwa/depense/static/dynaPlay.js',
	'/pwa/depense/static/perso.css',
	'/pwa/depense/static/structure.css',
	'/pwa/depense/php/',
	'/pwa/depense/php/get.php',
	'/pwa/depense/php/add.php',
	'/pwa/depense/php/put.php',
	'/pwa/depense/php/del.php',
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
