document.addEventListener('DOMContentLoaded', function () {
    // Make a request to the server to get messages for the logged-in user
    fetch('http://localhost:5000/getMessages')
      .then(response => response.json())
      .then(data => {
        const messageContainer = document.getElementById('message-container');
        data.forEach(message => {
            
          const listItem = document.createElement('li');
          listItem.className = 'message';
          listItem.innerHTML = `
            <p>${message.sender_email}:</p>
            <p>${message.message}</p>
            <p>${moment(message.sent_at).fromNow()}</p>
            <button class="chat-button" data-email="${message.sender_email}">Chat</button>
          
            <hr>
          `;
          messageContainer.appendChild(listItem);
          const chatButtons = document.querySelectorAll('.chat-button');
      chatButtons.forEach(button => {
        button.addEventListener('click', function() {
          const companionEmail = this.dataset.email;
          window.location.href = `/chat.html?receiverEmail=${companionEmail}`;
        });
      });
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  