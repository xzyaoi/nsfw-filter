/**
 * Constants
 */
let BLUR_RADIUS = 6;

function listImageIds(doc) {
    let ids = []
    let images = doc.getElementsByTagName('img')
    for(let i =0;i<images.length;i++) {
        ids.push(images[i].id)
    }
    return ids
}

function postInfer(domid, isNude) {
    if(isNude) {
        console.log(domid + 'is nude? ' + isNude)
        let porn_image = document.getElementById(domid)
        porn_image.src = ""
        porn_image.style.filter = "blur(20px);"
        console.log(porn_image.style)
    }
}

function infer(images) {
    for(let i=0;i<images.length;i++) {
        nude.load(images[i])
        nude.scan(function(result) {
            postInfer(images[i], result)
            return result
        })
    }
}


function handleDOMContent(domContent) {
    let parser = new DOMParser()
    let doc = parser.parseFromString(domContent, "text/html")
    let images = listImageIds(doc)
    if (images.length > 0) {
        infer(images)
    }
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        //sendResponse(document.all[0].outerHTML);
        let images = listImageIds(document)
        if (images.length > 0) {
            infer(images)
        }
    }
});

chrome.runtime.onInstalled