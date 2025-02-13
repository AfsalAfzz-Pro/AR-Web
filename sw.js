const CACHE_NAME = 'ar-portfolio-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles.css',
    'https://aframe.io/releases/1.4.0/aframe.min.js',
    'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.min.js',
    'https://cdn.glitch.com/36cb8393-65c6-408d-a538-055ada20431b/Astronaut.glb?v=1542147958948',
    'https://cdn.jsdelivr.net/gh/gerwld/Star-Wars-Intro-Creator/fonts/SfDistantGalaxy-0l3d.ttf',
    'https://cdn.jsdelivr.net/gh/gerwld/Star-Wars-Intro-Creator/audio/Star_Wars_original_opening_crawl_1977.mp3'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('Error caching assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version if available
                if (response) {
                    return response;
                }

                // Clone the request because it can only be used once
                const fetchRequest = event.request.clone();

                // Make network request and cache the response
                return fetch(fetchRequest).then(response => {
                    // Check if response is valid
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response because it can only be used once
                    const responseToCache = response.clone();

                    // Add response to cache
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(error => {
                console.error('Fetch failed:', error);
                // You could return a custom offline page here
            })
    );
});

// Handle push notifications (if needed in the future)
self.addEventListener('push', event => {
    if (event.data) {
        const notification = event.data.json();
        self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: notification.icon,
            badge: notification.badge
        });
    }
});

// Background sync (if needed in the future)
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // Handle background sync
            console.log('Background sync triggered')
        );
    }
}); 