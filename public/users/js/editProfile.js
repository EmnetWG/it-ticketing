import axios from '/ticket/js/axios.js';


const formDOM = document.querySelector('.form')
const nameInputDOM = document.querySelector('.name-input')
const roleDOM = document.querySelector('#role')
const departmentInputDOM = document.querySelector('.department-input')
const positionInputDOM = document.querySelector('.position-input')
const emailInputDOM = document.querySelector('.email-input')
const btnUpdateDOM = document.querySelector('.btnUpdate')
const formAlertDOM = document.querySelector('.form-alert')

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if(!token) {
    location.replace('/login.html')
  }
})

//Bring Department
const bringDepartments = async () =>  {
  try
  {
      const token = localStorage.getItem('token')

      if (!token) {
      location.replace('/login.html'); // force back to login
      return;
 }
const {
  data:{departments}
} = await axios.get(`/api/v1/department`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
//console.log(users)
if (!departments || departments.length < 1) {

  departmentInputDOM.innerHTML = '<option disabled>No departments available</option>';
  //departmentInputDOM.innerHTML = '<h5 class="empty-list">No departments in your list</h5>'
 // departmentInputDOM.innerHTML = '<option disabled>No departments available</option>';
  //loadingDOM.style.visibility = 'hidden'
  return
}
//console.log({users})
//const userFilter = users.filter(item => item.role==='IT staff')
//console.log(userFilter)
const allDepartments = departments
.map((department, index) => {
  
const {name,  id:departmentID} = department

return `
<option value="${departmentID}" data-id="${departmentID}">${name}</option>
`
})
.join('')
//categorySelectDOM.innerHTML = allCategorys
//console.log({users})
// departmentInputDOM.insertAdjacentHTML('beforeend', allDepartments)
departmentInputDOM.innerHTML = allDepartments;
/* new assignedToInputUpdateDOM.selectedIndex="0"
//categorySelectDOM.querySelectorAll('option')[0].selected = 'selected'
/**categorySelectDOM.children[0].setAttribute('selected', true)
for (var i = 0; i < categorySelectDOM.length; i++) {
  //if (categorySelectUpdateDOM[i].dataset.id === category) {
    categorySelectDOM[i].selected = false;
  
} 


*/
} catch(error) {
      
   // departmentInputDOM.innerHTML = 
   //   '<h5 class="empty-list">There was an error, please try later....</h5>'
      departmentInputDOM.innerHTML = '<option disabled>Error loading departments. Please try again later.</option>';
  }
}

departmentInputDOM.addEventListener('change', async (event) => {
  const department = event.target.options[event.target.selectedIndex].dataset.id
  //return categoryid
  
  console.log(department)
})

const bringUserData = async ( ) => {
    try {
        //modal.style.display = "block";
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
       // const{name, userId, role} = user
      // if(userID) {
      //  window.open(`/editProfile.html/${userID}`, "_self");
      // }

     // console.log(user)
  //console.log(userID)

  if(departmentInputDOM.length===1){
   await bringDepartments ()
}
      const {data:users} = await axios.get(`/api/v1/users/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }},)
        
        const {name, department, position, role, email, id:userId, listDepartment} = users.user
        nameInputDOM.value = name
       // departmentInputDOM.value = listDepartment.departmentName
        departmentInputDOM.value=listDepartment.departmentid;
       //departmentInputDOM.dataset.id = listDepartment.departmentid
        positionInputDOM.value = position
        emailInputDOM.value = email
        for (var i = 0; i < departmentInputDOM.length; i++) {
          if (departmentInputDOM[i].dataset.id === listDepartment.departmentid) {
            departmentInputDOM[i].selected = true;
          }
       }
       // roleDOM.value = role
        btnUpdateDOM.dataset.id = userId

    }

 catch (error) {
    console.log(error)
    alert('Error loading user data. Please try again later.');
}
}

bringUserData ()

formDOM.addEventListener('submit', async (e) => {
    formAlertDOM.classList.remove('text-success')
    //successDOM.classList.remove('text-success')
     const id=btnUpdateDOM.dataset.id
    e.preventDefault()
    const name = nameInputDOM.value
    //const password = passwordInputDOM.value
    //const department = departmentInputDOM.value
    const department = departmentInputDOM.options[departmentInputDOM.selectedIndex].dataset.id
    
    console.log(departmentInputDOM.options[departmentInputDOM.selectedIndex].dataset.id)
    const position = positionInputDOM.value
    const email = emailInputDOM.value
    
  
  
    try {
      const token = localStorage.getItem('token')

if (!token) {
      location.replace('/login.html'); // force back to login
      return;
  }

      
      const { data } = await axios.patch(`/api/v1/users/${id}`, { name, department,
          position, email},  {
            headers: {
              Authorization: `Bearer ${token}`,
            }},)
  //console.log(data)
     // formAlertDOM.style.display = 'block'
     // formAlertDOM.textContent = data.msg || 'Update is successful'
  
    //  formAlertDOM.classList.add('text-success')
      nameInputDOM.value = ''
     // passwordInputDOM.value = ''
      departmentInputDOM.value = ''
      positionInputDOM.value = ''
      emailInputDOM.value = ''
  
      //localStorage.setItem('token', data.token)
      console.log(data.token)
      //resultDOM.innerHTML = ''
      formAlertDOM.style.display = 'block'
      formAlertDOM.textContent = data.msg || 'Update is successful'
      formAlertDOM.classList.add('text-success')

     
    } catch (error) {
      formAlertDOM.style.display = 'block'
      //formAlertDOM.textContent = error.response.data.msg
      const errorMsg = error.response?.data?.msg || 'An error occurred, please try again later.';
        
        // Error message
        formAlertDOM.textContent = errorMsg;
     // localStorage.removeItem('token')
      //window.open("../login.html", '_self')
      //resultDOM.innerHTML = ''
      //successDOM.textContent = 'no token present'
      formAlertDOM.classList.remove('text-success')
    }
    setTimeout(() => {
      formAlertDOM.style.display = 'none'
    }, 3000)
  })
  