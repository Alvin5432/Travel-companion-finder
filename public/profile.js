document.addEventListener('DOMContentLoaded', function () {
    const userProfileDiv = document.getElementById('user-profile');
    const updateProfileForm = document.getElementById('update-profile-form');

    // Fetch user profile information when the page loads
    fetch('/getUserProfile')
        .then(response => response.json())
        .then(userProfile => {
            // Display user profile information in the designated div
            userProfileDiv.innerHTML = `
                <img src="${userProfile.photo || 'download.png'}" alt="Profile Photo" style="max-width: 200px; max-height: 200px;">
                <p>Email: ${userProfile.email}</p>
                <p>Interest: ${userProfile.interest || 'Not specified'}</p>
                <p>Chosen Destination: ${userProfile.chosen_destination || 'Not specified'}</p>
            `;

            // Populate form fields with current user profile data
            document.getElementById('interest').value = userProfile.interest || '';
            document.getElementById('chosen-destination').value = userProfile.chosen_destination || '';
        })
        .catch(error => console.error('Error fetching user profile:', error));

    // Handle form submission
    updateProfileForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Gather updated profile information from the form
        const interest = document.getElementById('interest').value;
        const chosen_destination = document.getElementById('chosen-destination').value;

        // Send a GET request to update the user's profile
        fetch(`/updateUserProfile?interest=${interest}&chosen_destination=${chosen_destination}`)
            .then(response => {
                if (response.ok) {
                    // If the update is successful, re-fetch and display the updated profile
                    return fetch('/getUserProfile');
                } else {
                    alert('Failed to update profile. Please try again.');
                }
            })
            .then(response => response.json())
            .then(updatedProfile => {
                // Display the updated profile information
                userProfileDiv.innerHTML = `
                    <img src="${updatedProfile.photo || 'download.png'}" alt="Profile Photo" style="max-width: 200px; max-height: 200px;">
                    <p>Email: ${updatedProfile.email}</p>
                    <p>Interest: ${updatedProfile.interest || 'Not specified'}</p>
                    <p>Chosen Destination: ${updatedProfile.chosen_destination || 'Not specified'}</p>
                `;
            })
            .catch(error => console.error('Error updating user profile:', error));
    });
});
