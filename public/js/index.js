"use strict"

function appendFeed(userName, timestamp, message)
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
  request(thisUrl()+'/api/get-message-by-date/?min=0&max=' + Date.now(), 
    'GET',
    function(xhr){
      var messages = JSON.parse(xhr.responseText);
      clearFeed();
      //go backwards to maintain order
      for(var i = 0; i < messages.length; i++) {
        appendFeed(
          messages[i].username,
          messages[i].date,
          messages[i].message
        );
      }
    },
    function(xhr) 
    {
      console.log(xhr);
    }
  );
}

//actually sends http request to server
function sendMessage(username, message) {
  var url = thisUrl()+'/api/new-message/?username='+encodeURI(username)+'&message='+encodeURI(message);
  console.log('making request to: ' + url);
  request(url, 'GET',
    function(xhr){}, 
    function(xhr){});
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
  console.log('loaded');
  sendMessage('welcome-agent', 'Welcome to this messaging server. Stay dank');
  updateFeed();
});


setInterval(updateFeed, 1000);
