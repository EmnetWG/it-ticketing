//import axios from 'axios'
//var requirejs = require('requirejs');
import axios from './axios.js';
//requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
 //   nodeRequire: require
//});
//const axios = require("axios/dist/browser/axios.cjs")

// --- DOM Selectors ---
const formDOM = document.querySelector('.form')
const subjectInputDOM = document.querySelector('.subject-input')
const locationInputDOM = document.querySelector('.location-input')
const departmentInputDOM = document.querySelector('.department-input')
const categorySelectDOM = document.querySelector('.selectCategory')
const subCategorySelectDOM = document.querySelector('.selectSubCategory')
const overlayDOM = document.querySelector('.overlay')
const closeDOM = document.querySelector(".btn-close")
const btnAddDOM = document.querySelector('.addTicket')
const btnUpdateDOM = document.querySelector('.btnUpdate') // Update button for the modal
const formAlertDOM = document.querySelector('.form-alert') // Alert for add form
const formAlertUpdate = document.querySelector('.form-alert-update') // Alert for update modal
const ticketsDOM = document.querySelector('.ticketList')
const addModal = document.querySelector('.ticketContent') // Add ticket modal/section
const updateModal = document.querySelector('.modal') // Update ticket modal
const successDOM = document.querySelector('.success')

// Update Modal Input Fields
const subjectInputUpdateDOM = document.querySelector('.ticket-name-input')
const locationInputUpdateDOM = document.querySelector('.ticket-location-input')
const departmentInputUpdateDOM = document.querySelector('.ticket-department-input')
const categorySelectUpdateDOM = document.querySelector('.selectTicketCategory')
const subCategorySelectUpdateDOM = document.querySelector('.ticket-subcategory-input')
const approvalInputUpdateDOM = document.querySelector('.selectTicketApproval')
const statusInputUpdateDOM = document.querySelector('.selectTicketStatus')
const createdByInputUpdateDOM = document.querySelector('.ticket-createdBy-input')
const approvedByInputUpdateDOM = document.querySelector('.ticket-approvedBy-input')
const assignedToInputUpdateDOM = document.querySelector('.selectTicketAssignedTo') // Staff dropdown
const remarkInputUpdateDOM = document.querySelector('.ticket-remark-input')

// Other Selectors
const pendingDOM= document.querySelector('.pending')
const acceptedDOM = document.querySelector('.accepted')
const resolvedDOM = document.querySelector('.resolved')
const pendingStatDOM = document.querySelector('.pending-stat')
const acceptedStatDOM = document.querySelector('.accepted-stat')
const resolvedStatDOM = document.querySelector('.resolved-stat')
const logoutDOM = document.querySelector('.logout')
const span = document.getElementsByClassName("close")[0]; // Close button for add modal

// --- Event Listeners & Initial Setup ---

logoutDOM.addEventListener('click', async (e) => {
  e.preventDefault ()
  const utils = await import ('/logout.js')
  utils.removeToken()
});

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if(!token) {
    location.replace('/login.html')
  }
})

// --- Pagination Logic ---
let pending=1
let accepted= 0
let resolved = 0
let all=0 // Assuming default view shows all or pending initially

const paginationNumbers = document.getElementById("pagination-numbers");
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
  if(index === currentPage) pageNumber.classList.add('active')
pageNumber.addEventListener("click", () => {
    if(index >= 1 && index <= noOfPages){
currentPage = index;
if(pending === 1) {
  showPendingTickets(currentPage)
}
 else if(accepted === 1) {
      showAcceptedTickets(currentPage)
    }
    else {
      showResolvedTickets(currentPage)
    }
    }
  })
  
  paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = (pageCount) => {
  paginationNumbers.innerHTML = ''; // Clear existing numbers
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
  // Add event listeners to new page numbers if needed
};

// Update Pagination Button Visibility
const updatePaginationButtons = () => {
  if (!prevButton || !nextButton) return; // Guard against missing elements
  prevButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
  nextButton.style.visibility = currentPage === noOfPages ? 'hidden' : 'visible';
};


// Handle Previous Button Click
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
  currentPage = currentPage - 1;

  // Hide the "previous" button on first page and show "next"
  

  // Show the appropriate tickets
  if (pending === 1) {
    showPendingTickets(currentPage);
  } else if (accepted === 1) {
    showAcceptedTickets(currentPage);
  } else {
    showResolvedTickets(currentPage);
  }

}
});

