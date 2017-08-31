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
        return !!_getLocation(href) && ( _getLocation(href).domain == _getLocation(curPage).domain )
    },
    //  scan curpage TODO scan stage should be modify
    _scanCurPage  (href, $) {
        var title = $("title").html();
        // save curpage info
        this._saveToDataBase({
            href, title
        });
    },
    // save
    _saveToDataBase (data) {
        fs.appendFileSync('result.txt', data.title + '\n' + data.href + '\n');
    },
    _schedules: [] 
}
// config end

//start page
_config._schedules.push('http://www.jd.com');

// run
punisher._init(_config);





