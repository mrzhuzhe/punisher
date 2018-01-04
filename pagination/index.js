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
            proxy: 'http://10.12.50.103:5389',
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
        this._init('http://waimai.meituan.com/ajax/poilist?_token=eJxNklFzojAUhf8LrzCSBEjAmX2gUNQq1WK1yk4fUECBIghBZHf2v2+CQ3cZZvjm3JOT3Bt+C9UsFMYQsIdIwi2qhLEAR2CEBUmgNatoUANEA5qOMDMc/9OwoWCsSsKh2trC+CdEOpAUgD654jHhoegAfEoPJED9lJDKXu6ZMYtwprQcy3IbJHmQjPIooU1wGR2LXD4XeSS3tDXgNY6rDiN2IO6uub1tR6eiOH1FzDpKS1lggfk7D9R1CSlYZWadbaRoPQFGKmRECCNkcOJV2JPCCQ0E8IMg6VMe9E8j36QPRNA3GQPpA+lAGwgOa3X0SCa83McgwNf0KuyDlB4RR/CNjy0B5si7wYbBUOOxmHUGicoNWONhKg/DvbdHdmUceSOqwg0aT1DYbfRNsfllfH7sG/RzZEOUoAGlxYzX6FBz2e/B1tXJ6cIoerm/pkfatKn55sWi4/n77MlKQJaG4fl5/pVUh4Tui9oF6mQZ+2A1yYJbhcvMKpFxb0O8xy74NUnI5lZa/rtnXrdoccpdJy7CJfxYAGcZhOfikEbuZONU9N7tQeCBYG3fymkSxvCykDMryuZdYlPPedZ89+BVndVV7tOH3bV5ssvoa2qmXjH3TksFd93LKdrKFHhyslKJ7ebhMZha80nabFfmcuWvMxFM0MInW11cqLumu91j37qi8mqYxs2Wd3U9vR+ymbn5iJsulS+6CtfN7urWUHQ6hdogE49kKjr7570hmm/O3b/UP4Q/fwGDKOTJ')
        //'eJxNkl9volAQxb8LrxCZe7n8uSb7QKGoVarF1iqbPqCAAkUQUKSb/e57L80uS0j45cyZM5MJv4RqFgpjBOzRJeEWVcJYQCMYaYIkNDWrqEgFXQXVwBozHP7TENGYKAn7amML458IGyApgD+44jHhWzEAPqRv1IF8SJiwl3tmzCKcmqYcy3IbJHmQjPIoaa7BeXQocvlU5JHcNi1FlziuOg2zhbi75va2HR2L4vgZMesoLWWBBeavPBArmoR0RJkbK+qAZEBgiIEjJv8QcS9GDBHlCVjhaCCOKkfV4MgTkMJR6VVEGRK+G4Ie9R55Lum9oEiIEhhQGXAwqIOq9rnA1qHadxubRvV+BMIMaa8iXcKA+jZdZQj9YFXjBoMjIRxJv686IOLYj8A6R61HPpj262DgYZgfNOMHZd9gOCxF0mLGa83fmsv+F9ZXJ8czo+jp/pwemmubmi9eLDqev8serASyNAxPj/PPpNonza6oXSCTZezDapIFt0orM6vE9N6G2k5z4WuS6G+30vJfPfOywYtj7jpxES7R+wKcZRCein0auZM3p2ru3Q4CD4K1fSunSRij80LOrCibd4ndeM6j6rt7r+qsrnIf3u2uzZNt1jynZuoVc++4VLSuezpGG7kBT05WRLfdPDwEU2s+Sa+blblc+etMhAle+PrGEBdke+1u99i3Lri8UJPebHlb19P7PpuZb+/xtUvls0HQ+rq9uDUSnU5pbMjEgz4Vnd3jjormi3P3z/UP4fcf2XTnkA==')
    }
}
_app._run()
