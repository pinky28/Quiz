<div id="vcSystemInfo">

	<div clas="browser"> <span>
	    <b> Browser Name : </b></span> <span class="browser-name-result"> </span><br />
	    <b> Browser Version 1 : </b></span> <span class="browser-version-result1"> </span> <br />
	    <b> Browser Version 2 : </b></span> <span class="browser-version-result2"> </span><br />
	    <b> Browser Engine : </b></span> <span class="browser-engine"> </span> <br />
	    <b> Browser Platform : </b></span> <span class="browser-platform"> </span> <br />
	</div>

    <div clas="sample-rate"> <span>
        <b> Sample Rate : </b></span> <span class="sample-rate-result"> </span>
    </div>

</div>
<script>


    var systemInfo={

        timeOpened:new Date(),
        timezone:(new Date()).getTimezoneOffset()/60,

        pageon(){return window.location.pathname},
        referrer(){return document.referrer},
        previousSites(){return history.length},

        browserName(){return navigator.appName},
        browserEngine(){return navigator.product},
        browserVersion1a(){return navigator.appVersion},
        browserVersion1b(){return navigator.userAgent},
        browserLanguage(){return navigator.language},
        browserOnline(){return navigator.onLine},
        browserPlatform(){return navigator.platform},
        javaEnabled(){return navigator.javaEnabled()},
        dataCookiesEnabled(){return navigator.cookieEnabled},
        dataCookies1(){return document.cookie},
        dataCookies2(){return decodeURIComponent(document.cookie.split(";"))},
        dataStorage(){return localStorage},

        sizeScreenW(){return screen.width},
        sizeScreenH(){return screen.height},
        sizeDocW(){return document.width},
        sizeDocH(){return document.height},
        sizeInW(){return innerWidth},
        sizeInH(){return innerHeight},
        sizeAvailW(){return screen.availWidth},
        sizeAvailH(){return screen.availHeight},
        scrColorDepth(){return screen.colorDepth},
        scrPixelDepth(){return screen.pixelDepth},


        latitude(){return position.coords.latitude},
        longitude(){return position.coords.longitude},
        accuracy(){return position.coords.accuracy},
        altitude(){return position.coords.altitude},
        altitudeAccuracy(){return position.coords.altitudeAccuracy},
        heading(){return position.coords.heading},
        speed(){return position.coords.speed},
        timestamp(){return position.timestamp},
    };

function initSystemInfo(){
    var bname = systemInfo.browserName();
    var bEngine = systemInfo.browserEngine();
    var bVersion1a = systemInfo.browserVersion1a();
    var bVersion1b = systemInfo.browserVersion1b();
    var browserPlatform = systemInfo.browserPlatform();

      var audioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
      var context = new audioContext();


    document.querySelector("#vcSystemInfo .browser-name-result").innerHTML = bname;
    document.querySelector("#vcSystemInfo .browser-engine").innerHTML = bEngine;
    document.querySelector("#vcSystemInfo .browser-version-result1").innerHTML = bVersion1a;
    document.querySelector("#vcSystemInfo .browser-version-result2").innerHTML = bVersion1b;
    document.querySelector("#vcSystemInfo .browser-platform").innerHTML = browserPlatform;
    document.querySelector("#vcSystemInfo .sample-rate-result").innerHTML = context.sampleRate;
}

window.onload = function (){
    setTimeout(
        function (){
            initSystemInfo();
        }
    );
}


</script>

<style type="text/css">
    #vcSystemInfo {
        border: 2px solid #ddd;
        width: 300px;
        padding: 10px;
        position: absolute;
        top: 91px;
        right: 347px;
        line-height: 175%;
    }

</style>