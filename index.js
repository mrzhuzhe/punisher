var fs = require('fs');
var punisher = require('./punisher');
var { _getLocation } = require('./utils');

//  config; TODO add an error handle
let _config = {
    _max_pages_to_visit : 100,
    //  judge Url if it shold be visit TODO Judge Rules should be Modify
    /* TODO
       nowaday i just just full location as filter it is too simple and will miss too much 
        i should improve this for get most imfomation page
     */
    _urlfilter (curPage, href) {
        //return !!_getLocation(href) && ( _getLocation(href).main == _getLocation(curPage).main )
        return href.match(/^https\:\/\/yevon1ou\.wordpress.com\/(\d+)\/(\d+)\/(\d+)\/[^/]+\/$/)
    },
    //  scan curpage TODO scan stage should be modify
    _scanCurPage  (href, count , $) {
        var title = $("#container .entry-title").text();
        var content = $("#container .entry-content p").text();    
        var updateTime = $("#container .entry-date").text();
        // save curpage info
        this._saveToDataBase({
            href, count, title, content, updateTime
        });
    },
    // save
    _saveToDataBase (data) {
        var _format = data.count + " " + data.title + ' ' +  data.href + ' ' + data.content + ' ' + data.updateTime + ' \n \n \n ';
        fs.appendFileSync('result.txt', _format);
    },
    _schedules: [] 
}
// config end

//start page
_config._schedules.push('https://yevon1ou.wordpress.com/2005/06/26/%E7%94%A8%E6%9D%BF%E5%9D%97%E7%9A%84%E7%9C%BC%E5%85%89%E7%9C%8B%E6%A5%BC%E5%B8%82/');

let _app = {
    run () {
        fs.unlinkSync('result.txt')
        // run
        punisher._init(_config);
    }
}
_app.run();




