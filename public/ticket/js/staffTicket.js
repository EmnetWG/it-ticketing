import axios from './axios.js';
// import removeItem from '../logout.js'
//const logoutDetail= require('../logout.js')
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
const printView=document.querySelector('#printView')
//const pageNumberDisplay = document.getElementById("pageNumberDisplay");
const pageNumbersContainer = document.getElementById("pageNumbersContainer");

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
const assignedToInputUpdateDOM = document.querySelector('.ticket-assignedTo-input')
const remarkInputUpdateDOM = document.querySelector('.ticket-remark-input')
const createdAtInputUpdateDOM = document.querySelector('.ticket-createdAt-input')
const logoutDOM =document.querySelector('.logout')
const pendingStatDOM = document.querySelector('.pending-stat')
const acceptedStatDOM = document.querySelector('.accepted-stat')
const resolvedStatDOM = document.querySelector('.resolved-stat')
const pendingDOM = document.querySelector('.pending')
const acceptedDOM = document.querySelector('.accepted')
const resolvedDOM = document.querySelector('.resolved')
const monthlyStatDOM = document.querySelector('.staff-stat')
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

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if(!token) {
    location.replace('/login.html')
  }
})

monthlyStatDOM.addEventListener('click', () =>{
  location.replace('/staffStats.html');
})

//pagination
let pending=0
let accepted=0
let resolved=0
let all=1

const paginationNumbers = document.getElementById("pagination-numbers");
//usersDOM - const paginatedList = document.getElementById("");
const listItems = ticketsDOM.querySelectorAll("td");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

let currentPage=1
let noOfPages=1

function renderPageNumbers() {
  pageNumbersContainer.innerHTML = ''; // Clear old buttons

  for (let i = 1; i <= noOfPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.classList.add('page-number');
    
    if (i === currentPage) {
      pageButton.classList.add('active');
    }

    pageButton.addEventListener('click', async () => {
      currentPage = i;
      await showTicketsWithFilters(currentPage);
      updatePaginationButtons(); // update state
      renderPageNumbers(); // update UI
    });

    pageNumbersContainer.appendChild(pageButton);
  }
}

// Reusable function to update button states
function updatePaginationButtons() {
    prevButton.disabled = currentPage <= 1;
    nextButton.disabled = currentPage >= noOfPages;
   // pageNumberDisplay.textContent = ` ${currentPage}`;
   document.getElementById("pageNumberDisplay")?.remove(); // if you had it
  renderPageNumbers();
  }
  
  prevButton.addEventListener("click", async () => {
    if (currentPage > 1) {
      currentPage--;
      await showTicketsWithFilters(currentPage);
      updatePaginationButtons();
    }
  });
  
  nextButton.addEventListener("click", async () => {
    if (currentPage < noOfPages) {
      currentPage++;
      await showTicketsWithFilters(currentPage);
      updatePaginationButtons();
    }
})
/*
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

*/
//showStat

const showStaffTicketStats = async () => {

  try {
const token = localStorage.getItem('token')

if (!token) {
  location.replace('/login.html'); // force back to login
  return ;
}

  const {data:{defaultStats},} = await axios.get(`/api/v1/tickets/staffAssignedStats`,
  {
      headers: {
        Authorization: `Bearer ${token}`,
      }},
   )

   

console.log({defaultStats})
pendingStatDOM.innerHTML=defaultStats.pending 
acceptedStatDOM.innerHTML=defaultStats.accepted
resolvedStatDOM.innerHTML=defaultStats.resolved
  
}
catch(error) {
  console.log(error)
}
}


showStaffTicketStats ()
/*
// Update Pagination Button Visibility
const updatePaginationButtons = () => {
  prevButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
  nextButton.style.visibility = currentPage === noOfPages ? 'hidden' : 'visible';
}

*/
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
  //console.log(selectvalue)
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
         if (!token) {
          location.replace('/login.html'); // force back to login
          return ;
        }
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
    
  const {name,  id:userID} = user
  
  return `
  <option data-id="${userID}">${name}</option>
  `
  })
  .join('')
  //categorySelectDOM.innerHTML = allCategorys
  
  assignedToInputUpdateDOM.insertAdjacentHTML('beforeend', allUsers)
  
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
       if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
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
       if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
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
// Bring Subcategories based on selected category
const bringSubCategoriesUpdate = async (categoryID) => {
  try {
    const token = localStorage.getItem('token');
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
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
  bringSubCategoriesUpdate(selectedCategoryID);
});