// Handle Next Button Click
nextButton.addEventListener("click", () => {
   if (currentPage < noOfPages) {
  currentPage = currentPage + 1;

  // Hide the "next" button on last page and show "previous"
  

  // Show the appropriate tickets
  if (pending === 1) {
    showPendingTickets(currentPage);
  } else if (accepted === 1) {
    showAcceptedTickets(currentPage);
  } else {
    showResolvedTickets(currentPage);
  }
}
});

// --- Ticket Statistics ---
const showTicketStats = async () => {
  try {
    const token = localStorage.getItem('token')
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
   // const {data:{defaultStats}} = await axios.get(`/api/v1/tickets/approvedStats`, {
      const {data:{defaultStats}} = await axios.get(`/api/v1/tickets/allStats`, {
      
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log({defaultStats})
    pendingStatDOM.innerHTML=defaultStats.pending 
    acceptedStatDOM.innerHTML=defaultStats.accepted
    resolvedStatDOM.innerHTML=defaultStats.resolved
  } catch(error) {
    console.error('Error fetching ticket stats:', error)
  }
};

// --- Ticket Display Functions ---

// Function to render tickets (used by showPendingTickets, showAcceptedTickets, etc.)
const renderTickets = (tickets) => {
  const allTicketsHTML = tickets.map((ticket) => {
    var {subject, department, location, category, subCategory, 
     status, createdAt, createdBy, assignedTo, remark, id:ticketID, 
    list1, sub2, createdByUser, assignedToUser,  departmentTicket} = ticket;
    var date = createdAt.slice(0, 10);
    date = date.split('-').reverse().join('/');

    if(remark===null) { remark='-'; }

    // Safely access nested properties
    const deptId = departmentTicket ? departmentTicket.departmentId : '';
    const deptName = departmentTicket ? departmentTicket.department : '-';
    const catId = list1 ? list1.categoryid : '';
    const catName = list1 ? list1.categoryName : '-';
    const createdById = createdByUser ? createdByUser.createdById : '';
    const createdByName = createdByUser ? createdByUser.createdBy : '-';
    const assignedToId = assignedToUser ? assignedToUser.assignedToId : '';
    const assignedToName = assignedToUser ? assignedToUser.assignedTo : '-';

    return `<tr>
      <td data-id="${deptId}" title="${deptName}">${deptName}</td>
      <td>${location}</td>
      <td data-id="${catId}">${catName}</td>
      <td>${status}</td>
      <td>${date}</td>
      <td data-id="${createdById}">${createdByName}</td>
      ${assignedTo===null ? '<td>-</td>': `<td data-id="${assignedToId}">${assignedToName}</td>`}
      <td>
        <div class="user-links">
          <button data-id="${ticketID}" data-toggle="modal" data-target="#exampleModal" class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <!-- delete btn (optional) 
          <button type="button" class="delete-btn" data-id="${ticketID}">
            <i class="fas fa-trash"></i>
          </button>
          -->
        </div>
      </td>
    </tr>`;
  }).join('');
  ticketsDOM.innerHTML = allTicketsHTML;
};

// Show Pending Tickets
const showPendingTickets = async (page) => {
  try {
    const token = localStorage.getItem('token');
 if (!token) {
          location.replace('/login.html'); // force back to login
          return ;
        }

    const {
      data:{tickets, totalTickets, numOfPages},
    } = await axios.get(`/api/v1/tickets/pendingTickets?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!tickets || tickets.length < 1) {
      ticketsDOM.innerHTML = '<h5 class="empty-list">No pending tickets found.</h5>';
      noOfPages = 0;
    } else {
      noOfPages = numOfPages;
      renderTickets(tickets);
    }
    getPaginationNumbers(noOfPages);
    updatePaginationButtons();

  } catch(error) {
    console.error('Error fetching pending tickets:', error);
    ticketsDOM.innerHTML = '<h5 class="empty-list">Error loading pending tickets. Please try again later.</h5>';
  }
};

// Show Accepted Tickets
const showAcceptedTickets = async (page) => {
  try {
    const token = localStorage.getItem('token');
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
    const {
      data:{tickets, totalTickets, numOfPages},
    } = await axios.get(`/api/v1/tickets/acceptedTickets?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!tickets || tickets.length < 1) {
      ticketsDOM.innerHTML = '<h5 class="empty-list">No accepted tickets found.</h5>';
      noOfPages = 0;
    } else {
      noOfPages = numOfPages;
      renderTickets(tickets);
    }
    getPaginationNumbers(noOfPages);
    updatePaginationButtons();

  } catch(error) {
    console.error('Error fetching accepted tickets:', error);
    ticketsDOM.innerHTML = '<h5 class="empty-list">Error loading accepted tickets. Please try again later.</h5>';
  }
};

// Show Resolved Tickets
const showResolvedTickets = async (page) => {
  try {
    const token = localStorage.getItem('token');
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
    const {
      data:{tickets, totalTickets, numOfPages},
    } = await axios.get(`/api/v1/tickets/resolvedTickets?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!tickets || tickets.length < 1) {
      ticketsDOM.innerHTML = '<h5 class="empty-list">No resolved tickets found.</h5>';
      noOfPages = 0;
    } else {
      noOfPages = numOfPages;
      renderTickets(tickets);
    }
    getPaginationNumbers(noOfPages);
    updatePaginationButtons();

  } catch(error) {
    console.error('Error fetching resolved tickets:', error);
    ticketsDOM.innerHTML = '<h5 class="empty-list">Error loading resolved tickets. Please try again later.</h5>';
  }
};

// --- Filter Button Event Listeners ---
pendingDOM.addEventListener('click', async () =>{
  accepted=0;
  all=0;
  pending=1;
  resolved=0;
  currentPage=1;
  await showPendingTickets(currentPage);
});

acceptedDOM.addEventListener('click', async () => {
  accepted=1;
  all=0;
  pending=0;
  resolved=0;
  currentPage=1;
  await showAcceptedTickets(currentPage);
});

resolvedDOM.addEventListener('click', async () => {
  accepted=0;
  all=0;
  pending=0;
  resolved=1;
  currentPage=1;
  await showResolvedTickets(currentPage);
});


// --- Add Ticket Modal Logic ---
btnAddDOM.addEventListener('click', async () => {
  addModal.style.display='block';
  // Reset add form fields if necessary
  subjectInputDOM.value = '';
  locationInputDOM.value = '';
  departmentInputDOM.value = '';
  categorySelectDOM.innerHTML = '<option value="">-- Select Category --</option>'; // Reset categories
  subCategorySelectDOM.innerHTML = '<option value="">-- Select SubCategory --</option>'; // Reset subcategories
  formAlertDOM.style.display = 'none';
  await bringCategorys(); // Load categories for the add form
});

// Close add modal via 'x' span
span.onclick = function() {
  addModal.style.display = "none";
};

// Close modals on outside click
window.onclick = function(event) {
  if (event.target == addModal) {
    addModal.style.display = "none";
  }
  if (event.target == updateModal) {
    updateModal.style.display = "none";
     overlayDOM.style.display = "none";
  }
};

closeDOM.addEventListener('click', async ( ) => {
    overlayDOM.style.display = "none"
})

// --- Data Fetching for Dropdowns ---

// Function to fetch and populate IT staff dropdown (IMPROVED VERSION)
const bringITstaffs = async () => {
  try {
    const token = localStorage.getItem('token');
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
    const {
      data: { users }
    } = await axios.get(`/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },

 params: {
        role: 'IT staff',   // Filtering by IT staff role
             // Pagination: number of users per page
      },

    });

    // Clear existing options before adding new ones, keep a default
    assignedToInputUpdateDOM.innerHTML = '<option value="">-- Select Staff --</option>'; 

    if (!users || users.length < 1) {
      console.warn('No users found from API.');
      return;
    }
console.log(users)
    const userFilter = users.filter(item => item.role === 'IT staff');

    if (userFilter.length < 1) {
      console.warn('No users with role \'IT staff\' found.');
      return;
    }

    // Use value attribute for easier selection later, keep data-id if needed elsewhere
    const optionsHTML = userFilter
      .map(({ name, id }) => `<option value="${id}" data-id="${id}">${name}</option>`)
      .join('');

    assignedToInputUpdateDOM.insertAdjacentHTML('beforeend', optionsHTML);
    console.log('IT staff loaded:', userFilter.length);

  } catch (error) {
    console.error('Error fetching IT staff:', error);
    assignedToInputUpdateDOM.innerHTML = '<option value="">Error loading staff</option>'; // Provide feedback
  }
};

