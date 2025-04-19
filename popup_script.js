//when the popup runs, load all the setting from storage and populate the settings form
//on start, send a message with all the settings and a start command
//responds to started and stopped commands, just by changing the button to start and stop. this is also stored in storage for when it opens.


console.log('popup_script.js started');
let isRunning = false;
fillValues();
document.getElementById('run-button').onclick = toggleStartStop;
document.getElementById('new-rule-button').onclick = () => newRule(null);
window.addEventListener('blur', saveValues);

//fill the options with the currently saved values from local storage
function fillValues(){
    browser.storage.local.get(null).then(handleStorage);
    function handleStorage(options){
        document.getElementById('reload-time').value = options.time ?? 5;
        //create and fill all the rules in the rules array!!
        for(rule in options.rules ?? {}){
            //nothing for now.
        }
        document.getElementById('run-button').innerHTML = options.running ? "Stop" : "Start";
        isRunning = !!options.running;

        for(rule of Object.values(options.rules)){
            newRule(rule);
        }

        let HTMLstring = '';
        for(job of Object.values(options.jobsThisRun)){
            //console.log(job);
            HTMLstring += `${job.name}:  ${job.title} 
                            \n ${job.dateStart} - ${job.dateEnd}  ${job.startTime} - ${job.endTime} 
                            ${job.durationName}  ${job.locationName}  :: ${job.id} <br />\n ${job.processed} <br /> <br />\n\n`;//!!
        }
        document.getElementById('run-log').innerHTML = "Run Log: <br />\n " + HTMLstring;
    }
}

//saves all the settings into storage
//returns the promise from the set
function saveValues(){
    let options = createOptionsObject();
    return browser.storage.local.set(options);
}

function createOptionsObject(){
    let options = {};
    options.time = document.getElementById('reload-time').value;
    options.running = isRunning;
    options.rules = [];
    //grab all the rules and make them into a rule array
    let rulesBody = document.getElementById('rules-tbody');
    //!! rulesbody get rows each row is a rule then each rule is 
    for(ruleRow of rulesBody.querySelectorAll('tr')){
        let rule = {
            acceptReject : ruleRow.querySelector("[name='accept-reject']").value, 
            startDate : ruleRow.querySelector("[name='start-date']").value,
            endDate : ruleRow.querySelector("[name='end-date']").value,
            duration : ruleRow.querySelector("[name='duration']").value,
            regEx : ruleRow.querySelector("[name='reg-ex']").value,
        };
        options.rules.push(rule);
    }
    return options;
}

function toggleStartStop(){
    let runButton = document.getElementById('run-button');
    let msg;
    switch(isRunning){
        case true:
            runButton.innerHTML = "Start";
            msg = { type : 'stop' };
            break;
        case false:
            runButton.innerHTML = "Stop";
            msg = { type : 'start' , options : createOptionsObject() };
            break;
    }
    isRunning = !isRunning;
    saveValues().then( () => {browser.runtime.sendMessage(msg);} );
}


/* rule object has the following properties
rule.acceptReject: 'accept' or 'reject'
rule.startDate: date object
rule.endDate: date object 
rule.duration: 'all' or 'full' or 'am' or 'pm'
rule.regEx: any string
*/

function newRule(rule = null){
    let rulesBody = document.getElementById('rules-tbody');
    let newRow = document.createElement('tr');
    rulesBody.appendChild(newRow);
    newRow.innerHTML = `<td><select name="accept-reject"> 
                            <option value="accept" selected>+</option>
                            <option value="reject">-</option>
                        </select></td>
                        <td><input name="start-date" type="date"><br />
                        <input name="end-date" type="date"></td>
                        <td><select name="duration">
                            <option value="all">All</option>
                            <option value="full" selected>Full</option>
                            <option value="am">AM</option>
                            <option value="pm">PM</option>
                        </select></td>
                        <td>
                            <textarea name="reg-ex">Rule matches in regular expression form separated by commas</textarea>
                        </td>
                        <td><button class="remove-button" type="button">Delete</button></td>`;
    newRow.querySelector('.remove-button').onclick = deleteRule;
    newRow.querySelector("[name='start-date']").valueAsDate = new Date();
    newRow.querySelector("[name='end-date']").valueAsDate = new Date();


    if(rule != null){
        newRow.querySelector("[name='accept-reject']").value = rule.acceptReject;
        newRow.querySelector("[name='start-date']").value = rule.startDate;
        newRow.querySelector("[name='end-date']").value = rule.endDate;
        newRow.querySelector("[name='duration']").value = rule.duration;
        newRow.querySelector("[name='reg-ex']").value = rule.regEx;
    }
}

function deleteRule(){
    this.parentElement.parentElement.remove();
}