//Bring  Category
const bringSubCategorys = async () =>  {
 // const categoryid = categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id
  const categoryname=categorySelectDOM.value
 try
  {
      const token = localStorage.getItem('token')
       if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
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
//const categoryFilter = categorys.filter(item => item.category._id==id)

const allCategorys = categorys
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
/*
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

*/
//
/*
const showPendingTickets= async (page) => {

  try
  {
    
      const token = localStorage.getItem('token')
const {
  data:{tickets, totalTickets, numOfPages},
} = await axios.get(`/api/v1/tickets/assignedPendingTickets?page=${page}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)

if (tickets.length < 1) {
  ticketsDOM.innerHTML = '<h5 class="empty-list">No tickets in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}

noOfPages=numOfPages
// const ticketsFilter = tickets.filter(item => item.assignedTo._id==req.user.userId)
//const ticketsPending = tickets.filter(item => item.status=="pending")
//const pendingCount = ticketsPending.length

//pendingStatDOM.innerHTML=pendingCount

//const ticketsAccepted = tickets.filter(item => item.status=="accepted")
//const acceptedCount = ticketsAccepted.length
//acceptedStatDOM.innerHTML=acceptedCount
console.log(totalTickets)
const allTickets = tickets
.map((ticket) => {
var {subject, department, location, category, subCategory, status, createdBy, assignedTo, remark, createdAt, id:ticketID,
  list1, sub2, createdByUser, assignedToUser, departmentTicket
} = ticket
var date = createdAt.slice(0, 10)
date = date.split('-').reverse().join('/')
/*
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
/*

return `<tr>
<!---
<td colspan="2">${subject}</td>
--->
<td data-id="${departmentTicket.departmentId}">${departmentTicket.department}</td>
<td>${location}</td>

<td data-id="${list1.categoryid}">${list1.categoryName}</td>

<td>${status}</td>

<td data-id="${createdByUser.createdById}">${createdByUser.createdBy}</td>
<td>${date}</td>
<!-- 

${assignedTo===null ? '<td>-</td>': '<td data-id="'+assignedToUser.assignedToId+'">'+assignedToUser.assignedTo+'</td>'}

<td>${remark}</td>
-->
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

updatePaginationButtons()

  } catch(error) {
      
      ticketsDOM.innerHTML = error
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
}

pendingDOM.addEventListener('click', async () =>{
  accepted=0
  all=0
  pending=1
  resolved=0
  currentPage=1
 await showPendingTickets(currentPage)}
)

//Accepted requests
const showAcceptedTickets = async (page) => {

  try
  {
    
      const token = localStorage.getItem('token')
const {
  data:{tickets, totalTickets, numOfPages},
} = await axios.get(`/api/v1/tickets/assignedAcceptedTickets?page=${page}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)

if (tickets.length < 1) {
  ticketsDOM.innerHTML = '<h5 class="empty-list">No tickets in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}

noOfPages=numOfPages
// const ticketsFilter = tickets.filter(item => item.assignedTo._id==req.user.userId)
//const ticketsPending = tickets.filter(item => item.status=="pending")
//const pendingCount = ticketsPending.length

//pendingStatDOM.innerHTML=pendingCount

//const ticketsAccepted = tickets.filter(item => item.status=="accepted")
//const acceptedCount = ticketsAccepted.length
//acceptedStatDOM.innerHTML=acceptedCount
console.log(totalTickets)
const allTickets = tickets
.map((ticket) => {
var {subject, department, location, category, subCategory, status, createdBy, assignedTo, remark, createdAt, id:ticketID,
  list1, sub2, createdByUser, assignedToUser, departmentTicket

} = ticket
var date = createdAt.slice(0, 10)
date = date.split('-').reverse().join('/')
/*
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
/*
return `<tr>
<!---
<td colspan="2">${subject}</td>
-->
<td dats-id="${departmentTicket.departmentId}">${departmentTicket.department}</td>
<td>${location}</td>

<td data-id="${list1.categoryid}">${list1.categoryName}</td>

<td>${status}</td>

<td data-id="${createdByUser.createdById}">${createdByUser.createdBy}</td>
<td>${date}</td>
<!-- 

${assignedTo===null ? '<td>-</td>': '<td data-id="'+assignedToUser.assignedToId+'">'+assignedToUser.assignedTo+'</td>'}

<td>${remark}</td>
-->
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

updatePaginationButtons()
  } catch(error) {
      
      ticketsDOM.innerHTML = error
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
}

acceptedDOM.addEventListener('click', async () => {
  accepted=1
  all=0
  pending=0
  resolved=0
  currentPage=1
  await showAcceptedTickets(currentPage)
}
)

//Resolved Tickets
const showResolvedTickets= async (page) => {

  try
  {
    
      const token = localStorage.getItem('token')
const {
  data:{tickets, totalTickets, numOfPages},
} = await axios.get(`/api/v1/tickets/assignedResolvedTickets?page=${page}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)

if (tickets.length < 1) {
  ticketsDOM.innerHTML = '<h5 class="empty-list">No tickets in your list</h5>'
  //loadingDOM.style.visibility = 'hidden'
  return
}

noOfPages=numOfPages
// const ticketsFilter = tickets.filter(item => item.assignedTo._id==req.user.userId)
//const ticketsPending = tickets.filter(item => item.status=="pending")
//const pendingCount = ticketsPending.length

//pendingStatDOM.innerHTML=pendingCount

//const ticketsAccepted = tickets.filter(item => item.status=="accepted")
//const acceptedCount = ticketsAccepted.length
//acceptedStatDOM.innerHTML=acceptedCount
console.log(totalTickets)
const allTickets = tickets
.map((ticket) => {
var {subject, department, location, category, subCategory, status, createdBy, assignedTo, remark, createdAt, id:ticketID,
  list1, sub2, createdByUser, assignedToUser, departmentTicket
} = ticket
var date = createdAt.slice(0, 10)
date = date.split('-').reverse().join('/')
/*
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
/*
return `<tr>
<!---
<td colspan="2">${subject}</td>
--->
<td data-id="${departmentTicket.departmentId}">${departmentTicket.department}</td>
<td>${location}</td>

<td data-id="${list1.categoryid}">${list1.categoryName}</td>

<td>${status}</td>

<td data-id="${createdByUser.createdById}">${createdByUser.createdBy}</td>
<td>${date}</td>
<!-- 

${assignedTo===null ? '<td>-</td>': '<td data-id="'+assignedToUser.assignedToId+'">'+assignedToUser.assignedTo+'</td>'}

<td>${remark}</td>
-->
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

updatePaginationButtons()

  } catch(error) {
      
      ticketsDOM.innerHTML = error
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
}

resolvedDOM.addEventListener('click', async () =>{
  accepted=0
  all=0
  pending=0
  resolved=1
  currentPage=1
 await showResolvedTickets(currentPage)}
)


//
const showTickets = async (page) => {

    try
    {
      
      pending=0
      accepted=0
      resolved=0
      all=1

        const token = localStorage.getItem('token')
const {
    data:{tickets, totalTickets, numOfPages},
} = await axios.get(`/api/v1/tickets/assignedTickets?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)

if (tickets.length < 1) {
    ticketsDOM.innerHTML = '<h5 class="empty-list">No tickets in your list</h5>'
    //loadingDOM.style.visibility = 'hidden'
    return
  }
  noOfPages=numOfPages
/*
 // const ticketsFilter = tickets.filter(item => item.assignedTo.id==req.user.userId)
 const ticketsPending = tickets.filter(item => item.status=="pending")
const pendingCount = ticketsPending.length

pendingStatDOM.innerHTML=pendingCount

 const ticketsAccepted = tickets.filter(item => item.status=="accepted")
const acceptedCount = ticketsAccepted.length
acceptedStatDOM.innerHTML=acceptedCount
*/
// console.log({tickets})
/*
const allTickets = tickets
.map((ticket) => {
var {subject, department, location, category, subCategory, status, createdBy, assignedTo, remark, createdAt, id:ticketID,
  list1, sub2, createdByUser, assignedToUser, departmentTicket
} = ticket
var date = createdAt.slice(0, 10)
date = date.split('-').reverse().join('/')
/*
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
  <!-- <td data-id="${sub2.subCategoryid}">${sub2.subCategoryName}</td> 
<td>${approval}</td> -->
}
*/
/*
return `<tr>
<!--
<td colspan="2">${subject}</td>
-->
<td data-id="${departmentTicket.departmentId}">${departmentTicket.department}</td>
<td>${location}</td>

<td data-id="${list1.categoryid}">${list1.categoryName}</td>

<td>${status}</td>

<td data-id="${createdByUser.createdById}">${createdByUser.createdBy}</td>
<td>${date}</td>
<!---

 

${assignedTo===null ? '<td>-</td>': '<td data-id="'+assignedToUser.assignedToId+'">'+assignedToUser.assignedTo+'</td>'} 

<td>${remark}</td> -->


<td><div class="user-links">

<!-- edit link -->
<button data-id="${ticketID}"  data-toggle="modal" data-target="#exampleModal" class="edit-btn">
<i class="fas fa-edit"></i>
</button>
<button data-id="${ticketID}"  data-toggle="modal" data-target="#exampleModal" class="print-btn">
<i class="fas fa-print"></i>
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

updatePaginationButtons()
    } catch(error) {
        
        ticketsDOM.innerHTML = error
        '<h5 class="empty-list">There was an error, please try later....</h5>'
    }
}

showTickets (currentPage)
*/

acceptedDOM.addEventListener('click', async () => {
    currentEndpoint = 'assignedAcceptedTickets';
    currentPage = 1;

    dateFilter = { start: null, end: null };
  

  // Optionally reset input fields too
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
   await showTicketsWithFilters(currentPage);
  });
  
  pendingDOM.addEventListener('click', async () => {
    currentEndpoint = 'assignedPendingTickets';
    currentPage = 1;
    dateFilter = { start: null, end: null };
  

  // Optionally reset input fields too
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
    await showTicketsWithFilters(currentPage);
  });
  resolvedDOM.addEventListener('click', async () => {
    currentEndpoint = 'assignedResolvedTickets';
    currentPage = 1;
    dateFilter = { start: null, end: null };
  

  // Optionally reset input fields too
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
await showTicketsWithFilters(currentPage);
  });
  
  
  document.querySelector('.icon-home').addEventListener('click', async () => {
    currentEndpoint = 'assignedTickets';
    currentPage = 1;
    dateFilter = { start: null, end: null };
 // currentPage = 1;

  // Optionally reset input fields too
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
   await showTicketsWithFilters(currentPage);
  });

  /*
  
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
 /*
  else {
    prevButton.style.visibility='visible'
    nextButton.style.visibility='visible'
  }

  if(pending==1){
    showPendingTickets(currentPage)
      }
      else  if(accepted==1){
        showAcceptedTickets(currentPage)
          }
          else  if(resolved==1){
            showResolvedTickets(currentPage)
              }
  else {
showTickets(currentPage)
  }

  
  
});
nextButton.addEventListener('click', () =>{
  
  currentPage=currentPage+1;
  /*
  if(currentPage==1){
    prevButton.style.visibility="hidden"
    nextButton.style.visibility='visible'
  }
  */
 /*
   if(currentPage==noOfPages){
    nextButton.style.visibility="hidden"
    prevButton.style.visibility='visible'
  }
  else {
    prevButton.style.visibility='visible'
    nextButton.style.visibility='visible'
  }
  
  if(pending==1){
    showPendingTickets(currentPage)
      }
      else  if(accepted==1){
        showAcceptedTickets(currentPage)
          }
  else {
showTickets(currentPage)
  }
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
 */
//add Ticket
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
  const department = departmentInputDOM.dataset.id
  console.log(subCategory)
  //const category = categoryInputDOM.value
  //const subCategory = subCategoryInputDOM.value



  try {
    const token = localStorage.getItem('token')
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }

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




//const deleteBtnDOM = document.querySelector('.delete-btn')
//const editBtnDOMS = document.querySelectorAll('.edit-btn')
async function loadTicketDataIntoForm(id) {
try
{
    
    const token = localStorage.getItem('token')
    
    if (!token) {
      location.replace('/login.html'); // force back to login
      return;
    }

const {
data:ticket,
} = await axios.get(`/api/v1/tickets/${id}`, {
headers: {
  Authorization: `Bearer ${token}`,
}},)

//console.log(ticket)
const {subject, department, location, category, subCategory, approvedBy,  
  status, createdBy,  assignedTo, remark, createdAt, id:ticketID, approval,
  list1, sub2, createdByUser,  assignedToUser, departmentTicket, approvedByUser
} = ticket.ticket

const [year, month, day] = createdAt.split('T')[0].split('-');
const date = `${day}/${month}/${year}`;

subjectInputUpdateDOM.value = subject
departmentInputUpdateDOM.value = departmentTicket.department
locationInputUpdateDOM.value = location
createdAtInputUpdateDOM.value = date
approvalInputUpdateDOM.value=approval

if(categorySelectUpdateDOM.length==1){
  await bringCategorysUpdate ()
}
categorySelectUpdateDOM.value = list1.categoryName
// console.log(list1.categoryName)
// categorySelectUpdateDOM.dataset.id = list1.categoryid
for (var i = 0; i < categorySelectUpdateDOM.length; i++) {
  if (categorySelectUpdateDOM[i].dataset.id === list1.categoryid) {
    categorySelectUpdateDOM[i].selected = true;
    categorySelectUpdateDOM.dataset.id = list1.categoryid
  }
}
// console.log(subCategory.name)
////////////
/*
if(subCategorySelectUpdateDOM.length==1){
  await bringSubCategoriesUpdate (list1.categoryid)
}
  */
/////////////////

await bringSubCategoriesUpdate(list1.categoryid)

if (sub2 === null || !sub2.subCategoryid) {
  subCategorySelectUpdateDOM.value = ""
  subCategorySelectUpdateDOM.dataset.id = ""
} else {

  subCategorySelectUpdateDOM.value = sub2.subCategoryName
subCategorySelectUpdateDOM.dataset.id = sub2.subCategoryid
  
 // for (let i = 0; i < subCategorySelectUpdateDOM.length; i++) {
    //const option = subCategorySelectUpdateDOM.options[i]
 //   if (subCategorySelectUpdateDOM[i].dataset.id === sub2.subCategoryid) {
  //    subCategorySelectUpdateDOM[i].selected = true
  //    subCategorySelectUpdateDOM.dataset.id = sub2.subCategoryid
  //   subCategorySelectUpdateDOM.value = sub2.subCategoryName
   //   break
   // }
 // }
}

console.log("Loaded subcategories:", subCategorySelectUpdateDOM.innerHTML)
console.log("Expected subCategory id:", sub2?.subCategoryid)
console.log("Expected subCategory Name:", sub2?.subCategoryName)

/*
if(subCategory===null) {

  subCategorySelectUpdateDOM.value = "-"
  }
  else {
subCategorySelectUpdateDOM.value = sub2.subCategoryName
subCategorySelectUpdateDOM.dataset.id = sub2.subCategoryid
}

for (var i = 0; i < subCategorySelectUpdateDOM.length; i++) {
  if (subCategorySelectUpdateDOM[i].dataset.id === subCategory._id) {
    subCategorySelectUpdateDOM[i].selected = true;
  }
}

*/
//approvalInputUpdateDOM.value = approval
statusInputUpdateDOM.value = status
createdByInputUpdateDOM.value= createdByUser.createdBy
createdByInputUpdateDOM.dataset.id=createdByUser.createdById


if(approvedBy===null) {

approvedByInputUpdateDOM.value = "-"
}
else{
  approvedByInputUpdateDOM.value = approvedByUser.approvedBy
 // approvedByInputUpdateDOM.dataset.id = approvedByUser.approvedById
}

if(assignedTo===null){
assignedToInputUpdateDOM.value = "-"
}
else {
  assignedToInputUpdateDOM.value =assignedToUser.assignedTo
//  assignedToInputUpdateDOM.dataset.id=assignedToUser.assignedToId
}
if(remark === null) {
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
//Bring data for update
ticketsDOM.addEventListener('click', async (e) => {
    const el = e.target
    if (el.parentElement.classList.contains('edit-btn')) {
      //loadingDOM.style.visibility = 'visible'
      
      const id = el.parentElement.dataset.id
      updateModal.style.display = "block"
    overlayDOM.style.display = "block"
      //console.log(id)
await loadTicketDataIntoForm(id) 

}

 if (el.parentElement.classList.contains('print-btn')) {
      //loadingDOM.style.visibility = 'visible'
      
      const id = el.parentElement.dataset.id
      try {
        const token = localStorage.getItem('token')
         if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
        const { data: ticket } = await axios.get(`/api/v1/tickets/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
  
        const {
          subject,
          location,
          departmentTicket,
          list1,
          sub2,
          createdByUser,
          assignedToUser,
          status,
          remark,
          createdAt,
          approvedByUser
        } = ticket.ticket
  
        // Populate print view (no need to touch modal)
       // document.getElementById('printSubject').textContent = subject || '-'
       // document.getElementById('printLocation').textContent = location || '-'
        document.getElementById('printDepartment').textContent = departmentTicket.department
       // document.getElementById('printCategory').textContent = list1.categoryName
       // document.getElementById('printSubcategory').textContent = sub2?.subCategoryName || '-'
       await populatePrintSubcategories(sub2?.subCategoryid || null)
       await populatePrintCategories(list1?.categoryid || null)
       // document.getElementById('printStatus').textContent = status
        document.getElementById('printRemark').textContent = remark || '-'
        document.getElementById('printCreatedBy').textContent = createdByUser.createdBy
       // document.getElementById('printApprovedBy').textContent =  approvedByUser?.approvedBy || '-'
       // document.getElementById('printAssignedTo').textContent = assignedToUser?.assignedTo || '-'
        document.getElementById('printDate').textContent = createdAt.split('T')[0].split('-').reverse().join('-');
        document.getElementById('printQuantity').textContent = '-' 
       const approvedBy = approvedByUser?.approvedBy || '-'
// document.getElementById('printApprovedBy').textContent = approvedBy
  
        // Print!
        printFormOnly(printView)
  
      } catch (err) {
        console.error('Error loading ticket for print:', err)
      }
    }
 }

)


//// Print

 

function printFormOnly(elementId) {
  //const element = document.getElementById(elementId)
  if (!elementId) {
    console.error(`Element with ID "${elementId}" not found.`)
    return
  }
 // console.log(document.getElementById('printView').innerHTML)

  const content = elementId.innerHTML
  const original = document.body.innerHTML

  document.body.innerHTML = content
  window.print()
  document.body.innerHTML = original
  window.location.reload()
}



//////
updateModal.addEventListener('load', async () => {

  try
    {
        const token = localStorage.getItem('token')
         if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
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

////Update Status
btnUpdateDOM.addEventListener('click', async (e) => {
    e.preventDefault();
  
    const id = btnUpdateDOM.dataset.id;
    const token = localStorage.getItem('token');
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
  
    try {
      // Defensive check: make sure an option is selected
      const selectedOption = subCategorySelectUpdateDOM.options[subCategorySelectUpdateDOM.selectedIndex];
      const subCategoryValue = selectedOption?.dataset?.id || null;
  
      const statusValue = statusInputUpdateDOM.value;
      const remarkValue = remarkInputUpdateDOM.value;
  
      const updatePayload = {};
      if (statusValue) updatePayload.status = statusValue;
      if (remarkValue) updatePayload.remark = remarkValue;
      if (subCategoryValue) updatePayload.subCategory = subCategoryValue;

      if (Object.keys(updatePayload).length === 0) {
        formAlertUpdate.style.display = 'block';
        formAlertUpdate.textContent = 'Please provide at least one field to update.';
        return;
      }
  
      const { data: { ticket } } = await axios.patch(
        `/api/v1/tickets/${id}/updateStatus`,
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
  
      formAlertUpdate.style.display = 'block';
      formAlertUpdate.textContent = 'Success, edited ticket';

      formAlertUpdate.classList.add('text-success');
      //showTickets(currentPage);
      await showStaffTicketStats ()
     await showTicketsWithFilters(currentPage);
    } catch (error) {
      console.error(error);
      formAlertUpdate.style.display = 'block';
      formAlertUpdate.textContent = 'Error, please try again';
    }
  
    setTimeout(() => {
      formAlertUpdate.style.display = 'none';
      formAlertUpdate.classList.remove('text-success');
    }, 3000);
  });   
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

  async function populatePrintSubcategories(selectedSubcategoryId) {
    try {
      const token = localStorage.getItem('token');
       if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
      // Fetch categories (using your bringCategorys function)
      const { data: { categorys } } = await axios.get('/api/v1/category', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Fetch subcategories (using bringSubCategoriesUpdate for this example)
      const { data: subCategories } = await axios.get('/api/v1/subCategory/name', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Container to hold the checkboxes
      const container = document.getElementById('printSubcategoryContainer');
      container.innerHTML = ''; // Clear any existing checkboxes
  
      // Iterate over categories
      categorys.forEach(category => {
        
        const categoryTitle = document.createElement('div');
        categoryTitle.innerHTML = `<strong>${category.name}</strong>`;
        categoryTitle.style.marginTop = '10px';
        categoryTitle.style.marginBottom = '5px';
        categoryTitle.style.fontSize = '1.5rem';
        container.appendChild(categoryTitle);
  
        // Filter subcategories based on category ID (same logic as your code)
        const categorySubcategories = subCategories.subcategorys.filter(sub => sub.list.categoryid === category.id);
  
        // Render checkboxes for each subcategory of this category
        categorySubcategories.forEach(sub => {

         // console.log(`sub.id: ${sub.id} (${typeof sub.id}), selectedSubcategoryId: ${selectedSubcategoryId} (${typeof selectedSubcategoryId})`);


          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.disabled = true;
          checkbox.checked = (String(sub.id) === String(selectedSubcategoryId)); // Check if this is the selected subcategory
         // console.log(checkbox.checked)
         if (String(sub.id) === String(selectedSubcategoryId)) {
          checkbox.checked = true;
          checkbox.setAttribute('checked', 'checked'); //
          checkbox.style.backgroundColor = 'black';
          
        }
        
          checkbox.id = `print-sub-${sub.id}`;
          // Style the checkbox to be bigger
      checkbox.style.transform = 'scale(1.5)';
      checkbox.style.marginRight = '1.5rem';
          
          const label = document.createElement('label');
          label.setAttribute('for', checkbox.id);
          label.textContent = sub.name;
         // label.style.marginLeft = '8px';
          label.style.fontSize = '1.5rem';
  
          const wrapper = document.createElement('div');
         // wrapper.style.marginBottom = '5px';
          wrapper.style.display = 'flex';
          wrapper.style.alignItems = 'center';
          wrapper.style.marginBottom = '1.5rem';
          wrapper.style.marginLeft = '1.5rem';
          wrapper.appendChild(checkbox);
          wrapper.appendChild(label);
  
          container.appendChild(wrapper);
        });
      });
    } catch (err) {
      console.error('Error loading categories/subcategories for print:', err);
    }
  }
  

  async function populatePrintCategories(selectedCategoryId) {
    try {
      const token = localStorage.getItem('token');
       if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
  
      // Fetch all categories
      const { data: { categorys } } = await axios.get('/api/v1/category', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      // Get the container to display the checkboxes
      const container = document.getElementById('printCategoryContainer');
      container.innerHTML = ''; // Clear existing content
  
      categorys.forEach(category => {
        const isSelected = String(category.id) === String(selectedCategoryId);
  
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.disabled = true;
        checkbox.checked = isSelected;
  
        if (isSelected) {
          checkbox.setAttribute('checked', 'checked'); // Ensure it's visible in print
        
        }
  
        checkbox.id = `print-cat-${category.id}`;

        // Style the checkbox to be bigger
      checkbox.style.transform = 'scale(2.5)';
      checkbox.style.marginRight = '2rem';
  
        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        label.textContent = category.name;
        label.style.fontSize = '1.5rem';
       // label.style.marginLeft = '8px';
  
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginBottom = '1.5rem';
        wrapper.style.marginLeft = '1.5rem';
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
  
        container.appendChild(wrapper);
      });
  
    } catch (err) {
      console.error('Error loading categories for print:', err);
    }
  }
  

  //let allFetchedTickets = []; // cache to avoid re-fetching
//let currentPage = 1;
let numOfPages = 1;
let currentEndpoint = 'assignedTickets';
let dateFilter = { start: null, end: null };
let filteredTicketsForExport = [];

//document.getElementById('startDate').addEventListener('change', filterAndDisplayTickets);
//document.getElementById('endDate').addEventListener('change', filterAndDisplayTickets);

document.getElementById('filterBtn').addEventListener('click', async () => {
  const startInput = document.getElementById('startDate').value;
  const endInput = document.getElementById('endDate').value;

  if (startInput && isNaN(Date.parse(startInput))) return alert("Invalid Start Date");
  if (endInput && isNaN(Date.parse(endInput))) return alert("Invalid End Date");

  // Just store the string "YYYY-MM-DD"
  dateFilter.start = startInput || null;
  dateFilter.end = endInput || null;

  currentPage = 1;
  await showTicketsWithFilters(currentPage);
});


/*
document.getElementById('filterBtn').addEventListener('click', async () => {
    const startInput = document.getElementById('startDate').value;
    const endInput = document.getElementById('endDate').value;
  
    const startDate = startInput ? new Date(startInput) : null;
    const endDate = endInput ? new Date(endInput) : null;
  
    if (startDate && isNaN(startDate)) return alert("Invalid Start Date");
    if (endDate && isNaN(endDate)) return alert("Invalid End Date");
  
    if (endDate) endDate.setHours(23, 59, 59);
  
    dateFilter.start = startDate;
    dateFilter.end = endDate;
  
    currentPage = 1;
    await showTicketsWithFilters(currentPage); // 👈 Modified function
  });
  
*/

  const showTicketsWithFilters = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
       if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
  
      const {
        data: { tickets, totalTickets, numOfPages: totalPages },
      } = await axios.get(`/api/v1/tickets/${currentEndpoint}?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      numOfPages = totalPages;
      noOfPages=numOfPages;


      const filteredTickets = tickets.filter(ticket => {
        const ticketDateStr = ticket.createdAt.split('T')[0]; // "YYYY-MM-DD"
      
        if (dateFilter.start && ticketDateStr < dateFilter.start) return false;
        if (dateFilter.end && ticketDateStr > dateFilter.end) return false;
      
        return true;
      });
      
      
  /*
      const filteredTickets = tickets.filter(ticket => {
        const createdAt = new Date(ticket.createdAt);
        if (dateFilter.start && createdAt < dateFilter.start) return false;
        if (dateFilter.end && createdAt > dateFilter.end) return false;
        return true;
      });
  */
      // Store for export if on first page (optional: fetch all pages separately too)
      if (page === 1) filteredTicketsForExport = [...filteredTickets];
  
      updateTableWithButtons(filteredTickets); // Renders table rows with action buttons
      updatePaginationButtons(); // Your pagination control logic
    } catch (err) {
      ticketsDOM.innerHTML = `<tr><td colspan="8">Error loading tickets</td></tr>`;
    }
  };
  
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded'); 
    showTicketsWithFilters(currentPage);
  });
  

//let allFetchedTickets = []; // Declare this globally
//let filteredTicketsForExport = []; // Also global

/*
async function filterAndDisplayTickets(endpoint = 'assignedTickets') {
  const start = document.getElementById('startDate').value;
  const end = document.getElementById('endDate').value;

  let startDate = start ? new Date(start) : null;
  let endDate = end ? new Date(end) : null;

  if (start && isNaN(startDate)) {
    alert("Invalid Start Date format! Please enter a valid date.");
    return;
  }

  if (end && isNaN(endDate)) {
    alert("Invalid End Date format! Please enter a valid date.");
    return;
  }

  if (endDate) {
    endDate.setHours(23, 59, 59);
  }

  // Fetch all if not already fetched or if endpoint changed
  if (allFetchedTickets.length === 0 || filterAndDisplayTickets.lastEndpoint !== endpoint) {
    allFetchedTickets = await fetchAllTickets(endpoint);
    filterAndDisplayTickets.lastEndpoint = endpoint;
  }

  if (!start && !end) {
    updateTable(allFetchedTickets);
    filteredTicketsForExport = allFetchedTickets;
    return;
  }

  const filtered = allFetchedTickets.filter(ticket => {
    const createdAt = new Date(ticket.createdAt);

    if (startDate && endDate) {
      return createdAt >= startDate && createdAt <= endDate;
    }

    if (startDate) return createdAt >= startDate;
    if (endDate) return createdAt <= endDate;

    return true;
  });

  filteredTicketsForExport = filtered;

  if (filtered.length === 0) {
    ticketsDOM.innerHTML = `<tr><td colspan="8" style="text-align:center;">No tickets found in selected range</td></tr>`;
  } else {
    updateTable(filtered); // 👈 This shows table rows with action buttons
  }
}
*/
// Helper function to update the table
// <td>${ticket.assignedToUser?.assignedTo || '-'}</td>
function updateTableWithButtons(tickets) {
  const rows = tickets.map(ticket => {
    const {
      id: ticketID,
      departmentTicket,
      subject,
      location,
      list1,
      status,
      createdByUser,
      assignedToUser,
      approvedByUser,
      createdAt
    } = ticket;
    const [year, month, day] = createdAt.split('T')[0].split('-');
const date = `${day}/${month}/${year}`;

   return `
    <tr>
     
      <td title="${departmentTicket.department}">${departmentTicket?.department || '-'}</td>
      <td>${location || '-'}</td>
      <td>${list1?.categoryName || '-'}</td>
      <td>${status || '-'}</td>
      <td>${createdByUser?.createdBy || '-'}</td>
     
      <td>${date}</td>
      <td>
          <div class="user-links">
            <button data-id="${ticketID}" data-toggle="modal" data-target="#exampleModal" class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button data-id="${ticketID}" data-toggle="modal" data-target="#exampleModal" class="print-btn">
              <i class="fas fa-print"></i>
            </button>
          </div>
        </td>

    </tr>
  `;}).join('');
  
  ticketsDOM.innerHTML = rows;
}


async function prepareExportedTickets() {
    const token = localStorage.getItem('token');
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
    let page = 1;
    let allFiltered = [];
  
    while (page <= numOfPages) {
      const { data } = await axios.get(`/api/v1/tickets/${currentEndpoint}?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const filtered = data.tickets.filter(ticket => {
        const ticketDateStr = ticket.createdAt.split('T')[0]; // "2025-04-27"
        
        if (dateFilter.start) {
          let startDateStr = new Date(dateFilter.start)
           startDateStr =startDateStr.toISOString().split('T')[0];
          if (ticketDateStr < startDateStr) return false;
        }
      
        if (dateFilter.end) {
        let endDateStr = new Date(dateFilter.end)
           endDateStr = endDateStr.toISOString().split('T')[0];
          if (ticketDateStr > endDateStr) return false;
        }
      
        return true;
      });
      
/*
      const filtered = data.tickets.filter(ticket => {
        const createdAt = new Date(ticket.createdAt);
        if (dateFilter.start && createdAt < dateFilter.start) return false;
        if (dateFilter.end && createdAt > dateFilter.end) return false;
        return true;
      });
  */
      allFiltered.push(...filtered);
      page++;
    }
  
    filteredTicketsForExport = allFiltered;
  }
  

document.getElementById('exportBtn').addEventListener('click', async () => {
  await prepareExportedTickets();

  if (filteredTicketsForExport.length === 0) {
    alert("No tickets to export.");
    return;
  }

  const rows = filteredTicketsForExport.map(ticket => ({
    Department: ticket.departmentTicket?.department || '-',
    Location: ticket.location || '-',
    Subject:ticket.subject|| '-',
    Category: ticket.list1?.categoryName || '-',
    SubCategory:ticket.sub2?.subCategoryName || '-',
   
    Remark:ticket.remark||'-',
    Date: new Date(ticket.createdAt).toLocaleDateString(),
    Status: ticket.status || '-',
    RequestedBy: ticket.createdByUser?.createdBy || '-',
    ApprovedBy:ticket.approvedByUser?.approvedBy ||'-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Filtered Tickets');
  XLSX.writeFile(workbook, 'filtered_tickets.xlsx');
});