// Bring Categories for Update Modal
const bringCategorysUpdate = async () =>  {
  try {
    const token = localStorage.getItem('token');
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
    const { data:{categorys} } = await axios.get(`/api/v1/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    categorySelectUpdateDOM.innerHTML = '<option value="">-- Select Category --</option>'; // Start fresh

    if (!categorys || categorys.length < 1) {
      console.warn('No categories found for update modal.');
      return;
    }

    const allCategorys = categorys.map((category) => {
      const {name,  id:categoryID} = category;
      return `<option value="${categoryID}" data-id="${categoryID}">${name}</option>`;
    }).join('');

    categorySelectUpdateDOM.insertAdjacentHTML('beforeend', allCategorys);

  } catch(error) {
    console.error('Error fetching categories for update:', error);
    categorySelectUpdateDOM.innerHTML = '<option value="">Error loading categories</option>';
  }
};

// Bring Categories for Add Modal
const bringCategorys = async () =>  {
  try {
    const token = localStorage.getItem('token');
     if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
    const { data:{categorys} } = await axios.get(`/api/v1/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    categorySelectDOM.innerHTML = '<option value="">-- Select Category --</option>'; // Start fresh

    if (!categorys || categorys.length < 1) {
      console.warn('No categories found for add modal.');
      return;
    }

    const allCategorys = categorys.map((category) => {
      const {name,  id:categoryID} = category;
      return `<option value="${categoryID}" data-id="${categoryID}">${name}</option>`;
    }).join('');

    categorySelectDOM.insertAdjacentHTML('beforeend', allCategorys);

  } catch(error) {
    console.error('Error fetching categories for add:', error);
    categorySelectDOM.innerHTML = '<option value="">Error loading categories</option>';
  }
};

// Bring Subcategories (Assuming this function exists and works based on category selection)
// You might need to add event listeners to categorySelectDOM and categorySelectUpdateDOM
// to trigger fetching subcategories when a category is selected.
/*
const bringSubCategorys = async (categoryId, targetDropdown) => {
  // ... implementation to fetch subcategories based on categoryId ...
  // ... populate targetDropdown (subCategorySelectDOM or subCategorySelectUpdateDOM) ...
};

categorySelectDOM.addEventListener('change', (e) => {
  const categoryId = e.target.value;
  bringSubCategorys(categoryId, subCategorySelectDOM);
});

categorySelectUpdateDOM.addEventListener('change', (e) => {
  const categoryId = e.target.value;
  // You might need a different subcategory dropdown for the update modal
  // bringSubCategorys(categoryId, subCategorySelectUpdateDOM); // Or the correct target
});
*/

// --- Event Listener for Edit Button Clicks (NEW/IMPROVED) ---
ticketsDOM.addEventListener('click', async (e) => {
  const editButton = e.target.closest('.edit-btn');
  
  if (editButton) {
    const ticketID = editButton.dataset.id;
    console.log(`Edit button clicked for ticket ID: ${ticketID}`);

    editButton.disabled = true; 
    formAlertUpdate.textContent = 'Loading ticket details...';
    formAlertUpdate.style.display = 'block';
    formAlertUpdate.classList.remove('text-success'); // Ensure no success class

    try {
      const token = localStorage.getItem('token');
       if (!token) {
          location.replace('/login.html'); // force back to login
          return;
        }
      
      // 1. Fetch the specific ticket details
      const { data: { ticket } } = await axios.get(`/api/v1/tickets/${ticketID}`, {
          headers: { Authorization: `Bearer ${token}` }
      });

      // 2. Populate the update modal fields
      subjectInputUpdateDOM.value = ticket.subject || '';
      locationInputUpdateDOM.value = ticket.location || '';
      departmentInputUpdateDOM.value = ticket.departmentTicket ? ticket.departmentTicket.department : '';
      subCategorySelectUpdateDOM.value = ticket.sub2 ? ticket.sub2.subCategoryName : ''; 
      remarkInputUpdateDOM.value = ticket.remark || '';
      createdByInputUpdateDOM.value = ticket.createdByUser ? ticket.createdByUser.createdBy : ''; 
      approvedByInputUpdateDOM.value = ticket.approvedByUser ? ticket.approvedByUser.approvedBy : ''; 

      updateModal.dataset.ticketId = ticketID; // Store ID for update

      // 3. Populate dropdowns *BEFORE* setting selected values
      await bringCategorysUpdate(); // Populate categories
      await bringITstaffs();        // **** POPULATE IT STAFF ****
      // await bringSubCategorysUpdate(ticket.list1?.categoryid); // Fetch subcategories if needed
      
      // 4. Set selected options
      // Set Category
      const categoryId = ticket.list1 ? ticket.list1.categoryid : null;
      categorySelectUpdateDOM.value = categoryId || ''; // Set selected category by value

      // Set Approval Status
      approvalInputUpdateDOM.value = ticket.approval || 'pending';

      // Set Status
      statusInputUpdateDOM.value = ticket.status || 'pending';

      // Set Assigned To
      const assignedStaffId = ticket.assignedToUser ? ticket.assignedToUser.assignedToId : null;
      assignedToInputUpdateDOM.value = assignedStaffId || ''; // Set selected staff by value
      if (assignedStaffId && !assignedToInputUpdateDOM.value) {
           console.warn(`Assigned staff ID ${assignedStaffId} not found in dropdown options.`);
      }

      // 5. Display the update modal
      updateModal.style.display = 'block';
      overlayDOM.style.display = "block"
      formAlertUpdate.style.display = 'none';
      formAlertUpdate.textContent = '';

    } catch (error) {
        console.error('Error fetching or populating ticket details:', error);
        formAlertUpdate.textContent = `Error loading ticket: ${error.response?.data?.msg || error.message || 'Please try again'}`;
        formAlertUpdate.style.display = 'block';
    } finally {
        editButton.disabled = false; 
    }
  }
  
  // Add logic for delete button if implemented
  /*
  const deleteButton = e.target.closest('.delete-btn');
  if (deleteButton) {
      const ticketID = deleteButton.dataset.id;
      // Add confirmation and delete logic here
      console.log(`Delete button clicked for ticket ID: ${ticketID}`);
  }
  */
});

// --- Update Button Event Listener (NEW/IMPROVED) ---
btnUpdateDOM.addEventListener('click', async (e) => {
    e.preventDefault();
    const ticketID = updateModal.dataset.ticketId; 

    if (!ticketID) {
        formAlertUpdate.textContent = 'Cannot update: Ticket ID missing.';
        formAlertUpdate.style.display = 'block';
        return;
    }

    btnUpdateDOM.disabled = true;
    formAlertUpdate.textContent = 'Updating ticket...';
    formAlertUpdate.style.display = 'block';
    formAlertUpdate.classList.remove('text-success');

    try {
        const token = localStorage.getItem('token');
        
        // Get values from the update form
       // const subject = subjectInputUpdateDOM.value;
       // const location = locationInputUpdateDOM.value;
        // const department = departmentInputUpdateDOM.value; // Send ID if backend expects it
       // const category = categorySelectUpdateDOM.value; // Send category ID
        // const subCategory = subCategorySelectUpdateDOM.value; // Send subCategory ID if needed
       // const approval = approvalInputUpdateDOM.value;
       // const status = statusInputUpdateDOM.value;
        const assignedTo = assignedToInputUpdateDOM.value; // This is the user ID
       // const remark = remarkInputUpdateDOM.value;

        const updateData = {
           // subject,
           // location,
           // category, 
            // subCategory, 
          //  approval,
          //  status,
            assignedTo: assignedTo || null, // Send null if '-- Select Staff --' is chosen
           // remark
        };

        await axios.patch(`/api/v1/tickets/${ticketID}/assignTicket`, updateData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        // Success
        formAlertUpdate.textContent = 'Ticket updated successfully!';
        formAlertUpdate.classList.add('text-success'); 
        
        // Hide modal after a short delay to show success message
        setTimeout(() => {
            updateModal.style.display = 'none'; 
            
            formAlertUpdate.style.display = 'none'; // Hide alert when closing
             overlayDOM.style.display = "none"
        }, 1500); 

        // Refresh the current ticket list view
        if (pending === 1) {
            await showPendingTickets(currentPage);
        } else if (accepted === 1) {
            await showAcceptedTickets(currentPage);
        } 
          else if (resolved === 1) {
            await showResolvedTickets(currentPage);
        }
        else {
            // Refresh whatever the default view is (e.g., pending or an 'all' view)
             await showPendingTickets(currentPage); 
        }
        await showTicketStats(); // Refresh stats

    } catch (error) {
        console.error('Error updating ticket:', error);
        const errorMsg = error.response?.data?.msg || error.message || 'Update failed.';
        formAlertUpdate.textContent = `Error: ${errorMsg}`;
    } finally {
        btnUpdateDOM.disabled = false;
        delete updateModal.dataset.ticketId; 
    }
});

// --- Initial Page Load ---
const initializePage = async () => {
    await showTicketStats();
    // Load the default ticket view (e.g., pending tickets on page 1)
    await showPendingTickets(currentPage); 
};

initializePage(); // Call the initialization function when the script loads


