// service-worker.js

// Nome do cache
var CACHE_NAME = 'meu-pwa-cache-v1';

// Instalação do Service Worker e cache dos recursos
self.addEventListener('install', function(event) {
  // Abre o cache e faz cache dos recursos iniciais
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll([
          // Lista de recursos iniciais para fazer cache
        ]);
      })
  );
});

// Intercepta as requisições e retorna os recursos do cache se disponíveis
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retorna o recurso do cache se encontrado
        if (response) {
          return response;
        }
        // Se não, faz cache do recurso solicitado e retorna a resposta da rede
        return fetch(event.request).then(function(response) {
          // Verifica se recebeu uma resposta válida
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clona a resposta
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});
