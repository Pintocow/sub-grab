(() => {
    //check if this is already running, if so, leave don't rerun
    if (window.sub_grabHasRun) {
      return;
    }
    window.sub_grabHasRun = true;
    
    //!!alert('this script has run')

    //grab the jobs from the html and create a message object to send to the listener
    let jobsTable = document.getElementById("availableJobs");
    let jobs = jobsTable.querySelectorAll("tbody.job");
    for (let job of jobs){
        let message = {type:"list"};
        message.name = job.querySelector('span.name').innerHTML;
        message.title = job.querySelector('span.title').innerHTML;
        message.dateStart = job.querySelector('span.itemDate').innerHTML;
        message.dateEnd = job.querySelector('span.multiEndDate').innerHTML;
        message.startTime = job.querySelector('span.startTime').innerHTML;
        message.endTime = job.querySelector('span.endTime').innerHTML;
        message.type = job.querySelector('span.durationName').innerHTML;
        message.locationName = job.querySelector('div.locationName').innerHTML;
        message.id = job.id;

        let msg = message;
        alert(`${msg.name}:  ${msg.title} \n ${msg.dateStart} - ${msg.dateEnd}  ${msg.startTime} - ${msg.endTime} ${msg.type}  ${msg.locationName}  :: ${msg.id}`);
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
  