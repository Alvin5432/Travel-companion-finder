

document.getElementById('search').addEventListener('input', function() {
    let search = this.value;
  
    fetch(`http://localhost:5000/users?search=${search}`)
      .then(response => response.json())
      .then(data => {
        // data is an array of users
        // Display these users in the results div
        let resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        data.forEach(user => {
          let userDiv = document.createElement('div');
          userDiv.textContent = user.email;
  
          // Add a button for starting a chat session
          let chatButton = document.createElement('button');
          chatButton.textContent = 'Chat';
          chatButton.addEventListener('click', function() {
            window.location.href = `/chat.html?username=${user.email}`;
          });
  
          userDiv.appendChild(chatButton);
          resultsDiv.appendChild(userDiv);
        });
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });