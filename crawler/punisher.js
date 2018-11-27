// var { _getLocation, _convertToFullUrl } = require('../utils/convertURL');
// var Crawler = require("crawler");

// // global var
// var _pagesToVisit = [];
// var _pagesVisited = {};
// var _visited_pages_count = 0;
// // defalt setting
// var _config = {
//     _max_pages_to_visit : 10,
//     _urlfilter () {
//         return true
//     },
//     _scanCurPage  () {

//     },
//     _schedules: []
// }

// // go
// var _visitPage = function (curPage, callback) {
//     // TODO find this error
//     if (!curPage) {
//         let msg = "run out of schedules";
//         _config._onFinish({ msg });
//         return
//     }
//     _pagesVisited[curPage]= true;
//     _visited_pages_count++;
//     //  TODO this should be simple line
//     var c = new Crawler({
//         maxConnections : 10,//maxConnections是可以同时运行的最大任务数。
//         rateLimit: 1000,//rateLimit是两个任务之间的最小时间差距。当rateLimit设置为非零值时，maxConnections将强制为1。
//         proxy: _config._proxy,
//         jQuery: {
//             name: 'cheerio',
//             options: {
//                 normalizeWhitespace: false,
//                 xmlMode: false,
//                 decodeEntities: false
//             }
//         },
//         callback : function (error, res, done) {
//             let curPage = res.options.uri;
//             if (error) {
//                 console.log(error);
//                 // console.log(curPage);
//                 //  Store and Handler error info
//                 _config._onError({ error , curPage });
//             } else {
//                 if (res.$) {
//                     var $ = res.$;
//                     // scan data
//                     _config._scanCurPage(curPage, _visited_pages_count , $);
//                     // get links within page
//                     var _links = $("a");
//                     _links.each(function(i, e){
//                         var href = $(e).attr("href");
//                         if (href) {
//                             //add to schedules
//                             href = _convertToFullUrl(curPage, href);
//                             //judge if it should be
//                             if (!!_config._urlfilter(curPage, href)) {
//                                 _pagesToVisit.push(href);
//                             }
//                         }
//                     });
//                     callback()
//                 }
//             }
//             done();
//         }
//     });
//     // Queue just one URL, with default callback
//     c.queue({ uri: curPage, headers: _config._customHeader });
// }

// // init
// var _crawl = function () {
//     //  judge by limited
//     if(_visited_pages_count >= _config._max_pages_to_visit) {
//         let msg = "Reached max limit of number of pages to visit.";
//         _config._onFinish({ msg });
//         return;
//     }
//     // TODO judge by deep

//     // judge by Compare
//     var _nextPage = _pagesToVisit.pop();
//     if (_nextPage in _pagesVisited) {
//         // We've already visited this page, so repeat the crawl
//         _crawl();
//     } else {
//         setTimeout(()=> {
//             // New page we haven't visited
//             _visitPage(_nextPage, _crawl);
//         }, _config._timeLimit)
//     }
// }

// var _init = function (options) {
//     _config = Object.assign(_config, options);
//     let _startPage = _config._schedules;
//     _pagesToVisit = _pagesToVisit.concat(_startPage);
//     _crawl();
// }

