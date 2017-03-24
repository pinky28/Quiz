<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Prints a particular instance of congrea
 *
 * You can have a rather longer description of the file as well,
 * if you like, and it can span multiple lines.
 *
 * @package    mod_congrea
 * @copyright  2014 Pinky Sharma
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
header("access-control-allow-origin: *");

require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
require_once(dirname(__FILE__).'/lib.php');
require_once('auth.php');
$id = optional_param('id', 0, PARAM_INT); // Course_module ID, or
$n = optional_param('n', 0, PARAM_INT);  // ... congrea instance ID - it should be named as the first character of the module.
$isplay = optional_param('play', 0, PARAM_INT);  // Play recording
$vcSid = optional_param('vcSid', 0, PARAM_INT); // virtual class session record id

if ($id) {
    $cm         = get_coursemodule_from_id('congrea', $id, 0, false, MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
    $congrea  = $DB->get_record('congrea', array('id' => $cm->instance), '*', MUST_EXIST);
} else if ($n) {
    $congrea  = $DB->get_record('congrea', array('id' => $n), '*', MUST_EXIST);
    $course     = $DB->get_record('course', array('id' => $congrea->course), '*', MUST_EXIST);
    $cm         = get_coursemodule_from_instance('congrea', $congrea->id, $course->id, false, MUST_EXIST);
} else {
    print_error('You must specify a course_module ID or an instance ID');
}

// Theme color
$theme = $congrea->themecolor;

require_login($course, true, $cm);
$context = context_module::instance($cm->id);

/*
$event = \mod_congrea\event\course_module_viewed::create(array(
    'objectid' => $congrea->id,
    'context' => $PAGE->context,
));
$event->add_record_snapshot('course', $PAGE->course);
$event->add_record_snapshot('congrea', $congrea);
$event->trigger();
*/

$suggestion = 'low';
$latency = 'slow';
$quality = 'low';


// Print the page header.




$PAGE->set_url('/mod/congrea/classroom.php', array('id' => $cm->id));
$PAGE->set_popup_notification_allowed(false); // No popup notifications in virtual classroom.
$PAGE->set_title(format_string($congrea->name));
$PAGE->set_context($context);

$PAGE->set_pagelayout('popup');
$PAGE->requires->jquery(true);
$PAGE->requires->jquery_plugin('ui');
$PAGE->requires->jquery_plugin('ui-css');

$PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/codemirror/lib/codemirror.css'));
$PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/bundle/jquery/css/base/'.$theme.'_jquery-ui.css'));
$PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/pbar.css'));
$PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/progress.css'));
$PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/custom.css'));



// Chrome extension for desktop sharing.
echo '<link rel="chrome-webstore-item" href="https://chrome.google.com/webstore/detail/ijhofagnokdeoghaohcekchijfeffbjl">';

// Mark viewed by user (if required).
//$completion = new completion_info($course);
//$completion->set_module_viewed($cm);

// Checking moodle deugger is unable or disable.
$info = 0;
if ($CFG->debug == 32767 && $CFG->debugdisplay == 1) {
    $info = 1;
}

$fontface = "";

echo "<style type='text/css'>";
    $fontface .= "@font-face {";
        $fontface .= "font-family: 'icomoon';\n";
        $fontface .= "src:url('".$CFG->wwwroot ."/mod/congrea/bundle/virtualclass/fonts/icomoon.eot?-jjdyd0');\n";
        $fontface .= "src:url('".$CFG->wwwroot ."/mod/congrea/bundle/virtualclass/fonts/icomoon.eot?#iefix-jjdyd0') format('embedded-opentype'), url('".$CFG->wwwroot ."/mod/congrea/bundle/virtualclass/fonts/icomoon.woff?-jjdyd0') format('woff'), url('".$CFG->wwwroot ."/mod/congrea/bundle/virtualclass/fonts/icomoon.ttf?-jjdyd0') format('truetype'), url('".$CFG->wwwroot ."/mod/congrea/bundle/virtualclass/fonts/icomoon.svg?-jjdyd0#icomoon') format('svg');\n";
        $fontface .= "font-weight: normal;\n";
        $fontface .= "font-style: normal;\n";
    $fontface .= "}\n";
    echo  $fontface;
echo "</style>";

/*
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."css/bootstrap/css/bootstrap.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."codemirror/lib/codemirror.css" ?> />
<link rel="stylesheet" type="text/css" href= <?php echo $whiteboardpath."bundle/jquery/css/base/".$theme."_jquery-ui.css" ?> />

<link   rel="stylesheet" type="text/css" href=<?php echo $whiteboardpath."poll/graphs/c3.css"  ?>>


<!-- Load d3.js and c3.js -->
<script src= <?php echo $whiteboardpath."poll/graphs/d3.js" ?> ></script>
<script src=<?php echo $whiteboardpath."poll/graphs/c3.min.js" ?>></script>



*/




// File included if debugging on

if($info) { 
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/'.$theme.'/styles.css'));
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/'.$theme.'/popup.css'));
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/'.$theme.'/jquery.ui.chatbox.css'));
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/'.$theme.'/vceditor.css'));  
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/progress.css'));  
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/pbar.css'));  
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/bootstrap/css/bootstrap.css'));  
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/poll/graphs/c3.css'));


} else {
    $PAGE->requires->css(new moodle_url($CFG->wwwroot . '/mod/congrea/bundle/virtualclass/css/'.$theme.'.min.css'));
}  
   


$whiteboardpath = $CFG->wwwroot . "/mod/congrea/bundle/virtualclass/";


$sid = $USER->sesskey;

$r = 's'; // Default role.
$role  = 'student';
$cont_class = 'congrea ';

if (has_capability('mod/congrea:addinstance', $context)) {
    if ($USER->id == $congrea->moderatorid && !$isplay) {
        $r = 't';
        $role  = 'teacher orginalTeacher';
        $classes = "audioTool active";
        $dap = "true";
        $speakermsg = get_string('disablespeaker', 'congrea');
        $pressingimg = $whiteboardpath . "images/speakerpressingactive.png";
    }
}
$cont_class .= $role;
if(empty($congrea->moderatorid)) {
    $anyonepresenter = 1;
} else {
    $anyonepresenter = 0;
}
if($isplay){
	$cont_class .= " playMode";	
}
// Push to talk
$cont_class .= $congrea->pushtotalk ? ' pt_enable' : ' pt_disable';

// Audio enable/disable
if($congrea->audio){
    $classes = "audioTool active";
    $speakermsg = "Disable Speaker";
    $dap = "true";
    $speakerimg = $whiteboardpath . "images/speakerpressingactive.png";
    $audio_tooltip =  get_string('disableAudio','congrea');
} else {
    $dap = "false";
    $classes = "audioTool deactive";
    //$isplay = false;
    $speakermsg = get_string('enablespeaker', 'congrea');
    $pressingimg = $whiteboardpath . "images/speakerpressing.png";
    $audio_tooltip =  get_string('enableAudio','congrea');
}

// Output starts here.
echo $OUTPUT->header();
// Default image if webcam disable.
if ($USER->id) {
    $userpicture = moodle_url::make_pluginfile_url(context_user::instance($USER->id)->id, 'user', 'icon', null, '/', 'f2');
    $src = $userpicture->out(false);
} else {
    $src = 'bundle/virtualclass/images/quality-support.png';
}

// Javascript variables.
?> <script type="text/javascript">
    wbUser.virtualclassPlay = '<?php echo $isplay; ?>';
    wbUser.vcSid = '<?php echo $vcSid; ?>';
    wbUser.imageurl =  '<?php echo $src; ?>';
    wbUser.id =  '<?php echo $USER->id; ?>';
    wbUser.socketOn =  '<?php echo $info; ?>';
    wbUser.dataInfo =  0; //layout and all inofrmation is not validated since long time
    wbUser.room =  '<?php echo $course->id . "_" . $cm->id; ?>';
    wbUser.sid =  '<?php echo $sid; ?>';
    wbUser.role =  '<?php echo $r; ?>';
//    wbUser.fname =  '<?php // echo $USER->firstname; ?>';
    wbUser.lname =  '<?php echo $USER->lastname; ?>';
    wbUser.name =  '<?php echo $USER->firstname; ?>';
    wbUser.anyonepresenter =  '<?php echo $anyonepresenter ?>';

    window.whiteboardPath =  '<?php echo $whiteboardpath; ?>';
    window.importfilepath = "<?php echo $CFG->wwwroot."/mod/congrea/webapi.php?cmid=".$cm->id."&methodname=record_file_save"; ?>";
    window.webapi = "<?php echo $CFG->wwwroot."/mod/congrea/webapi.php?cmid=".$cm->id; ?>";
    window.exportfilepath = "<?php echo $CFG->wwwroot."/mod/congrea/play_recording.php?cmid=".$cm->id ?>";
    if (!!window.Worker) {
        var sworker = new Worker("<?php echo $whiteboardpath."worker/screenworker.js" ?>");
        var mvDataWorker = new Worker("<?php echo $whiteboardpath."worker/json-chunks.js" ?>");
        var dtConWorker = new Worker("<?php echo $whiteboardpath."worker/storage-array-base64-converter.js" ?>");
        var webpToPng = new Worker("<?php echo $whiteboardpath."worker/webptopng.js" ?>");

        
    }
</script> <?php

if ($info) {
    require_once('bundle/virtualclass/build/js.debug.php');
    $PAGE->requires->js('/mod/congrea/bundle/virtualclass/css/bootstrap/js/bootstrap.js');
    //$PAGE->requires->js('/mod/congrea/bundle/virtualclass/poll/graphs/d3.js');
    $PAGE->requires->js('/mod/congrea/bundle/virtualclass/poll/graphs/c3.js');
        
    
} else {
    $PAGE->requires->js('/mod/congrea/bundle/virtualclass/bundle/io/build/iolib.min.js');
    $PAGE->requires->js('/mod/congrea/bundle/virtualclass/build/wb.min.js');
    $PAGE->requires->js('/mod/congrea/bundle/virtualclass/index.js');
//    $PAGE->requires->js('/mod/congrea/bundle/virtualclass/poll/graphs/d3.js');
//    $PAGE->requires->js('/mod/congrea/bundle/virtualclass/poll/graphs/c3.min.js');
//    $PAGE->requires->js('/mod/congrea/bundle/virtualclass/bundle/jquery/jquery-1.12.4.min.js');
    
    
}



//echo html_writer::start_tag('div', array('id' => 'virtualclassCont', 'class' => "$cont_class"));

?>

  <div id="virtualclassCont" class="<?php echo $cont_class; ?>">

    <div id="virtualclassPreCheck" class="bootstrap">

        <div id="preCheckcontainer">

             <div class="container ">

                  <!-- Modal -->
                  <div class="modal fade" id="myModal" role="dialog">
                    <div class="modal-dialog modal-lg">

                      <!-- Modal content-->
                      <div class="modal-content">

                           <div class="modal-body">
                                <div id="preCheckProgress">
                                     <ul class="progressbar">
                                         <li class="screen1 browser active">  </li>
                                         <li class="screen2 bandwidth">  </li>
                                         <li class="screen5 speaker"> </li>
                                         <li class="screen4 mic" > </li>
                                         <li class="screen3 webcam" > </li>
                                     </ul>
                                </div>


                              <div id="vcBrowserCheck" class="precheck browser">

                                  <div class="testName"> <?php echo get_string('testingbrowser','congrea'); ?> </div>

                                  <!-- <div class="progress"> Progressing .... </div> -->

                                  <div class="result"> </div>

                                  <div id="browserButtons" class="button clearfix"><button type="button" class="next btn btn-default">Next</button> </div>
                              </div>

                              <div id="vcBandWidthCheck" class="precheck bandwidth">
                                  <div class="testName"> <?php echo get_string('testinginternetspeed','congrea'); ?></div>

                                  <!-- <div class="progress"> Progressing....</div> -->

                                  <div class="result"> <img src="<?php echo $whiteboardpath.'images/progressbar.gif'; ?>" /> </div>
                                  <div id="bandwidthButtons" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button>  <button type="button" class="next btn btn-default">Next</button> </div>
                              </div>


                              <div id="vcSpeakerCheck" class="precheck speaker">
                                    <div class="testName"> <?php echo get_string('testingspeaker','congrea'); ?>  </div>
                                    <!-- <div class="progress"> Progressing....</div> -->
                                    <audio id="vcSpeakerCheckAudio">
                                        <source src="<?php echo $whiteboardpath.'audio/audio_music.ogg'; ?>"  type="audio/ogg">
                                        <source src="<?php echo $whiteboardpath.'audio/audio-music.mp3'; ?>"  type="audio/mpeg">
                                    </audio>
                                    <div class="result"> </div>
                                    <div id="speakerButtons" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button> <button type="button" class="next btn btn-default">Next</button> </div>

                              </div>

                              <div id="vcMicCheck" class="precheck mic">
                                    <div class="testName">  <?php echo get_string('testingmichrophone','congrea'); ?> </div>
                                    <!-- <div class="progress"> Progressing....</div> -->
                                    <div id="audioVisualaizerCont">
                                        <canvas id="audioVisualaizer" class="visualizer" width="60" ></canvas>
                                    </div>

                                    <div class="result"> </div>


                                    <div id="micButtons" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button>  <button type="button" class="next btn btn-default">Next </button> </div>

                              </div>

                              <div id="vcWebCamCheck" class="precheck webcam">
                                    <div class="testName">  <?php echo get_string('testingwebcam','congrea'); ?> </div>
                                    <!-- <div class="progress"> Progressing....</div> -->
                                    <div id="webcamTempVideoCon">
                                      <video id="webcamTempVideo"></video>
                                    </div>
                                    <div class="result"> </div>

                                    <div id="joinSession" class="button clearfix"><button type="button" class="prev btn btn-default">Prev</button> <button type="button" class="next btn btn-default">Join Session</button> </div>

                              </div>

                           </div>
                      </div>

                    </div>
                  </div>

            </div>

        </div>

    </div>

 <div id="virtualclassApp">
     <?php

$adarr = array('0' => 'deactive', '1' => 'active');
$audactive = '0';
if(isset($_GET['audio'])){
    if($_GET['audio'] == '0' || $_GET['audio'] == '1'){
        $audactive = $_GET['audio'];
    }
}

$audactive = $adarr[$audactive];


?>
<!-- virtualclass right panel start -->

<div id="virtualclassAppRightPanel" class="rightbar">
    <div id="audioWidget">
        <?php
        if($audactive == 'deactive'){
            $dap = "false";
            $classes = "audioTool";
            $speakermsg = "Enable Speaker";
            $speakerimg = $whiteboardpath . "images/speakerpressing.png";
            $audio_tooltip =  get_string('enableAudio','congrea');
        } else {
            $classes = "audioTool";
            $speakermsg = "Disable Speaker";
            //$dap = "true"; //display audio
            $dap = "true";
            $speakerimg = $whiteboardpath . "images/speakerpressingactive.png";
            $audio_tooltip =  get_string('disableAudio','congrea');

        }

        $classes .= ' ' .$audactive;

        ?>

        <div id="mainAudioPanel">
            <div id="speakerPressOnce" class="<?php echo $classes; ?>" data-audio-playing="<?php echo $dap;?>">
                <a id="speakerPressonceAnch" class="tooltip" data-title="<?php echo $audio_tooltip; ?>" name="speakerPressonceAnch">
                <span id="speakerPressonceLabel" class="silenceDetect" data-silence-detect="stop"> <i> </i> </span>

                </a>
            </div>
            <div id="videoPacketInfo">
                    <span id="videoSpeed">
                    <span id="videSpeedNumber" class="suggestion tooltip" data-suggestion="<?php echo $suggestion; ?>"  data-title="<?php echo get_string('proposedspeed','congrea'); ?>">  </span>
                    <span id="videLatency" class="latency  tooltip" data-latency="<?php echo $latency; ?>" data-title="<?php echo get_string('audiolatency','congrea'); ?>">  </span>
                    <span id="videoFrameRate" class="quality  tooltip" data-quality="<?php echo $quality; ?>" data-title="<?php echo get_string('videoquality','congrea'); ?>"> </span>
                </span>
            </div>
        </div>
    </div>

    <div id="videoHostContainer">
            <?php if($r == 't') { ?>
                <video id="videoHostSource" autoplay=""> </video>

                    <!--
                        <div id="videoPacketInfo">
                            <span id="videoSpeed"><b >Proposed Speed : </b> <span id="videSpeedNumber"> Low </span> <br />
                                <b> Audio Latency  : </b> <span id="videLatency"> Fast </span> <br />
                                <b> Video Quality : </b> <span id="videoFrameRate"> High </span>

                            </span>
                        </div>
                    -->

                    <canvas id="videoHost"> </canvas>
                    <canvas id="videoHostSlice"> </canvas>

            <?php } else {
            ?>
                <div id="fromServer">
                    <!-- <canvas id="videoParticipate" width="320" height="240"> </canvas> -->
                    <canvas id="videoParticipate" > </canvas>
                    <!--
                    <div id="videoPacketInfo">
                        <span id="videoSpeed"><b >Proposed Speed : </b> <span id="videSpeedNumber"> Low </span> <br />
                            <b> Audio Latency  : </b> <span id="videLatency"> Slow </span> <br />
                            <b> Video Quality : </b> <span id="videoFrameRate"> Low </span>

                        </span>
                    </div>
                    -->

                </div>
            <?php
                }
        ?>
    </div>

    <div id="chatWidget">
        <div id = "stickycontainer"> </div>
    </div>
</div>

 <div id="virtualclassAppLeftPanel" class="leftbar">

    <?php
        if($isplay){
            ?>

                <div id="playControllerCont">
                    <div id="playController">
                        <div id="recPlayCont" class="recButton"> <button id="recPlay" class="icon-play tooltip" data-title="Play"></button></div>
                        <div id="recPauseCont" class="recButton "> <button id="recPause" class="icon-pause tooltip" data-title="Pause"></button></div>
                        <div id="ff2Cont" class="recButton"> <button id="ff2" class="ff icon-forward tooltip" data-title="Fast Forward 2"></button></div>
                        <div id="ff8Cont" class="recButton"> <button id="ff8" class="ff icon-fast-forward tooltip" data-title="Fast Forward 8"></button></div>
                        <div id="playProgress"> <div id="playProgressBar" class="progressBar" style="width: 0%;"></div> </div>
                        <div id="repTimeCont"> <span id="tillRepTime">00:00</span> / <span id="totalRepTime">00:00</span> </div>
                   </div>
                   <div id="replayFromStart"> <button  class="ff icon-Replayfromstart tooltip" data-title="Replay from Start."></button> </div>
               </div>

    <?php
        }
    ?>
    
    <div id="virtualclassWhiteboard" class="virtualclass">

       <div id="vcanvas" class="socketon">

        <div id="containerWb">

        </div>

        <!-- this need to be deleted -->
        <div id="mainContainer">
            <div id="packetContainer" >
                
            </div>

            <div id="informationCont">
                
            </div>
        </div>

        <div class="clear"></div>
      </div>

    </div>
    </div>



<!-- virtualclass right panel end -->
    <div id="popupContainer">
        <div id="about-modal" class="rv-vanilla-modal">

            <!-- for uploading progress bar -->

            <div id="recordingContainer" class="popupWindow">

                <div class="rv-vanilla-modal-header group" id="recordingHeaderContainer">
                    <h2 class="rv-vanilla-modal-title" id="recordingHeader"> <?php echo get_string('uploadsession','congrea'); ?> </h2>
                </div>

                <div class="rv-vanilla-modal-body">

                    <div id="progressContainer">

                        <div id="totProgressCont">
                            <div id="totalProgressLabel"> <?php echo get_string('totalprogress','congrea'); ?> </div>
                            
                            <div id="progress">
                                <div id="progressBar" class="progressBar"></div>
                                <div id="progressValue" class="progressValue"> 0%</div>
                            </div>
                        </div>

                        <div id="indvProgressCont">
                            <div id="indvProgressLabel"> <?php echo get_string('indvprogress','congrea'); ?> </div>

                            <div id="indProgress">
                                <div id="indProgressBar" class="progressBar">
                                </div>

                                <div id="indProgressValue" class="progressValue"> 0%
                                </div>
                            </div>


                        </div>

                    </div>

                    <div id="recordFinishedMessageBox">
                        <span id="recordFinishedMessage">  <?php echo get_string('uploadedsession','congrea'); ?></span>
                        <span id="recordingClose" class="icon-close"></span>

                    </div>

                </div>

            </div>

            <!-- for play window -->
            <div id="recordPlay" class="popupWindow">
                <div class="rv-vanilla-modal-body">
                    <div id="downloadPcCont">
                        <div id="downloadSessionText"> <?php echo get_string('downloadsession','congrea'); ?> </div>

                        <div id="downloadPrgressLabel"> <?php echo get_string('overallprogress'); ?>  </div>
                        <div id="downloadProgress">
                            <div id="downloadProgressBar" class="progressBar"></div>
                            <div id="downloadProgressValue" class="progressValue"> 0% </div>
                        </div>

                    </div>

                    <div id="askPlay">
                        <div id="askplayMessage"> </div>

                         <button id="playButton" class="icon-play"><?php echo get_string('play','congrea'); ?> </button>

                    </div>
                </div>
             </div>


         <!--for replay window -->
         <div id="replayContainer" class="popupWindow">
             <p id="replayMessage"><?php echo get_string('replay_message','congrea'); ?>  </p>
             <div id="replayClose" class="close icon-close"></div>
             <button id="replayButton" class="icon-repeat"><?php echo get_string('replay','congrea'); ?> </button>

         </div>

         <!--For confirm window-->
          <div id="confirm" class="popupWindow simple-box">
          </div>

           <!-- For Session End window -->
           <div id="sessionEndMsgCont" class="popupWindow">
           <span id="sessionEndClose" class="icon-close"></span>

           <span id="sessionEndMsg"> <?php echo get_string('sessionendmsg','congrea'); ?> </span>
           </div>

            <!--For confirm window-->
            <div id="waitMsgCont" class="popupWindow">
                <span id="waitMsg"> <?php echo get_string('waitmsgconnect','congrea'); ?> </span>
            </div>

        </div>

         <!--For wait message window-->
    </div>

</div>
</div>
<?php

echo $OUTPUT->footer();
?>
