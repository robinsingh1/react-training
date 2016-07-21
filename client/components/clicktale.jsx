export class Clicktale {
    render () {
        // BEGIN CLICKTALE JS
        (function(win,doc){

        var scriptElement, scrSrc;

        if (typeof (win.ClickTaleCreateDOMElement) != "function") { win.ClickTaleCreateDOMElement = function(tagName) { if (doc.createElementNS) { return doc.createElementNS('http://www.w3.org/1999/xhtml', tagName); } return doc.createElement(tagName); } }

        win.WRInitTime=(new Date()).getTime();

        scriptElement = ClickTaleCreateDOMElement('script');
        scriptElement.type = "text/javascript";

        scrSrc = doc.location.protocol=='https:'? 'https://clicktalecdn.sslcs.cdngc.net/': 'http://cdn.clicktale.net/';

        scrSrc += 'www19/ptc/e52f8be7-df52-4466-8fe4-3284548b26c5.js';

        scriptElement.src = scrSrc;

        doc.getElementsByTagName('body')[0].appendChild(scriptElement);
        })(window,document);
    }
}