//script works by reloading, running a content script at some interval
//the content script will then send a message to the listener here
//this will then determine if the job is wanted or to be rejected and send a message back
//the content script will then accept or reject



let currentlyRunning = false;
let mainTaskIntervalId = 0; 

//load settings and set the settings to save on change? or save button!! or start button? 

//set up the start stop button
document.getElementById('run-button').onclick = toggleStartStop;

//run listener for messages
browser.runtime.onMessage.addListener(handleMessage);



//gets messages from the content script and handles them
function handleMessage(message){
    switch(message.type){
        case 'job':
            let testDiv = document.getElementById('message-test');
            testDiv.innerHTML += `${message.name}:  ${message.title} \n ${message.dateStart} - ${message.dateEnd}  ${message.startTime} - ${message.endTime} ${message.type}  ${message.locationName}  :: ${message.id} <br />\n`;
            break;
        default:
            reportError( {'message': 'misunderstood message type recieved'} );
            break;
    }
}


//refreshes the page, then sends a message to the page to get jobs
function mainTask(){
    function jobRequestMessage(tabs){
        browser.tabs.sendMessage( tabs[0].id, {'type' : 'job-request'} );
    }
    function getActiveTab(){
        return browser.tabs.query( { active : true, currentWindow: true } );
    }
    
    browser.tabs.reload().then(getActiveTab).then(jobRequestMessage);
}


function determineAcceptance(){
    //get html of the correct table throw error if not found
    //apply rejection criteria
    //apply acceptence criteria
    //log job when found !!just logging every job for testing!!

}

//fill the options with the currently saved values from a file
function fillValues(filename){

}

function setLocalStorage(id = 'none', value = null){
    //for each input in fieldset options store the value of it??!!
    theElement = document.getElementById(id);
    browser.storage.local.set(id, value ?? theElement.innerHTML);//or value?? not perfect!!
}

//toggles whether the extension is currently doing its task
function toggleStartStop(){
    let runButton = document.getElementById('run-button');
    if(currentlyRunning){
        window.clearInterval(mainTaskIntervalId);
        runButton.innerHTML = "Start";
    }else{
        mainTaskIntervalId = window.setInterval(mainTask, document.getElementById('reload-time').value*1000);
        runButton.innerHTML = "Stop";

    }
    currentlyRunning = !currentlyRunning;
}


function reportError(e){
    let errorDiv = document.querySelector('#error-display');
    errorDiv.classList.remove('hidden');
    errorDiv.innerHTML += '<br />\n' + e.message;
    console.error("sub-grab: " + e.message);
}