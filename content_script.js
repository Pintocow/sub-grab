(() => {
    //check if this is already running, if so, leave don't rerun
    if (window.sub_grabHasRun) {
      return;
    }
    window.sub_grabHasRun = true;
    
    alert('this script has run')

    //grab the jobs from the html and create a message object to send to the listener
    let jobsTable = document.getElementById("availableJobs");
    let jobs = jobsTable.querySelectorAll("tbody.job");
    let message = {type:"list"};
    for (let i =0; i < jobs.length; i++){
        let job = jobs[i];
        alert(job);
        message[i].dateStart = job.querySelector('itemDate').innerHTML;
        message[i].dateEnd = job.querySelector('multiEndDate').innerHTML;
        message[i].startTime = job.querySelector('startTime').innerHTML;
        message[i].endTime = job.querySelector('endTime').innerHTML;
        message[i].type = job.querySelector('durationName').innerHTML;
        message[i].locationName = job.querySelector('locationName').innerHTML;
        message[i].id = job.id;
        let msg = message[i];
        alert("thilskdfj" + message[i].type);
      alert(`${msg.dateStart} - ${msg.dateEnd}  ${msg.startTime} - ${msg.endTime} ${msg.type}  ${msg.locationName}  :: ${msg.id}`);
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
  