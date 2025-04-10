//script works by reloading, running a content script at some interval
//the content script will then send a message to the listener here
//this will then determine if the job is wanted or to be rejected and send a message back
//the content script will then accept or reject



let currentlyRunning = false;
let mainTaskIntervalId = 0; 



//load settings and set the settings to save on change? or save button!! or start button? 

//set up the start stop button
document.getElementById('run-button').onclick = toggleStartStop;





//refreshes the page, then loads the content script on the page
//the content script will send a message to the listener 
//the listener will 
function mainTask(){
    browers.tab.reload().then(runContentScript);
}

function runContentScript(){
    //run the remote code on the content page
    browser.tabs.executeScript({ file: "/content_script.js" })
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

//toggles whether the extension is currently doing its task
function toggleStartStop(){
    let runButton = document.getElementById('run-button');
    if(currentlyRunning){
        //stop the script from running!!!!
        Window.clearInterval(mainTaskIntervalId);
        runButton.innerHTML = "Start";
    }else{
        //start the script up!!!!
        mainTaskIntervalId = Window.setInterval(mainTask, document.getElementById('reload-time').value*1000);
        runButton.innerHTML = "Stop";
    }
    currentlyRunning = !currentlyRunning;
}


function reportError(e){
    console.log(e);
}