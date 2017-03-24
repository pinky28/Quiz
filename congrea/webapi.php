<?php 

function set_session(){
    if (isset($_GET['key'])) {
        session_id($_GET['key']);
    }
}

set_session();

require_once(dirname(dirname(dirname(__FILE__))).'/config.php');
include('weblib.php');

// The function list is avaible in weblib.php
define('Functions_list', serialize(array('record_file_save', 'poll_save','poll_data_retrieve','poll_delete','poll_update','poll_result','poll_option_drop','congrea_quiz','congrea_get_quizdata')));

function set_header(){
    header("access-control-allow-origin: *");
}

/* Exit when there is request is happend by options method  
 * This generally happens when the request is coming from other domain
 * eg:- if the request is coming from l.vidya.io and main domain suman.moodlehub.com
 * it also know as preflight request
 * **/
function exit_if_request_is_options() {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit;
    }
}

function received_get_data(){
    return (isset($_GET)) ? $_GET : false;
}

function received_post_data(){
    return (isset($_POST)) ? $_POST : false;
}
   
function validate_request() {

    $cmid = required_param('cmid', PARAM_INT);
    $userid = required_param('user', PARAM_INT);

    $qstring = array($cmid, $userid);

    $getdata = received_get_data();
    $fun_name = $getdata['methodname'];
    switch ($fun_name) {
        case 'record_file_save' :
            $filenum = required_param('cn', PARAM_INT);
            $qstring[] = $filenum;
            $vmsession = required_param('sesseionkey', PARAM_FILE);
            $qstring[] = $vmsession;
            $data = required_param('record_data', PARAM_RAW);
            $qstring[] = $data;
            break;
    }
    return $qstring;
}

/* The function is executed which is passed by get */
function execute_action($valid_parameters, $DB) {
    $getdata = received_get_data();
    if ($getdata && isset($getdata['methodname'])) {
        $postdata = received_post_data();
        //$postdata = array('user'=>2, 'qid'=>2,'cmid'=>6);
        if ($postdata) {
            $function_list = unserialize(Functions_list);
            if (in_array($getdata['methodname'], $function_list)) {
                if ($getdata['methodname'] == 'record_file_save' || $getdata['methodname'] == 'poll_save') {
                    $getdata['methodname']($postdata, $valid_parameters, $DB);
                } else {
                    $getdata['methodname']($postdata, $DB);
                }
            } else {
                throw new Exception('There is no ' . $getdata['methodname'] . ' method to execute.');
            }
        }
    } else {
        throw new Exception('There is no method to execute.');
    }
}

set_header();

exit_if_request_is_options();

$validparams = validate_request();

execute_action($validparams, $DB);
?>
