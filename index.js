var Crawler = require("crawler");
var fs = require('fs');

//  config;
var _pagesToVisit = [];
var _pagesVisited = {};
var _max_pages_to_visit = 100;
var _visited_pages_count = 0;

// go
var _visitPage = function (curPage, callback) {
    _pagesVisited[curPage]= true;
    _visited_pages_count++;
    //  TOOD if curPage is relative path convert it to host + path
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
            if (error) {
                console.log(error);
            } else {
                if (res.$) {
                    var $ = res.$;
                    var _links = $("a");
                    _links.each(function(i, e){
                        var href = $(e).attr("href");
                        var title = $("title").html();
                        if (href) {
                            //add to schedules
                            href = _addUrlTopagesToVisit(curPage, href);
                            fs.appendFileSync('result.txt', title + '\n' + href + '\n');   
                        }                        
                    });
                }                
            }
            //next 
            callback();
            done();
        }
    });
    // Queue just one URL, with default callback
    //c.queue('http://www.amazon.com');
    c.queue(curPage);
}

    // init
var _crawl = function () {
    //  judge by limited
    if(_visited_pages_count >= _max_pages_to_visit) {
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

//  
var _addUrlTopagesToVisit = function (curPage, href) {
    var _location = curPage.match(/(http[s]*\:\/\/)([^\/\.]+\.)+[^\/\.]+/); 
    var _host = _location[0], _protocol = _location[1];
    // whent time out href
    href = href
    // if it is relative Path
    .replace(/^(?!(\/\/|http[s]*:\/\/)).+/, function(){
        return _host + arguments[0].replace(/^(?!\/)/, '/');
    })
    //if without protocol
    .replace(/^\/\//, _protocol);
    // TODO add a filter to restrict url within a few rules
    _pagesToVisit.push(href);
    return href
}

var _init = function (_startPages) { 
    _pagesToVisit = _pagesToVisit.concat(_startPages);
    _crawl();
}

var _schedules = [];
    _schedules.push('http://www.jd.com');

// run
_init(_schedules);


