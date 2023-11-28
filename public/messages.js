document.addEventListener('DOMContentLoaded', function () {
    const messagesList = document.getElementById('messages-list');

    // Fetch and display messages
    fetch('http://localhost:5000/getMessages')
        .then(response => response.json())
        .then(messages => {
            messages.forEach(message => {
                const isOwnMessage = message.senderEmail === nameInput.value;
                addMessageToUI(isOwnMessage, {
                    message: message.message,
                    dateTime: message.sent_at,
                    name: message.sender_email,
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
});
