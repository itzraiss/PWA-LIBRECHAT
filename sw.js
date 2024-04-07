// service-worker.js

// Nome do cache
var CACHE_NAME = 'meu-pwa-cache-v1';

// Instalação do Service Worker
self.addEventListener('install', function(event) {
  // Abre o cache (cria se não existir) e faz cache dos recursos iniciais
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('Cache aberto');
      // Lista de recursos iniciais para fazer cache
      return cache.addAll([
          '/assets/index-woJS5PG.js',
          '/assets/vendor-zawsWcY.js',
          '/assets/index-z3skEMl.css',
          '/assets/Inter-Bold-sYrZ_-1B.woff2',
          '/assets/Inter-Regular-deFHWtI.woff2',
          '/assets/Inter-SemiBold-PyS8DO2L.woff2',
          '/assets/bingai-jb.png'
          // Adicione aqui os caminhos dos outros arquivos que você deseja fazer cache
        ]);
    })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Limpa caches antigos que não são mais necessários
          if (cacheName !== CACHE_NAME) {
            console.log('Cache antigo removido', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta as requisições e retorna os recursos do cache se disponíveis
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      // Retorna o recurso do cache se encontrado
      if (response) {
        return response;
      }
      // Se não, faz cache do recurso solicitado e retorna a resposta da rede
      return fetch(event.request).then(function(response) {
        // Verifica se recebeu uma resposta válida
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clona a resposta
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
