/**
 * This file is responsible  for getting  teacher/host video
 * and send it other participates and, if participate in firefox Browser
 * then it converst webp images to png images for enable the video in
 * firefox as well
 */

var BASE64_MARKER = ';base64,';

var videoHost = {
    gObj : {},
    // Contain all the related variables
    //
    //
    //gObj : {
    //    MYSPEED : 1,
    //    MYSPEED_COUNTER : 0,
    //    time_diff : 0,
    //    teacherVideoQuality : 16,
    //    video_count : 0
    //},


    setDefaultValue : function(speed){
        virtualclass.videoHost.gObj.MYSPEED = speed || 1;
        virtualclass.videoHost.gObj.MYSPEED_COUNTER = 0;
        virtualclass.videoHost.gObj.time_diff = 0;
        virtualclass.videoHost.gObj.teacherVideoQuality = this.getTeacherVideoQuality();;
        virtualclass.videoHost.gObj.video_count = 0;
    },
    /**
     * initialize various actions like, for get user media,
     * set dimension for various canvas,
     * @param width expects width for various canvas
     * @param height expects width for various canvas
     */
    init : function (width, height){
        this.sl = 0;
        this.width =  width;
        this.height =  height;

        if(roles.hasAdmin()){
            if((virtualclass.system.mybrowser.name == 'Chrome')){
                this._init();
                //var session = { audio: false, video: { width: width, height: height } };
             /*
                var session = {
                    audio: false,
                    video: {
                        width: {ideal: width, max: 320 },
                        height: { ideal: height, max: 240 }
                    }
                }; */

                var session = {
                    audio: false,
                    video: true
                };


                var that = this;

                virtualclass.vhAdpt = virtualclass.adapter();
                var cNavigator = virtualclass.vhAdpt.init(navigator);
                cNavigator.getUserMedia(session, function (stream){ that.getMediaStream(stream);}, this.onError);
            }
        } else {
            this.setCanvasAttr('videoPartCan', 'videoParticipate');
            //this.setCanvasAttr('videoPartCan', 'videoParticipate');
            // this would be used for converting webp image to png image
            WebPDecDemo('videoParticipate');
        }
    },






    /**
     * Initialsize the various canvas attribute
     *  for slice canvas, host canvas and participate canvas
     * @private
     */
    _init  : function (){
        // Canvas for host/teacvher
        this.setCanvasAttr('vidHost', 'videoHost');

        this.setCanvasAttr('vidHostSlice', 'videoHostSlice');
        this.vidHostSlice.globalAlpha = 0.5;
        this.vidHostSlice.globalCompositeOperation = "multiply";
    },

    /** Setting canvas attribut like
     * width, height, context etc
     * @param canvas expect key for canvas
     * @param id expects canvas id
     */
    setCanvasAttr : function (canvas, id){
        this[canvas] = document.getElementById(id);
        this[canvas].width = this.width;
        this[canvas].height = this.height;
        this[canvas+'Con'] = this[canvas].getContext('2d');

    },

    /**
     *  Getting the stream for teacher/host video
     *  @param stream expects medea stream, eventually converts into video
     */
    getMediaStream : function (stream){
        this.videoHostSrc = document.getElementById("videoHostSource");
        this.videoHostSrc.width = this.width;
        this.videoHostSrc.height = this.height;

        virtualclass.vhAdpt.attachMediaStream(this.videoHostSrc, stream);
        var that = this;
        setTimeout(
            function (){
                that.shareVideo();
            }, 2000
        );
    },

    /**
     * It shares the video,
     * It gets the user picture in various slices according to resolution
     * and send it to other users
     */

    shareVideo : function(){
        var resA = 1;
        var resB = 1;

        this.imageSlices = this.getImageSlices(resA, resB);
        var that = this;
        setInterval(
            function (){
                for (that.sl=0; that.sl<(resA * resB); that.sl++) {
                    that.vidHostCon.drawImage(that.videoHostSrc, 0, 0, that.width, that.height);
                    var d = that.imageSlices[that.sl];
                    var imgData = that.vidHostCon.getImageData(d.x,d.y,d.w,d.h);
                    that.vidHostSliceCon.putImageData(imgData, d.x, d.y);
                }

                if(that.sl ==  resA * resB){
                    var d ={x:0, y:0};
                    // you increase the the value, increase the quality
                    // 0.4 and 9 need 400 to 500 kb/persecond
                    var sendimage = that.vidHostSlice.toDataURL("image/webp", 0.6);
                    that.vidHostSliceCon.clearRect(0,0, that.width, that.height);
                     that.sendInBinary(sendimage);
                   // ioAdapter.send({'videoSlice' : sendimage, 'des' : d, 'cf' : 'teacherVideo'});
                }
            },
            120
        );
    },

     sendInBinary : function(sendimage){
        sendimage = this.convertDataURIToBinary(sendimage);
        var scode = new Int8Array([21]); // Status Code teacher video
        var sendmsg = new Int8Array(sendimage.length + scode.length);
        sendmsg.set(scode);
        sendmsg.set(sendimage, scode.length); // First element is status code (101)
        ioAdapter.sendBinary(sendmsg);
     },



    convertDataURIToBinary : function (dataURI){
        var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
        var base64 = dataURI.substring(base64Index);
        var raw = window.atob(base64);
        var rawLength = raw.length;
        var array = new Uint8Array(new ArrayBuffer(rawLength));

        for(i = 0; i < rawLength; i++) {
            array[i] = raw.charCodeAt(i);
        }
        return array;

    },


/**
     * The teacher/host video is shown at participate side
     * @param imgData expects image which has to be drawn
     * @param d expects destination x and y
     */
    drawReceivedImage : function(imgData, d) {
        if(typeof videoPartCont == 'undefined'){
            // canvas2 = document.getElementById('mycanvas2');
            this.videoPartCan = document.getElementById('videoParticipate');
            this.videoPartCont = this.videoPartCan.getContext('2d');
            videoPartCont = true;
        }

        // 371 audio latency of buffered audio
        // for synch the audio and video
        var that = this;
        setTimeout(
            function (){
                if(virtualclass.system.mybrowser.name == 'Chrome'){
                    var img = new Image();
                    img.src = imgData;
                    that.videoPartCont.drawImage(img, d.x, d.y);
                } else {
                    loadfile(imgData, that.videoPartCont); // for firefox
                }
            }, 372
        );
    },

    onError : function (err){
        console.log('MediaStream Error ' + err);
    },


    /**
     *
     * @param resA, resB defines the total number of slices of images
     * returns the array which has slices of image,
     * each slice has x, y, width and height of image
     */
    getImageSlices : function(resA, resB){
        //resB ==  y
        //resA ==  x
        var imgSlicesArr = [];
        var totLen = resA * resB;
        var width =  Math.floor(this.vidHost.width / resB);
        var height = Math.floor(this.vidHost.height / resA);

        for(var i=0; i<totLen; i++){
            var eachSlice  = this._getSingleSliceImg(i, width, height, resA, resB);
            imgSlicesArr.push(eachSlice);
        }
        return imgSlicesArr;
    },

    /** Getting the single slice of image according to given i
     *
     * @param i
     * @param width of single slice of image
     * @param height of single slice of image
     * @param resA, resB defines the total number of slices
     * @returns the an image block from where it should strart by given x and y,
     * and height and width of that single image
     */
    _getSingleSliceImg : function(i, width, height, resA, resB){
        var imgSlice = {};
        var x, y, cx, cy, ci =  0;

        if(i==0){
            x = 0;
            y = 0;
        }else{
            cx = i  % resB; // for x
            cy = Math.floor(i / resB); // for y

            x = cx * width;
            y = cy * height;;
        }
        return {'x' : x, 'y' : y, 'w' : width, 'h' : height}
    },

    Uint8ToString : function(u8a){
        var CHUNK_SZ = 0x8000;
        var c = [];
        for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
            c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
        }
        return c.join("");
    },

    updateVideoInfo : function (speed, frameRate, latency){
     //   console.log("frame rate " + frameRate);

        if (speed == 1) {
            speed = "high";
        } else if (speed == 2) {
            speed = "medium";
        } else if (speed == 3) {
            speed = "low";
        }

        if (frameRate >= 6) {
            frameRate = "high";
        } else if (frameRate >= 2) {
            frameRate = "medium";
        } else if (frameRate >= 0) {
            frameRate = "low";
        }

        if (latency >= 1000) {
            latency = "slow";
        } else if (latency >= 700) {
            latency = "medium";
        } else {
            latency = "fast";
        }



         var videoSpeed = document.getElementById('videSpeedNumber');
            videoSpeed.dataset.suggestion = speed;
            //videoSpeed.innerHTML = speed;

         var videoFrameRate = document.getElementById('videoFrameRate');
        videoFrameRate.dataset.quality = frameRate;
             //videoFrameRate.innerHTML = frameRate;

         var videLatency = document.getElementById('videLatency');
        videLatency.dataset.latency = latency;
             //videLatency.innerHTML =  latency;
    },

    getTeacherVideoQuality : function (){
        virtualclass.videoHost.gObj.teacherVideoQuality = 16;
        var videoHostSource = document.querySelector('#virtualclassCont.teacher #videoHostSource');
        if(videoHostSource !=  null){
            if(videoHostSource.src == ''){
                virtualclass.videoHost.gObj.teacherVideoQuality = 0;
            }
        }
        return virtualclass.videoHost.gObj.teacherVideoQuality;
    },

    initVideoInfo : function(){
        if(roles.hasAdmin() && virtualclass.system.mybrowser.name == 'Firefox'){
            virtualclass.vutil.removeVideoHostContainer();
        } else {
            setInterval(
                function (){
                    // MYSPEED, internet connection
                    //  virtualclass.videoHost.gObj.video_count, frame rate
                    // time_diff, Latency

                    if(roles.hasAdmin()){
                        virtualclass.videoHost.gObj.video_count =  virtualclass.videoHost.gObj.teacherVideoQuality;
                    }
                    //for now, we are disabling the video infor

                    virtualclass.videoHost.updateVideoInfo(virtualclass.videoHost.gObj.MYSPEED,  virtualclass.videoHost.gObj.video_count,  virtualclass.videoHost.gObj.time_diff);
                //
                }, 1000
            );

        }
    },

    afterSessionJoin : function(){
        var speed = roles.hasAdmin() ? 1 :  virtualclass.videoHost.gObj.MYSPEED;
        this.setDefaultValue(speed);
        this.initVideoInfo();

        setInterval(
            function (){
                //console.log("Video Frame Rate :" +  virtualclass.videoHost.gObj.video_count);
                virtualclass.videoHost.gObj.video_count = 0;
            }, 1000
        );

        setInterval(
            function (){
                ioAdapter.sendPing();
            }, 1000
        );
    }
};
