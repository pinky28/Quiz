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
 * Save file recorded during congrea session when local file is 
 * serving for virtual class 
 *
 * @package   mod_congrea
 * @copyright 2016 Suman Bogati
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function record_file_save($postdata, $valparams, $DB) {
    global $CFG;
    list($cmid, $userid, $filenum, $vmsession, $data) = $valparams;

    if ($cmid) {
        $cm = get_coursemodule_from_id('congrea', $cmid, 0, false, MUST_EXIST);
        $course = $DB->get_record('course', array('id' => $cm->course), '*', MUST_EXIST);
        $congrea = $DB->get_record('congrea', array('id' => $cm->instance), '*', MUST_EXIST);
    } else {
        echo 'VCE6';
        exit; //'Course module ID missing.';
    }
    require_login($course, true, $cm);
    $context = context_module::instance($cm->id);
    $basefilepath = $CFG->dataroot . "/congrea"; // Place to save recording files.
    if (has_capability('mod/congrea:dorecording', $context)) {
        if ($data) {
            $filepath = $basefilepath . "/" . $course->id . "/" . $congrea->id . "/" . $vmsession;
            // Create folder if not exist
            if (!file_exists($filepath)) {
                mkdir($filepath, 0777, true);
            }
            $filename = "vc." . $filenum;
            if (file_put_contents($filepath . '/' . $filename, $data) != false) {
                //save file record in database
                if ($filenum > 1) {
                    //update record
                    $vcfile = $DB->get_record('congrea_files', array('vcid' => $congrea->id, 'vcsessionkey' => $vmsession));
                    $vcfile->numoffiles = $filenum;
                    $DB->update_record('congrea_files', $vcfile);
                } else {
                    $vcfile = new stdClass();
                    $vcfile->courseid = $course->id;
                    $vcfile->vcid = $congrea->id;
                    $vcfile->userid = $userid;
                    $vcfile->vcsessionkey = $vmsession;
                    $vcfile->vcsessionname = 'vc-' . $course->shortname . '-' . $congrea->name . $cm->id . '-' . date("Ymd") . '-' . date('Hi');
                    $vcfile->numoffiles = $filenum;
                    $vcfile->timecreated = time();
                    //print_r($vcfile);exit;
                    $DB->insert_record('congrea_files', $vcfile);
                }
                echo "done";
            } else {
                echo 'VCE5'; //'Unable to record data.';exit;
            }
        } else {
            echo 'VCE4'; //'No data for recording.';
        }
    } else {
        echo 'VCE2'; //'Permission denied';
    }
}

/**
 * To save a poll into LMS
 * @package   mod_congrea
 * @copyright 2017 Ravi Kumar
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function poll_save($postdata, $valparams, $DB) {
    $response_array = array();
    $obj = new stdClass();
    global $CFG;
    list($cmid, $userid) = $valparams;
    $datatosave = json_decode($postdata['dataToSave']);
    if ($datatosave->question) {
        $question = new stdClass();
        $question->description = $datatosave->question;
        $question->name = 0;
        $question->timecreated = time();
        $question->createdby = $userid;
        $question->category = $datatosave->category;
        $question->cmid = $cmid;
        $questionid = $DB->insert_record('congrea_poll_question', $question);
        $username = $DB->get_field('user', 'username', array('id' => $userid));
        if ($questionid) {
            foreach ($datatosave->options as $optiondata) {
                $options = new stdClass();
                $options->options = $optiondata;
                $options->qid = $questionid;
                $id = $DB->insert_record('congrea_poll_question_option', $options);
                $options->optid = $id;
                $response_array[] = $options;
            }
        }
        $obj->qid = $questionid;
        $obj->createdby = $question->createdby;
        $obj->question = $question->description;
        $obj->createdby = $question->createdby;
        $obj->category = $question->category;
        $obj->options = $response_array;
        $obj->creatorname = $username;
    } else {
        echo "No Data for Save";
    }

    $obj->copied = $datatosave->copied;
    
    print_r(json_encode($obj));
}

/**
 * Delete poll options 
 * serving for virtual class 
 *
 * @package   mod_congrea
 * @copyright 2017 Ravi Kumar
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function poll_option_drop($postdata, $DB) { 
    $id = json_decode($postdata['id']);
    if ($id) {
        $temp = $DB->delete_records('congrea_poll_question_option', array('id' => $id));
    }
    echo $temp;
}

/**
 * Retrieve congrea poll
 * serving for virtual class

 * @package   mod_congrea
 * @copyright 2017 Ravi Kumar
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
$response_array = array();
function poll_data_retrieve($postdata,$DB) {
    global $CFG, $DB;
    $category = json_decode($postdata['category']);
    $questiondata = $DB->get_records('congrea_poll_question', array('category' => $category));
    if ($questiondata) {
        foreach ($questiondata as $data) {
            $username = $DB->get_field('user', 'username', array('id' => $data->createdby));
            $result = $DB->record_exists('congrea_poll_attempts', array('qid' => $data->id));
            $sql = "SELECT id, options from {congrea_poll_question_option} where qid = $data->id";
            $optiondata = $DB->get_records_sql($sql);
            $polllist = array('questionid' => $data->id, 'category' => $data->category, 'createdby' => $data->createdby, 'questiontext' => $data->description, 'options' => $optiondata, 'creatorname' => $username, 'isPublished' => $result);
            $response_array[] = $polllist;
        }
    }

    if (is_siteadmin()) { // check user is admin
        $response_array[] = "true";
    } else {
        $response_array[] = "false";
    }
   
   echo( json_encode($response_array));
}


/**
 * Delete Congrea poll question and options 
 * serving for virtual class 
 *
 * @package   mod_congrea
 * @copyright 2017 Ravi kumar
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
*/

