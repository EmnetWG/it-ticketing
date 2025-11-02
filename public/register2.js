import axios from './ticket/js/axios.js';

const formDOM = document.querySelector('.form')
const nameInputDOM = document.querySelector('.name-input')
const passwordInputDOM = document.querySelector('.password-input')
const departmentInputDOM = document.querySelector('.department-input')
const positionInputDOM = document.querySelector('.position-input')
const emailInputDOM = document.querySelector('.email-input')

const formAlertDOM = document.querySelector('.form-alert')
//const resultDOM = document.querySelector('.result')
//const btnDOM = document.querySelector('#data')
//const successDOM = document.querySelector('.sucess')

//bring Department 
const bringDepartments = async () =>  {
    try
    {
        const token = localStorage.getItem('token')
  const {
    data:{departments}
  } = await axios.get(`/api/v1/department`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)
  //console.log(users)
  if (departments.length < 1) {
    departmentInputDOM.innerHTML = '<h5 class="empty-list">No departmentss in your list</h5>'
    //loadingDOM.style.visibility = 'hidden'
    return
  }

  const allDepartments = departments
  .map((department, index) => {
    
  const {name,  id:departmentID} = department
  
  return `
  <option data-id="${departmentID}">${name}</option>
  `
  })
  .join('')
  //categorySelectDOM.innerHTML = allCategorys
  //console.log({users})
  departmentInputDOM.insertAdjacentHTML('beforeend', allDepartments)
}
  catch(error){

    departmentInputDOM.innerHTML = error
        '<h5 class="empty-list">There was an error, please try later....</h5>'
  }

}

bringDepartments()

formDOM.addEventListener('submit', async (e) => {
  formAlertDOM.classList.remove('text-success')
  //successDOM.classList.remove('text-success')

  e.preventDefault()
  const name = nameInputDOM.value
  const password = passwordInputDOM.value
  const department = departmentInputDOM.dataset.id
  const position = positionInputDOM.value
  const email = emailInputDOM.value



  try {
    const { data } = await axios.post('/api/v1/auth/register', { name, department,
        position, email, password })

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = data.msg

    formAlertDOM.classList.add('text-success')
    nameInputDOM.value = ''
    passwordInputDOM.value = ''
    departmentInputDOM.value = ''
    positionInputDOM.value = ''
    emailInputDOM.value = ''

    localStorage.setItem('token', data.token)
    //resultDOM.innerHTML = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = 'Registration is successful'
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = error.response.data.msg
    localStorage.removeItem('token')
    //resultDOM.innerHTML = ''
    //successDOM.textContent = 'no token present'
    formAlertDOM.classList.remove('text-success')
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
  }, 2000)
})
