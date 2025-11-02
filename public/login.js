import axios from './ticket/js/axios.js';

const formDOM = document.querySelector('.form')

const passwordInputDOM = document.querySelector('.password-input')

const emailInputDOM = document.querySelector('.email-input')

const formAlertDOM = document.querySelector('.form-alert')
//const resultDOM = document.querySelector('.result')
//const btnDOM = document.querySelector('#data')
//const successDOM = document.querySelector('.sucess')


const peek = document.getElementById('peek');

peek.addEventListener('mousedown', () => passwordInputDOM.type = 'text');
peek.addEventListener('mouseup',  () => passwordInputDOM.type = 'password');
peek.addEventListener('mouseleave', () => passwordInputDOM.type = 'password');

// keyboard accessible: space/enter press
peek.addEventListener('keydown', (e) => {
  if (e.key === ' ' || e.key === 'Enter') passwordInputDOM.type = 'text';
});
peek.addEventListener('keyup', (e) => {
  if (e.key === ' ' || e.key === 'Enter') passwordInputDOM.type = 'password';
});

formDOM.addEventListener('submit', async (e) => {
  formAlertDOM.classList.remove('text-success')
  //successDOM.classList.remove('text-success')

  e.preventDefault()
  
  const password = passwordInputDOM.value
  
  const email = emailInputDOM.value
///////////////////////


////////////////////////////
  try {
    const { data } = await axios.post('/api/v1/auth/login', {  email, password })
 console.log(data)
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = data.msg

    formAlertDOM.classList.add('text-success')
    
    passwordInputDOM.value = ''
   
    emailInputDOM.value = ''

    localStorage.setItem('token', data.token)
    //resultDOM.innerHTML = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = 'Logged in'
    formAlertDOM.classList.add('text-success')
   //window.location.href = "/users/users.html"
    //console.log('token')
    if(data.user.role=="supervisor") {
      window.open("ticket/allTickets.html", '_self')
    }

    if(data.user.role=="manager") {
      window.open("ticket/department.html", '_self')
    }

    if(data.user.role=="IT staff") {
      window.open("ticket/staffTicket.html", '_self')
    }

    if(data.user.role=="user") {
      window.open("ticket/userTicket.html", '_self')
    }
    //
  } catch (error) {
	  
	  let msg = 'Login failed. Please try again.';

 if (error.response && error.response.status === 429) {
  msg = 'Too many login attempts. Please wait a minute and try again.';
 } else if (error.response?.data?.msg) {
  msg = error.response.data.msg;
 }
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = msg
    localStorage.removeItem('token')
    //resultDOM.innerHTML = ''
    //successDOM.textContent = 'no token present'
    formAlertDOM.classList.remove('text-success')
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
  }, 3000)
})
