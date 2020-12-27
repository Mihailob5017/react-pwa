// Cache -- temp file storage



// Site Versioning 
const CACHE_NAME = 'version-3';
// All the files we are going to cache
const urlsToCache = [
    'index.html',
    'offline.html']

// To remove warnings
const self = this;

// Install SW 
self.addEventListener('install', e => {
    // Adding files to the catche
    e.waitUntil(
        // Opening a new cache
        caches.open(CACHE_NAME).then(cache => {
            console.log('Open Cache')
            console.log(cache)

            // Adding the url with the files to the cache
            return cache.addAll(urlsToCache)
        })
    )


})

// Listen for requests
self.addEventListener('fetch', e => {
    // respond to a fetch requests (for an image,file,css,whatever)
    e.respondWith(
        // match the request with the cache
        caches.match(e.request)
            .then(() => {
                // fetch the resaurces back
                return fetch(e.request).catch(() => caches.match('offline.html'))
            })
    )


})

// Activate SW
self.addEventListener('activate', e => {
    // Remove all the previous caches and add the new ones
    const cachesWhiteList = [];
    cachesWhiteList.push(CACHE_NAME);

    e.waitUntil(
        // Go thru all the keys
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => {
                // pretty much removes all the previous caches and creates a new one
                if (!cachesWhiteList.includes(cacheName))
                    return caches.delete(cacheName);
            })
        ))
    )
})