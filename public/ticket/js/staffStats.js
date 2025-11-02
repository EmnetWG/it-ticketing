import axios from './axios.js';

const defaultStatsDOM = document.querySelector('.defaultStats')
const monthlyApplicationsDOM = document.querySelector('.statList')
const pendingStatDOM = document.querySelector('.pending-stat')
const acceptedStatDOM = document.querySelector('.accepted-stat')


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
showStats(currentPage)
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
  

  showStats(currentPage)

}
});

// Handle Next Button Click
nextButton.addEventListener("click", () => {
   if (currentPage < noOfPages) {
  currentPage = currentPage + 1;

  // Hide the "next" button on last page and show "previous"
  

  showStats(currentPage)
}
});


const showStats = async (page) => {

    try {
  const token = localStorage.getItem('token')

  if (!token) {
    location.replace('/login.html'); // force back to login
    return;
  }

    const {data:{defaultStats, monthlyApplications, totalPages},} = await axios.get(`/api/v1/tickets/staffStats?page=${page}`,
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
       paginationNumbers.innerHTML = '';  // Clear pagination buttons
      updatePaginationButtons();
      //loadingDOM.style.visibility = 'hidden'
      return
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
  
  
   getPaginationNumbers(noOfPages);
    updatePaginationButtons(); 

    
}
catch(error) {
    console.log(error)
}
}


showStats (currentPage)