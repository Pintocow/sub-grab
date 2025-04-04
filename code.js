
function mainTask(){
    browers.tab.reload().then(determineAcceptance);
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




//run the remote code on the content page
browser.tabs.executeScript({ file: "/content_script.js" })

//load settings and set the settings to save on change? or save button!! or start button? 

//set up the start stop button

