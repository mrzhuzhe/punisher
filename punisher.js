var { _getLocation } = require('./utils');
var Crawler = require("crawler");

// global var
var _pagesToVisit = [];
var _pagesVisited = {};
var _visited_pages_count = 0;
// defalt setting
var _config = {
    _max_pages_to_visit : 10,
    _urlfilter () {
        return true
    },
    _scanCurPage  () {

    },
    _schedules: []
}

// go
var _visitPage = function (curPage, callback) {
    // TODO find this error
    if (!curPage) {
        let msg = "run out of schedules";
        _config._onFinish({ msg });
        return
    }
    _pagesVisited[curPage]= true;
    _visited_pages_count++;
    //  TODO this should be simple line
    var c = new Crawler({
        maxConnections : 10,
        rateLimit: 1000,
        proxy:'http://127.0.0.1:8888',
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
                //  Store and Handler error info
                _config._onError({ error , curPage });
            } else {
                if (res.$) {
                    var $ = res.$;
                    // scan data
                    _config._scanCurPage(curPage, _visited_pages_count , $);
                    // get links within page
                    var _links = $("a");
                                            console.log(curPage, $.html())
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
    c.queue({ uri: curPage, headers: {
            'Host': 'waimai.meituan.com',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
'Upgrade-Insecure-Requests': 1,
'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
"Accept-Encoding": "gzip, deflate",
"Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,ja;q=0.5",
"Cookie": 'uuid=3553baa96e52492083af.1514904587.1.0.0; _lxsdk_cuid=160b7598fa1c8-09d4b1e127ebb2-5f19331c-100200-160b7598fa1c8; __mta=49004057.1514904589073.1514904589073.1514904589073.1; ci=10; w_utmz="utm_campaign=(direct)&utm_source=(direct)&utm_medium=(none)&utm_content=(none)&utm_term=(none)"; w_uuid=e1EOzdb-9UCWFumszoPG2m70UsjxSdO4FRCm8FeKreLbACc2SfIBxmDU7iBi02Ng; _ga=GA1.3.1858980780.1514904597; _gid=GA1.3.676025905.1514904597; _lx_utm=utm_source%3Dgoogle%26utm_medium%3Dorganic; w_cid=0; waddrname=; w_geoid=wtw3sqhhwnud; w_ah=; _ga=GA1.2.1858980780.1514904597; _gid=GA1.2.676025905.1514904597; oc=PllNOTVo73XalOHyRYXQkdiVqb1Xknpcs3JqqQq5ZTLTjqNeUwrV4RbnLNdnVgInxIRnDlV7DRE80viPjmw1Sg4y59ZCiik_-f16Q00_OAdpXt9R2KcR-Pj59y4Y1cKGcBBwy439aOE-M_lfoFrBD7wz40u5DRpWU4h8OLkKVJI; w_visitid=20670214-a22a-4cec-84cb-bf2cd6739f73; JSESSIONID=1wqf46lqhypf01sz65hyza5yyy; __mta=49004057.1514904589073.1514904589073.1514913352523.2'            },
        });
}

// init
var _crawl = function () {
    //  judge by limited
    if(_visited_pages_count >= _config._max_pages_to_visit) {
        let msg = "Reached max limit of number of pages to visit.";
        _config._onFinish({ msg });
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