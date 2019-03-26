/**
 * global variables
 */
let model
let endpoints
const IMAGE_SIZE = 299
let normalizationOffset

/**
 * functions
 */
function listImages(doc) {
    let images = doc.getElementsByTagName('img');
    return images
}

function listImageIds(doc) {
    let ids = []
    let images = doc.getElementsByTagName('img')
    for(let i =0;i<images.length;i++) {
        console.log(images[i])
        console.log(images[i].id)
        ids.push(images[i].id)
    }
    return ids
}

function handleVendor(vendorURL) {
    return new Promise((resolve, reject) => {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = function () {
            console.log('[nsfw filter] vendor loaded ' + vendorURL)
            resolve(vendorURL)
        }
        script.src = vendorURL;
        head.appendChild(script);
    })
}

function bootstrap() {
    handleVendor('vendor/nude.min.js')
    handleVendor('vendor/worker.nude.js')
}

function infer(images) {
    for(let i=0;i<images.length;i++) {
        nude.load(images[i])
        nude.scan(function(result) {
            console.log(result)
        })
    }
}

function handleDOMContent(domContent) {
    let parser = new DOMParser()
    let doc = parser.parseFromString(domContent, "text/html")
    let images = listImageIds(doc)
    console.log(images)
    if (images.length > 0) {
        infer(images)
    }
}

chrome.tabs.onUpdated.addListener(function (tab) {
    chrome.tabs.sendMessage(
        tab,
        { text: 'report_back' },
        handleDOMContent
    )
})

bootstrap()