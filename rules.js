function newRule(){
    let rulesBody = document.getElementById('rules-tbody');
    let newRow = document.createElement('tr');
    rulesBody.appendChild(newRow);
    newRow.innerHTML = `<tr>
                        <td><select name="accept-reject"> 
                            <option value="accept" selected>+</option>
                            <option value="reject">-</option>
                        </select></td>
                        <td><input name="start-date" type="date"><br />
                        <input name="end-date" type="date"></td>
                        <td><select name="type">
                            <option value="all">All</option>
                            <option value="full" selected>Full</option>
                            <option value="am">AM</option>
                            <option value="pm">PM</option>
                        </select></td>
                        <td>
                            <textarea name="reg-ex">Rule matches in regular expression form separated by commas</textarea>
                        </td>
                        <td><button class="remove-button" type="button">Delete</button></td>
                    </tr>`;
    newRow.querySelector('.remove-button').onclick = deleteRule;
}

function deleteRule(){
    this.parentElement.parentElement.remove();
}

document.getElementById('new-rule-button').onclick = newRule;



