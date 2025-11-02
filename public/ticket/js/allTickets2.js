const formDOM = document.querySelector('.form')
const subjectInputDOM = document.querySelector('.subject-input')
const locationInputDOM = document.querySelector('.location-input')
const departmentInputDOM = document.querySelector('.department-input')
const categorySelectDOM = document.querySelector('.selectCategory')
const subCategorySelectDOM = document.querySelector('.selectSubCategory')
//const modalDOM = document.querySelector('.modal')
const overlayDOM = document.querySelector('.overlay')
const closeDOM = document.querySelector(".btn-close")
const btnAddDOM = document.querySelector('.addTicket')
const btnUpdateDOM = document.querySelector('.btnUpdate')
const formAlertDOM = document.querySelector('.form-alert')
const formAlertUpdate = document.querySelector('.form-alert-update')
const ticketsDOM = document.querySelector('.ticketList')
const addModal = document.querySelector('.ticketContent')
const updateModal = document.querySelector('.modal')
const successDOM = document.querySelector('.success')

const subjectInputUpdateDOM = document.querySelector('.ticket-name-input')
const locationInputUpdateDOM = document.querySelector('.ticket-location-input')
const departmentInputUpdateDOM = document.querySelector('.ticket-department-input')
const categorySelectUpdateDOM = document.querySelector('.selectTicketCategory')
//const subCategorySelectUpdateDOM = document.querySelector('.selectTicketSubCategory')
const subCategorySelectUpdateDOM = document.querySelector('.ticket-subcategory-input')
const approvalInputUpdateDOM = document.querySelector('.selectTicketApproval')
const statusInputUpdateDOM = document.querySelector('.selectTicketStatus')
const createdByInputUpdateDOM = document.querySelector('.ticket-createdBy-input')
const approvedByInputUpdateDOM = document.querySelector('.ticket-approvedBy-input')
const assignedToInputUpdateDOM = document.querySelector('.selectTicketAssignedTo')
const remarkInputUpdateDOM = document.querySelector('.ticket-remark-input')
//const staffsDOM = document.querySelector('.staffsList')
//const staffsTab = document.querySelector('#allStaffs')
//const searchInputDOM = document.querySelector('.searchInput')
//const searchButtonDOM = document.querySelector('.btnSearch')
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];
//

//categorySelectDOM.options[categorySelectDOM.selectedIndex].defaultSelected=true
//categorySelectDOM.children[0].setAttribute('selected', 'selected')
btnAddDOM.addEventListener('click', async () => {
  //categorySelectDOM.selectedIndex='0'
  addModal.style.display='block';
  //const label = "Please select...";
//categorySelectDOM.insertAdjacentHTML('beforeend', `
 // <option>${label}</option>
//`)
  //const categoryid = subCategorySelectUpdateDOM.options[subCategorySelectUpdateDOM.selectedIndex].dataset.id
  
  bringCategorys ()
  /*
  for (var i = -1; i < categorySelectDOM.length-1; i++) {
    //if (categorySelectUpdateDOM[i].dataset.id === category) {
      if(i==0){
        categorySelectDOM[i].selected = true;
      }
      categorySelectDOM[i].selected = false;
    
  } 
  */
  //categorySelectDOM.selectedIndex= '0'
  //HTMLOptionElement.defaultSelected = true;
 // categorySelectDOM.querySelectorAll('option')[1].selected = 'selected'
  //categorySelectDOM.options.selectedIndex='0'
  console.log(categorySelectDOM.selectedIndex)
const selectvalue = categorySelectDOM.querySelectorAll('option')[1]
  //const selectvalue=categorySelectDOM.value
  console.log(selectvalue)
  //console.log(categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id)
  //categorySelectDOM.children[0].setAttribute('selected', 'selected')
  //const categoryValue = categorySelectDOM.value
  //console.log(categorySelectDOM.options[categorySelectDOM.selectedIndex])
  //const categoryid = categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id
  //bringSubCategorys ()
})
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

