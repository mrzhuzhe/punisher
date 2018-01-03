var fs = require('fs');
var punisher = require('./punisher');
var { _getLocation } = require('./utils');

//Store Data in Memory

//  config; TODO add an error handle
let _config = {
    _resultData: [],
    _outputFile: 'result/result.json',
    _max_pages_to_visit : 100,
    //  judge Url if it shold be visit TODO Judge Rules should be Modify
    /* TODO
       nowaday i just just full location as filter it is too simple and will miss too much
        i should improve this for get most imfomation page
     */
    _urlfilter (curPage, href) {
        //console.log(href)
        //return !!_getLocation(href) && ( _getLocation(href).main == _getLocation(curPage).main )
        return href.match(/^http[s]*\:\/\/waimai.meituan.com\/restaurant\/(\d+)$/);
    },
    //  scan curpage TODO scan stage should be modify
    _scanCurPage  (href, count , $) {
        var _detail = $(".rest-info .details");
        console.log($(".rest-info").html(),_detail.find(".na span").html());
        var name = _detail.find(".na span").text()
        var star = _detail.find(".stars .mark").text();
        var time = _detail.find(".sale-time").text(); 
        var address = _detail.find(".poi-address").text()
        var tel = _detail.find(".telephone").text()

        // save curpage info
        this._addToResult({
            href, count,
            name ,
            star ,
            time,
            address,
            tel
        });
    },
    _addToResult (data) {
        var _format = data;/* {
            "count": data.count,
            "title": data.title,
            "author": data.author,
            "date": data.updateTime,
            "url": data.href,
            "content": data.content
        } */
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
        fs.appendFileSync(this._outputFile, _formatedData);
        //fs.appendFileSync('result.txt', _format);
    },
    _schedules: []
}
// config end

//start page
let _send = [
    'http://waimai.meituan.com/home/wtw3sqhhwnud'
    ];
_config._schedules = _config._schedules.concat(_send);

let _app = {
    run () {
        fs.open(_config._outputFile, 'w', (err, fd) => {
            console.log(err, fd)
        });        
        console.time("start")
        // run
        punisher._init(_config);
    }
}
_app.run();




