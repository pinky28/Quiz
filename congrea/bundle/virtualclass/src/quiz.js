/* global virtualclass, ioAdapter */
(function (window) {
    var quiz = function () {

        var _quiz = {
            /* to generlize */
            coursequiz: [],
            uid: virtualclass.gObj.uid,
            currQid: 0,
            newUserTime: {},
            list: [],
            listQuiz: {},
            uniqueUsers: [],
            cmid : 2, //TODO : courseid of moodle
            exportfilepath: window.exportfilepath,
            init: function () { 

                //virtualclass.poll.pollState = {};
                virtualclass.previrtualclass = 'virtualclass' + "Quiz";
                virtualclass.previous = 'virtualclass' + "Quiz";
                var urlquery = getUrlVars(exportfilepath);

                this.cmid = urlquery.cmid;


/*
                if (virtualclass.poll.timer) {

                    clearInterval(virtualclass.poll.timer);

                }
*/

                if (!roles.hasAdmin() || (roles.isEducator())) {
                    if (roles.isStudent()) {
                        this.UI.defaultLayoutForStudent();

                    } else {
                        this.UI.container();

                        if (roles.hasControls()) {

                            ioAdapter.mustSend({
                                'quiz': {
                                    quizMsg: 'init'
                                },
                                'cf': 'quiz'
                            });
                        } else {
                            this.UI.defaultLayoutForStudent();

                        }
                    }
                } else {
                    this.UI.container();
                    ioAdapter.mustSend({
                        'quiz': {
                            quizMsg: 'init'
                        },
                        'cf': 'quiz'
                    });
                }
                if (roles.hasControls()) {
                        console.log("fetchquizes");
                        this.interfaceToFetchList(this.cmid);
                }
                
                
/*
                var storedData = JSON.parse(localStorage.getItem('pollState'));
                if (storedData && !(isEmpty(storedData))) {
                    console.log("storeddata if block")
                    this.storedDataHandle(storedData);
                } else {
                    if (roles.hasControls()) {
                        console.log("fetchlist");
                        virtualclass.poll.interfaceToFetchList(virtualclass.poll.cmid);
                    }
                }

                localStorage.removeItem('pollState');

                function isEmpty(obj) {
                    for (var prop in obj) {
                        if (obj.hasOwnProperty(prop))
                            return false;
                    }

                    return true;
                }
*/

            },
            /*
                Check if quiz exit, call function to display list of quizes 
            */
            displayQuizList: function () {

                virtualclass.quiz.dispList("course");
                var listcont = document.getElementById("listquizcourse");
                // *****reminder**change
/*
                while (listcont.hasChildNodes()) {
                    listcont.removeChild(listcont.lastChild);
                }
*/
                if (Object.keys(this.coursequiz).length > 0) {            
                // to modify parameters ...********
                //virtualclass.quiz.coursequiz.forIn(function (item, index) {
                    for ( var k in this.coursequiz) {
    
                        if (this.coursequiz.hasOwnProperty(k)) {
                            this.displayQuizes (this.coursequiz[k], k);
                        }
                        //virtualclass.quiz.forEachPoll(item, index, "course", item.creatorname, item.createdby, item.questionid, item.isPublished);
                    }
                    this.listHeader();
                                    
                } else {
                    alert('No quiz to display');
                }

/*
                var elem = document.getElementById("emptyListsite");
                if (elem) {
                    elem.parentNode.removeChild(elem);
                }
*/


/*
                this.dispNewPollBtn("course");
                if (virtualclass.poll.pollState["currScreen"] != "teacherPublish") {
                    virtualclass.poll.pollState["currScreen"] = "displaycoursePollList";
                }
*/
            },
            listHeader: function () {
                var cont = document.getElementById("listQzCont")
                
                var headCont = document.createElement("div");
                headCont.classList.add("row", "headerContainer", "col-md-12")
                headCont.id = "headerContainer";

                cont.insertBefore(headCont, cont.firstChild)
                var elem = document.createElement("div");
                elem.classList.add("controlsHeader", "col-md-1")
                elem.innerHTML = "Controls";
                headCont.appendChild(elem);

                var iconCtr = document.createElement('i');
                iconCtr.className = "icon-setting";
                elem.appendChild(iconCtr);

                var elem = document.createElement("div");
                elem.classList.add("qnTextHeader", "col-md-8")
                elem.innerHTML = "Quizes";
                headCont.appendChild(elem);

                
                var iconHelp = document.createElement('i');
                iconHelp.className = "icon-help";
                elem.appendChild(iconHelp);


                var elem = document.createElement("div");
                elem.classList.add("timeHeader", "col-md-2")
                elem.innerHTML = "Time";
                headCont.appendChild(elem);

                var iconCreator = document.createElement('i');
                iconCreator.className = "icon-creator";
                elem.appendChild(iconCreator);
                
                var elem = document.createElement("div");
                elem.classList.add("qperpageHeader", "col-md-1")
                elem.innerHTML = "Quiz/page";
                headCont.appendChild(elem);
            },
            dispList: function () {

                var mszbox = document.getElementById("mszBoxQuiz");
/*
                if (mszbox.childNodes.length > 0) {
                    mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
                }
*/

/*
                var hide = pollType == "course" ? "site" : "course";
                virtualclass.poll.hidePollList(hide);
*/
                var listCont = document.getElementById("listQzCont");
                if (listCont) {
                    listCont.style.display = "block";
/*
                    var elem = document.getElementById("newPollBtn" + pollType);
                    if (elem) {
                        if (elem.classList.contains(hide)) {
                            elem.classList.remove(hide);
                            elem.classList.add(pollType);
                        }
                    }
*/
                } else {
                    console.log('quiz layout 2');
                    this.UI.layout2("layoutQuizBody");

                }

            },
            
            interfaceToFetchList: function (category) {
                var formData = new FormData();
                formData.append("course", '2');
                formData.append("user", this.uid);
                //virtualclass.recorder.items = []; //empty on each chunk sent
                var scope = this;
                virtualclass.xhr.send(formData, window.webapi+"&methodname=congrea_quiz", function (data) { //TODO Handle more situations
                    //console.log("fetched" + msg);
                    // to change later in php file 
                    var getContent = JSON.parse(data);

                    for (var i = 0; i <= getContent.length - 1; i++) {
                        var options = getContent[i].options;
                        for (var j in options) {
                            getContent[i].options[j] = options[j].options;
                            console.log("getContent " + getContent[i]);
                        }
                    }
                    console.log(getContent);
                    scope.coursequiz = getContent;
                    scope.displayQuizList();
                    //this.displayQuizList();
                });

            },
            /*
                Display quiz list with detail
            */
            displayQuizes: function (item, index) {
                //console.log(item);
                this.UI.qzCont(index);
                this.UI.qzCtrCont(index);
                this.UI.qzTextCont(item, index);
                this.attachQZEvent("publishQz" + index, "click", this.publishHandler, item, index);
/*
                virtualclass.poll.attachEvent("editQn" + pollType + index, "click", virtualclass.poll.editHandler, pollType, index, crtrId, id);
                virtualclass.poll.attachEvent("publishQn" + pollType + index, "click", virtualclass.poll.publishHandler, item, pollType, index, crtrId, id, isPublished);
                virtualclass.poll.attachEvent("deleteQn" + pollType + index, "click", virtualclass.poll.deleteHandler, pollType, index, crtrId, id);
*/
            },

            attachQZEvent: function (actionid, eventName, handler, item, index) {

                var elem = document.getElementById(actionid);
                if (elem != null) {
                    elem.addEventListener(eventName, function () {
                        if (typeof item != 'undefined') {
                            console.log('attach time handler');
                            handler(item, index);
                            //handler(item, index, actionid, item.id);
                        } else {
                            console.log('quiz is missing no need of time');
                            //handler(index, actionid);
                        }
                    })
                }
            },
            /*
                Attach publis & preview button with quiz list
            */
            publishHandler: function (item, index) {

                var mszbox = document.getElementById("mszBoxQuiz");
                if (mszbox.childNodes.length > 0) {
                    mszbox.childNodes[0].parentNode.removeChild(mszbox.childNodes[0]);
                }

/*
                var isPublished = arguments[5];
                console.log(arguments[4]);
                if (isPublished) {
                    virtualclass.poll.duplicatePoll(item);

                } else {
*/
                    virtualclass.quiz.publishQuiz(item, index);

                //}
            },
            /*
                Display preview pop up box for quiz display
                and call preview function for teacher screen
            */            
            publishQuiz: function (item, index) {

/*
                virtualclass.poll.dataToStd.question = item.questiontext;
                virtualclass.poll.dataToStd.qId = item.questionid;
                virtualclass.poll.dataToStd.options = item.options;
*/
                // to add here

                var cont = document.getElementById("layoutQuizBody");
                var elem = document.createElement('div');
                elem.className = "container";
                cont.appendChild(elem);
                var modal = document.getElementById("editQuizModal");
                if (modal) {
                    modal.remove();
                }
                // to change this to 
                var cont = document.getElementById("bootstrapQzCont");
                virtualclass.quiz.UI.generateModal("editQuizModal", cont);

                $('#editQuizModal').modal({
                    backdrop: 'static',
                    keyboard: false
                });
                $('#editQuizModal').modal({
                    show: true
                });

                virtualclass.quiz.quizPreview(item);

/*
                $("#editPollModal").on('hidden.bs.modal', function () {
                    $("#editPollModal").remove();
                });
*/

            },
            showQn: function (qnCont) {
                if (roles.hasControls()) {
                    qnCont.innerHTML = 'quiz question';

                } else {
                    qnCont.innerHTML = 'quiz question for student';

                }
            },
            action: function (id, cb, index) {
                cb(id, index)
            },
            getQuizData: function(quizitem){
                var formData = new FormData();
                formData.append("cmid", this.cmid);
                formData.append("user", this.uid);
                formData.append("qid", quizitem.id);
                virtualclass.xhr.send(formData, window.webapi+"&methodname=congrea_get_quizdata", function (data) { //TODO Handle more situations
                    var quizJSON = data;
                    //var getContent = JSON.parse(data);
                    $('#slickQuiz').slickQuiz({json: quizJSON, questionPerPage : 2, questionMode : 'deferredfeedback', quizTime : 0, displayDetailResult : false});
                });
                //$('#slickQuiz').slickQuiz({json: JSON.stringify(quizJSON), questionPerPage : 2, questionMode : 'deferredfeedback', quizTime : 0, displayDetailResult : false});
            },
            quizPopUp: function (cb, index) {
                console.log('quiz pop up');
                var attachInit = function () {
                    console.log(this.id);
                    virtualclass.quiz.action(this.id, cb, index);
                }
                var modal = document.getElementById("editQuizModal") ? document.getElementById("editQuizModal") : document.getElementById("qzPopup");
                var controls = modal.querySelectorAll(':scope .controls');

                for (var i = 0; i < controls.length; i++) {
                    controls[i].addEventListener("click", attachInit)
                }
            },
            quizPreview: function (quizitem) { 
                console.log('quiz preview function');
                this.UI.modalContentUI();
                
                var header = document.getElementById("contQzHead");
                
                var btn = document.createElement('button');
                btn.id = "publishQzBt";
                btn.classList.add("btn", "btn-default", "controls")
                btn.innerHTML = "Publish Quiz";
                
                header.appendChild(btn);
                
                //virtualclass.quiz.quizPopUp(virtualclass.quiz.popupFn, index);

                var iconPublish = document.createElement('i');
                iconPublish.className = "icon-publish";
                btn.appendChild(iconPublish);
             
                var header = document.getElementById("contQzBody");
                this.getQuizData(quizitem); 
                //$('#slickQuiz').slickQuiz({json: JSON.stringify(quizJSON), questionPerPage : 2, questionMode : 'deferredfeedback', quizTime : 0, displayDetailResult : false});
                //this.SlickQuizBody();               
                
/*
                (document.getElementById("publish")).addEventListener("click", function () {
                    this.publishedOnTeacher();

                });
*/
                //this.attachEvent("publishQzBt", "click", alert('hello'));
                this.quizPopUp(this.popupFn, 1);
                //var cont = document.getElementById("qzTxCont")
                //this.showQn(cont);
/*
                var cont = document.getElementById("optsTxCont")
                this.showOption(cont);
*/
               //var cont = document.getElementById("contQzFooter");
               //this.UI.previewFooterBtns(cont); 

            },
            popupFn: function (id, index) { 

                virtualclass.quiz[id].call(this.quiz, index);

            },
            /*
                Function is called when teacher pulished quiz
                call by popupFn function and display quiz result
            */
            publishQzBt: function(){
                virtualclass.quiz.UI.resultView();
                var data = {json: JSON.stringify(quizJSON), questionPerPage : 2, questionMode : 'deferredfeedback', quizTime : 0, displayDetailResult : false};
                ioAdapter.mustSend({
                        'quiz': {
                            quizMsg: 'stdPublish',
                            data: data
                        },
                        'cf': 'quiz'
                    });
                    console.log("to send" + data);
                //alert('published by teacher');
            },
            // Quiz published at student end
            onmessage: function (msg, fromUser) {

                if (msg.quiz.quizMsg == "stdPublish") {
                    virtualclass.quiz.dataRec = msg.quiz.data;
                }

                console.log("student side " + msg.quiz.quizMsg);
                var cont = document.getElementById("bootstrapQzCont");//Todo:
                var body = virtualclass.view.customCreateElement('div','contQzBody','modal-body');
                cont.appendChild(body);
                this.UI.modalContentUI();
                $('#slickQuiz').slickQuiz(msg.quiz.data);
                //virtualclass.quiz[msg.poll.pollMsg].call(this, msg.poll.data, fromUser);
/*
                if (msg.poll.pollMsg == "stdPublishResult") {
                    virtualclass.poll.resultToStorage();
                }
*/

            },                                             
            UI: {
                id: 'virtualclassQuiz',
                class: 'virtualclass',
                /*
                 * Creates container for the quiz 
                 */
                container: function () {
                    console.log("quiz layout check");
                    var quizCont = document.getElementById(this.id);
                    if (quizCont != null) {
                        quizCont.parentNode.removeChild(quizCont);
                    }
                    
                    var divQuiz = virtualclass.view.customCreateElement('div', this.id, this.class);
                    virtualclass.vutil.insertIntoLeftBar(divQuiz);
//                    var beforeAppend = document.getElementById(virtualclass.rWidgetConfig.id);
//                    document.getElementById(virtualclass.html.id).insertBefore(divPoll, beforeAppend);

                    this.layout(divQuiz)
                },
                layout: function (divQuiz) {
                    
                    var contQuiz = virtualclass.view.customCreateElement('div', 'layoutQuiz','bootstrap container-fluid quizLayout');
                    divQuiz.appendChild(contQuiz);
                    // this.listNav(contPoll);

                    //this.createNav(contPoll);
                    var contQuizBody = virtualclass.view.customCreateElement('div', 'layoutQuizBody','quizMainCont');
                    contQuiz.appendChild(contQuizBody);

                    this.createMszBox(contQuizBody);
                    this.createModalCont(contQuizBody);



                },

/*
                createNewBtnCont: function (ctr) {

                    var btncont = document.getElementById("createPollCont");
                    if (btncont) {
                        btncont.parentNode.removeChild(btncont);
                    }
                    
                    var ct = document.createElement('div');
                    ct.id = "createPollCont";
                    ct.className = "createBtnCont";
                    ctr.appendChild(ct);

                },
*/

                createModalCont: function (contQuiz) {
                    var bsCont = virtualclass.view.customCreateElement('div', 'bootstrapQzCont','modalCont');
                    contQuiz.appendChild(bsCont);

                },
                layout2: function (contQuiz) {
                    var ctr = document.getElementById(contQuiz);

                    var text = "Available Quizes";

                    var e = document.getElementById("listQzCont");
                    if (e == null) {
                        
                        var e = virtualclass.view.customCreateElement('div', 'listQzCont','row quizList');
                        ctr.appendChild(e);

                    }

                    //this.createNewBtnCont(ctr);

                },
/*
                layoutNewPoll: function () {

                    var head = document.getElementById(("contHead"));
                    var headerTx = document.createElement('div');



                    var text = document.createElement('div');
                    text.id = "editTx";
                    text.classList.add("row", "modalHeaderTx");
                    //text.className = "row";
                    text.innerHTML = "Create New Poll";
                    head.appendChild(text);

                    var body = document.getElementById("contBody");
                    //var footer = document.getElementById("newPollFooter");
                    var txCont = document.getElementById("qnTxCont");
                    if (!txCont) {
                        var qncont = document.createElement("div");
                        qncont.id = "qnTxCont";
                        qncont.classList.add("row", "pollTxCont")
                        body.appendChild(qncont);
                    }
                    var optsCont = document.getElementById("optsTxCont");
                    if (!optsCont) {
                        var opscont = document.createElement("div");
                        opscont.id = "optsTxCont";
                        opscont.classList.add("row", "pollTxCont")
                        body.appendChild(opscont);
                    }
                },
                newPollTextUI: function () {
                    var qncont = document.getElementById("qnTxCont");
                    var opscont = document.getElementById("optsTxCont");
                    var label = document.createElement('label');
                    label.innerHTML = "Question :";
                    label.className = "pollLabel";
                    qncont.appendChild(label);

                    var cont = document.createElement("div")
                    cont.className = "inputWrapper clearfix clearfix";
                    qncont.appendChild(cont);

                    var qnText = document.createElement('textArea');
                    qnText.id = "q";
                    qnText.className = "qn form-control";
                    qnText.rows = "1";
                    qnText.placeholder = "Type question";
                    cont.appendChild(qnText);

                    var label = document.createElement('label');
                    label.innerHTML = "Options :";
                    label.className = "optionLabel";
                    opscont.appendChild(label);

                    var cont = document.createElement("div")
                    cont.className = "inputWrapper clearfix";
                    opscont.appendChild(cont);

                    var optnText = document.createElement('textArea');
                    optnText.id = "1";
                    optnText.className = "opt form-control";
                    optnText.placeholder = "Type option";
                    optnText.rows = "1";
                    cont.appendChild(optnText);

                    var cont = document.createElement("div")
                    cont.className = "inputWrapper clearfix";
                    opscont.appendChild(cont);
                    var optnText = document.createElement('textArea');

                    optnText.id = "2";
                    optnText.className = "opt form-control";
                    optnText.rows = "1";
                    optnText.placeholder = "Type option";
                    cont.appendChild(optnText);

                    var addMoreCont = document.createElement("div");
                    addMoreCont.id = "addMoreCont";
                    addMoreCont.className = "addMoreCont";
                    opscont.appendChild(addMoreCont);

                    var addIcon = document.createElement("span");
                    addIcon.className = "icon-plus-circle";
                    addMoreCont.appendChild(addIcon);

                    var addMore = document.getElementById("AddMoreOption");
                    if (!addMore) {
                        var anc = document.createElement("a");
                        anc.href = "#";
                        anc.id = "addMoreOption";
                        anc.innerHTML = "Add Option"
                        anc.classList.add("addMoreOption", "controls");
                        addMoreCont.appendChild(anc);
                    }
                },
*/

                resultView: function () {
                    var layout = document.getElementById("layoutQuiz");
                    
                    if (roles.hasControls()) {
                        this.createResultLayout();
/*
                        if (!istimer) {
                            var head = document.getElementById("resultLayoutHead");
                            var btn = document.getElementById("closePoll");
                            if (!btn) {
                                var btn = document.createElement("button");
                                btn.id = "closePoll";
                                head.appendChild(btn);
                                btn.innerHTML = "closePoll";
                                btn.addEventListener("click", virtualclass.poll.closePoll);

                                var iconClose = document.createElement("i");
                                iconClose.className = "icon-close-poll";
                                btn.appendChild(iconClose);

                            }

                        }
*/
                    }
                    //var modalClose = document.getElementById("modalQzClose");
                    //modalClose.removeAttribute("data-dismiss");

/*
                    modalClose.addEventListener("click", function () {
                        this.quizModalClose(pollType);

                    });
*/


                    //virtualclass.poll.count = {};
                   // virtualclass.poll.list = [];

                },


                createResultLayout: function () {

                    var resultLayout = document.getElementById("resultQzLayout")
                    if (resultLayout) {
                        resultLayout.parentNode.removeChild(resultLayout);
                    }

                    if (roles.hasControls()) {

                        var head = document.getElementById(("contQzHead"));
                        if (pubbtn = document.getElementById("publishQzBt")) {
                            pubbtn.parentNode.removeChild(pubbtn);
                        }
                        var resultTx = document.getElementById(("resultQzTx"));
                        if (!resultTx) {
                            var text = document.createElement('div');
                            text.id = "resultQzTx";
                            text.classList.add("row", "modalHeaderTx");
                            //text.className = "row";
                            text.innerHTML = "Quiz Result";
                            head.appendChild(text);


                        }

                        var cont = document.getElementById("quizModalBody");
                        if (cont) {
                            while (cont.childElementCount > 1) {
                                cont.removeChild(cont.lastChild);
                            }
                        }

                        var settingTx = document.getElementById("settingQzTx");
                        if (settingTx) {
                            settingTx.parentNode.removeChild(settingTx);
                        }
                        var elem = document.createElement("div");
                        elem.id = "resultQzLayout";
                        // elem.className = "bootstrap container";

                        cont.appendChild(elem);


                    } else {

                        var cont = document.getElementById("virtualclassQuiz");
                        var elem = document.createElement("div");
                        elem.id = "resultQzLayout";
                        elem.className = "bootstrap container";
                        cont.appendChild(elem);


                    }

                    //this.resultLayoutHeader(elem);
                    //this.resultLayoutBody(elem);
    //this.resultLayoutFooter(elem);

                },

/*
                resultNotShownUI: function (header) {
                    var elem = document.createElement("div");
                    var mszbox = document.getElementById("mszBoxPoll");
                    var i = 0;
                    if (mszbox) {
                        while (mszbox.childNodes.length > 0) {
                            mszbox.removeChild(mszbox.childNodes[i]);
                        }


                    }


                    header.appendChild(elem);
                    var msg = "<b>Poll Closed </b><br/>You wont be able to see the result<br/> As you are not permitted";
                    virtualclass.poll.showMsg("mszBoxPoll", msg, "alert-success");
                },
                resultLayoutHeader: function (cont) {
                    var elem = document.createElement("div");
                    elem.id = "resultLayoutHead";
                    elem.className = "row";
                    cont.appendChild(elem);

                    var tw = document.createElement("div");
                    tw.id = "timerWrapper";
                    tw.className = "col-md-6";
                    elem.appendChild(tw);

                    var label = document.createElement('label');
                    label.innerHTML = "Remaining Time";
                    label.id = "timerLabel";
                    tw.appendChild(label);

                    var tw = document.createElement("div");
                    tw.id = "votesWrapper";
                    tw.className = "col-md-6";
                    elem.appendChild(tw);

                    if (roles.hasControls()) {
                        var label = document.createElement('label');
                        label.innerHTML = "Voted So Far";
                        label.id = "congreaPollVoters";
                        tw.appendChild(label);

                        var votes = document.createElement("div");
                        votes.id = "receivedVotes";
                        tw.appendChild(votes);

                    }

                },
                resultLayoutBody: function (cont) {
                    var elem = document.createElement("div");
                    elem.id = "resultLayoutBody";
                    elem.className = "row";
                    cont.appendChild(elem);

                    var qnLabel = document.createElement("div");
                    qnLabel.id = "qnLabelCont"
                    qnLabel.className = "row";
                    elem.appendChild(qnLabel);
                    if (roles.hasControls()) {
                        qnLabel.innerHTML = virtualclass.poll.dataToStd.question;
                    } else {
                        qnLabel.innerHTML = virtualclass.poll.dataRec.question;
                    }

                    var chartMenu = document.createElement("div");
                    chartMenu.id = "chartMenuCont";
                    chartMenu.className = "row";
                    elem.appendChild(chartMenu);
                    if (roles.hasControls()) {
                        this.chartMenu(chartMenu);
                        this.createResultMsgCont(cont);
                    }

                    this.createChartCont(elem);

                },
                createResultMsgCont: function (cont) {
                    var elem = document.createElement("div");
                    elem.id = "pollResultMsz";
                    elem.className = "pollResultMsz";
                    elem.innerHTML = "Waiting for student response....."
                    cont.appendChild(elem);

                },
                createChartCont: function (cont) {

                    var chart = document.createElement("div");
                    chart.id = "chart";
                    chart.className = "row";
                    cont.appendChild(chart);

                },
                pollClosedUI: function () {
                    var closeBtn = document.getElementById("closePoll");
                    if (closeBtn) {
                        closeBtn.parentNode.removeChild(closeBtn);
                    }

                    var elem = document.getElementById("congreaPollVoters")
                    if (elem) {
                        elem.innerHTML = "Recevied Votes / Total Users";
                    }

                    var elem = document.getElementById("pollResultMsz")
                    if (elem) {
                        elem.parentNode.removeChild(elem)
                    }

                },
                chartMenu: function (cont) {

                    var elem = document.createElement("div");
                    elem.id = "bar ";
                    elem.className = "col-sm-1";
                    cont.appendChild(elem);


                    var bar = document.createElement("a");
                    //bar.innerHTML = "bar graph ";
                    bar.href = "#"
                    bar.id = "barView";
                    // elem.className="glyphicon glyphicon-stats";
                    elem.appendChild(bar);

                    var baricon = document.createElement("span");
                    baricon.className = "icon-stats-bars";
                    bar.appendChild(baricon);


                    elem.addEventListener('click', virtualclass.poll.barGraph)


                    var elem = document.createElement("div");
                    elem.id = "pi";
                    elem.className = "col-sm-1";
                    cont.appendChild(elem);


                    var pi = document.createElement("a");
                    // pi.innerHTML = "pi chart ";
                    pi.href = "#"
                    pi.id = "piView";
                    // elem.className="glyphicon glyphicon-stats";
                    elem.appendChild(pi);
                    var piicon = document.createElement("span");
                    piicon.className = "icon-pie-chart";
                    pi.appendChild(piicon);


                    pi.addEventListener('click', virtualclass.poll.createPiChart);

                    var elem = document.createElement("div");
                    elem.id = "list view";
                    elem.className = "col-sm-1";
                    cont.appendChild(elem);

                    // a to replace with span
                    if (roles.hasControls()) {

                        var list = document.createElement("a");
                        //list.innerHTML = "list view ";
                        list.href = "#"
                        list.id = "listView"

                        var listicon = document.createElement("span");
                        listicon.className = "icon-list-ul";
                        list.appendChild(listicon);

                        elem.appendChild(list);
                        elem.addEventListener('click', virtualclass.poll.listView)
                    }

                },
*/
/*
                qnLabel: function (cont) {
                    var chart = document.createElement("div");
                    chart.id = "chart";
                    chart.className = "row";
                    cont.appendChild(chart);
                },
*/
/*
                resultLayoutFooter: function (cont) {
                    var elem = document.createElement("div");
                    elem.id = "resultLayoutFooter";
                    elem.className = "row";
                    cont.appendChild(elem);

                },
*/
                createNav: function (pollCont) {
//               
                    var nav = document.createElement('nav');
                    nav.id = "navigator";
                    nav.className = "nav navbar";
                    pollCont.appendChild(nav);
//                    if (!roles.hasControls()) {
//                        nav.style.display = "none";
//                    }
                    var ul = document.createElement('ul');
                    ul.classList.add("nav", "nav-tabs", "pollNavBar");
                    nav.appendChild(ul);

                    if (roles.hasControls()) {
                        var li1 = document.createElement('li');
                        li1.setAttribute("role", "presentation");
                        li1.id = "coursePollTab";
                        li1.classList.add("navListTab", "active")
                        li1.setAttribute("data-toggle", "popover");
                        li1.setAttribute("data-trigger", "hover");
                        //li1.setAttribute("title","Polls you will create are course specific");
                        li1.setAttribute("data-content", "Polls you will create are course specific");

                        ul.appendChild(li1);

                        var a = document.createElement("a")
                        a.href = "#";
                        a.innerHTML = "Course Poll";
                        li1.appendChild(a);

                        var li = document.createElement('li');
                        a.addEventListener('click', function () {

                            li.classList.remove('active');
                            li1.classList.add('active');
                            virtualclass.poll.interfaceToFetchList(virtualclass.poll.cmid);
                        })
                        ul.appendChild(li);

                        li.setAttribute("role", "presentation");
                        li.id = "sitePollTab";
                        li.classList.add("navListTab");
                        li.setAttribute("data-toggle", "popover");
                        li.setAttribute("data-trigger", "hover");
                        // li.setAttribute("title","Polls created here are of site level");
                        li.setAttribute("data-content", "Polls created here are of site level");
                        var a = document.createElement("a")
                        a.href = "# ";
                        a.innerHTML = "Site Poll";
                        li.appendChild(a);
                        //virtualclass.poll.attachEvent('click','coursePollNav',virtualclass.poll.coursePollHandler);
                        a.addEventListener('click', function () {
                            var category = 0;
                            li1.classList.remove('active');
                            li.classList.add('active');
                            virtualclass.poll.interfaceToFetchList(category);
                        });


                    } else {

                        li = document.createElement('li');
                        li.setAttribute("role", "presentation");
                        li.id = "pollResult";
                        li.classList.add("navListTab");
                        li.setAttribute("data-toggle", "popover");
                        li.setAttribute("data-trigger", "hover");
                        //li.classList.remove('active');
                        // li.setAttribute("title","Polls created here are of site level");
                        li.setAttribute("data-content", "show result");
                        ul.appendChild(li);
                        var a = document.createElement("a")
                        a.href = "# ";
                        a.innerHTML = "Poll Result";
                        li.appendChild(a);
                        //virtualclass.poll.attachEvent('click','coursePollNav',virtualclass.poll.coursePollHandler);
                        a.addEventListener('click', function () {
//                        var category = 0;
//                        li1.classList.remove('active');
//                        li.classList.add('active');
                            virtualclass.poll.showStudentPollReport();
                        });

                    }

                    $(function () {
                        $('[data-toggle="popover"]').popover()
                    })
                },
                createMszBox: function (cont) {
                    var elem = virtualclass.view.customCreateElement('div', 'mszBoxQuiz','row');
                    cont.appendChild(elem);

                },
/*
                newPollBtn: function (pollType) {

                    var ct = document.getElementById("createPollCont")
                    var btn = document.createElement('button');
                    btn.id = "newPollBtn" + pollType;
                    btn.className = "btn btn-default";
                    btn.classList.add(pollType);
                    btn.innerHTML = "Create New";
                    btn.setAttribute("data-toogle", "modal");
                    btn.setAttribute("data-target", "#editPollModal")
                    ct.appendChild(btn);
                    virtualclass.poll.attachEvent(btn.id, "click", virtualclass.poll.newPollHandler, pollType)

                    var iconNew = document.createElement('i');
                    iconNew.className = "icon-create-new";
                    btn.appendChild(iconNew);

                },
*/
/*
                addAnc: function (navId, text, active) {

                    var elem = document.getElementById(navId);
                    var anc = document.createElement('a');
                    anc.id = navId + "Anch";
                    anc.href = "#";
                    if (elem != null) {
                        var iconButton = document.createElement('span');
                        iconButton.className = "icon-" + "pollNav";
                        iconButton.id = "icon-" + text;
                        iconButton.innerHTML = text;

                        iconButton.setAttribute("data-toogle", "tooltip");
                        iconButton.setAttribute("data-placement", "bottom");
                        iconButton.setAttribute("title", text);

                        anc.appendChild(iconButton);
                        anc.dataset.title = text;
                        anc.className = 'tooltip';
                        if (typeof active != 'undefined') {
                            anc.classList.add(active);
                        }
                        elem.appendChild(anc);
                    }
                },
*/
/*
                createOption: function (qIndex, type) {

                    var optsCont = document.getElementById('optsTxCont');
                    var elem = optsCont.querySelectorAll(':scope .opt');
                    var count = 0;
                    for (var i = 0; i < elem.length; i++) {

                        count++;
                        var x = elem[i].id;

                    }
                    var newIndex = count;
                    if (x) {
                        var y = newIndex;
                    } else {
                        y = "0";
                    }
                    var addMore = document.getElementById("addMoreCont");
                    var cont = document.createElement("div");
                    cont.className = "inputWrapper clearfix";


                    optsCont.insertBefore(cont, addMore)

                    var option = document.createElement("textArea");

                    option.rows = "1";
                    option.id = "option" + y;
                    option.className = "opt form-control";
                    option.placeholder = "Type option";
                    option.style.width = "97%";
                    option.style.float = "left";
                    cont.appendChild(option)
                    if (newIndex > 1) {
                        var close = document.createElement("a");
                        close.id = "remove" + y;
                        close.className = "close";
                        close.innerHTML = "&times";
                        cont.appendChild(close);
                        // cont.appendChild(close);
                        close.addEventListener("click", function () {
                            virtualclass.poll.removeOption(type, qIndex, close.id);

                        })

                    }

                },
*/
                qzCont: function (index) {
                    var list = document.getElementById("listQzCont");
                    var elem = virtualclass.view.customCreateElement('div', 'contQz' + index,'row vcQuizCont col-md-12');
                    if (list != null) {
                        list.insertBefore(elem, list.firstChild);
                    }
                },
/*
                hidePrevious: function (index) {
                    var cont = document.getElementById("optsTxCont");
                    if (cont) {
                        cont.parentNode.removeChild(cont);
                    }

                    var cont = document.getElementById("reset");
                    if (cont) {
                        cont.style.display = "none";
                    }
                    var footer = document.getElementById("footerCtrCont");
                    footer.parentNode.removeChild(footer)

                },
*/

                generateModal: function (id, bsCont) {

                    var modal = virtualclass.view.customCreateElement('div',id,'modal');
                    modal.role = "dialog";
                    modal.style.display = "none";
                    modal.setAttribute("tab-index", "-1");
                    modal.setAttribute("area-hidden", "true");
                    bsCont.appendChild(modal);

                    var dialog = document.createElement("div");
                    dialog.className = "modal-dialog";
                    modal.appendChild(dialog);
                    
                    var content = virtualclass.view.customCreateElement('div','quizModalBody','modal-content');
                    dialog.appendChild(content);

                    var head = virtualclass.view.customCreateElement('div','contQzHead','modal-header');
                    content.appendChild(head);
                    
/*
                    var publish = virtualclass.view.customCreateElement('div','contQzFooter');
                    head.appendChild(publish);
*/

                    
                    var el = virtualclass.view.customCreateElement('div','modalQzClose','close');
                    el.type = "button";
                    el.setAttribute("data-dismiss", "modal");
                    el.innerHTML = "&times";
                    head.appendChild(el);
                    
                    var body = virtualclass.view.customCreateElement('div','contQzBody','modal-body');
                    content.appendChild(body);
                    
                    //var footer = virtualclass.view.customCreateElement('div','contQzFooter','modal-footer');
                    //content.appendChild(footer);
                },


                modalContentUI: function () {
                    //Quiz display container
                    var body = document.getElementById("contQzBody");
                    
                    var skQzCont = virtualclass.view.customCreateElement('div','slickQuiz','path-mod-exam');
                    var qzName = virtualclass.view.customCreateElement('h3','','quizName');
                    skQzCont.appendChild(qzName); //quiz name div
                    
                    var qzTime = virtualclass.view.customCreateElement('P','timeText');
                    skQzCont.appendChild(qzTime); //quiz timer p
                    
                    var skQzNav = virtualclass.view.customCreateElement('div','exam_navblock','navblock');
                    skQzCont.appendChild(skQzNav); ////quiz questions navigation
                    
                    var skQzNavCont = virtualclass.view.customCreateElement('div','','content');
                    skQzNav.appendChild(skQzNavCont);
                    
                    var skQzNavContBt = virtualclass.view.customCreateElement('div','','qn_buttons multipages');
                    skQzNavCont.appendChild(skQzNavContBt);
                    
                    
                    var qzArea = virtualclass.view.customCreateElement('div','','quizArea');
                    skQzCont.appendChild(qzArea);
                    var qzheader = virtualclass.view.customCreateElement('div','','quizHeader');
                    qzArea.appendChild(qzheader);
                    
                    var qzheaderA = virtualclass.view.customCreateElement('a','','button startQuiz');
                    qzheaderA.href="#";
                    qzheaderA.innerHTML= "Get Started!";
                    qzheader.appendChild(qzheaderA);
                    
                    //alert('I am here. add result div');
                    var qzResult = virtualclass.view.customCreateElement('div','','quizResults');
                    skQzCont.appendChild(qzResult);
                    
                    var qzScr = virtualclass.view.customCreateElement('h3','','quizScore');
                    qzScr.innerHTML= "You Scored: <span></span>";
                    qzResult.appendChild(qzScr);
                    
                    var qzLevel = virtualclass.view.customCreateElement('h3','','quizLevel');
                    qzheaderA.innerHTML= "<strong>Ranking:</strong> <span></span>";
                    qzResult.appendChild(qzLevel);
                    
                    var qzRsCpy = virtualclass.view.customCreateElement('div','','quizResultsCopy');
                    qzResult.appendChild(qzRsCpy);
                    body.appendChild(skQzCont);
                },

                qzCtrCont: function (index) {

                    var e = document.getElementById("contQz" + index);
                    
                    var ctrCont = virtualclass.view.customCreateElement('div', "ctrQz" + index, "col-md-1 quizCtrCont");
                    e.appendChild(ctrCont);
                    
                    var cont = virtualclass.view.customCreateElement('div','',"quizCtrContainer");
/*
                    var cont = document.createElement("div");
                    cont.className = "quizCtrContainer";
*/
                    ctrCont.appendChild(cont);

/*
                    var editCont = document.createElement("div");
                    editCont.id = "contQz" + index + "E";
                    editCont.className = "editCont pull-left";
                    cont.appendChild(editCont);
*/

/*
                    var deleteCont = document.createElement("div");
                    deleteCont.id = "contQz" + index;
                    deleteCont.className = "deleteCont pull-left";
                    cont.appendChild(deleteCont);
*/

                   /* if ((pollType == "course" && id == wbUser.id) || (pollType == "site" && isAdmin == "true")) {

                        if (!isPublished) {
                            var link1 = document.createElement("a");
                            //link1.innerHTML = "edit";
                            link1.href = "#";

                            link1.setAttribute("data-target", "#editPollModal")
                            link1.setAttribute("id", "editQn" + pollType + index);
//                           
                            editCont.appendChild(link1);

                            var sp = document.createElement("span");
                            sp.className = "icon-pencil2";
                            sp.setAttribute("data-toggle", "tooltip")
                            sp.setAttribute("title", "edit poll");
                            link1.appendChild(sp);

                        } else {
                            var link1 = document.createElement("span");
                            link1.className = "icon-pencil2";
                            link1.setAttribute("data-toggle", "tooltip")
                            link1.setAttribute("title", "cannt edit,poll attempted ");
                            editCont.appendChild(link1);

                        }
                        var link3 = document.createElement("a");
                        link3.href = "#";
                        link3.id = "deleteQn" + pollType + index;


                        //link3.innerHTML = "delete";
                        // link3.className= "icon-bin"
                        var sp = document.createElement("span");
                        sp.className = "icon-bin22";
                        sp.setAttribute("data-toggle", "tooltip")
                        sp.setAttribute("title", "delete poll");


                        link3.appendChild(sp);

                        deleteCont.appendChild(link3);


                    } else {*/

/*
                        var link1 = document.createElement("span");
                        link1.className = "icon-pencil2";
                        link1.setAttribute("data-toggle", "tooltip")
                        link1.setAttribute("title", "cannt edit, can be edited by creator of the poll");
                        editCont.appendChild(link1);
*/

/*
                        var link3 = document.createElement("span");
                        link3.setAttribute("data-toggle", "tooltip")
                        link3.setAttribute("title", "cannt delete, can be deleted  by creator of the poll");
                        link3.className = "icon-bin22"
                        deleteCont.appendChild(link3);
*/

                   // }
                    var e = virtualclass.view.customCreateElement('div', "publishCont pull-left", "contQz" + index + "P");
                    cont.appendChild(e);

                    var link2 = document.createElement("a");
                    link2.href = "#";
                    link2.id = "publishQz" + index;

                    e.appendChild(link2);

                    var sp = document.createElement("span");
                    sp.className = "icon-publish2";
                    sp.setAttribute("data-toggle", "tooltip")
                    sp.setAttribute("title", virtualclass.lang.getString('quizreviewpublish'));

                    link2.appendChild(sp);
                },
                qzTextCont: function (item, index) {

/*
                    var option = "";
                    for (var i in item.options) {
                        option = option + item.options[i] + " ";
                    }
*/

                    var e = document.getElementById("contQz" + index);
                    var qzCont = virtualclass.view.customCreateElement('div', "qzText" + index);
                    qzCont.classList.add("qnText", "col-md-8")
                    qzCont.innerHTML = item.name;
                    e.appendChild(qzCont);

                    qzCont.setAttribute("data-toggle", "popover");
                    qzCont.setAttribute("data-trigger", "hover");
                    
                    var preview = virtualclass.view.customCreateElement('div', "popover" + index);
                    preview.classList.add("pollPreview");
                    this.quizPreviewCont(preview, item);


                    $(function () {
                        $('[data-toggle="popover"]').popover({content: preview, html: true, delay: {show: 1000}})
                    })



                    var elem = document.createElement("div");
                    elem.classList.add("creator", "col-md-2")

                    elem.innerHTML = item.timelimit;
                    e.appendChild(elem);
                    
                    var elem = document.createElement("div");
                    elem.classList.add("qperpage", "col-md-1")

                    elem.innerHTML = item.questionsperpage;
                    e.appendChild(elem);



                },
                quizPreviewCont: function (cont, item) {
                    
                    var popUpcont = virtualclass.view.customCreateElement('div', "popupCont");
                    cont.appendChild(popUpcont);

                    var qzcont = virtualclass.view.customCreateElement('div', "qzTxCont");
                    qzcont.classList.add("row", "previewTxCont")
                    popUpcont.appendChild(qzcont);


/*
                    var l = document.createElement("label");
                    l.innerHTML = "Question";
                    qncont.appendChild(l);
                    virtualclass.poll.showPreviewQn(qncont, item);

                    var opscont = document.createElement("div");
                    opscont.id = "optsTxCont";
                    opscont.classList.add("row", "previewTxCont");
                    popUpcont.appendChild(opscont);

                    var label = document.createElement("label");
                    label.innerHTML = "Options";
                    opscont.appendChild(label);
                    virtualclass.poll.showPreviewOption(opscont, item);
*/


                },
/*
                editPoll: function (pollType, index) {
                    var header = document.getElementById("contHead");
                    var text = document.createElement('div');
                    text.id = "editTx";
                    text.classList.add("row", "modalHeaderTx");
                    //text.className = "row";
                    text.innerHTML = "Poll Edit";
                    header.appendChild(text);


                    virtualclass.poll.UI.loadContent(pollType, index);
                },
*/

                previewFooterBtns: function (footerCont, index) {
                    console.log('previewFooterBtns function');
                    var cont = document.getElementById("footerCtrQzCont");
                    if (!cont) {
                        var ctrCont = virtualclass.view.customCreateElement('div', "footerCtrQzCont");                        
                        footerCont.appendChild(ctrCont);

/*
                        var btn = virtualclass.view.customCreateElement('button', "goBackQz"); 
                        btn.setAttribute("data-dismiss", "modal");
                        btn.innerHTML = "< Back";
                        btn.classList.add("btn", "btn-default", "controls");
                        ctrCont.appendChild(btn);

                        var iconBack = document.createElement('i');
                        iconBack.className = "icon-back";
                        btn.appendChild(iconBack);
*/

                        var btn = document.createElement('button');
                        btn.id = "publishQzBt";
                        btn.classList.add("btn", "btn-default", "controls")
                        btn.innerHTML = "Go to Publish";
                        ctrCont.appendChild(btn)
                        virtualclass.quiz.quizPopUp(virtualclass.quiz.popupFn, index);

                        var iconPublish = document.createElement('i');
                        iconPublish.className = "icon-publish";
                        btn.appendChild(iconPublish);
                    }
                },
                footerBtns: function (index) {

                    var footerCont = document.getElementById("contQzFooter");
                    var ctrCont = document.createElement("div");
                    ctrCont.id = "footerCtrQzCont";
                    footerCont.appendChild(ctrCont);

                    var cont = document.getElementById("etSave");
                    if (cont == null) {
//                        var anc = document.createElement("a");
//                        anc.href = "#";
//                        anc.id = "addMoreOption";
//                        anc.innerHTML = "AddMoreOption"
//                        anc.classList.add("addMoreOption", "controls");
//                        ctrCont.appendChild(anc);
                        var btn = document.createElement("button");

                        btn.id = "reset";
                        btn.classList.add("btn", "btn-default", "pull-left", "controls");
                        btn.type = "button";
                        btn.innerHTML = "Reset";
                        ctrCont.appendChild(btn);

                        var iconReset = document.createElement('i');
                        iconReset.className = "icon-reset";
                        btn.appendChild(iconReset);


                        var btn = document.createElement('button');
                        btn.id = "etSave";
                        btn.innerHTML = "Save";
                        btn.classList.add("btn", "btn-default", "controls");
                        ctrCont.appendChild(btn);

                        var iconSave = document.createElement('i');
                        iconSave.className = "icon-save";
                        btn.appendChild(iconSave);


                        var btn = document.createElement('button');
                        btn.id = "saveNdPublish";
                        btn.classList.add("btn", "btn-default", "controls");
                        btn.innerHTML = "Save and Publish";
                        ctrCont.appendChild(btn)

                        var savePublish = document.createElement('i');
                        savePublish.className = "icon-publish";
                        btn.appendChild(savePublish);


                        //if (pollType) {
                            virtualclass.quiz.quizPopUp(virtualclass.quiz.popupFn, index);
                        //}
                    }
                },
/*
                editQn: function (pollType, index) {
                    var el = document.getElementById('qnTxCont')
                    var qn = document.getElementById('q')
                    // el.style.display="block";
                    if (qn == null) {
                        var label = document.createElement('label');
                        label.innerHTML = "Question :";
                        label.className = "pollLabel";
                        el.appendChild(label);

                        var qncont = document.createElement("div")
                        qncont.className = "inputWrapper clearfix";
                        el.appendChild(qncont);

                        var qnText = document.createElement('textArea');
                        qnText.id = "q";
                        qnText.className = "qn form-control";
                        qnText.rows = "1";
                        qnText.value = document.getElementById("qnText" + pollType + index).innerHTML;
                        qncont.appendChild(qnText);
                    }
                    var elem = document.getElementById('q')

                    if (elem != null && !elem.value) {
                        if (pollType = 'course') {
                            elem.value = virtualclass.poll.coursePoll[index].questiontext;
                        } else {
                            elem.value = virtualclass.poll.sitePoll[index].questiontext;
                        }
                    }

                },
*/
/*
                editOptions: function (pollType, qIndex, prop, optsCount) {
                    var el = document.getElementById('optsTxCont')
                    el.style.display = "block";

                    var opt = document.getElementById("opt" + qIndex + prop);
                    if (opt == null) {
                        var l = document.getElementById("pollOptLabel");
                        if (l == null) {
                            var label = document.createElement('label');
                            label.innerHTML = "Options :";
                            label.id = "pollOptLabel";
                            label.className = "pollLabel";

                            el.appendChild(label);
                        }
                        var cont = document.createElement("div");
                        cont.className = "inputWrapper clearfix";
                        el.appendChild(cont);

                        var option = document.createElement("textArea");

                        option.rows = "1";
                        option.id = "option" + prop;
                        option.className = "opt form-control";

                        option.style.width = "97%";
                        option.style.float = "left";
                        cont.appendChild(option)
                        if (optsCount > 2) {
                            var close = document.createElement("a");
                            close.id = "remove" + prop;
                            close.className = "close";
                            close.innerHTML = "&times";

                            cont.appendChild(close);
                            close.addEventListener("click", function () {
                                virtualclass.poll.removeOption(pollType, qIndex, close.id);

                            })
                        }
                        if (pollType == "course") {
                            var courseOpts = virtualclass.poll.coursePoll[qIndex].options[prop];
                            option.value = (typeof courseOpts == 'object') ? courseOpts.options : courseOpts;
                        } else {
                            var siteOpts = virtualclass.poll.sitePoll[qIndex].options[prop];
                            option.value = (typeof siteOpts == 'object') ? siteOpts.options : siteOpts;
                        }

                    }
                },
*/
/*
                pollSettingUI: function (index, label) {
                    this.settingUIHeader(index, label)
                    this.settingUIBody(index, label);
                    this.settingUIFooter(index, label)

                },
*/
/*
                settingUIHeader: function (index, label) {
                    var header = document.getElementById("contHead");
                    var editTx = document.getElementById("editTx");
                    if (editTx) {
                        editTx.parentNode.removeChild(editTx);
                    }
                    var publishTx = document.getElementById("publishTx");
                    if (publishTx) {
                        publishTx.parentNode.removeChild(publishTx);
                    }

                    var text = document.createElement('div');
                    text.id = "settingTx";
                    text.classList.add("row", "modalHeaderTx");
                    // text.className = "row";
                    text.innerHTML = "Poll Setting";
                    header.appendChild(text);

                },
*/
/*
                settingUIBody: function (index, label) {

                    var body = document.getElementById("contBody");
                    for (var i = 0; i < body.childNodes.length; i++) {
                        body.childNodes[i].parentNode.removeChild(body.childNodes[i]);
                    }

                    var elem = document.createElement('div');
                    elem.id = "settingCont";
                    elem.className = "row";
                    body.appendChild(elem);

                    this.modeSetting(elem);
                    this.enTimer(elem);
                    this.ckShowRt(elem)
                    this.addSettingHandlers();


                },
*/
/*
                addSettingHandlers: function () {

                    var mode = document.getElementById("mode");
                    mode.addEventListener('click', function () {
                        var r1 = document.getElementById("radioBtn1");
                        var r2 = document.getElementById("radioBtn2");
                        if (r1.checked) {
                            var timer = document.getElementById("timer");
                            timer.setAttribute('disabled', true);
                            var unit = document.getElementById("ut");
                            unit.setAttribute('disabled', true);
                        } else if (r2.checked) {
                            var timer = document.getElementById("timer");
                            timer.removeAttribute('disabled');
                            var unit = document.getElementById("ut");
                            unit.removeAttribute('disabled');
                        }

                    });
                },
*/
/*
                settingUIFooter: function (index, label) {
                    var footer = document.getElementById("contFooter");
                    var settingBtn = document.createElement('div');
                    settingBtn.id = "settingBtn";
                    footer.appendChild(settingBtn);

                    var cancel = document.createElement('button');
                    cancel.id = "cacelSetting";
                    cancel.className = "btn btn-default";
                    cancel.setAttribute("data-dismiss", "modal");
                    cancel.innerHTML = "cancel";
                    settingBtn.appendChild(cancel);

                    var iconCancel = document.createElement('i');
                    iconCancel.className = "icon-publish-cancel";
                    cancel.appendChild(iconCancel);

                    var publish = document.createElement('button');
                    publish.id = "publish";
                    publish.className = "btn btn-default";
                    // save.setAttribute("data-dismiss", "modal");
                    publish.innerHTML = "Publish";

                    var iconPublish = document.createElement('i');
                    iconPublish.className = "icon-publish";
                    publish.appendChild(iconPublish);
                    settingBtn.appendChild(publish);

                },
*/
                modeSetting: function (cont) {
                    var modeLabel = document.createElement('div');
                    modeLabel.innerHTML = "Mode of closing Poll :";
                    modeLabel.className = "pollLabel"
                    cont.appendChild(modeLabel);

                    var mode = document.createElement('div');
                    mode.id = "mode";
                    mode.className = "custom-controls-stacked";
                    cont.appendChild(mode);

                    var label = document.createElement('label');
                    label.className = "custom-control custom-radio";
                    mode.appendChild(label);

                    var el = document.createElement('input');
                    el.type = "radio";
                    el.name = "option"
                    el.value = "BY Instructor";
                    el.id = "radioBtn1";
                    el.className = "custom-control-input";
                    label.appendChild(el);

                    var span = document.createElement("span");
                    span.className = "custom-control-indicator";
                    label.appendChild(span)

                    var span = document.createElement("span");
                    span.className = "custom-control-description";
                    span.innerHTML = "By Instructor";
                    label.appendChild(span);

                    var labelTimer = document.createElement('label');
                    labelTimer.className = "custom-control custom-radio";
                    mode.appendChild(labelTimer);
                    var el = document.createElement('input');
                    el.type = "radio";
                    el.name = "option"
                    el.value = "BY Timer";
                    el.id = "radioBtn2";
                    el.checked = "checked";
                    el.className = "custom-control-input";
                    labelTimer.appendChild(el);

                    var span = document.createElement("span");
                    span.className = "custom-control-indicator";
                    labelTimer.appendChild(span)

                    var span = document.createElement("span");
                    span.className = "custom-control-description";
                    span.innerHTML = "By Timer";
                    labelTimer.appendChild(span);
                },
                enTimer: function (setting) {
                    var enTimer = document.createElement('div');
                    enTimer.id = "enTimer";
                    setting.appendChild(enTimer);

                    var timerTx = document.createElement('div');
                    timerTx.id = "timerTx";
                    timerTx.innerHTML = "Set Timer"
                    timerTx.className = "pollLabel"
                    enTimer.appendChild(timerTx);

                    var sel = document.createElement('div');
                    sel.id = "selTime";
                    enTimer.appendChild(sel);

                    var time = document.createElement('select');
                    time.type = "select";
                    time.id = "timer";
                    time.name = "timer"
                    time.className = "form-control";
                    time.style.width = "100px";
                    time.style.display = "inline";
                    sel.appendChild(time);
                    selectOne();

                    function selectOne() {
                        var select = document.getElementById('timer');
                        for (var i = 0; i < 60; i++) {

                            select.options[select.options.length] = new Option(i + 1, i + 1);
                        }
                    }

                    var unit = document.createElement('select');
                    unit.type = "select";
                    unit.id = "ut";
                    unit.name = "unit";
                    unit.className = "form-control";
                    unit.style.width = "100px";
                    unit.style.display = "inline";
                    sel.appendChild(unit);

                    var op = document.createElement('option');
                    op.id = "op1";
                    op.name = "unit";
                    op.value = "minut";
                    op.innerHTML = "minut";
                    unit.appendChild(op);

                    var op = document.createElement('option');
                    op.id = "op2";
                    op.name = "unit";
                    op.value = "second";
                    op.innerHTML = "second";
                    unit.appendChild(op);

                },
                ckShowRt: function (setting) {
                    var showRt = document.createElement('div');
                    showRt.id = "showRt";
                    showRt.className = "form-group";
                    setting.appendChild(showRt);

                    var label = document.createElement('label');
                    label.id = "labelCk";
                    label.className = "custom-control custom-checkbox ";
                    showRt.appendChild(label);

                    var ckbox = document.createElement('input');
                    ckbox.type = "checkbox";
                    ckbox.id = "pollCkbox";
                    ckbox.className = "custom-control-input ";
                    ckbox.checked = "checked";
                    label.appendChild(ckbox);

                    var span = document.createElement('span');
                    span.id = "labelCk";
                    span.classList.add("custom-control-description", "pollLabel")
                    // span.className = "custom-control-description";
                    span.innerHTML = "show result to students";
                    label.appendChild(span);

                },
                defaultLayoutForStudent: function () {
                    this.container();
                    var mszCont = document.getElementById("mszBoxQuiz");
                    var messageLayoutId = 'stdQuizMszLayout';
                    if (document.getElementById(messageLayoutId) == null) {
                        var studentMessage = virtualclass.view.customCreateElement('div', messageLayoutId);
                        studentMessage.innerHTML = virtualclass.lang.getString('quizmayshow');
                        mszCont.appendChild(studentMessage);
                    }
                },
                stdPublishUI: function () {

                    this.stdPublishLayout();
                    var msz = document.getElementById("stdQuizMszLayout");
                    if (msz) {
                        msz.parentNode.removeChild(msz);
                    }


                },
                stdQuizDisplay: function () {

                    this.stdQuizHeader();
                    this.stdQuizContent();
                    this.stdQuizFooter();

                },
                stdQuizHeader: function () {
                    var head = document.getElementById("stdContQzHead");
                    var label = document.createElement('label');
                    label.innerHTML = "Remaining Time";
                    label.id = "timerLabel";
                    head.appendChild(label);

                },
                stdQuizContent: function () {
                    var body = document.getElementById("stdContQzBody");
                    
                    var elem = document.createElement("div");
                    elem.id = "stdQnCont";
                    elem.className = "row";
                    body.appendChild(elem);

                    var elem = document.createElement("div");
                    elem.id = "stdOptionCont";
                    elem.className = "row";
                    body.appendChild(elem);
                    // elem.innerHTML="option container";
                },
                stdQuizFooter: function () {
                    var footer = document.getElementById("stdContQzFooter");
                    var btn = document.createElement("input");
                    btn.id = "btnVote";
                    btn.className = "btn btn-primary";
                    btn.value = "VOTE"
                    footer.appendChild(btn);

                },
                stdPublishLayout: function () {

                    var cont = document.getElementById("layoutPollBody");
                    var elem = document.getElementById("stdPollContainer");
                    if (elem) {
                        elem.parentNode.removeChild(elem);
                    }
                    var elem = document.createElement('div');
                    elem.id = "stdPollContainer";
                    elem.className = "container";
                    cont.appendChild(elem);
                    this.stdLayoutTemp(elem);

                },
                stdLayoutTemp: function (cont) {
                    var elem = document.createElement('div');
                    elem.id = "stdContQzHead";
                    elem.className = "row";
                    cont.appendChild(elem);

                    var elem = document.createElement('div');
                    elem.id = "stdContQzBody";
                    elem.className = "row";
                    cont.appendChild(elem);

                    var elem = document.createElement('div');
                    elem.id = "stdContQzFooter";
                    elem.className = "row";
                    cont.appendChild(elem);
                    this.stdPollDisplay();

                },
                disableClose: function () {
                    var close = document.getElementById("pollClose");
                    close.style.display = "none";

                }

            }
        }
        return _quiz;
    };
    window.quiz = quiz;

})(window);