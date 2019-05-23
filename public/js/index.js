"use strict"

function addMessage(userName, timestamp, message)
{
  var table = document.getElementById("message-feed");
  if(table.rows.length < 1) {
    clearFeed();
  }
  table.insertRow(table.rows.length).innerHTML=
    ('<tr>' + 
    '<td>' + userName + '</td>' +
    '<td>' + getDateString(timestamp) + '</td>' + 
    '<td>' + message + '</td>' +
    '</tr>');
}

function clearFeed()
{
  document.getElementById('message-feed').innerHTML = 
            '<tr class="dark-gray">' +
              '<td>Name</td>' +
              '<td>Time</td>' +
              '<td>Message</td>' +
            '</tr>';
}

//gets new data from server and inserts it at the beginning
function updateFeed() {
  request(thisUrl()+'/encounter/?count=100', 
    function(xhr){
      var encounters = JSON.parse(xhr.responseText);
      clearFeed();
      //go backwards to maintain order
      for(var i = encounters.length-1; i >= 0; i--) {
        addSignInOutFeedEntry(encounters[i].type == 'in', 
          encounters[i].user.name, 
          encounters[i].user.id, 
          encounters[i].location.name, 
          encounters[i].time);
      }
    },
    function(xhr) 
    {
      console.log(xhr);
    }
  );
}

//actually sends http request to server
function newEncounter(userId, locationId, type) {
  var url = thisUrl()+'/encounter/new/?userId='+userId+'&locationId='+locationId+'&type='+type;
  console.log('making request to: ' + url);
  request(url,
    function(xhr){}, 
    function(xhr){});
}


//submits encounter to server and then refreshes the screen
function sendEncounter(id) {
  var checkBox = document.getElementById('sign-in-or-out-checkbox');
  newEncounter(id, 1, checkBox.checked ? 'out' : 'in');
  setTimeout(function() {
    updateFeed();
  }, 50);
}

function submitEncounter() {
  var userNameTextBox = document.getElementById('user-name-textbox');
  var messageTextBox = document.getElementById('message-textbox');
  addMessage(userNameTextBox.value, new Date(), messageTextBox.value);
  messageTextBox.value = '';
  //sendEncounter(textBox.value);
}


function grayOutOrangeButton(element) {
  element.classList().remove("deep-orange");
  element.classList().add("gray");
}

function orangeGrayButton(element) {
  element.classList().remove("gray");
  element.classList().add("deep-orange");
}

$(document).ready(function() {
  console.log('loaded');
  addMessage('welcome-agent', new Date(), 'Welcome to this messaging server. Stay dank');
});
