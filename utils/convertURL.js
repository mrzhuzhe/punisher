// get location
const _getLocation = (url) => {
    let _location = url.match(/^(https?:)?\/\/([\da-z\.]+)\/?((?:[\-a-z\d\.]+\/)*)([\-a-z\d\.]+)(?!\/\b)/);
    if (_location) {
        return {
            host: _location[0],
            protocol: _location[1] + '//',
            domain: _location[2],
            // main: _location[0].match(/([^\.\/]+)\.(com|cn|net|me|c|org|tt)/)[0],
            path: '/' + _location[3] || ''
        }
    } else {
        return null
    }
}


//  convert relative path or without protocol to full domain
var _convertToFullUrl = function (curPage, href) {
    var _location = _getLocation(curPage);
    var _domain = '//' + _location.domain, _protocol = _location.protocol, 
    // 对 path 中 ../ 做特殊处理 [BUG]注意 这里只对 xxx/../做处理 未处理多个../连a续的情况
    _path = _location.path.replace(/[a-z\d]+\/\.\.\//g, '');    
    // whent time out href
    // console.log('href:' + href,"curPage:" + curPage)
    href = href
    // if it is relative Path
    .replace(/^(?!(\/\/|http[s]*:\/\/)).+/, function(){
        if(/^\//.test(arguments[0])) {
            return _domain + arguments[0]
        } else{                    
            return _domain + _path + arguments[0]
        }
    })
    //if without protocol
    .replace(/^\/\//, _protocol);
    // console.log('newhref:'+ href);
    
    return href
}


module.exports = { _getLocation, _convertToFullUrl }