function poll_delete($postdata, $valparams, $DB) {
    global $DB;
    $id = json_decode($postdata['qid']);
    $category = $DB->get_field('congrea_poll_question', 'category', array('id' => "$id"));
    if ($id) {

        $delresult = $DB->delete_records('congrea_poll_attempts', array('qid' => $id));

        $deloptions = $DB->delete_records('congrea_poll_question_option', array('qid' => $id));
        if ($deloptions) {
            $DB->delete_records('congrea_poll_question', array('id' => $id));
        }
        echo $category;
    } else {
        echo "No data for delete";
    }
}

/**
 * Update Congrea poll question and options 
 * serving for virtual class 
 *
 * @package   mod_congrea
 * @copyright 2017 Ravi Kumar
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function poll_update($postdata, $DB) {
    global $DB;
    $response_array = array();
    $obj = new stdClass();
    $data = json_decode($postdata['editdata']);
    $category = $DB->get_field('congrea_poll_question', 'category', array('id' => "$data->questionid"));
    $quesiontext = $DB->execute("UPDATE {congrea_poll_question} SET description = '" . $data->question . "' WHERE id = '" . $data->questionid . "'");
    if ($quesiontext) {
        foreach ($data->options as $key => $value) {
            $newoptions = new stdClass();
            if (is_numeric($key)) {

                $DB->execute("UPDATE {congrea_poll_question_option} SET options = '" . $value . "' WHERE id = '" . $key . "'");
                $newoptions->options = $value;
                $newoptions->id = $key;
                $newoptions->qid = $data->questionid;
            } else {

                $newoptions->options = $value;
                $newoptions->qid = $data->questionid;
                $optid = $DB->insert_record('congrea_poll_question_option', $newoptions);
                $newoptions->id = $optid;

            }
            $response_array[] = $newoptions;
        }
    }

    $obj->qid = $data->questionid;
    $obj->question = $data->question;
    $obj->createdby = $data->createdby;
    $obj->category = $category;
    $obj->options = $response_array;
    print_r(json_encode($obj));
}

/**
 * Save questions and options which is attempt by users 
 * serving for virtual class 
 *
 * @package   mod_congrea
 * @copyright 2017 Ravi kumar
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
function poll_result($postdata, $DB) {
    global $DB;
    $data = json_decode($postdata['saveResult']);
    if ($data->qid) {
        $questionid = $data->qid;
        $category = $DB->get_field('congrea_poll_question', 'category', array('id' => "$data->qid"));
        if ($data->list) {
            foreach ($data->list as $optiondata) {
                foreach ($optiondata as $userid => $optionid) {
                    if (is_numeric($userid) && is_numeric($optionid)) {
                        $attempt = new stdClass();
                        $attempt->userid = $userid;
                        $attempt->qid = $questionid;
                        $attempt->optionid = $optionid;
                        $DB->insert_record('congrea_poll_attempts', $attempt);
                    }
                }
            }
            echo $category;
        }
    }
}


/**
 * function to get all quiz object for a specific course.
 *
 * @param object $postdata t
 * @param object $DB
 * @return quiz the new quiz object
 */

function congrea_quiz($postdata, $DB) {
    global $CFG, $DB , $COURSE;

    $quizes = $DB->get_records('quiz', array('course'=> 2),null,'id, name, timelimit, preferredbehaviour, questionsperpage');
    //print_r($quizes);
    if ($quizes) {
        echo( json_encode($quizes));
    } else{
        echo null;
    }

   //echo( json_encode($response_array));
}
function congrea_file_rewrite_pluginfile_urls($text, $file, $contextid, $component, $filearea, $itemid, $filename, array $options=null) {
    global $CFG;

    $options = (array)$options;
    if (!isset($options['forcehttps'])) {
        $options['forcehttps'] = false;
    }

    if (!$CFG->slasharguments) {
        $file = $file . '?file=';
    }

    $baseurl = "$CFG->wwwroot/$file/$contextid/$component/$filearea/";

    if ($itemid !== null) {
        $baseurl .= "$itemid/$filename";
    }

    if ($options['forcehttps']) {
        $baseurl = str_replace('http://', 'https://', $baseurl);
    }
    $replaceurl = "$CFG->wwwroot/$file/$contextid/$component/$filearea/$itemid/";
    return str_replace('@@PLUGINFILE@@/', $replaceurl, $text);
}

