//running background script communicates with popup and with the content script 
console.log('background_script.js started');
let mainTaskIntervalId = 0;

//run listener for messages
browser.runtime.onMessage.addListener(handleMessage);

let allJobs = {};
browser.storage.local.get('allJobs').then((res) => allJobs = res ?? {});
browser.storage.local.set({'jobsThisRun': {}, 'running':false});
let jobsThisRun = {};
let runningOptions = {};



//gets messages from the content script and handles them
function handleMessage(message){
    switch(message.type){
        case 'jobs':
            setTimeout(handleJobs, 2000, message.list);
            //handleJobs(message.list);
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


        for(rule of runningOptions.rules){
            jobsThisRun[job.id].processed = 'ignore';
            if(ruleApplies(rule, job)){
                //must get active tab
                getTargetTab().then( (tabs) => browser.tabs.sendMessage( tabs[0].id,  { type : rule.acceptReject, id : job.id } )  );
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
    rule.startDate: input.value
    rule.endDate: input.value should be "yyyy-mm-dd" 
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

    //check duration match
    if(rule.duration != 'all'){
        if(!(RegExp(rule.duration, 'i').test(job.durationName)))
            return false;
    }

    
    try{
        //check for date match
        let split = job.dateStart.match(/\d+/g);
        let jobStart = new Date(+split[2], (+split[0] - 1), +split[1]);
        let ruleStart = new Date(Date.parse(rule.startDate));
        split = job.dateEnd.match(/\d+/g);
        let jobEnd = new Date(+split[2], (+split[0] - 1), +split[1]);
        let ruleEnd = new Date(Date.parse(rule.endDate));

        if(jobStart < ruleStart || jobEnd > ruleEnd){
            return false;
        }
    }catch(error){
        console.error(error);
    }


    //check pattern match
    let regExArray = rule.regEx.split('\n');
    let fullText = `${job.name}:  ${job.title} \n ${job.dateStart} - ${job.dateEnd}  ${job.startTime} - ${job.endTime} ${job.durationName}  ${job.locationName}  :: ${job.id}`
    for(let regExString of regExArray){
        let regExBuild = regExString.split('/');
        try{
           let regEx = RegExp(regExBuild[1] ?? regExBuild[0], regExBuild[2] ?? 'i');
            if(regEx.test(fullText)){
                return true;
            }
        }catch(error){
            console.log('sub-grab: probably a bad regex given:  ' + regExBuild);
            console.error(error);
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
}


function reportError(e){
    /*let errorDiv = document.querySelector('#error-display');
    errorDiv.classList.remove('hidden');
    errorDiv.innerHTML += '<br />\n' + e.message;
    console.error("sub-grab: " + e.message);*/
    console.log("sub-grab: " + e.message);
}