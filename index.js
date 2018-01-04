var fs = require('fs');
var punisher = require('./crawler/punisher');
var { _getLocation } = require('./utils/convertURL');

//Store Data in Memory

//  config; TODO add an error handle
let _config = {
    _resultData: [],
    _outputFile: 'result/result.json',
    _timeLimit: 2500,
    _max_pages_to_visit : 100,
    //  _proxy: 'http://127.0.0.1:8888',
    _customHeader: {
            'Host': 'waimai.meituan.com',
            'Connection': 'keep-alive',
            'Cache-Control': 'max-age=0',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,ja;q=0.5",
            "Cookie": 'uuid=3553baa96e52492083af.1514904587.1.0.0; _lxsdk_cuid=160b7598fa1c8-09d4b1e127ebb2-5f19331c-100200-160b7598fa1c8; __mta=49004057.1514904589073.1514904589073.1514904589073.1; ci=10; w_utmz="utm_campaign=(direct)&utm_source=(direct)&utm_medium=(none)&utm_content=(none)&utm_term=(none)"; w_uuid=e1EOzdb-9UCWFumszoPG2m70UsjxSdO4FRCm8FeKreLbACc2SfIBxmDU7iBi02Ng; _ga=GA1.3.1858980780.1514904597; _gid=GA1.3.676025905.1514904597; _lx_utm=utm_source%3Dgoogle%26utm_medium%3Dorganic; w_cid=0; waddrname=; w_geoid=wtw3sqhhwnud; w_ah=; _ga=GA1.2.1858980780.1514904597; _gid=GA1.2.676025905.1514904597; oc=PllNOTVo73XalOHyRYXQkdiVqb1Xknpcs3JqqQq5ZTLTjqNeUwrV4RbnLNdnVgInxIRnDlV7DRE80viPjmw1Sg4y59ZCiik_-f16Q00_OAdpXt9R2KcR-Pj59y4Y1cKGcBBwy439aOE-M_lfoFrBD7wz40u5DRpWU4h8OLkKVJI; w_visitid=20670214-a22a-4cec-84cb-bf2cd6739f73; JSESSIONID=1wqf46lqhypf01sz65hyza5yyy; __mta=49004057.1514904589073.1514904589073.1514913352523.2'
    },
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




