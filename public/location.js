const apiKey = 'pk.75e5af0e3d7c0fe7c16a921f85e44c7a'; 
const locationInput = document.getElementById('locationInput');
const suggestionsDiv = document.getElementById('suggestions');

locationInput.addEventListener('input', debounce(searchLocations, 300));

function debounce(func, delay) {
    let timer;
    return function() {
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
                    const suggestion = document.createElement('div');
                    suggestion.classList.add('suggestion');
                    suggestion.textContent = location.display_name;
                    suggestion.addEventListener('click', () => selectLocation(location));
                    suggestionsDiv.appendChild(suggestion);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
    }
}

function selectLocation(location) {
    // Handle the selected location as needed (e.g., display it to the user, store in a variable, etc.)
    console.log('Selected Location:', location);
}
