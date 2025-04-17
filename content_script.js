(() => {
    //check if this is already running, if so, leave don't rerun
    if (window.sub_grabHasRun) {
      return;
    }
    window.sub_grabHasRun = true;
    
    browser.runtime.onMessage.addListener(handleMessage);
    
    function handleMessage(message){
      switch(message.type){
        case "job-request":
          //!!should use process jobs. make a fake job for now
          //processJobs();
          browser.runtime.sendMessage( {'type':'job', 'name':'Mrs.teacher', } );
          break;
        case "accept":
          break;
        case "reject":
          break;
        default:
          //!!add some kind of error
          break;
      }
    }


    function processJobs(){
      let jobsTable = document.getElementById("availableJobs");
      let jobs = jobsTable.querySelectorAll("tbody.job");
      for (let job of jobs){
        let msg = generateMessage(job);
        browser.runtime.sendMessage(msg);
      }
    }

    function generateMessage(job){
      //grab the jobs from the html and create a message object to send to the listener
      let message = {type:"job"};
      message.name = job.querySelector('span.name').innerHTML;
      message.title = job.querySelector('span.title').innerHTML;
      message.dateStart = job.querySelector('span.itemDate').innerHTML;
      message.dateEnd = job.querySelector('span.multiEndDate').innerHTML;
      message.startTime = job.querySelector('span.startTime').innerHTML;
      message.endTime = job.querySelector('span.endTime').innerHTML;
      message.type = job.querySelector('span.durationName').innerHTML;
      message.locationName = job.querySelector('div.locationName').innerHTML;
      message.id = job.id;

      //let msg = message;
      //alert(`${msg.name}:  ${msg.title} \n ${msg.dateStart} - ${msg.dateEnd}  ${msg.startTime} - ${msg.endTime} ${msg.type}  ${msg.locationName}  :: ${msg.id}`);
      return message;
    }

})();
  