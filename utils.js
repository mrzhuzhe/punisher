// get location 
const _getLocation = (url) => {
    let _location = url.match(/((?:http[s]*\:)*\/\/)(([^\/\.]+\.)+[^\/\.]+)/);
    if (_location) {
        return {
            host: _location[0],
            protocol: _location[1],
            domain: _location[2],
            main: _location[0].match(/([^\.\/]+)\.(com|cn|net|me|c|org)/)[0]
        }
    } else {
        return null
    }
}

module.exports = { _getLocation }