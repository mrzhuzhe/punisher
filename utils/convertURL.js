// get location
const _getLocation = (url) => {
    let _location = url.match(/((?:http[s]*\:)*\/\/)(([^\/\.]+\.)+[^\/\.]+)/);
    if (_location) {
        return {
            host: _location[0],
            protocol: _location[1],
            domain: _location[2],
            main: _location[0].match(/([^\.\/]+)\.(com|cn|net|me|c|org|tt)/)[0]
        }
    } else {
        return null
    }
}


//  convert relative path or without protocol to full domain
var _convertToFullUrl = function (curPage, href) {
    var _location = _getLocation(curPage);
    var _host = _location.host, _protocol = _location.protocol;
    // whent time out href
    href = href
    // if it is relative Path
    .replace(/^(?!(\/\/|http[s]*:\/\/)).+/, function(){
        return _host + arguments[0].replace(/^(?!\/)/, '/');
    })
    //if without protocol
    .replace(/^\/\//, _protocol);
    return href
}


module.exports = { _getLocation, _convertToFullUrl }