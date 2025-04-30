//running background script communicates with popup and with the content script 
console.log('background_script.js started');
let mainTaskIntervalId = 0;

//run listener for messages
browser.runtime.onMessage.addListener(handleMessage);

let allJobs = browser.storage.local.get('allJobs');
browser.storage.local.set({'jobsThisRun': {}});
let jobsThisRun = {};
let runningOptions = {};



//gets messages from the content script and handles them
function handleMessage(message){
    switch(message.type){
        case 'jobs':
            handleJobs(message.list);
            break;
        case 'start':
            toggleStartStop('start', message.options ?? null);
            break;
        case 'stop':
            toggleStartStop('stop');
            break;
        default:
            reportError( {'message': 'misunderstood message type recieved: ' + message.type} );
            break;
    }
}

function handleJobs(jobs){
    for(let job of jobs){
        job.discoveryTime = Date.now();
        jobsThisRun[job.id] = {...job};
        allJobs[job.id] = {...job};
        //check the job or whatever!!
        for(rule of runningOptions.rules){
            jobsThisRun[job.id].processed = 'ignore';
            if(ruleApplies(rule, job)){
                //must get active tab
                getTargetTab().then( (tabs) => browser.tabs.sendMessage( tabs[0].id,  { type : rule.acceptReject, id : job.id } )  );
                //browser.runtime.sendMessage( { type : rule.acceptReject, id : job.id } );
                jobsThisRun[job.id].processed = rule.acceptReject;
                break;
            }
        }
    }
    browser.storage.local.set({'jobsThisRun' : jobsThisRun});
    browser.storage.local.set({'allJobs' : allJobs});
}

//compares a rule to a job and returns true if it applies or false if it doesnt
function ruleApplies(rule, job){
    
    /* rule object has the following properties
    rule.acceptReject: 'accept' or 'reject'
    rule.startDate: date object
    rule.endDate: date object 
    rule.duration: 'all' or 'full' or 'am' or 'pm'
    rule.regEx: any string
    */

    //   message.name = job.querySelector('span.name').innerHTML;
    //   message.title = job.querySelector('span.title').innerHTML;
    //   message.dateStart = job.querySelector('span.itemDate').innerHTML;
    //   message.dateEnd = job.querySelector('span.multiEndDate').innerHTML;
    //   message.startTime = job.querySelector('span.startTime').innerHTML;
    //   message.endTime = job.querySelector('span.endTime').innerHTML;
    //   message.durationName = job.querySelector('span.durationName').innerHTML;
    //   message.locationName = job.querySelector('div.locationName').innerHTML;
    //   message.id = job.id;

    let regExArray = rule.regEx.split('\n');
    let fullText = `${job.name}:  ${job.title} \n ${job.dateStart} - ${job.dateEnd}  ${job.startTime} - ${job.endTime} ${job.durationName}  ${job.locationName}  :: ${job.id}`
    for(let regExString of regExArray){
        let regExBuild = regExString.split('/');
        try{
           let regEx = RegExp(regExBuild[1], regExBuild[2]);
            if(regEx.test(fullText)){
                return true;
            }
        }catch{
            console.log('sub-grab: probably a bad regex given:  ' + regExBuild);
        }
    }
    return false;
}

//refreshes the page, then sends a message to the page to get jobs
function mainTask(){
    getTargetTab().then((t) => browser.tabs.reload(t[0].id)).then(getTargetTab).then(jobRequestMessage);
    //getTargetTab().then(jobRequestMessage); //for testing without reload

    function jobRequestMessage(tabs){
        browser.tabs.sendMessage( tabs[0].id, {'type' : 'job-request'} );
    }
}

function getTargetTab(){
    return browser.tabs.query( { url:"*://absencesub.frontlineeducation.com/Substitute/Home" } ); 
}


//toggles whether the extension is currently doing its task
function toggleStartStop(action, options = null){
    if(action === 'start'){
        if(options == null){
            //some error!!
        }else{
            runningOptions = options;
            mainTaskIntervalId = window.setInterval(mainTask, options.time*1000);
        }
    }else if(action === 'stop'){
        //simply clear the interval
        if(mainTaskIntervalId != 0){
            window.clearInterval(mainTaskIntervalId);
        }
        //send a message that its stopped!!
        
    }


    /* //oldcode !!
    let runButton = document.getElementById('run-button');
    if(currentlyRunning){
        window.clearInterval(mainTaskIntervalId);
        runButton.innerHTML = "Start";
    }else{
        mainTaskIntervalId = window.setInterval(mainTask, document.getElementById('reload-time').value*1000);
        runButton.innerHTML = "Stop";

    }
    currentlyRunning = !currentlyRunning;
    */
}


function reportError(e){
    /*let errorDiv = document.querySelector('#error-display');
    errorDiv.classList.remove('hidden');
    errorDiv.innerHTML += '<br />\n' + e.message;
    console.error("sub-grab: " + e.message);*/
    console.log("sub-grab: " + e.message);
}