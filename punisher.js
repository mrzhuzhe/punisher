var { _getLocation } = require('./utils');
var Crawler = require("crawler");

// global var
var _pagesToVisit = [];
var _pagesVisited = {};
var _visited_pages_count = 0;
// defalt setting
var _config = {
    _max_pages_to_visit : 1000,
    _urlfilter () {
        return true 
    },
    _scanCurPage  () {
       
    },
    _schedules: [] 
}

// go
var _visitPage = function (curPage, callback) {
    _pagesVisited[curPage]= true;
    _visited_pages_count++;
    //  TODO this should be simple line
    var c = new Crawler({
        maxConnections : 10,
        rateLimit: 1000,
        jQuery: {
            name: 'cheerio',
            options: {
                normalizeWhitespace: false,
                xmlMode: false,
                decodeEntities: false
            }
        },
        callback : function (error, res, done) {
            let curPage = res.options.uri;
            if (error) {
                console.log(error);
                console.log(curPage);
                //  TODO Store and Handler error info
            } else {
                if (res.$) {                    
                    var $ = res.$;
                    // scan data
                    _config._scanCurPage(curPage, $);
                    // get links within page
                    var _links = $("a");
                    _links.each(function(i, e){
                        var href = $(e).attr("href");                      
                        if (href) {                            
                            //add to schedules
                            href = _convertToFullUrl(curPage, href);
                            //judge if it should be 
                            if (!!_config._urlfilter(curPage, href)) {
                                _pagesToVisit.push(href);                                
                            }                                                          
                        }                        
                    });
                }                
            }
            // next
            callback();
            done();
        }
    });
    // Queue just one URL, with default callback
    c.queue(curPage);
}

// init
var _crawl = function () {
    //  judge by limited
    if(_visited_pages_count >= _config._max_pages_to_visit) {
        console.log("Reached max limit of number of pages to visit.");
        return;
    }
    // TODO judge by deep

    // judge by Compare
    var _nextPage = _pagesToVisit.pop();
    if (_nextPage in _pagesVisited) {
        // We've already visited this page, so repeat the crawl
        _crawl();
    } else {
        // New page we haven't visited
        _visitPage(_nextPage, _crawl);
    }
}

//  convert relative path or without protocol to full domain
var _convertToFullUrl = function (curPage, href) {
    var _location = _getLocation(curPage); 
    var _host = _location.host, _protocol = _location.protocol;
    // whent time out href
    href = href
    // if it is relative Path
    .replace(/^(?!(\/\/|http[s]*:\/\/)).+/, function(){
        return _host + arguments[0].replace(/^(?!\/)/, '/');
    })
    //if without protocol
    .replace(/^\/\//, _protocol);   
    return href
}

var _init = function (options) { 
    _config = Object.assign(_config, options);
    let _startPage = _config._schedules;
    _pagesToVisit = _pagesToVisit.concat(_startPage);
    _crawl();
}

module.exports = { _init }