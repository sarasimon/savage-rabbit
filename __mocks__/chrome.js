const chrome = {
    runtime: {
      lastError: false,
    },
    
    identity: {
      getAuthToken(){
        return 'test_token';
      }
    },
}

module.exports = chrome;