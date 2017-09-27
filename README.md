# punisher
a simple js web crawler

## how to use 
```
1. npm i
```

2. modify `index.js`
change start pages
```
//start page
let _send = [
    'http://antirez.com/latest/0'
    ];
_config._schedules = _config._schedules.concat(_send);
```
```
3. npm run punisher
```
4. then you will see result in `result.txt` (meanwhile you can change output file in `index.js` )

## options
in `./index.js`
```
//  config your crawler Strategy here
let _config = {
    _resultData: [],
    // the max limit of crawler to request
    _max_pages_to_visit : 1000,
    //  judge Url if it shold be visit insofar return true
    _urlfilter (curPage, href) {       
        //return !!_getLocation(href) && ( _getLocation(href).main == _getLocation(curPage).main )
        return href.match(/^http[s]*\:\/\/antirez.com\/news\/(\d+)$/);
    },
    //  scan curpage and gather infomation 
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
    // change the data object format
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
```
