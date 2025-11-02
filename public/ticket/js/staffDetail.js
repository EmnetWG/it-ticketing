import axios from './axios.js';

const defaultStatsDOM = document.querySelector('.defaultStats')
const monthlyApplicationsDOM = document.querySelector('.statList')
const pendingStatDOM = document.querySelector('.pending-stat')
const acceptedStatDOM = document.querySelector('.accepted-stat')
const selectDOM = document.querySelector('.selectTicketAssignedTo')

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
showStats(currentPage, id)
  updatePaginationButtons();
  updatePaginationNumbers();  
    }
  })
  
  paginationNumbers.appendChild(pageNumber);
};


const updatePaginationNumbers = () => {
  // Clear previous "active" class from all page buttons
  const allPages = document.querySelectorAll('.pagination-number');
  allPages.forEach((button) => {
    button.classList.remove('active');
  });

  // Add the "active" class to the current page
  const activeButton = document.querySelector(`.pagination-number[page-index='${currentPage}']`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
};


const getPaginationNumbers = (pageCount) => {
  paginationNumbers.innerHTML = ''; // Clear existing numbers
// Only create page numbers if there are pages to display
  if (pageCount === 0) {
    return;  // Do nothing if there are no pages
  }

  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
  // Add event listeners to new page numbers if needed
};

// Update Pagination Button Visibility
const updatePaginationButtons = () => {
  if (!prevButton || !nextButton) return; // Guard against missing elements
// Hide prev and next buttons if there are no pages
  if (noOfPages === 0) {
    prevButton.style.visibility = 'hidden';
    nextButton.style.visibility = 'hidden';
    return;  // Don't show buttons if there are no pages
  }

  prevButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
  nextButton.style.visibility = currentPage === noOfPages ? 'hidden' : 'visible';
};


// Handle Previous Button Click
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
  currentPage = currentPage - 1;

  // Hide the "previous" button on first page and show "next"
  

  showStats(currentPage, id)
  updatePaginationButtons();
  updatePaginationNumbers(); 

}
});

// Handle Next Button Click
nextButton.addEventListener("click", () => {
   if (currentPage < noOfPages) {
  currentPage = currentPage + 1;

  // Hide the "next" button on last page and show "previous"
  

  showStats(currentPage, id)
  updatePaginationButtons();
  updatePaginationNumbers(); 
}
});

const bringStaffName = async () => {
    try {
        const token = localStorage.getItem('token')

        if (!token) {
          location.replace('/login.html'); // force back to login
        }

          const {data:{users}} = await axios.get(`/api/v1/users/ITStaff`,
          {
              headers: {
                Authorization: `Bearer ${token}`,
              }},
           )

           if (users.length < 1) {
            selectDOM.innerHTML = '<h5 class="empty-list">No users in your list</h5>'
            //loadingDOM.style.visibility = 'hidden'
            return
          }
        //console.log({users})
        const allUsers = users
        .map((user) => {
        const {name,  id:userID} = user
        return `
        <option data-id="${userID}">${name}</option>`
    })
    .join('')
    selectDOM.insertAdjacentHTML('beforeend', allUsers)

        } 
     catch(error) {
            console.log(error)
        }
   

}

 bringStaffName ()
 let id=0

selectDOM.addEventListener('change', async (event) => {

    try {
         id = event.target.options[event.target.selectedIndex].dataset.id
        //const id = e.target.dataset.id
  
currentPage=1;
await showStats(currentPage, id)
//getPaginationNumbers(noOfPages);
//    updatePaginationButtons();
}
catch(error) {
    console.log(error)
}
} )



//showStats ()
const showStats = async (page, id) => {
  try {

    const token = localStorage.getItem('token')

  if (!token) {
    location.replace('/login.html'); // force back to login
    return;
  }
  const {data:{defaultStats, monthlyApplications, totalPages},} = await axios.get(`/api/v1/tickets/${id}/staffDetail?page=${page}`,
    {
        headers: {
          Authorization: `Bearer ${token}`,
        }},
     )
     console.log({defaultStats, monthlyApplications})
     pendingStatDOM.innerHTML=defaultStats.pending 
     acceptedStatDOM.innerHTML=defaultStats.accepted
      noOfPages = totalPages; 
     if (monthlyApplications.length < 1) {
      monthlyApplicationsDOM.innerHTML = '<h5 class="empty-list">No tickets in your list</h5>'
      //loadingDOM.style.visibility = 'hidden'

       // Don't generate pagination buttons if there are no records
      paginationNumbers.innerHTML = '';  // Clear pagination buttons
      updatePaginationButtons();  // Hide next/prev buttons
      return;
    }
  
    //const ticketsFilter = tickets.filter(item => item.approval=='approved')
  
  //console.log({tickets})
  const allStats = monthlyApplications
  .map((stat) => {
  var {date, category, count} = stat
  
  
  return `<tr>
  <td>${date}</td>
  <td>${category}</td>
  <td>${count}</td>
  
  
  
  
  </tr>`
  })
  .join('')
  monthlyApplicationsDOM.innerHTML = allStats
   // Update pagination numbers and buttons
    if (noOfPages > 0) {
      getPaginationNumbers(noOfPages);  // Generate pagination buttons
      updatePaginationButtons();  // Update the visibility of prev/next buttons
    } else {
      paginationNumbers.innerHTML = '';  // No pages to show
      updatePaginationButtons();  // Hide the prev/next buttons
    }
 //  getPaginationNumbers(noOfPages);
  //  updatePaginationButtons(); 
 
}
catch (error){
console.log(error)
}  

}