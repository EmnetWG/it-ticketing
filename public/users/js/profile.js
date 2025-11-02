import axios from '/ticket/js/axios.js';

const updateProfileDOM = document.querySelector('.updateProfile')
const modal= document.querySelector('.profileContent')
const formDOM = document.querySelector('.form')
const nameInputDOM = document.querySelector('.name-input')
const roleDOM = document.querySelector('#role')
const departmentInputDOM = document.querySelector('.department-input')
const positionInputDOM = document.querySelector('.position-input')
const emailInputDOM = document.querySelector('.email-input')
const btnUpdateDOM = document.querySelector('.btnUpdate')
const formAlertDOM = document.querySelector('.form-alert')




// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if(!token) {
    location.replace('/login.html')
  }
})

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
updateProfileDOM.addEventListener('click', async () => {
    try {
        modal.style.display = "block";
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
      console.log(user)
  console.log(userID)
      const {data:users} = await axios.get(`/api/v1/users/${userID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }},)
        
        const {name, department, position, role, email, id:userId} = users.user
        nameInputDOM.value = name
        departmentInputDOM.value = department
        positionInputDOM.value = position
        emailInputDOM.value = email
        roleDOM.value = role
        btnUpdateDOM.dataset.id = userId
    
        

//bc.innerHTML=userID
    } catch (error) {
        console.log(error)
        alert("There was an error. Please try again later")
    }
    
})


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

//const userRole = roleDOM.value
const name = nameInputDOM.value
const position = positionInputDOM.value
const email = emailInputDOM.value
const department = departmentInputDOM.value

//console.log(userRole)
const data
= await axios.patch(`/api/v1/users/${id}`, 
{name, department, position, email
      }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }}, 
    
)

console.log(data)
formAlertDOM.style.display = 'block'
formAlertDOM.textContent = `success, edited profile`
formAlertDOM.classList.add('text-success')
    } catch (error) {
      console.log(error.response.data)
        formAlertDOM.style.display = 'block'
        formAlertDOM.innerHTML = `error, please try again`
        //formAlertDOM.innerHTML = error
    }

    setTimeout(() => {
        formAlertDOM.style.display = 'none'
        formAlertDOM.classList.remove('text-success')
      }, 3000)
})
