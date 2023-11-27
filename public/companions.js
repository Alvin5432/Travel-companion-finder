// companions.js

document.addEventListener('DOMContentLoaded', function () {
    // Get parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const interest = urlParams.get('interest');
    const destination = urlParams.get('destination');
  
    // Display the interest and destination (You can modify this as needed)
    document.getElementById('interest').textContent = `Interest: ${interest}`;
    document.getElementById('destination').textContent = `Destination: ${destination}`;
  
    // Send a request to the server to get companions based on the interest and destination
    fetch(`http://localhost:5000/searchCompanions?interest=${interest}&destination=${destination}`)
      .then(response => response.json())
      .then(data => {
        console.log('Companions:', data);
        // Display the companions (You can modify this as needed)
        const companionsList = document.getElementById('companionsList');
        data.forEach(companion => {
          const listItem = document.createElement('li');
          listItem.textContent = companion.email;
          companionsList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
  