//import { removeToken } from '../logout.js'
import axios from './axios.js';

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
const subCategorySelectUpdateDOM = document.querySelector('.selectTicketSubCategory')
const approvalInputUpdateDOM = document.querySelector('.selectTicketApproval')
const statusInputUpdateDOM = document.querySelector('.selectTicketStatus')
const createdByInputUpdateDOM = document.querySelector('.ticket-createdBy-input')
const approvedByInputUpdateDOM = document.querySelector('.ticket-approvedBy-input')
const assignedToInputUpdateDOM = document.querySelector('.ticket-assignedTo-input')
const remarkInputUpdateDOM = document.querySelector('.ticket-remark-input')
const createdAtInputUpdateDOM = document.querySelector('.ticket-createdAt-input')
const logoutDOM = document.querySelector('.logout')
//const staffsDOM = document.querySelector('.staffsList')
//const staffsTab = document.querySelector('#allStaffs')
//const searchInputDOM = document.querySelector('.searchInput')
//const searchButtonDOM = document.querySelector('.btnSearch')
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];
//
logoutDOM.addEventListener('click', async (e) => {
  e.preventDefault();
  const utils = await import('/logout.js');
  utils.removeToken();

  // Redirect without saving history
  location.replace('/login.html'); // or whatever your login page is
});


//pagination


const paginationNumbers = document.getElementById("pagination-numbers");
//usersDOM - const paginatedList = document.getElementById("");
const listItems = ticketsDOM.querySelectorAll("td");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

let currentPage=1
let noOfPages=0
const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);
  paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = (pageCount) => {
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
};

//logoutDOM.addEventListener('click', removeToken())
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
  if(categorySelectDOM.length===1){
  await bringCategorys ()
  }
  //await bringDepartments()
  //await bringSubCategories ()
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
const {name,  id:categoryID} = category
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
  