//Bring IT Staffs
const bringITstaffs = async () =>  {
    try
    {
        const token = localStorage.getItem('token')
  const {
    data:{users}
  } = await axios.get(`/api/v1/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)
  //console.log(categorys)
  if (users.length < 1) {
    assignedToInputUpdateDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
    //loadingDOM.style.visibility = 'hidden'
    return
  }
  //console.log({users})
  const userFilter = users.filter(item => item.role==='IT staff')
  const allUsers = userFilter
  .map((user, index) => {
    
  const {name,  _id:userID} = user
  
  return `
  <option data-id="${userID}">${name}</option>
  `
  })
  .join('')
  //categorySelectDOM.innerHTML = allCategorys
  
  assignedToInputUpdateDOM.insertAdjacentHTML('beforeend', allUsers)
  assignedToInputUpdateDOM.selectedIndex="0"
  //categorySelectDOM.querySelectorAll('option')[0].selected = 'selected'
  /**categorySelectDOM.children[0].setAttribute('selected', true)
  for (var i = 0; i < categorySelectDOM.length; i++) {
    //if (categorySelectUpdateDOM[i].dataset.id === category) {
      categorySelectDOM[i].selected = false;
    
  } 
  
  categorySelectDOM.options.selectedIndex='0'
  console.log(categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id)
  //categorySelectDOM.value="Hardware"
  //categorySelectDOM.options[categorySelectDOM.selectedindex].defaultSelected=true
  //categorySelectDOM[0].selected=true
  //categorySelectDOM.selectedIndex="0"
  //categorySelectDOM.options[categorySelectDOM.selectedIndex]= "0"
  */
  } catch(error) {
        
      assignedToInputUpdateDOM.innerHTML = error
        '<h5 class="empty-list">There was an error, please try later....</h5>'
    }
  }

  

//BringCategoryUpdate
const bringCategorysUpdate = async () =>  {
  try
  {
      const token = localStorage.getItem('token')
const {
  data:{categorys}
} = await axios.get(`/api/v1/category`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
//console.log(categorys)
if (categorys.length < 1) {
  categorySelectUpdateDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}
//console.log({users})
const allCategorys = categorys
.map((category) => {
const {name,  _id:categoryID} = category
return `
<option data-id="${categoryID}">${name}</option>
`
})
.join('')
categorySelectUpdateDOM.insertAdjacentHTML('beforeend', allCategorys)
//categorySelectUpdateDOM[0].selected=true
//categorySelectUpdateDOM.selectedIndex="0"

  } catch(error) {
      
    categorySelectUpdateDOM.innerHTML=
      `<h5 class="empty-list">There was an error, please try later....</h5>`
  }
}

//Bring Category
const bringCategorys = async () =>  {
  try
  {
      const token = localStorage.getItem('token')
const {
  data:{categorys}
} = await axios.get(`/api/v1/category`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
//console.log(categorys)
if (categorys.length < 1) {
  categorySelectDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}
//console.log({users})
const allCategorys = categorys
.map((category, index) => {
  
const {name,  _id:categoryID} = category

return `
<option data-id="${categoryID}">${name}</option>
`
})
.join('')
//categorySelectDOM.innerHTML = allCategorys

categorySelectDOM.insertAdjacentHTML('beforeend', allCategorys)

//categorySelectDOM.querySelectorAll('option')[0].selected = 'selected'
/**categorySelectDOM.children[0].setAttribute('selected', true)
for (var i = 0; i < categorySelectDOM.length; i++) {
  //if (categorySelectUpdateDOM[i].dataset.id === category) {
    categorySelectDOM[i].selected = false;
  
} 

categorySelectDOM.options.selectedIndex='0'
console.log(categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id)
//categorySelectDOM.value="Hardware"
//categorySelectDOM.options[categorySelectDOM.selectedindex].defaultSelected=true
//categorySelectDOM[0].selected=true
//categorySelectDOM.selectedIndex="0"
//categorySelectDOM.options[categorySelectDOM.selectedIndex]= "0"
*/
} catch(error) {
      
    categorySelectDOM.innerHTML = error
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
}

//Bring SubCategories
//BringCategoryUpdate
const bringSubCategorysUpdate = async () =>  {
  //const categoryid = subCategorySelectUpdateDOM.options[subCategorySelectUpdateDOM.selectedIndex].dataset.id
  try
  {
      const token = localStorage.getItem('token')
const {
  data:{categorys}
} = await axios.get(`/api/v1/subCategory/name`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
//console.log(categorys)
if (categorys.length < 1) {
  subCategorySelectUpdateDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}

const categoryFilter = categorys.filter(function(e)
{
  return e.category._id==id
})
//console.log({users})
const allCategorys = categoryFilter
.map((subCategory) => {
const {name, category, _id:subCategoryID} = subCategory
return `
<option data-id="${subCategoryID}">${name}</option>
`
})
.join('')
subCategorySelectUpdateDOM.innerHTML = allCategorys
//
  } catch(error) {
      
    subCategorySelectUpdateDOM.innerHTML=
      `<h5 class="empty-list">There was an error, please try later....</h5>`
  }
}

//Bring  Category
const bringSubCategorys = async () =>  {
 // const categoryid = categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id
  const categoryname=categorySelectDOM.value
 try
  {
      const token = localStorage.getItem('token')
const {
  data:{categorys}
} = await axios.get(`/api/v1/subCategory/name?category.name=${categoryname}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
//console.log(categorys)
if (categorys.length < 1) {
  subCategorySelectDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}
//console.log({users})
//const categoryFilter = categorys.filter(item => item.category._id==id)

const allCategorys = categorys
.map((subCategory) => {
const {name,  category, _id:categoryID} = subCategory
return `
<option data-id="${categoryID}">${name}</option>
`
})
.join('')
subCategorySelectDOM.innerHTML = allCategorys
  } catch(error) {
      
    subCategorySelectDOM.innerHTML = error
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
}

//select subcategory
subCategorySelectDOM.addEventListener('change', async (event) => {
  const categoryid = event.target.options[event.target.selectedIndex].dataset.id
  //return categoryid
  const subCategoryname = event.target.value
  //console.log(subCategoryname)
  
  //console.log(categoryid)
})

subCategorySelectUpdateDOM.addEventListener('change', async (event) => {
  const categoryid = event.target.options[event.target.selectedIndex].dataset.id
  //return categoryid
  
  console.log(categoryid)
})

assignedToInputUpdateDOM.addEventListener('change', async (event) => {
    const assignedto = event.target.options[event.target.selectedIndex].dataset.id
    //return categoryid
    
    console.log(categoryid)
  })

//var option = document.createElement("option");
//option.text = "Please select...";

//categorySelectDOM.appendChild(option);
//select
categorySelectDOM.addEventListener('change', async (event) => {
  const categoryid = event.target.options[event.target.selectedIndex].dataset.id
  //return categoryid
  const categoryname = event.target.value
  //console.log(categoryname)
  try
  {
      const token = localStorage.getItem('token')
const {
  data:{categorys}
} = await axios.get(`/api/v1/subCategory/name?category.name=${categoryname}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
//console.log(categorys)
if (categorys.length < 1) {
  subCategorySelectDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}
//console.log({users})
const categoryFilter = categorys.filter(item => item.category.name==categoryname)

const allCategorys = categoryFilter
.map((subCategory) => {
const {name,  category, _id:categoryID} = subCategory
return `
<option data-id="${categoryID}">${name}</option>
`
})
.join('')
subCategorySelectDOM.innerHTML = allCategorys
  } catch(error) {
      
    subCategorySelectDOM.innerHTML = error
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  //bringSubCategorys()
  console.log(categoryid)
})

categorySelectUpdateDOM.addEventListener('change', async (event) => {
  const categoryid = event.target.options[event.target.selectedIndex].dataset.id
  
  const categoryname = event.target.value
  //console.log(categoryname)
  try
  {
      const token = localStorage.getItem('token')
const {
  data:{categorys}
} = await axios.get(`/api/v1/subCategory/name?category.name=${categoryname}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
//console.log(categorys)
if (categorys.length < 1) {
  subCategorySelectUpdateDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}
//console.log({users})
const categoryFilter = categorys.filter(item => item.category.name==categoryname)

const allCategorys = categoryFilter
.map((subCategory) => {
const {name,  category, _id:subCategoryID} = subCategory
return `
<option data-id="${subCategoryID}">${name}</option>
`
})
.join('')
subCategorySelectUpdateDOM.innerHTML = allCategorys
  } catch(error) {
      
    subCategorySelectUpdateDOM.innerHTML = error
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
  //bringSubCategorys()
  console.log(categoryid)
  //bringSubCategorysUpdate()
  //return categoryid
  //console.log(categoryid)
})
//

const showTickets = async () => {

    try
    {
      
        const token = localStorage.getItem('token')
const {
    data:{tickets},
} = await axios.get(`/api/v1/tickets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)

if (tickets.length < 1) {
    ticketsDOM.innerHTML = '<h5 class="empty-list">No tickets in your list</h5>'
    //loadingDOM.style.visibility = 'hidden'
    return
  }

  const ticketsFilter = tickets.filter(item => item.approval=='approved')

console.log({tickets})
const allTickets = ticketsFilter
.map((ticket) => {
var {subject, department, location, category, subCategory, approval, status, createdBy,approvedBy, assignedTo, remark, _id:ticketID} = ticket
if(remark===undefined) {
  remark='-'
}
/*
if(typeof approvedBy===undefined || approvedBy.name === undefined || approvedBy._id===undefined){
  approvedBy='-'
  approvedBy.name='-'

}
if(typeof assignedTo===undefined || assignedTo.name === undefined || assignedTo._id===undefined){
  assignedTo='-'
  assignedTo.name='-'
}
*/
return `<tr>
<td>${subject}</td>
<td>${department}</td>
<td>${location}</td>

<td data-id="${category._id}">${category.name}</td>
<!-- <td data-id="${subCategory._id}">${subCategory.name}</td> 
<td>${approval}</td> -->
<td>${status}</td>
<td data-id="${createdBy._id}">${createdBy.name}</td>
<!-- ${typeof approvedBy==="undefined" ? '<td>-</td>': '<td data-id="'+approvedBy._id+'">'+approvedBy.name+'</td>'} -->
${typeof assignedTo==="undefined" ? '<td>-</td>': '<td data-id="'+assignedTo._id+'">'+assignedTo.name+'</td>'}

<!--- <td>${remark}</td> --->
<td><div class="user-links">

<!-- edit link -->
<button data-id="${ticketID}"  data-toggle="modal" data-target="#exampleModal" class="edit-btn">
<i class="fas fa-edit"></i>
</button>
<!-- delete btn  
<button type="button" class="delete-btn" data-id="${ticketID}">
<i class="fas fa-trash"></i>
</button>
-->
</div>
</td>

</tr>`
})
.join('')
ticketsDOM.innerHTML = allTickets
    } catch(error) {
        
        ticketsDOM.innerHTML = error
        '<h5 class="empty-list">There was an error, please try later....</h5>'
    }
}

showTickets ()
//add Ticket
/*
formDOM.addEventListener('submit', async (e) => {
  formAlertDOM.classList.remove('text-success')
  //successDOM.classList.remove('text-success')
  
  //bringCategorysUpdate()

  
  const category = categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id
  const subCategory = subCategorySelectDOM.options[subCategorySelectDOM.selectedIndex].dataset.id
  e.preventDefault()
  console.log(category)
  console.log(subCategory)
  const subject = subjectInputDOM.value
  const location = locationInputDOM.value
  const department = departmentInputDOM.value
  console.log(subCategory)
  //const category = categoryInputDOM.value
  //const subCategory = subCategoryInputDOM.value



  try {
    const token = localStorage.getItem('token')

    const { data } = await axios.post('/api/v1/tickets', { subject, department,
        location, category, subCategory }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }},)

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = data.msg

    formAlertDOM.classList.add('text-success')
    subjectInputDOM.value = ''
    locationInputDOM.value = ''
    departmentInputDOM.value = ''
    //categoryInputDOM.value = ''
    //subCategoryInputDOM.value = ''

   // localStorage.setItem('token', data.token)
    //resultDOM.innerHTML = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = 'Registration is successful'
    formAlertDOM.classList.add('text-success')
  } catch (error) {
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = error.response.data.msg
   // localStorage.removeItem('token')
    //resultDOM.innerHTML = ''
    //successDOM.textContent = 'no token present'
    formAlertDOM.classList.remove('text-success')
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none'
  }, 2000)
})

*/


//const deleteBtnDOM = document.querySelector('.delete-btn')
//const editBtnDOMS = document.querySelectorAll('.edit-btn')
//Bring data for update
ticketsDOM.addEventListener('click', async (e) => {
    const el = e.target
    if (el.parentElement.classList.contains('edit-btn')) {
      //loadingDOM.style.visibility = 'visible'
      const id = el.parentElement.dataset.id
      console.log(id)

//editBtnDOMS.forEach((button) => {
//button.addEventListener('click', async (e) => {
    updateModal.style.display = "block"
    overlayDOM.style.display = "block"
if(categorySelectUpdateDOM.length==1){
    bringCategorysUpdate ()
}
    
if(assignedToInputUpdateDOM.length==1){
bringITstaffs()
}
//bringSubCategorysUpdate ()
    //modalDOM.style.display = 'block'
  //  const id = e.target.dataset.id
    try
    {
        
        const token = localStorage.getItem('token')
const {
    data:ticket,
} = await axios.get(`/api/v1/tickets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)

    //console.log(ticket)
    const {subject, department, location, category, subCategory, approval, 
      status, createdBy, approvedBy, assignedTo, remark, _id:ticketID} = ticket.ticket
    subjectInputUpdateDOM.value = subject
    departmentInputUpdateDOM.value = department
    locationInputUpdateDOM.value = location
    categorySelectUpdateDOM.value = category.name
    categorySelectUpdateDOM.dataset.id = category._id
    for (var i = 0; i < categorySelectUpdateDOM.length; i++) {
      if (categorySelectUpdateDOM[i].dataset.id === category._id) {
        categorySelectUpdateDOM[i].selected = true;
      }
    }
   // console.log(subCategory.name)
    ////////////
    
    /////////////////
    subCategorySelectUpdateDOM.value = subCategory.name
    subCategorySelectUpdateDOM.dataset.id = subCategory._id
    /*
    for (var i = 0; i < subCategorySelectUpdateDOM.length; i++) {
      if (subCategorySelectUpdateDOM[i].dataset.id === subCategory._id) {
        subCategorySelectUpdateDOM[i].selected = true;
      }
    }

    */
    approvalInputUpdateDOM.value = approval
    statusInputUpdateDOM.value = status
    createdByInputUpdateDOM.value= createdBy.name
    createdByInputUpdateDOM.dataset.id=createdBy._id
    if(typeof approvedBy==="undefined") {

    approvedByInputUpdateDOM.value = "-"
    }
    else{
      approvedByInputUpdateDOM.value = approvedBy.name
      approvedByInputUpdateDOM.dataset.id = approvedBy._id
    }

    if(typeof assignedTo==="undefined"){
    assignedToInputUpdateDOM.value = "-"
    }
    else {
      assignedToInputUpdateDOM.value =assignedTo.name
      assignedToInputUpdateDOM.dataset.id=assignedTo._id
    }
    if(typeof remark === "undefined") {
      remarkInputUpdateDOM.value = "-"
    }
    else {
    remarkInputUpdateDOM.value = remark
    }
    btnUpdateDOM.dataset.id = ticketID

} catch(error) {
    console.log(error)
}
}
})
//////
updateModal.addEventListener('load', async () => {

  try
    {
        const token = localStorage.getItem('token')
  const {
    data:{categorys}
  } = await axios.get(`/api/v1/subCategory/name`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)
  //console.log(categorys)
  if (categorys.length < 1) {
    subCategorySelectDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
    //loadingDOM.style.visibility = 'hidden'
    return
  }
  //console.log({users})
  const categoryname=categorySelectUpdateDOM.value
  const categoryid=categorySelectUpdateDOM.dataset.id
  const categoryFilter = categorys.filter(item => item.category.name==categoryname)
  console.log(categoryFilter)
  const allCategorys = categoryFilter
  .map((subCategory) => {
  const {name,  category, _id:categoryID} = subCategory
  return `
  <option data-id="${categoryID}">${name}</option>
  `
  })
  .join('')
  subCategorySelectUpdateDOM.innerHTML = allCategorys
    } catch(error) {
        
      subCategorySelectUpdateDOM.innerHTML = error
        '<h5 class="empty-list">There was an error, please try later....</h5>'
    }

})

/////
closeDOM.addEventListener('click', async ( ) => {
    overlayDOM.style.display = "none"
})

////Update Assignment
btnUpdateDOM.addEventListener('click', async (e) => {
    e.preventDefault()
    
    const id = btnUpdateDOM.dataset.id
      //loadingDOM.style.visibility = 'visible'
      
    try
    
   {
        const token = localStorage.getItem('token')
//const subjectValue = subjectInputUpdateDOM.value
//const locationValue = locationInputUpdateDOM.value
//const departmentValue = departmentInputUpdateDOM.value
//const categoryValue = categorySelectUpdateDOM.value
//const subCategoryValue = subCategorySelectUpdateDOM.value
const assignedToValue = assignedToInputUpdateDOM.value
//console.log(userRole)
const {
    data:{ticket},
} = await axios.patch(`/api/v1/tickets/${id}/assignTicket`, {assignedTo:assignedToValue, 
 
 }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }}, 
    
)
formAlertUpdate.style.display = 'block'
formAlertUpdate.textContent = `success, edited ticket`
formAlertUpdate.classList.add('text-success')
showTickets()
    } catch (error) {
        formAlertUpdate.style.display = 'block'
        formAlertUpdate.innerHTML = `error, please try again`
        //formAlertDOM.innerHTML = error
    }

    setTimeout(() => {
        formAlertUpdate.style.display = 'none'
        formAlertUpdate.classList.remove('text-success')
      }, 3000)
})

