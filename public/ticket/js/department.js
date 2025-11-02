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
//const subCategorySelectUpdateDOM = document.querySelector('.selectTicketSubCategory')
const subCategorySelectUpdateDOM = document.querySelector('.ticket-subcategory-input')
const approvalInputUpdateDOM = document.querySelector('.selectTicketApproval')
const statusInputUpdateDOM = document.querySelector('.selectTicketStatus')
const createdByInputUpdateDOM = document.querySelector('.ticket-createdBy-input')
const approvedByInputUpdateDOM = document.querySelector('.ticket-approvedBy-input')
const assignedToInputUpdateDOM = document.querySelector('.ticket-assignedTo-input')
const remarkInputUpdateDOM = document.querySelector('.ticket-remark-input')
const createdAtInputUpdateDOM = document.querySelector('.ticket-createdAt-input')
const logoutDOM = document.querySelector('.logout')
const pendingStatDOM = document.querySelector('.pending-stat')
const acceptedStatDOM = document.querySelector('.accepted-stat')
const pendingDOM = document.querySelector('.pending')
const acceptedDOM = document.querySelector('.accepted')
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

/////////////////////////////

// =============================
// State
// =============================
let currentPage = 1;
let noOfPages = 0;
let mode = "all"; // "all", "pending", "accepted"

// ------------------------
// Helper: pick endpoint based on mode
// ------------------------
const getTicketsEndpoint = (page) => {
  // --- Use the endpoints your backend already exposes ---
  if (mode === 'pending') {
    return `/api/v1/tickets/departmentPendingTickets?page=${page}`;
  } else if (mode === 'accepted') {
    return `/api/v1/tickets/departmentAcceptedTickets?page=${page}`;
  } else {
    return `/api/v1/tickets/departmentTickets?page=${page}`;
  }
};

const paginationNumbers = document.querySelector("#pagination-numbers");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");

// =============================
// Pagination helpers
// =============================
const renderPagination = () => {
  paginationNumbers.innerHTML = "";

   if (!noOfPages || noOfPages <= 1) {
    updatePaginationButtons();
    return;
  }

  for (let i = 1; i <= noOfPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.className = "pagination-number";
    pageBtn.setAttribute('page-index', i);
    pageBtn.setAttribute('aria-label', `Page ${i}`);
    pageBtn.innerText = i;

    if (i === currentPage) pageBtn.classList.add("active");

    pageBtn.addEventListener("click", () => changePage(i));
    paginationNumbers.appendChild(pageBtn);
  }

  updatePaginationButtons();
};

const updatePaginationButtons = () => {

   // if there are no pages or only one page, hide both
  if (!noOfPages || noOfPages <= 1) {
    prevButton.style.visibility = 'hidden';
    nextButton.style.visibility = 'hidden';
    return;
  }
  prevButton.style.visibility = currentPage === 1 ? "hidden" : "visible";
  nextButton.style.visibility = currentPage === noOfPages ? "hidden" : "visible";
};

const changePage = (page) => {
  if (!page || page < 1) page = 1;
  if (noOfPages && page > noOfPages) page = noOfPages;
  if (page === currentPage) return;
  currentPage = page;
  loadTickets();
};

