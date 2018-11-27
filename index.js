var fs = require('fs');
var punisher = require('./crawler/punisher');
var { _getLocation } = require('./utils/convertURL');

//Store Data in Memory

//  config; TODO add an error handle
let _config = {
    _resultData: [],
    _outputFile: 'result/result.json',
    _timeLimit: 100,
    _max_pages_to_visit : 10000,
    //  _proxy: 'http://127.0.0.1:8888',
    _customHeader: {
            'Host': 'qidian.qq.com',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0',
            'Upgrade-Insecure-Requests': 1,
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,ja;q=0.5",
            "Cookie": 'pgv_pvid=2143136640; _qddaz=QD.lc2sx7.oe4wa6.jnokb98k; __qidianid=20913269ab1359d98fb78b73a14c07cd57d31027; __root_domain_v=.qidian.qq.com; _smt_uid=5bd1b691.f583365; _jc_uid=5bd1b691.f583365; _ga=GA1.2.861124998.1538969852; pgv_pvi=849018880; RK=KEoFXUBUPJ; ptcz=63af72f06ef312924f1ace06ae5d04a60db01f0e8f9df123ac654b816505505e; ts_uid=7138846725; _ga=GA1.3.861124998.1538969852; ptui_loginuin=3359676474; pac_uid=1_523647406; tvfe_boss_uuid=19425305186d9da0; o_cookie=3359676474; pt2gguin=o0523647406; luin=o0523647406; ts_refer=tapd.oa.com/NPC_BOSS/prong/stories/view/1010023411063461893; _gid=GA1.3.1061003966.1541988708; Hm_lvt_ff8dc0f41713a3c9cfdd53a52a98e279=1541992471; _qd_utm_term=; lskey=000100004fdd8aa101a8c3ffc2a78f05cf5108cf24cba9dde329aab140127ff409744263e561270c585df22b; _qpsvr_localtk=1542004878734; pgv_info=ssid=s5012796623; _qdda=3-1.1; _qddab=3-zfcmpq.joe08v84; Hm_lvt_3b5354c9bf27041f86175877f2134d74=1541579468,1541676914,1541988708,1542008834; PHPSESSID=3fc4ss2m9e7dii5colfl58pc57; QIDIANSTORESESSION=fqa839mobenhbo0fqit8pbgm42; _qddamta_2852139995=3-0; _qddamta_2852058890=3-0; ts_last=qidian.qq.com/news/cpsy/news-cpsy-content-0927-001.html; Hm_lpvt_3b5354c9bf27041f86175877f2134d74=1542008898'
    },
    //  judge Url if it shold be visit TODO Judge Rules should be Modify
    /* TODO
       nowaday i just just full location as filter it is too simple and will miss too much
        i should improve this for get most imfomation page
     */
    _urlfilter (curPage, href) {
        return !!_getLocation(href) && ( _getLocation(href).domain == _getLocation(curPage).domain )
        // return href.match(/^http[s]*\:\/\/qidian.qq.com\/news\//);
    },
    
    //  scan curpage TODO scan stage should be modify
    _scanCurPage  (href, count , $) {
        //去掉/N和空格
        var title = $('.title').text();
        var FText = $('.content').html();
        var detailjson = {};
        detailjson['data'] = [new Date()];
        detailjson['tdkTitle'] = $('title').text();
        detailjson['tdkKeyWords'] = $('meta[name="keywords"]').attr('content');
        detailjson['tdkAbstract'] = $('meta[name="description"]').attr('content');
        var newobj = {};
        var newarr= [];
        var listimg = $('.left img');
        for(var i = 0;i < listimg.length; i++){
            newobj['listimg'] = $('.left img').eq(i).attr('src');
            newobj['ahref'] = $('li .right a').eq(i).attr('href');
            newobj['xtitle'] = $('.right .x-title').eq(i).text();
            newobj['xcontent'] = $('.right .x-content').eq(i).text();
            newarr.push(newobj);
        }
        // save curpage info
        this._addToResult({
            href,
            count,
            title,
            FText,
            newarr
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

//待爬池
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
    if(i>= 10 && i < 100) {
        arr12.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1611-0' + i + '.html')
    }else{
        arr12.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1611-00' + i + '.html')
    }
}
for(var i = 1;i < 128; i++){
    if(i>= 10 && i < 100) {
        arr13.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1612-0' + i + '.html')
    }else if(i>= 100) {
        arr13.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1612-' + i + '.html')
    }else{
        arr13.push('https://qidian.qq.com/news/hyzx/news-hyzx-content-1612-00' + i + '.html')
    }
}
for(var i = 1;i < 33; i++){
    if(i>=10 && i < 100){
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
var allArr = arr0.concat(arr4, arr5, arr6, arr7, arr8, arr9, arr10, arr11, arr12, arr13, arr14, arr15, arr16, arr17, arr18);
//列表页
var listarr=['https://qidian.qq.com/news/news-hyzx.html', 'https://qidian.qq.com/news/news-qdxw.html', 'https://qidian.qq.com/news/news-cpsy.html'].concat(arr1, arr2, arr3);

//start page
// let _send = allArr;
let _send = listarr;
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




