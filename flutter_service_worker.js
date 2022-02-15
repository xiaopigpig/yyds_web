'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "7412dc3d19d32b335c458fe9351c7a4f",
"splash/img/light-2x.png": "c24a0febf0d2f939e885abfa291fe7b1",
"splash/img/dark-4x.png": "3872fcfbfee59fdc95d1e94b885c0e8f",
"splash/img/light-3x.png": "ddff9c2afc9ae725ee435dcb5fd89040",
"splash/img/dark-3x.png": "ddff9c2afc9ae725ee435dcb5fd89040",
"splash/img/light-4x.png": "3872fcfbfee59fdc95d1e94b885c0e8f",
"splash/img/dark-2x.png": "c24a0febf0d2f939e885abfa291fe7b1",
"splash/img/dark-1x.png": "04959c8d602e924c37f5fbc55e69af2c",
"splash/img/light-1x.png": "04959c8d602e924c37f5fbc55e69af2c",
"splash/style.css": "3c9a4db98015a43151259cc21d465410",
"index.html": "e1d8c91e2ea3ecd48d4f3d46e8790c2e",
"/": "e1d8c91e2ea3ecd48d4f3d46e8790c2e",
"main.dart.js": "c7f985268b5023a82941118ca79faf4d",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "da75a5d6a888209594601b96e2c0008d",
"assets/AssetManifest.json": "36af4e8430fee6ec3b6bd1ae44896b86",
"assets/NOTICES": "fbae28e08efaee82587eef9cab0e8195",
"assets/FontManifest.json": "a8e27bd99dd3d2f16d5801364ab20e27",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/packages/fluttertoast/assets/toastify.js": "e7006a0a033d834ef9414d48db3be6fc",
"assets/packages/fluttertoast/assets/toastify.css": "a85675050054f179444bc5ad70ffc635",
"assets/packages/wakelock_web/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/images/lock.png": "2c6e4e11a9d2145cc335679df01650ad",
"assets/assets/images/2.0x/account_header.png": "ffebc69db00bc82f8e5d603fb4af3365",
"assets/assets/images/3.0x/account_header.png": "3a4591c0a22fdff72fee9af97f7344a5",
"assets/assets/images/logo.png": "88a05a6846b2103c76d7a8e72b05613f",
"assets/assets/images/logo_lockup_flutter_vertical_wht.png": "0bdc069af57528e88f6c6b891ad57b8d",
"assets/assets/images/share_background.jpeg": "b0eec1a4b0b556dfd556484cad425d25",
"assets/assets/images/account_header.png": "4c03370bfc85216bbb2c93db2b061ed7",
"assets/assets/images/play.png": "114f0996218c3d2d79d8a9e9fd924d64",
"assets/assets/lottie/empty_box.json": "20e62229847226f1b54b605cc6df8d8c",
"assets/assets/lottie/error.json": "7c1d698ef18c56931b9b9e28780e5be2",
"assets/assets/lottie/loading.json": "b30dcd08331612deabe91457e61ebc95",
"assets/assets/lottie/loading_state.json": "98ede642a1c41c5dbd979fece1d02998",
"assets/assets/lottie/empty_state_cat.json": "db970353e6787abd1952abdc516e386c",
"assets/assets/lottie/error_state.json": "1e231b062cbd7e62c708e8a68e46ef0f",
"assets/assets/lottie/empty_state_box.json": "1364b16f8027360deb948ed969ab0f40",
"assets/assets/fonts/Avenir-Medium-6.otf": "816e267758adf7996bd82ffc9b692be5",
"assets/assets/fonts/Avenir-Black.otf": "d751de38dec65daee33892b6378a3d01",
"assets/assets/fonts/iconfont.ttf": "bb1a11d2dcc4e2d37b31f155e7ec7e03",
"assets/assets/fonts/Avenir-Book-4.otf": "935323edbd2002e3bc2d2d5f2a4bde06"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