// module.exports = { _init }
// var  _addToResul  = require ('../index.js')
var Crawler = require('crawler');
var fs = require('fs');
var _saveToDataBase = function(data) {
    var newarr = []
    var _outputFile = 'result/result.json';
    var _formatedData = JSON.stringify(data);
    fs.appendFileSync(_outputFile, _formatedData);
    //fs.appendFileSync('result.txt', _format);
};
var c = new Crawler({
    rateLimit: 2000,
    maxConnections: 1,
    callback: function(error, res, done) {
        if(error) {
            console.log(error)
        } else {
            var $ = res.$;
            console.log($('title').text())
            _saveToDataBase()
        }
        done();
    }
})
//待爬池
//列表页
var listarr=['https://qidian.qq.com/news/news-hyzx.html', 'https://qidian.qq.com/news/news-qdxw.html', 'https://qidian.qq.com/news/news-cpsy.html'];
var arr1 = [],arr2 = [],arr3 = [],arr4 = [],arr5 = [],arr6 = [],arr7 = [],arr8 = [],arr9 = [],arr10 = [],arr11 = [],arr12 = [],arr13 = [],arr14 = [],arr15 = [],arr16 = [],arr17 = [],arr18 = []
//news https://qidian.qq.com/news/news-qdxw.html
// var arr0 = ['https://qidian.qq.com/news/new-news.html',  'https://qidian.qq.com/news/qdinformation.html', 'https://qidian.qq.com/news/qdnews.html', 'https://qidian.qq.com/news/qdproduct.html'];老的，已弃用
var arr0 = [];
for(var i = 2;i < 4; i++){
    arr1.push('https://qidian.qq.com/news/news-cpsy' + i + '.html')
}
for(var i = 2;i < 25; i++){
    arr2.push('https://qidian.qq.com/news/news-hyzx' + i + '.html')
}
for(var i = 2;i < 4; i++){
    arr3.push('https://qidian.qq.com/news/news-qdxw' + i + '.html')
}
//cpsy https://qidian.qq.com/news/cpsy/news-cpsy-content-1.html
arr4 = ['https://qidian.qq.com/news/cpsy/news-cpsy-content-0823-001.html','https://qidian.qq.com/news/cpsy/news-cpsy-content-0927-001.html']
for(var i = 1;i < 24; i++){
    arr5.push('https://qidian.qq.com/news/cpsy/news-cpsy-content-' + i + '.html')
}
for(var i = 1;i < 4; i++){
    arr6.push('https://qidian.qq.com/news/cpsy/news-cpsy-content-1611-00' + i + '.html')
}
for(var i = 1;i < 5; i++){
    arr7.push('https://qidian.qq.com/news/cpsy/news-cpsy-content-1612-00' + i + '.html')
}
for(var i = 1;i < 3; i++){
    arr8.push('https://qidian.qq.com/news/cpsy/news-cpsy-content-1810-00' + i + '.html')
}

//hyzx https://qidian.qq.com/news/hyzx/news-cpsy-content-1.html
arr9 = ['https://qidian.qq.com/news/hyzx/news-qdxw-content-12.html']
for(var i = 1;i < 10; i++){
    arr10.push('https://qidian.qq.com/news/hyzx/news-cpsy-content-' + i + '.html')
}
for(var i = 1;i < 4; i++){
    arr11.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1611-00' + i + '.html')
}
for(var i = 1;i < 74; i++){
    if(i>= 10) {
        arr12.push('https://qidian.qq.com/news/hyzx/news-cpsy-content-1611-0' + i + '.html')
    }else{
        arr12.push('https://qidian.qq.com/news/hyzx/news-cpsy-content-1611-00' + i + '.html')
    }
}
for(var i = 1;i < 128; i++){
    if(i>= 10) {
        arr13.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1612-0' + i + '.html')
    }else if(i>= 100) {
        arr13.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1612-' + i + '.html')
    }else{
        arr13.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1612-00' + i + '.html')
    }
}
for(var i = 1;i < 33; i++){
    if(i>=10){
        arr14.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-160927-0' + i + '.html')
    }else{
        arr14.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-160927-00' + i + '.html')
    }
}
for(var i = 1;i < 4; i++){
    arr15.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-180910-00' + i + '.html')
}

//qdxw  https://qidian.qq.com/news/qdxw/news-cpsy-content-1.html
for(var i = 1;i < 13; i++){
    arr16.push('https://qidian.qq.com/news/qdxw/news-qdxw-content-' + i + '.html')
}
arr17 = ['https://qidian.qq.com/news/qdxw/news-qdxw-content-1612-001.html', 'https://qidian.qq.com/news/qdxw/news-qdxw-content-1612-002.html', 'https://qidian.qq.com/news/qdxw/news-qdxw-content-180710-001.html', 'https://qidian.qq.com/news/qdxw/news-qdxw-content-180711-001.html', 'https://qidian.qq.com/news/qdxw/news-qdxw-content-180816-001.html', 'https://qidian.qq.com/news/qdxw/news-qdxw-content-180828-001.html']
for(var i = 1;i < 10; i++){
    arr18.push('https://qidian.qq.com/news/qdxw/news-qdxw-content-160927-00' + i + '.html')
}
var allArr = arr0.concat(arr1, arr2, arr3, arr4, arr5, arr6, arr7, arr8, arr9, arr10, arr11, arr12, arr13, arr14, arr15, arr16, arr17, arr18)
c.queue(allArr);