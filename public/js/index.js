"use strict"

var dateLastUpdate = 0;

function appendFeed(userName, timestamp, message)
{
  var table = document.getElementById("message-feed");
  if(table.rows.length < 1) {
    clearFeed();
  }
  table.insertRow(1).innerHTML=
    ('<tr>' + 
    '<td>' + userName + '</td>' +
    '<td>' + message + '</td>' +
    '</tr>');
}

function clearFeed()
{
  document.getElementById('message-feed').innerHTML = 
            '<tr class="dark-gray">' +
              '<td>Name</td>' +
              '<td>Message</td>' +
            '</tr>';
}

//gets new data from server and inserts it at the beginning
function updateFeed() {
  $.ajax({
    url: thisUrl()+'/api/get-message-by-date/?min='+dateLastUpdate+'&max=' + Date.now(),
    type: 'GET',
    success: result => result.forEach(msg => appendFeed(msg.username, msg.date, msg.message)),
    error: error => console.log(error),
  });
  dateLastUpdate = Date.now() - 1000;
}

//actually sends http request to server
function sendMessage(username, message) {
  var url = thisUrl()+'/api/new-message/?username='+encodeURI(username)+'&message='+encodeURI(message);
  $.ajax({
    url: url,
    type: 'GET',
    success: result => undefined,
    error: error => console.log(error),
  });
}

function attemptMessageSubmit() {
  var userNameTextBox = document.getElementById('user-name-textbox');
  var messageTextBox = document.getElementById('message-textbox');
  var username = userNameTextBox.value;
  var message = messageTextBox.value;
    if(isValidString(username) && isValidString(message)) {
    sendMessage(username, message);
    setTimeout(updateFeed, 250);
    messageTextBox.value = '';
  }
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
  sendMessage('welcome-agent', 'Welcome to this messaging server. Stay dank');
  updateFeed();
});


setInterval(updateFeed, 1000);
