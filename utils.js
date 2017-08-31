// get location 
const _getLocation = (url) => {
    let _location = url.match(/((?:http[s]*\:)*\/\/)(([^\/\.]+\.)+[^\/\.]+)/);
    if (_location) {
        return {
            host: _location[0],
            protocol: _location[1],
            domain: _location[2]        
        }
    } else {
        return null
    }
}

module.exports = { _getLocation }