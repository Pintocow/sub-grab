// content script reloads every time the page is loaded. immediately sends a message for all avaialable jobs
// and runs a listener for other messages. the only messages it needs to respond to are accept and reject requests
// for jobs. 


(() => {
    //check if this is already running, if so, leave don't rerun
    /*if (window.sub_grabHasRun) {
      return;
    }
    window.sub_grabHasRun = true;*/
    
    console.log('content_script.js started');
    
    browser.runtime.onMessage.addListener(handleMessage);
    
    function handleMessage(message){
      switch(message.type){
        case "job-request":
          processJobs();
          break;
        case "accept":
          console.log(`accept on ${message.id}`);
          document.getElementById(message.id).querySelector("a.acceptButton").click();
          //if the button has a dialog it needs to accept again 
          setTimeout(pressDialogAccept, 1000);
          break;
        case "reject":
          console.log(`reject on ${message.id}`);
          document.getElementById(message.id).querySelector("a.rejectButton").click();
          break;
        default:
          console.log('unknown message in content script ')
          //!!add some kind of error
          break;
      }
      
      function pressDialogAccept(){
        let buttonHolder = document.getElementsByClassName("ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only");
        for(let clickButton of buttonHolder){
          if(clickButton.innerHTML == `<span class="ui-button-text">Accept</span>`)
            clickButton.click();
        }
      }
    }


    function processJobs(){
      let jobsTable = document.getElementById("availableJobs");
      let jobs = jobsTable.querySelectorAll("tbody.job");
      let msg = {type: 'jobs', list: []};
      for (let job of jobs){
        msg.list.push(generateMessage(job));
      }

      if(jobs.length > 0){
        browser.runtime.sendMessage(msg);
      }
    }

    function generateMessage(job){
      //grab the jobs from the html and create a message object to send to the listener
      let message = {};
      message.name = job.querySelector('span.name').innerHTML;
      message.title = job.querySelector('span.title').innerHTML;
      message.dateStart = job.querySelector('span.itemDate').innerHTML;
      message.dateEnd = job.querySelector('span.multiEndDate').innerHTML;
      message.startTime = job.querySelector('span.startTime').innerHTML;
      message.endTime = job.querySelector('span.endTime').innerHTML;
      message.durationName = job.querySelector('span.durationName').innerHTML;
      message.locationName = job.querySelector('div.locationName').innerHTML;
      message.id = job.id;


      let msg = message;
      console.log(`${msg.name}:  ${msg.title} \n ${msg.dateStart} - ${msg.dateEnd}  ${msg.startTime} - ${msg.endTime} ${msg.durationName}  ${msg.locationName}  :: ${msg.id}`);
      return message;
    }

})();
  