// =============================
// Ticket Loader (unified)
// =============================
const loadTickets = async () => {
  try {
   // let url = `/api/v1/tickets/departmentTickets?page=${currentPage}`;

//    if (mode === "pending") url += "&status=pending";
  //  if (mode === "accepted") url += "&status=accepted";

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

             const endpoint = getTicketsEndpoint(currentPage);

    const {
      data: { tickets, numOfPages: pages },
    } = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!tickets || tickets.length === 0) {
      ticketsDOM.innerHTML = `<h5 class="empty-list">No tickets found</h5>`;
     // paginationNumbers.innerHTML = "";
      noOfPages = pages || 0;
      renderPagination();
      return;
    }

   // noOfPages = pages;
  //  renderPagination();
   // update paging state & render pagination
    noOfPages = pages || 1;
    renderPagination();


    const html = tickets
      .map(
        (ticket) => {

 // destructure carefully, provide defaults for missing nested objects
        const {
          subject = '',
          approval = '',
          status = '',
          createdAt = '',
          createdBy = '',
          id: ticketID = '',
          list1 = {},
          createdByUser = {},
          assignedToUser = {},
        } = ticket;

        

         // createdAt -> DD/MM/YYYY (defensive)
        let date = '-';
        try {
          const [year, month, day] = (createdAt || '').split('T')[0].split('-');
          date = `${day}/${month}/${year}`;
        } catch (e) {
          date = createdAt || '-';
        }

        const categoryName = list1.categoryName || '-';
        const createdByName = createdByUser.createdBy || '-';
       // const assignedToName = assignedToUser.assignedTo || null;
        const assignedToName = assignedToUser?.assignedTo || '-';


         // show delete button only to creator when pending (your original rule)
        const deleteButtonHtml =
          ((createdBy === userID) && (status === 'pending'))
            ? `<button type="button" class="delete-btn" data-id="${ticketID}"><i class="fas fa-trash"></i></button>`
            : '';

             return `<tr>
          <td data-id="${list1.categoryid || ''}">${categoryName}</td>
          <td>${approval}</td>
          <td>${status}</td>
          <td>${date}</td>
          <td data-id="${createdByUser.createdById || ''}">${createdByName}</td>
          <td>
  ${assignedToUser?.assignedTo
    ? `<span data-id="${assignedToUser.assignedToId}">${assignedToUser.assignedTo}</span>`
    : '-'}
</td>

        
          <td>
            <div class="user-links">
              <button data-id="${ticketID}" class="edit-btn"><i class="fas fa-edit"></i></button>
              
              ${((createdBy == userID) && (status ==="pending")) ? 
    '<button type="button" class="delete-btn" data-id="' + ticketID + '">' +
      '<i class="fas fa-trash"></i>' +
    '</button>' 
    : ''
  }
            </div>
          </td>
        </tr>`;
      }).join('');

    ticketsDOM.innerHTML = html;

     

// wire delete buttons now that DOM exists
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
        const ticketID = event.currentTarget.dataset.id;
        const confirmed = window.confirm('Are you sure you want to delete this ticket?');
        if (!confirmed) return;

        try {
          await axios.delete(`/api/v1/tickets/${ticketID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
         await showTicketStats ()
           // reload current page
         await loadTickets();
        } catch (err) {
          console.error('Error deleting ticket:', err);
          alert(err.response?.data?.msg || 'There was an error deleting the ticket.');
        }
      });
    });


      
      
   } catch (err) {
    console.error('Error loading tickets:', err);
    ticketsDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
    paginationNumbers.innerHTML = '';
    noOfPages = 0;
    updatePaginationButtons();
  }
};

// =============================
// Event Listeners
// =============================
prevButton.addEventListener("click", () => {
  if (currentPage > 1) changePage(currentPage - 1);
});

nextButton.addEventListener("click", () => {
  if (currentPage < noOfPages) changePage(currentPage + 1);
});
/*
// Filter buttons
document.querySelector("#all-btn").addEventListener("click", () => {
  mode = "all";
  currentPage = 1;
  loadTickets();
});
*/

if (pendingDOM) {
document.querySelector(".pending").addEventListener("click", () => {
  mode = "pending";
  currentPage = 1;
  console.log('pending')
  loadTickets();
});
}

if (acceptedDOM) {
document.querySelector(".accepted").addEventListener("click", () => {
  mode = "accepted";
  currentPage = 1;
  console.log("accepted")
  loadTickets();
});
}
// =============================
// Initial load
// =============================
loadTickets();



///////////////////////////


// update pagination button visibility

//showStat

const showTicketStats = async () => {

  try {
const token = localStorage.getItem('token')

if (!token) {
  location.replace('/login.html'); // force back to login
  return;
}

  const {data:{defaultStats},} = await axios.get(`/api/v1/tickets/departmentStats`,
  {
      headers: {
        Authorization: `Bearer ${token}`,
      }},
   )

   

console.log({defaultStats})
pendingStatDOM.innerHTML=defaultStats.pending 
acceptedStatDOM.innerHTML=defaultStats.accepted
  
}
catch(error) {
  console.log(error)
}
}


showTicketStats ()

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
  if(categorySelectDOM.length==1){
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
//BringCategorys

const bringCategorys = async () =>  {
  try
  {
      const token = localStorage.getItem('token')
       if (!token) {
          location.replace('/login.html'); // force back to login
          return ;
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
.map((category) => {
const {name,  id:categoryID} = category
return `
<option data-id="${categoryID}">${name}</option>
`
})
.join('')
categorySelectDOM.insertAdjacentHTML('beforeend', allCategorys)
//categorySelectUpdateDOM[0].selected=true
//categorySelectUpdateDOM.selectedIndex="0"

  } catch(error) {
      
    categorySelectDOM.innerHTML=
      `<h5 class="empty-list">There was an error, please try later....</h5>`
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




//Bring SubCategories
//BringCategoryUpdate
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



//var option = document.createElement("option");
//option.text = "Please select...";

//categorySelectDOM.appendChild(option);
//select

// Update Pagination Button Visibility


//Pending Tickets

//Accepted Tickets

//



//add Ticket
formDOM.addEventListener('submit', async (e) => {
  formAlertDOM.classList.remove('text-success')
  //successDOM.classList.remove('text-success')
  
  //bringCategorysUpdate()

  
  const category = categorySelectDOM.options[categorySelectDOM.selectedIndex].dataset.id
 // const subCategory = subCategorySelectDOM.options[subCategorySelectDOM.selectedIndex].dataset.id
  //const department = departmentInputDOM.options[departmentInputDOM.selectedIndex].dataset.id
  e.preventDefault()
  console.log(category)
  //console.log(subCategory)
  const subject = subjectInputDOM.value
  const location = locationInputDOM.value
  //const department = departmentInputDOM.value
 // console.log(subCategory)
  //const category = categoryInputDOM.value
  //const subCategory = subCategoryInputDOM.value



  try {
    const token = localStorage.getItem('token')
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }

    const { data } = await axios.post('/api/v1/tickets', { subject, 
        location, category}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }},)

    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = data.msg

    formAlertDOM.classList.add('text-success')
    subjectInputDOM.value = ''
    locationInputDOM.value = ''
   // departmentInputDOM.value = ''
    //categoryInputDOM.value = ''
    //subCategoryInputDOM.value = ''

   // localStorage.setItem('token', data.token)
    //resultDOM.innerHTML = ''
    formAlertDOM.style.display = 'block'
    formAlertDOM.textContent = 'Registration is successful'
    formAlertDOM.classList.add('text-success')
    await showTicketStats ()
    await loadTickets ()
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
    
if(categorySelectUpdateDOM.length==1){
    await bringCategorysUpdate ()
}
    //bringSubCategorysUpdate ()
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
    data:ticket,
} = await axios.get(`/api/v1/tickets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)

    console.log(ticket)
    const {subject, department, location, category, subCategory, approval, 
      status, createdBy, approvedBy, assignedTo, remark, createdAt, id:ticketID,
      list1, sub2, createdByUser, assignedToUser, approvedByUser, departmentTicket
    } = ticket.ticket
    subjectInputUpdateDOM.value = subject
    departmentInputUpdateDOM.value = departmentTicket.department
    departmentInputUpdateDOM.dataset.id=departmentTicket.departmentId
    locationInputUpdateDOM.value = location

 //   var date = createdAt.slice(0, 10)
// date = date.split('-').reverse().join('/')

const [year, month, day] = createdAt.split('T')[0].split('-');
const date = `${day}/${month}/${year}`;


    createdAtInputUpdateDOM.value = date
    categorySelectUpdateDOM.value = list1.categoryName
    categorySelectUpdateDOM.dataset.id = list1.categoryid
    for (var i = 0; i < categorySelectUpdateDOM.length; i++) {
      if (categorySelectUpdateDOM[i].dataset.id === list1.categoryid) {
        categorySelectUpdateDOM[i].selected = true;
      }
    }
   // console.log(sub2.subCategoryName)
    ////////////
    ///await bringSubCategoriesUpdate (list1.categoryid)
    /////////////////
    if(subCategory===null || subCategory===""){
        subCategorySelectUpdateDOM.value = "-"
        }
        else {
    subCategorySelectUpdateDOM.value = sub2.subCategoryName
        }
    //subCategorySelectUpdateDOM.dataset.id = sub2.subCategoryid
    /*
    for (var i = 0; i < subCategorySelectUpdateDOM.length; i++) {
      if (subCategorySelectUpdateDOM[i].dataset.id === sub2.subCategoryid) {
        subCategorySelectUpdateDOM[i].selected = true;
      }
    }

    */
    approvalInputUpdateDOM.value = approval
    statusInputUpdateDOM.value = status
    createdByInputUpdateDOM.value= createdByUser.createdBy
    createdByInputUpdateDOM.dataset.id=createdByUser.createdById
    if(approvedBy===null) {

    approvedByInputUpdateDOM.value = "-"
    }
    else{
      approvedByInputUpdateDOM.value = approvedByUser.approvedBy
      approvedByInputUpdateDOM.dataset.id = approvedByUser.approvedById
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
    btnUpdateDOM.dataset.id = ticketID

    const {
        data:{user},
    }= await axios.get(`/api/v1/users/showMe`, 
    {
        headers: {
          Authorization: `Bearer ${token}`,
        }},)
      const userID = user.userId
      console.log(userID)
      
       //const {name, department:userDepartment, position, role, email, id:userId, listDepartment} = user
       // const{name, userId, role} = user
       if(createdBy == userID) {
        console.log(createdBy == userID)
        subjectInputUpdateDOM.removeAttribute("disabled");
        categorySelectUpdateDOM.removeAttribute("disabled");
        locationInputUpdateDOM.removeAttribute("disabled");
       }
       else {
        subjectInputUpdateDOM.setAttribute("disabled", true);
        categorySelectUpdateDOM.setAttribute("disabled", true);
        locationInputUpdateDOM.setAttribute("disabled", true);
       }
    

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
  const categoryFilter = categorys.filter(item => item.list1.categoryName==categoryname)
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

////Update Approval
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
const subjectValue = subjectInputUpdateDOM.value
const locationValue = locationInputUpdateDOM.value
//const departmentValue = departmentInputUpdateDOM.value
const categoryValue = categorySelectUpdateDOM.options[categorySelectUpdateDOM.selectedIndex].dataset.id

//const subCategoryValue = null
const approvalValue = approvalInputUpdateDOM.value
//console.log(userRole)
const {
    data:{ticket},
} = await axios.patch(`/api/v1/tickets/${id}/updateApproval`, {approval:approvalValue, 
    subject:subjectValue, 
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

await loadTickets()
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
    console.log(id)
    try {

      const token = localStorage.getItem('token')
      await axios.delete(`/api/v1/tickets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }},)
        showTickets(currentPage)
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