/*
//delete Ticket
ticketsDOM.addEventListener('click', async (e) => {
  const el = e.target
  if (el.parentElement.classList.contains('delete-btn')) {
    //loadingDOM.style.visibility = 'visible'
    const id = el.parentElement.dataset.id
    try {

      const token = localStorage.getItem('token')
      await axios.delete(`/api/v1/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }},)
        showTickets()
    } catch (error) {
      console.log(error)
    }
  }
 // loadingDOM.style.visibility = 'hidden'
})
*/
/*
//})
//showSingleUser ()



  searchButtonDOM.addEventListener('click', async () => {
    const searchName = searchInputDOM.value

    try
    {
        
        const token = localStorage.getItem('token')
const {
    data:users,
} = await axios.get(`/api/v1/users/?name=`+searchName, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)

    if (users.length < 1) {
      usersDOM.innerHTML = '<h5 class="empty-list">No userss in your list</h5>'
      //loadingDOM.style.visibility = 'hidden'
      return
    }
  //console.log({users})
 // const allUsers = users
  //.map((user) => {
  const {name, department, position, role, email, _id:userID} = users
  const allUsers = `<tr>
  <td>${name}</td>
  <td>${department}</td>
  <td>${position}</td>
  <td>${role}</td>
  <td>${email}</td>
  <td><div class="user-links">
  
  <!-- edit link -->
  <button data-id="${userID}" data-toggle="modal" data-target="#exampleModal" class="edit-btn">
  <i class="fas fa-edit"></i>
  </button>
  <!-- delete btn >
  <button type="button" class="delete-btn" data-id="${userID}">
  <i class="fas fa-trash"></i>
  </button>
  </div>
  </td>
  -->
  </tr>`
  //})
 // .join('')
  usersDOM.innerHTML = allUsers
      } catch(error) {
          
          usersDOM.innerHTML = error
          '<h5 class="empty-list">There was an error, please try later....</h5>'
      }
  
  })
  */

   