const cacheName = "currency-converter-1.0";

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'currconvert.js',
        'sw/index.js',
        'https://free.currencyconverterapi.com/api/v5/currencies'
      ]);
    }).catch(() => console.log("Could not add files"))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then( (keys) => {
        return Promise.all(keys.map((key, i) => {
          if(key !== cacheName){
            return caches.delete(keys[i]);
          }
      }))
    })
  )
});

self.addEventListener('fetch', (e) => {
  let url = e.request.clone();
  if (e.request.mode === 'navigate' || (e.request.method === 'GET')) {
    e.respondWith(
      fetch(e.request).catch(error => {
        console.log('Oops, You are offline, Currently');
        return caches.match('index.html');
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((res) => {
        if(res){
          return res;
        }
        return fetch(url).then((res) => {
          if(!res || res.status !== 200){
            return res;
          }
          let response = res.clone();
          caches.open(cacheName).then((cache) => {
            cache.put(e.request, response);
          });
          return res;
        }).catch ((error)=> {
          return error;
        })
      })
    )
  }
});