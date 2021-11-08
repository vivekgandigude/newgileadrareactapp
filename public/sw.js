let CACHE_NAME = 'codePwa';

var urlCache = [
        '/static/js/bundle.js',
        '/static/js/vendors~main.chunk.js',
        '/static/js/main.chunk.js',
        '/manifest.json',
        '/logo192.png',
        '/olympics',
        '/static/media/logo.6ce24c58.svg',
        '/employees'

]


/// install service worker 
this.addEventListener('install',(event)=>{
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache)=>{
            return cache.addAll(urlCache)
        })
    )
})

// fetch cache data

this.addEventListener('fetch',(event)=>{
    if(!navigator.onLine){
        console.log("offline")
        if (event.request.url === "http://localhost:3000/static/js/main.chunk.js") {
            event.waitUntil(
                this.registration.showNotification("modeNet", {
                    body: "Offline",
                    icon:'http://localhost:3000/logo192.png'
                })
            )
        }
        event.respondWith(
            caches.match(event.request)
            .then((response)=>{
                if(response){
                    return response
                }              
                let fUrl = event.request.clone()
                fetch(fUrl)
            })
        )
    }
})
