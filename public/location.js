const apiKey = 'pk.75e5af0e3d7c0fe7c16a921f85e44c7a';
const locationInput = document.getElementById('locationInput');
const suggestionsDiv = document.getElementById('suggestions');

locationInput.addEventListener('input', debounce(searchLocations, 300));

function debounce(func, delay) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, arguments);
    }, delay);
  };
}

function searchLocations() {
  const input = locationInput.value;

  // Clear previous suggestions
  suggestionsDiv.innerHTML = '';

  if (input.length >= 3) {
    // Make a request to LocationIQ API
    const apiUrl = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${input}&format=json`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        data.forEach(location => {
          const suggestionContainer = document.createElement('div');
          suggestionContainer.classList.add('suggestion-container');

          const suggestion = document.createElement('div');
          suggestion.classList.add('suggestion');
          suggestion.textContent = location.display_name;
          suggestion.addEventListener('click', () => selectLocation(location));

          const seeCompanionsButton = document.createElement('button');
          seeCompanionsButton.textContent = 'See Companions';
          seeCompanionsButton.style.display = 'none'; // Initially hide the button
          seeCompanionsButton.addEventListener('click', () => seeCompanions(location));

          suggestionContainer.appendChild(suggestion);
          suggestionContainer.appendChild(seeCompanionsButton);

          suggestionsDiv.appendChild(suggestionContainer);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }
}

function selectLocation(location) {
  // Auto-fill the location input
  locationInput.value = location.display_name;

  // Display the "See Companions" button for the selected suggestion
  const selectedSuggestion = document.querySelector('.suggestion-container.selected');
  if (selectedSuggestion) {
    selectedSuggestion.querySelector('button').style.display = 'block';
  }

  // Highlight the selected suggestion
  const allSuggestions = document.querySelectorAll('.suggestion-container');
  allSuggestions.forEach(suggestion => suggestion.classList.remove('selected'));
  event.currentTarget.parentElement.classList.add('selected');
}



function seeCompanions(location) {
    // Execute logic to see companions
    console.log('See Companions button clicked for location:', location);
  
    // Send a request to save the selected destination and user email to the server
    const selectedDestination = location.display_name;
    const userEmail = localStorage.getItem('userEmail'); // Assuming you stored user email in sessionStorage
    console.log(userEmail);
  
    // Save the destination to the server using a GET request
    fetch(`http://localhost:5000/saveDestination?destination=${selectedDestination}&userEmail=${userEmail}`)
      .then(response => response.text())
      .then(data => {
        console.log(data);
  
        // Redirect to the page showing companions for the selected destination
        window.location.href = `/companions.html?destination=${selectedDestination}`;
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  
