# punisher
a simple js web crawler

## how to use 
```
1. npm i
```

2. modify `index.js`
change start pge
```
//start page
_config._schedules.push('http://bj.fang.lianjia.com/loupan');
```
```
3. npm run punisher
```
4. then you will see result in `result.txt` (meanwhile you can change output file in `index.js` )

## options
in `./index.js`
```
let _config = {
    _max_pages_to_visit : 10000,
    //  judge Url if it shold be visit TODO Judge Rules should be Modify
    /* TODO
       nowaday i just just full location as filter it is too simple and will miss too much 
        i should improve this for get most imfomation page
     */
    _urlfilter (curPage, href) {
        return !!_getLocation(href) && ( _getLocation(href).main == _getLocation(curPage).main )
    },
    //  scan curpage TODO scan stage should be modify
    _scanCurPage  (href, count , $) {
        var title = $("title").html();
        // save curpage info
        this._saveToDataBase({
            href, count, title
        });
    },
    // save
    _saveToDataBase (data) {
        fs.appendFileSync('result.txt', data.count + " " + data.title + ' ' +  data.href + ' \n');
    },
    _schedules: [] 
}
```