const {name,  id:categoryID} = category

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
// Bring Subcategories based on selected category
const bringSubCategoriesUpdate = async (categoryID) => {
    try {
      const token = localStorage.getItem('token');
      const { data: subCategories  } = await axios.get(`/api/v1/subCategory/name?category=${categoryID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (subCategories.length < 1) {
        subCategorySelectUpdateDOM.innerHTML = '<h5 class="empty-list">No subcategory in your list</h5>';
        return;
      }
  console.log(subCategories)
  const subcategoryFilter = subCategories.subcategorys.filter(item => item.list.categoryid==categoryID)
      const allSubCategories = subcategoryFilter.map(subCategory => {
        const { name, id: subCategoryID } = subCategory;
        return `<option data-id="${subCategoryID}">${name}</option>`;
      }).join('');
  
      subCategorySelectUpdateDOM.innerHTML = allSubCategories;
  
    } catch (error) {
      console.error(error);
      subCategorySelectUpdateDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
    }
  };
  
  // Example usage: Listen for category selection change
  categorySelectUpdateDOM.addEventListener('change', (event) => {
    const selectedCategoryID = event.target.options[event.target.selectedIndex].dataset.id;
   // bringSubCategoriesUpdate(selectedCategoryID);
  });
  
/*
//Bring  subCategory
const bringSubCategorys = async (categoryID) =>  {
 // const categoryid = categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id
 try {
    const token = localStorage.getItem('token');
    const { data: subCategories  } = await axios.get(`/api/v1/subCategory/name?category=${categoryID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (subCategories.length < 1) {
      subCategorySelectDOM.innerHTML = '<h5 class="empty-list">No subcategory in your list</h5>';
      return;
    }
console.log(subCategories)
const subcategoryFilter = subCategories.subcategorys.filter(item => item.list.categoryid==categoryID)
    const allSubCategories = subcategoryFilter.map(subCategory => {
      const { name, id: subCategoryID } = subCategory;
      return `<option data-id="${subCategoryID}">${name}</option>`;
    }).join('');

    subCategorySelectDOM.innerHTML = allSubCategories;

  } catch (error) {
    console.error(error);
    subCategorySelectDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
};

// Example usage: Listen for category selection change
categorySelectDOM.addEventListener('change', (event) => {
  const selectedCategoryID = event.target.options[event.target.selectedIndex].dataset.id;
  bringSubCategorys(selectedCategoryID);
});
*/
// bring department




/*
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
} = await axios.get(`/api/v1/subCategory/name?list.categoryName=${categoryname}`, {
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
const categoryFilter = categorys.filter(item => item.list.categoryName==categoryname)

const allCategorys = categoryFilter
.map((subCategory) => {
const {name,  category, id:categoryID} = subCategory
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

/*
categorySelectUpdateDOM.addEventListener('change', async (event) => {
  const categoryid = event.target.options[event.target.selectedIndex].dataset.id
  
  const categoryname = event.target.value
  //console.log(categoryname)
  try
  {
      const token = localStorage.getItem('token')
const {
  data:{categorys}
} = await axios.get(`/api/v1/subCategory/name?list.categoryName=${categoryname}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
console.log(categorys)
if (categorys.length < 1) {
  subCategorySelectUpdateDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}
//console.log({users})
const categoryFilter = categorys.filter(item => item.list.categoryName==categoryname)

const allCategorys = categoryFilter
.map((subCategory) => {
const {name,  category, id:subCategoryID, list} = subCategory
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
*/

// Update Pagination Button Visibility
const updatePaginationButtons = () => {
  prevButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
  nextButton.style.visibility = currentPage === noOfPages ? 'hidden' : 'visible';
}

const showTickets = async (page) => {

    try
    {
      
        const token = localStorage.getItem('token')

        if (!token) {
          location.replace('/login.html'); // force back to login
        }

const {
    data:{tickets, totalTickets, numOfPages},
} = await axios.get(`/api/v1/tickets/requestedTickets?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)

if (tickets.length < 1) {
    ticketsDOM.innerHTML = '<h5 class="empty-list">No tickets in your list</h5>'
    //loadingDOM.style.visibility = 'hidden'
    return
  }

  noOfPages=numOfPages

console.log({tickets})
const allTickets = tickets
.map((ticket) => {
var {subject, department, location, category, subCategory, approval, status, approvedBy, assignedTo, remark, createdAt, id:ticketID,
  list1, sub2, createdByUser, assignedToUser, approvedByUser, departmentTicket
} = ticket
//var date = createdAt.slice(0, 10)
// date = date.split('-').reverse().join('/')


const [year, month, day] = createdAt.split('T')[0].split('-');
const date = `${day}/${month}/${year}`;


//var date = new Date(createdAt);  // dateStr you get from mongodb

//var dateValue = date.getDate();
/* createdAt=createdAt.toDateString()


if(remark===undefined) {
  remark='-'
}

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
<!---
<td colspan="2">${subject}</td>
<td data-id="${departmentTicket.departmentId}">${departmentTicket.department}</td>
<td>${location}</td>
--->
<td data-id="${list1.categoryid}">${list1.categoryName}</td>

<td>${approval}</td>
<td>${status}</td>
<!--
${approvedBy===null ? '<td>-</td>': '<td data-id=${approvedBy._id}>${approvedBy.name}</td>'}
${assignedTo===null ? '<td>-</td>': '<td data-id=${assignedTo._id}>${assignedTo.name}</td>'}

 ${approvedBy===null ? '<td>-</td>': '<td data-id="'+approvedByUser.approvedById+'">'+approvedByUser.approvedBy+'</td>'} 
-->
 ${assignedTo===null ? '<td>-</td>': '<td data-id="'+assignedToUser.assignedToId+'">'+assignedToUser.assignedTo+'</td>'}
<td>${date}</td>
 <!-- <td>${remark}</td> -->
<td><div class="user-links">

<!-- edit link -->
${status != "resolved" ? 
`<button data-id="${ticketID}"  data-toggle="modal" data-target="#exampleModal" title="edit" class="edit-btn">
<i class="fas fa-edit"></i>
</button>`:''}
<!-- delete btn  -->
 ${status === "pending" ? 
            `<button type="button" class="delete-btn" title="delete" data-id="${ticketID}">
                <i class="fas fa-trash"></i>
            </button>` 
            : ''}
</div>
</td>

</tr>`
})
.join('')
ticketsDOM.innerHTML = allTickets

const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        const ticketID = event.currentTarget.dataset.id;
        const confirmed = window.confirm('Are you sure you want to delete this ticket?');
        if (confirmed) {

          try {
            await axios.delete(`/api/v1/tickets/${ticketID}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            // Refresh the ticket list after deletion
            showTickets(currentPage);
          } catch (error) {
            console.error('Error deleting ticket:', error);
            ticketsDOM.innerHTML = '<h5 class="empty-list">There was an error deleting the ticket, please try later....</h5>';
          }
        }


        })
      })
updatePaginationButtons()

/*
if(noOfPages==0){
  prevButton.style.visibility='hidden'
  nextButton.style.visibility='hidden'
}
if(noOfPages==1){
  prevButton.style.visibility="hidden"
  nextButton.style.visibility="hidden"
}
   if(currentPage==1){
    prevButton.style.visibility="hidden"
    
  }
  if(currentPage==noOfPages){
    nextButton.style.visibility="hidden"
  }
*/
    } catch(error) {
        
        ticketsDOM.innerHTML = 
        '<h5 class="empty-list">There was an error, please try later....</h5>'
    }
}

showTickets (currentPage)

prevButton.addEventListener("click", () => {
  
  currentPage=currentPage - 1;
  if(currentPage==1){
    prevButton.style.visibility="hidden"
    nextButton.style.visibility='visible'
  }
  /*
  else if(currentPage==noOfPages){
    nextButton.style.visibility="hidden"
    prevButton.style.visibility='visible'
  }
  */
  else {
    prevButton.style.visibility='visible'
    nextButton.style.visibility='visible'
  }

  
showTickets(currentPage)
  

  
  
});
nextButton.addEventListener('click', () =>{
  
  currentPage=currentPage+1;
  /*
  if(currentPage==1){
    prevButton.style.visibility="hidden"
    nextButton.style.visibility='visible'
  }
  */
   if(currentPage==noOfPages){
    nextButton.style.visibility="hidden"
    prevButton.style.visibility='visible'
  }
  else {
    prevButton.style.visibility='visible'
    nextButton.style.visibility='visible'
  }
  
  
showTickets(currentPage)
  
 // showTickets(currentPage)
})
//showUsers(currentPage)


 const paginationButtons = paginationNumbers.querySelectorAll(".pagination-number")
console.log(paginationButtons)
paginationButtons.forEach((button1) => {
    const pageIndex = Number(button1.getAttribute("page-index"));
    if (pageIndex) {
     // console.log(pageIndex)
      button1.addEventListener("click",
        showTickets(pageIndex)
      );
    }
  });

//add Ticket
formDOM.addEventListener('submit', async (e) => {
  formAlertDOM.classList.remove('text-success')
  //successDOM.classList.remove('text-success')
  
  //bringCategorysUpdate()

  
  const category = categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id
 // const subCategory = subCategorySelectDOM.options[subCategorySelectDOM.selectedIndex].dataset.id
  e.preventDefault()
  console.log(category)
 // console.log(subCategory)
  const subject = subjectInputDOM.value
  const location = locationInputDOM.value
  //const department = departmentInputDOM.dataset.id
  //console.log(subCategory)
  //const category = categoryInputDOM.value
  //const subCategory = subCategoryInputDOM.value



  try {
    const token = localStorage.getItem('token')

    const { data } = await axios.post('/api/v1/tickets', { subject, 
        location, category }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }},)

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = data.msg

    formAlertDOM.classList.add('text-success')
    subjectInputDOM.value = ''
    locationInputDOM.value = ''
    //departmentInputDOM.value = ''
    //categoryInputDOM.value = ''
    //subCategoryInputDOM.value = ''

   // localStorage.setItem('token', data.token)
    //resultDOM.innerHTML = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = 'Registration is successful'
    formAlertDOM.classList.add('text-success')
    showTickets(currentPage)
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
if(categorySelectUpdateDOM.length===1){
   await bringCategorysUpdate ()
}

//if(subCategorySelectUpdateDOM===0) {
//  await bringSubCategoriesUpdate ()
//}
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

    console.log(ticket)
    const {subject, department, location, category, subCategory, approval, 
      status, approvedBy, assignedTo, remark, createdAt, id:ticketID,
      list1, sub2, createdByUser, assignedToUser, approvedByUser, departmentTicket
    } = ticket.ticket

    const [year, month, day] = createdAt.split('T')[0].split('-');
const date = `${day}/${month}/${year}`;

    subjectInputUpdateDOM.value = subject
    departmentInputUpdateDOM.value = departmentTicket.department
    locationInputUpdateDOM.value = location
    
    createdAtInputUpdateDOM.value = createdAt
    categorySelectUpdateDOM.value = list1.categoryName
    //categorySelectUpdateDOM.dataset.id = list1.categoryid
    for (var i = 0; i < categorySelectUpdateDOM.length; i++) {
      if (categorySelectUpdateDOM[i].dataset.id === list1.categoryid) {
        categorySelectUpdateDOM[i].selected = true;
      }
    }

    await bringSubCategoriesUpdate (list1.categoryid)
    // await  bringSubCategorysUpdate ()
    //console.log(subCategory.name)
    ////////////
    
    /////////////////
    if(subCategory===null){
      subCategorySelectUpdateDOM.value = "-"
      }
      else {
    subCategorySelectUpdateDOM.value = sub2.subCategoryName
      
    //subCategorySelectUpdateDOM.dataset.id = sub2.subCategoryid
    for (var i = 0; i < subCategorySelectUpdateDOM.length; i++) {
      if (subCategorySelectUpdateDOM[i].dataset.id === sub2.subCategoryid) {
        subCategorySelectUpdateDOM[i].selected = true;
      }
    }
  }
    approvalInputUpdateDOM.value = approval
    statusInputUpdateDOM.value = status
    if(approvedBy===null) {

    approvedByInputUpdateDOM.value = "-"
    }
    else{
      approvedByInputUpdateDOM.value = approvedByUser.approvedBy
      approvedByInputUpdateDOM.dataset.id = approvedBy.UserapprovedById
    }

    if(assignedTo===null){
    assignedToInputUpdateDOM.value = "-"
    }
    else {
      assignedToInputUpdateDOM.value =assignedToUser.assignedTo
      assignedToInputUpdateDOM.dataset.id=assignedToUser.assignedToId
    }
    if(remark === null) {
      remarkInputUpdateDOM.value = "-"
    }
    else {
    remarkInputUpdateDOM.value = remark
    }
    createdAtInputUpdateDOM.value = date
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
  const categoryFilter = categorys.filter(item => item.list.categoryName==categoryname)
  console.log(categoryFilter)
  const allCategorys = categoryFilter
  .map((subCategory) => {
  const {name,  category, id:categoryID} = subCategory
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

////Update Ticket
btnUpdateDOM.addEventListener('click', async (e) => {
    e.preventDefault()
    
    const id = btnUpdateDOM.dataset.id
      //loadingDOM.style.visibility = 'visible'
      
    try
    
   {
        const token = localStorage.getItem('token')
const subjectValue = subjectInputUpdateDOM.value
const locationValue = locationInputUpdateDOM.value
//const departmentValue = departmentInputUpdateDOM.value
const categoryValue = categorySelectUpdateDOM.value
//const subCategoryValue = "-"

//console.log(userRole)
const {
    data:{ticket},
} = await axios.patch(`/api/v1/tickets/${id}`, {subject:subjectValue, 
  location:locationValue,  
  category:categoryValue, 
  //subCategory:subCategoryValue
 }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }}, 
    
)
formAlertUpdate.style.display = 'block'
formAlertUpdate.textContent = `success, edited ticket`
formAlertUpdate.classList.add('text-success')
showTickets(currentPage)
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
//delete ticket
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