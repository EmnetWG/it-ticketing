import axios from './axios.js';

//const axios = require('axios');

const formDOM = document.querySelector('.form')
const nameInputDOM = document.querySelector('.name-input')
const departmentInputDOM = document.querySelector('.department-name-input')
const addModal = document.querySelector('.departmentContent')
const updateModal = document.querySelector('.modal')
//const updateModal = document.querySelector('.categoryContentUpdate')
const overlayDOM = document.querySelector('.overlay')
const closeDOM = document.querySelector(".btn-close")
const btnAddDOM = document.querySelector('.addDepartment')
const formAlertDOM = document.querySelector('.form-alert')
const formAlertUpdate = document.querySelector('.form-alert-update')
const departmentDOM = document.querySelector('.departmentList')
const btnUpdateDOM = document.querySelector('.btnUpdate')
//const overlayDOM = document.querySelector('.overlay')

//npm install -g http-server
// http-server
//const resultDOM = document.querySelector('.result')
//const btnDOM = document.querySelector('#data')
const successDOM = document.querySelector('.success')
const logoutDOM = document.querySelector('.logout')
logoutDOM.addEventListener('click', async (e) => {
  e.preventDefault();
  const utils = await import('/logout.js');
  utils.removeToken();

  // Redirect without saving history
  location.replace('/login.html'); // or whatever your login page is
});

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if(!token) {
    location.replace('/login.html')
  }
})

formDOM.addEventListener('submit', async (e) => {
  formAlertDOM.classList.remove('text-success')
  //successDOM.classList.remove('text-success')

  e.preventDefault()
  const name = nameInputDOM.value
  



  try {
    const token = localStorage.getItem('token')
    if (!token) {
      location.replace('/login.html'); // force back to login
      return;
    }

    const { data } = await axios.post('/api/v1/department', { name } ,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      }})

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = data.msg || 'Registration is successful'

    formAlertDOM.classList.add('text-success')
    nameInputDOM.value = ''
    

    //resultDOM.innerHTML = ''
   // formAlertDOM.style.display = 'block'
   // formAlertDOM.textContent = 'Registration is successful'
   // formAlertDOM.classList.add('text-success')
   await showDepartments ()

  } catch (error) {
    formAlertDOM.style.display = 'block'
   // formAlertDOM.textContent = error.response.data.msg
   const errorMessage = error.response?.data?.msg || 'An error occurred. Please try again.';
    formAlertDOM.textContent = errorMessage;
    //resultDOM.innerHTML = ''
    //successDOM.textContent = 'no token present'
    formAlertDOM.classList.remove('text-success')
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
  }, 3000)
})


btnAddDOM.addEventListener('click', async () => {
  addModal.style.display='block';
})
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  addModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == addModal) {
    addModal.style.display = "none";
  }
}
const showDepartments = async () => {

    try
    {
        const token = localStorage.getItem('token')

        if (!token) {
          location.replace('/login.html'); // force back to login
          return ;
        }

const {
    data:{departments}
} = await axios.get(`/api/v1/department`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)

if (!departments || departments.length < 1) {
    departmentDOM.innerHTML = '<h5 class="empty-list">No Department in your list</h5>'
    //loadingDOM.style.visibility = 'hidden'
    return
  }
//console.log({users})
const allDepartments = departments
.map((department) => {
const {name,  id:departmentID} = department
return `<tr>
<td>${name}</td>

<td><div class="user-links">

<!-- edit link -->
<button data-id="${departmentID}"  data-toggle="modal" data-target="#exampleModal" class="edit-btn">
<i class="fas fa-edit"></i>
</button>
<!-- delete btn --->
<button type="button" class="delete-btn" data-id="${departmentID}">
<i class="fas fa-trash"></i>
</button>
</div>
</td>

</tr>`
})
.join('')
departmentDOM.innerHTML = allDepartments

const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const departmentID = event.currentTarget.dataset.id;
        const confirmed = window.confirm('Are you sure you want to delete this department?');
        if (confirmed) {

          try {
            await axios.delete(`/api/v1/department/${departmentID}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // Refresh the ticket list after deletion
            //test@12
           await showDepartments()
          } catch (error) {
            console.error('Error deleting department:', error);

let errorMsg = 'There was an error deleting the department. Please try again later.';

if (error.response && error.response.data && error.response.data.msg) {
 errorMsg = error.response.data.msg; // use server error message
}

alert(errorMsg)

           // departmentDOM.innerHTML = '<h5 class="empty-list">There was an error deleting the department, please try later....</h5>';
          }
        }


        })
      })
    } catch(error) {
        
        departmentDOM.innerHTML = 
        '<h5 class="empty-list">There was an error, please try later....</h5>'
    }
}

showDepartments ()

/*
//delete department
departmentDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    //loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {

      const token = localStorage.getItem('token')
      await axios.delete(`/api/v1/department/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }},)
      await showDepartments()
    } catch (error) {
      console.log(error)
    }
  }
 // loadingDOM.style.visibility = 'hidden'
})

*/
//Bring data for update
departmentDOM.addEventListener('click', async (e) => {
    const el = e.target

    
    if (el.parentElement.classList.contains('edit-btn')) {
      //loadingDOM.style.visibility = 'visible'
      const id = el.parentElement.dataset.id

//editBtnDOMS.forEach((button) => {
//button.addEventListener('click', async (e) => {
  //  
    overlayDOM.style.display = "block"
    updateModal.style.display = "block"
    //modalDOM.style.display = 'block'
  //  const id = e.target.dataset.id
    try
    {
        
        const token = localStorage.getItem('token')

        if (!token) {
      location.replace('/login.html'); // force back to login
      return;
    }
const {
    data:department
} = await axios.get(`/api/v1/department/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }})
console.log(department)
    const {name,  id:departmentID} = department.department
    console.log(name)
    departmentInputDOM.value = name
    
    btnUpdateDOM.dataset.id = departmentID

} catch(error) {
    console.log(error)
    alert("There was an error. Please try again later")
}
}
})


closeDOM.addEventListener('click', async ( ) => {
    overlayDOM.style.display = "none"
})

/* Update department */
btnUpdateDOM.addEventListener('click', async (e) => {
    e.preventDefault()
    
    const id = btnUpdateDOM.dataset.id
      //loadingDOM.style.visibility = 'visible'
      
    try
    
   {
        const token = localStorage.getItem('token')

        if (!token) {
      location.replace('/login.html'); // force back to login
      return;
    }
const name = departmentInputDOM.value

console.log(name)
const 
    data
 = await axios.patch(`/api/v1/department/${id}`, {name}, {
    headers: {
      Authorization: `Bearer ${token}`,
    }}, 
    
)
formAlertUpdate.style.display = 'block'
formAlertUpdate.textContent = `success, edited department`
formAlertUpdate.classList.add('text-success')
await showDepartments ()

    } catch (error) {
        formAlertUpdate.style.display = 'block'
       // formAlertUpdate.innerHTML = `error, please try again`
       formAlertUpdate.innerHTML = `Error: ${error.response ? error.response.data.msg : 'Please try again later'}`;
        //formAlertDOM.innerHTML = error
    }

    setTimeout(() => {
        formAlertUpdate.style.display = 'none'
        formAlertUpdate.classList.remove('text-success')
      
      }, 3000)
})
//})
