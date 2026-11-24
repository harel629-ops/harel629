var CACHE='budget-v1';
var CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
  var req=e.request;if(req.method!=='GET')return;
  var u=new URL(req.url),same=u.origin===self.location.origin,font=/(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!same&&!font)return;
  e.respondWith(caches.match(req,{ignoreSearch:same}).then(function(cached){
    var net=fetch(req).then(function(res){
      if(res&&(res.ok||res.type==='opaque')){var copy=res.clone();caches.open(CACHE).then(function(c){c.put(req,copy)})}
      return res;
    }).catch(function(){return cached||(req.mode==='navigate'?caches.match('./index.html'):undefined)});
    return cached||net;
  }));
});
