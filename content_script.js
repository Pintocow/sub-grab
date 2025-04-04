(() => {
    alert('this script has run')
    //check if this is already running, if so, leave don't rerun
    if (window.sub_grabHasRun) {
      return;
    }
    window.sub_grabHasRun = true;
  
    //grab the jobs from the html and create a message object to send to the listener
    let jobsTable = document.getElementById("availableJobs");
    let jobs = jobsTable.querySelectorAll("tbody.job");
    let message = {type:"list"};
    for (let i =0; i < jobs.length; i++;){
        let job = jobs[i];

    }


    //click the button to accept or reject a job
  
    //message includes a command and an ID no id for fetch jobs or zero
    //listen for a message from code.js telling this what to do 
    browser.runtime.onMessage.addListener((message) => {
      switch(message.command){
        case "accept job":
            break;
        case "reject job":
            break;
        default:
            break;
      }
    });
})();
  