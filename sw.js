diff --git a/sw.js b/sw.js
new file mode 100644
index 0000000000000000000000000000000000000000..1c20607fffb39828208949034a500fbaf0496db2
--- /dev/null
+++ b/sw.js
@@ -0,0 +1,36 @@
+const CACHE_NAME = 'organigram-hr-it-v1';
+const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.svg', './icon-512.svg'];
+
+self.addEventListener('install', (event) => {
+  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
+  self.skipWaiting();
+});
+
+self.addEventListener('activate', (event) => {
+  event.waitUntil(
+    caches
+      .keys()
+      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
+  );
+  self.clients.claim();
+});
+
+self.addEventListener('fetch', (event) => {
+  if (event.request.method !== 'GET') return;
+
+  event.respondWith(
+    caches.match(event.request).then((cachedResponse) => {
+      if (cachedResponse) return cachedResponse;
+      return fetch(event.request)
+        .then((networkResponse) => {
+          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
+            return networkResponse;
+          }
+          const copy = networkResponse.clone();
+          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
+          return networkResponse;
+        })
+        .catch(() => caches.match('./index.html'));
+    })
+  );
+});
