const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const signUp = document.querySelector('.sup');
const signIn = document.querySelector('.sin')

signUpButton.addEventListener('click', () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
  container.classList.remove("right-panel-active");
});


signUp.addEventListener('click', () => {
  console.log('the signup button was clicked');
  let password = document.querySelector('.password');
  let email = document.querySelector('.email');
  console.log(email.value);
  console.log(password.value);
  fetch(`http://localhost:5000/insert?email=${email.value}&password=${password.value}`)
    .then(response => response.text())
    .then(data => {
      if(data === 'User inserted successfully!'){
        window.location.href = "/intrests.html";
      } else {
        console.log('User already exists!');
       
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});


signIn.addEventListener('click', () => {
  let emailField = document.querySelector('.signIn-email');
  let passwordField = document.querySelector('.signIn-password');

  // Trim the inputs to remove leading/trailing white spaces
  let email = emailField.value;
  let password = passwordField.value;

  // Check if fields are not empty
  if (email === "" || password === "") {
    alert("Please fill in all fields");

  }

  fetch(`http://localhost:5000/login?email=${email}&password=${password}`)
    .then(response => {
      if (!response.ok) {
        alert('please enter the right credentials');
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(data => {
      if (data === 'User found!') {
        console.log('Login successful!');
        window.location.href = '/index.html';
        alert('we will get you looged in soon');
        // Store the user's email in localStorage
        localStorage.setItem('userEmail', email);
      } else {
        console.log('Login failed!');
        alert('Wrong credentials! Please consider signing up.');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
});




let forms = document.querySelectorAll('form');

forms.forEach(form => {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });
});

