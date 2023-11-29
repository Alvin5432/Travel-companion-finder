document.addEventListener('DOMContentLoaded', function () {
    // Make a request to the server to get companions
    fetch('http://localhost:5000/searchCompanions')
      .then(response => response.json())
      .then(data => {
        // Display the companions
        const companionsList = document.getElementById('companions-list');
        data.forEach(companion => {
          const listItem = document.createElement('div');
          listItem.innerHTML = `
            <p>Email: ${companion.email}</p>
            <p>Interest: ${companion.interest}</p>
            <p>Destination: ${companion.chosen_destination}</p>
            <button class="chat-button" data-email="${companion.email}">Chat</button>
            <hr>
          `;
          
          companionsList.appendChild(listItem);
        });
  
        // Add event listeners for the chat buttons
        const chatButtons = document.querySelectorAll('.chat-button');
        chatButtons.forEach(button => {
          button.addEventListener('click', function() {
            const companionEmail = this.dataset.email;
            window.location.href = `/chat.html?receiverEmail=${companionEmail}`;
          });
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  