function congrea_formate_text($cmid, $questiondata, $text, $formate, $component, $filearea, $itemid) {
    global $PAGE, $DB;
    
    //$context = context_module::instance($cmid);
    if (!empty($text)) {
        if (!isset($formate)) {
            $formate = FORMAT_HTML;
        }
        $pattern = '/src="@@PLUGINFILE@@\/(.*?)"/';
        preg_match($pattern, $text, $matches);
        if (!empty($matches)) {
            $filename = $matches[1];
            $f = 'pluginfile.php';
            $contents = congrea_file_rewrite_pluginfile_urls($text, $f, $questiondata->contextid, $component, $filearea, $itemid, $filename);
             //print_r($contents);exit;
            return  congrea_make_html_inline($contents);

        } else {
            return  congrea_make_html_inline($text);
        }
    } else {
        return '';
    }
}

function congrea_make_html_inline($html) {
        $html = preg_replace('~\s*<p>\s*~u', '', $html);
        $html = preg_replace('~\s*</p>\s*~u', '<br />', $html);
        $html = preg_replace('~(<br\s*/?>)+$~u', '', $html);
        return trim($html);
}

/**
 * Get the quizjson object from given
 * quiz instance and quiz object
 *
 * @since Moodle 2.7
 * @param object $exam instance of exam
 * @param object $postdata instance of quiz
 * @return stdClass Subscription record from DB
 * @throws moodle_exception for an invalid id
 */
function congrea_get_quizdata($postdata, $DB) {
    global $CFG, $DB;
    
    if(empty($postdata) || !is_array($postdata)){
        print_r('invalid data');exit;
        //return array ("status" => 0, "message" =>'Invalid data');
    }
    
    $cm = get_coursemodule_from_id('congrea', $postdata['cmid'], 0, false, MUST_EXIST);

    if (!$qzcm = get_coursemodule_from_instance('quiz', $postdata['qid'], $cm->course)) {
        //print_error('invalidcoursemodule');
         print_r('invalidcoursemodule');exit;
        //return array ("status" => 0,"message" =>'Invalid course module');
    }
    
    require_once($CFG->dirroot . '/mod/quiz/locallib.php');
    $quizobj = quiz::create($qzcm->instance, $postdata['user']);

    if (!$quizobj->has_questions()) {
        print_r('No question in this quiz.');exit;
    }
    $quizgrade = $DB->get_field('quiz', 'grade', array ('id'=> $postdata['qid'], 'course' => $cm->course));
    //print_r($quizgrade);exit;
    $quizjson = array();
    $questions = array();

    if (empty($quizjson)) {
        $quizobj->preload_questions();
        $quizobj->load_questions();

        $info = array ("quiz" => "", "name" => "",
        "main" => "", "results" => $quizgrade);
        foreach ($quizobj->get_questions() as $questiondata) {
            $options = array();
            $selectany = true;
            $forcecheckbox = false;
            if ($questiondata->qtype == 'multichoice') {
                foreach ($questiondata->options->answers as $ans) {
                    $correct = false;
                    // Get score if 100% answer correct if only one answer allowed.
                    $correct = $ans->fraction > 0.9 ? true : false;
                    if ($questiondata->options->single < 1) {
                        $selectany = false;
                        $forcecheckbox = true;
                        // Get score if all option selected in multiple answer.
                        $correct = $ans->fraction > 0 ? true : false;
                    }
                    $answer = congrea_formate_text($cm->id, $questiondata, $ans->answer, $ans->answerformat, 'question', 'answer', $ans->id);
                    $options[] = array("option" => $answer, "correct" => $correct);
                }
                $questiontext = congrea_formate_text($cm->id, $questiondata, $questiondata->questiontext, $questiondata->questiontextformat, 'question', 'questiontext', $questiondata->id);
                $questions[] = array("q" => $questiontext, "a" => $options,
                "correct" => $questiondata->options->correctfeedback ? $questiondata->options->correctfeedback : "Your answer is correct.",
                "incorrect" => $questiondata->options->incorrectfeedback ? $questiondata->options->incorrectfeedback : "Your answer is incorrect.",
                "select_any" => $selectany,
                "force_checkbox" => $forcecheckbox);
            }
        }
        $qjson = array("info" => $info, "questions" => $questions);
        //$quizjson = addslashes(json_encode($qjson));
        $quizjson = json_encode($qjson);       
    }
    echo $quizjson;
    //return $quizjson;
}

