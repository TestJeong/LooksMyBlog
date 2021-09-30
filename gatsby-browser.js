// custom typefaces
require('typeface-catamaran')
require('@kfonts/ridi-batang')
require('fontsource-noto-sans-kr/300.css')
require('fontsource-noto-sans-kr/700.css')
require('fontsource-noto-sans-kr/500.css')
require('@kfonts/nexon-lv1-gothic')
require('@kfonts/nexon-lv2-gothic')
require('@kfonts/bm-hanna-air')

// polyfill
require('intersection-observer')

const metaConfig = require('./gatsby-meta-config')

exports.onInitialClientRender = () => {
  if (metaConfig.share.facebookAppId) {
    window.fbAsyncInit = function() {
      FB.init({
        appId: metaConfig.share.facebookAppId,
        xfbml: true,
        version: 'v3.2',
      })
      FB.AppEvents.logPageView()
    }
    ;(function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  }
}
