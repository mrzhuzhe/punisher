var fs = require('fs');
var punisher = require('./punisher');
var { _getLocation } = require('./utils');

//Store Data in Memory

//  config; TODO add an error handle
let _config = {
    _resultData: [],
    _max_pages_to_visit : 1000,
    //  judge Url if it shold be visit TODO Judge Rules should be Modify
    /* TODO
       nowaday i just just full location as filter it is too simple and will miss too much
        i should improve this for get most imfomation page
     */
    _urlfilter (curPage, href) {
        //console.log(href)
        //return !!_getLocation(href) && ( _getLocation(href).main == _getLocation(curPage).main )
        return href.match(/^http[s]*\:\/\/antirez.com\/news\/(\d+)$/);
    },
    //  scan curpage TODO scan stage should be modify
    _scanCurPage  (href, count , $) {
        var title = $("#newslist h2").text();
        var content = $("#content .comment pre").text();
        var _info = $("#content .comment .info");
        var updateTime = _info.text();
        var author = _info.find(".username").text();

        // save curpage info
        this._addToResult({
            href, count,
            title,
            content,
            updateTime,
            author
        });
    },
    _addToResult (data) {
        var _format = {
            "count": data.count,
            "title": data.title,
            "author": data.author,
            "date": data.updateTime,
            "url": data.href,
            "content": data.content
        }
        this._resultData.push(_format);
    },
    //  on maxLimit or finished
    _onFinish (data) {
        console.timeEnd("start")
        console.log(data);
        this._saveToDataBase(this._resultData);

    },
    // on crawler.js try catch
    _onError (data) {
        console.log(data);
        this._saveToDataBase(this._resultData);
    },
    // save
    _saveToDataBase (data) {
        let _formatedData = JSON.stringify(data);
        fs.appendFileSync('result.txt', _formatedData);
        //fs.appendFileSync('result.txt', _format);
    },
    _schedules: []
}
// config end

//start page
let _send = [
    'http://antirez.com/latest/0'
    ];
_config._schedules = _config._schedules.concat(_send);

let _app = {
    run () {
        fs.unlinkSync('result.txt')
        console.time("start")
        // run
        punisher._init(_config);
    }
}
_app.run();




