import axios from '/ticket/js/axios.js';

const formDOM = document.querySelector('.form')

const passwordInputDOM = document.querySelector('.password-input')

const oldPasswordInputDOM = document.querySelector('.old-password-input')

const formAlertDOM = document.querySelector('.form-alert')
//const resultDOM = document.querySelector('.result')
//const btnDOM = document.querySelector('#data')
//const successDOM = document.querySelector('.sucess')

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if(!token) {
    location.replace('/login.html')
  }
})

formDOM.addEventListener('submit', async (e) => {
  e.preventDefault()
  formAlertDOM.classList.remove('text-success')
  //successDOM.classList.remove('text-success')
  try {
  const token = localStorage.getItem('token')

  if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
  const {
      data:{user},
  }= await axios.get(`/api/v1/users/showMe`, 
  {
      headers: {
        Authorization: `Bearer ${token}`,
      }},)
     const userID = user.userId
     console.log(userID)

 
  
  const newPassword = passwordInputDOM.value
  
  const oldPassword = oldPasswordInputDOM.value


// If passwords are empty, show an error and stop the process
        if (!oldPassword || !newPassword) {
            formAlertDOM.style.display = 'block';
            formAlertDOM.textContent = 'Please enter both old and new passwords.';
            formAlertDOM.classList.remove('text-success');
            return;
        }
 
    const { data:userPassword } = await axios.patch(`/api/v1/users/updatePassword`, {  oldPassword, newPassword },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }},
    )
 //console.log(data)
    //formAlertDOM.style.display = 'block'
   // formAlertDOM.textContent = error.msg

   // formAlertDOM.classList.add('text-success')
    
    //passwordInputDOM.value = ''
   
    //oldPasswordInputDOM.value = ''

    //localStorage.setItem('token', data.token)
    //resultDOM.innerHTML = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = 'Password updated'
    formAlertDOM.classList.add('text-success')

   // Reset the input fields for security reasons
        passwordInputDOM.value = '';
        oldPasswordInputDOM.value = '';
   //window.location.href = "/users/users.html"
    //console.log('token')
    // Log the user out and redirect to login page after successful password update
        localStorage.removeItem('token'); // Remove the old token
        setTimeout(() => {
            location.replace('/login.html'); // Redirect to login page after 2 seconds
        }, 2000);
    //
  } catch (error) {
    //formAlertDOM.style.display = 'block'
  //  formAlertDOM.textContent = error.response.data.msg
  // Error handling: Check if the error has a response object, then handle the error message
        if (error.response && error.response.data && error.response.data.msg) {
            formAlertDOM.textContent = error.response.data.msg;
        } else {
            // If no response or message, show a generic error
            formAlertDOM.textContent = 'An error occurred. Please try again later.';
        }
    //localStorage.removeItem('token')
    //resultDOM.innerHTML = ''
    //successDOM.textContent = 'no token present'
    formAlertDOM.style.display = 'block';
    formAlertDOM.classList.remove('text-success')
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
  }, 3000)
})
