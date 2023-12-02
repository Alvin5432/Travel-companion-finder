const socket = io();

const clientTotal = document.querySelector('#clients-total');
const messageContainer = document.querySelector('#message-container');      
const messageForm = document.querySelector('#message-form');
const nameInput = document.querySelector('#name-input');
const messageInput = document.querySelector('#message-input');

const messageTone = new Audio('./public_message-tone.mp3');

function getSenderEmail() {
    return localStorage.getItem('userEmail'); 
}

  function getReceiverEmailFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('receiverEmail');
  }

  window.onload = function () {
    let receiverEmail = getReceiverEmailFromURL();
  
    document.getElementById('name-input').value = getSenderEmail();
  };
  


messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    sendMessage();
})

socket.on('clients-total', (data)=>{
    console.log(data);
    clientTotal.innerHTML = `Total Clients : ${data}`;
})


/**
 * This is a simple function that emits the message event to ensure that another event is triggerd when the message is sent
 * @returns 
 */

function sendMessage() {
    if (messageInput.value === '') return;
  
    const senderEmail = getSenderEmail();
    const receiverEmail = getReceiverEmailFromURL(); 
    console.log(receiverEmail);
  
    const data = {
      senderEmail: senderEmail,
      receiverEmail: receiverEmail,
      message: messageInput.value,
      dateTime: new Date(),
    };
  

    sendMessageToServer(data);
    addMessageToUI(true, data);
    saveMessageToDatabase(data.senderEmail, data.receiverEmail, data.message);
    messageInput.value = '';
}

function sendMessageToServer(data) {
    socket.emit('message', data);
}

socket.on('chat-message', (data) =>{
    console.log(data);
    messageTone.play();
    addMessageToUI(false , data)
} );

function addMessageToUI(isOwnMessage , data){
    clearFeedback();
    const element = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
    <p class="message">
        ${data.message}
        <span>${data.senderEmail}:::${moment(data.dateTime).fromNow()}</span>
    </p>
    </li>`

 messageContainer.innerHTML += element;
 scrollToBottom();

}

function scrollToBottom (){
    messageContainer.scrollTo(0 , messageContainer.scrollHeight);
}

messageInput.addEventListener('focus', (e)=>{
    socket.emit('feedback', {
        feedback:`${nameInput.value} is typing...`
    })
});


messageInput.addEventListener('keyPress', (e)=>{
    socket.emit('feedback', {
        feedback:`${nameInput.value} is typing...`
    })
});


messageInput.addEventListener('blur', (e)=>{
    socket.emit('feedback', {
        feedback:``
    })
});

socket.on('feedback' , (data) => {
    clearFeedback();
    const element = `
    <li class="message-feedback">
                <p class="feedback" id="feedback">
                    ${data.feedback} is typing....
                </p>
            </li>


    `
    messageContainer.innerHTML += element;
})

function clearFeedback(){
    document.querySelectorAll('li.message-feedback').forEach(element =>{
        element.parentNode.removeChild(element);
    })
}

