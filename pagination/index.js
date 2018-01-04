var Crawler = require("crawler");
var fs = require('fs');

let _config = {
    _outputFile: 'result/result2.json',
}
var _app = {
    _init(curPage, callback) {
        //  TODO this should be simple line
        var c = new Crawler({
            maxConnections : 10,
            rateLimit: 1000,
            //  proxy: 'http://10.12.50.103:5389',
            callback : function (error, res, done) {
                let curPage = res.options.uri;
                if (error) {
                    console.log(error);
                    console.log(curPage);
                    //  Store and Handler error info
                } else {
                    let _formatedData = JSON.stringify(res.body);
                    fs.appendFileSync(_config._outputFile, _formatedData);
                }
                // next
                //callback();
                done();
            }
        });
        // Queue just one URL, with default callback
        c.queue({ uri: curPage,
            headers: {
                'Host': 'waimai.meituan.com',
                'Connection': 'keep-alive',
                'Content-Length': 298,
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Origin': 'http://waimai.meituan.com',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Referer': 'http://waimai.meituan.com/home/wtw91qffry62',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,zh-TW;q=0.6,ja;q=0.5',
                'Cookie': '_lxsdk_cuid=16067bf4fd6c8-03cb4073e96348-2072234d-416e0-16067bf4fd6c8; _lxsdk=16067bf4fd6c8-03cb4073e96348-2072234d-416e0-16067bf4fd6c8; ci=10; rvct=10; __mta=152499078.1513583082387.1513583120430.1513583123009.4; w_utmz="utm_campaign=(direct)&utm_source=(direct)&utm_medium=(none)&utm_content=(none)&utm_term=(none)"; w_uuid=B7XQFVzFPjpGg3caxrPWh4W8N7ptetF0uHVs25RY_GKst8IojdJp3Sr5UnseXgpr; _ga=GA1.3.893776085.1514444835; waddrname="%E9%99%88%E6%A1%A51%E8%B7%AF"; w_geoid=wtw91qffry62; w_cid=310115; w_cpy=pudongxinqu; w_cpy_cn="%E6%B5%A6%E4%B8%9C%E6%96%B0%E5%8C%BA"; w_ah="31.150779873132706,121.69966880232096,%E9%99%88%E6%A1%A51%E8%B7%AF"; iuuid=73BB94DF99C436D6941DA0C14760A26B3E5B8302C46F4973451B07B346FD7DFE; cityname=%E4%B8%8A%E6%B5%B7; webp=1; _ga=GA1.2.893776085.1514444835; uuid=bdd180119d274d9c9c30.1515056932.1.0.0; _lx_utm=utm_source%3Dgoogle%26utm_medium%3Dorganic; _gid=GA1.3.492287903.1515056954; IJSESSIONID=1wn9w9f0m0461z10hk9pc5c6c; i_extend=H__a100038__b1; __utma=74597006.380706370.1514864465.1514864465.1515069323.2; __utmc=74597006; __utmz=74597006.1515069323.2.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); w_visitid=dd842a12-e9a8-4f83-9003-2dc44f8f7072; _gid=GA1.2.492287903.1515056954; JSESSIONID=1dheatxchlkm26tgdn7wrtlm3; __mta=152499078.1513583082387.1513583123009.1515075058659.5'
            },
            method: "post",
            jquery: false,
            form: {
                classify_type:'cate_all',
                sort_type:0,
                price_type:0,
                support_online_pay:0,
                support_invoice:0,
                support_logistic:0,
                page_offset:21,
                page_size:20,
                uuid:'B7XQFVzFPjpGg3caxrPWh4W8N7ptetF0uHVs25RY_GKst8IojdJp3Sr5UnseXgpr',
                platform:1,
                partner:4,
                originUrl:'http%3A%2F%2Fwaimai.meituan.com%2Fhome%2Fwtw91qffry62'
            }
        });
    },
    _run() {
        fs.open(_config._outputFile, 'w', (err, fd) => {
            console.log(err, fd)
        });
        this._init('http://waimai.meituan.com/ajax/poilist?_token='+
        'eJx1kluP2jAQhf+LX7HA40vsIK0qLoVlw4blTlXxECBLAiRQCGRD1f9e27RNH9ooUj6Pj8+Mj/IdnXsbVAeiH4nRLTyjOoIqqToIo+yidwQIIl1KlGIco/VfNe4wl7sYrc6zNqp/BaoIpkwtTWWkC4+KImSJHygJX2LK9Ws0PS1BUZad6rVaHsRJEFeTMM6uQVpdH5NadEzCWp7lbBNmYpfeEj3Q/9WfLllQPAHSxsnEGINkWAqp9CnKuUZukDlSI6EauVJYcmGqQgmN1FzZEXpMTohBVzswaarUcc0xYVGVKP+JokRq0DoI6yAtWoFrETQCsUMaXwCLRgDMorkFcIvEoPVljkFrxkwLsNek1sH6UlGiOUZtC3BKZCWWAiJLFA/Uge5NoPob2GBNFiAY7vesjGPQibR7M5MuSAyKP7aYnhckeSyEBAzsj07nDYL+WlFQGFzXCHWT7HezV/0j6t1LvE01hS8f/m5NvLxoDCO/cmjymliNVefZ8dP5Ok9o4F2dl2/Dt5Rk25H3JWf5e4MN7u3USyqTZjHyh/Nmg/DTfTcaXruztCM6/Oxnm6LxBs/bvTdqBIUUGzofyOIuBl7PZbRfeBevHYVrfrxea87+7rvThruJxsPmXjpn53MzmRzkYjT2+oKF6Wv8LtyP/q5dHC6L1nrBWRz1u8NbfBzstq1VazqfnvzBodLtZtcFi+JpfHxCP34CYPbfOA==')
    }
}
_app._run()
