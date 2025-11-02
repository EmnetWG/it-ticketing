import axios from '/ticket/js/axios.js';

const formDOM = document.querySelector('.form')
const nameInputDOM = document.querySelector('.name-input')
const roleDOM = document.querySelector('#role')
const departmentInputDOM = document.querySelector('.department-input')
const positionInputDOM = document.querySelector('.position-input')
const emailInputDOM = document.querySelector('.email-input')
const modalDOM = document.querySelector('.modal')
const overlayDOM = document.querySelector('.overlay')
const closeDOM = document.querySelector(".btn-close")
const btnUpdateDOM = document.querySelector('.btnUpdate')
const formAlertDOM = document.querySelector('.form-alert')
const usersDOM = document.querySelector('.usersList')
const staffsDOM = document.querySelector('.staffsList')
const staffsTab = document.querySelector('#allStaffs')
const searchInputDOM = document.querySelector('.searchInput')
const searchButtonDOM = document.querySelector('.btnSearch')
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
//pagination



const paginationNumbers = document.getElementById("pagination-numbers");
//usersDOM - const paginatedList = document.getElementById("");
const listItems = usersDOM.querySelectorAll("td");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

let currentPage=1
let noOfPages=0


// Generate all pagination number buttons
function generatePaginationButtons() {
  paginationNumbers.innerHTML = ""; // Clear old buttons
  for (let i = 1; i <= noOfPages; i++) {
    appendPageNumber(i);
  }
}
// Globals


// Function to update the state of Prev/Next buttons
function updatePaginationButtons() {
if (!prevButton || !nextButton) return; // Guard against missing elements
// Hide prev and next buttons if there are no pages
  if (noOfPages === 0) {
    prevButton.style.visibility = 'hidden';
    nextButton.style.visibility = 'hidden';
    return;  // Don't show buttons if there are no pages
  }

   prevButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
  nextButton.style.visibility = currentPage === noOfPages ? 'hidden' : 'visible';
 // prevButton.disabled = currentPage === 1;
  //nextButton.disabled = currentPage === noOfPages;

  // Optional: Highlight active page
  const allButtons = paginationNumbers.querySelectorAll(".pagination-number");
  allButtons.forEach(btn => {
    const page = Number(btn.getAttribute("page-index"));
    btn.classList.toggle("active", page === currentPage);
  });
}

/*
// Function to navigate to a specific page
async function goToPage(page) {
  if (page >= 1 && page <= noOfPages) {
    currentPage = page;
    await showUsers(currentPage); // Wait for data to load
    updatePaginationButtons();    // Then update buttons
  }
}
*/

async function goToPage(page) {
  if (page < 1) return;

  currentPage = page;

 const totalPages = await showUsers(currentPage);
//console.log(totalPages)
  // Update noOfPages only after fetching
  if (totalPages && totalPages > 0) {
    noOfPages = totalPages;
    generatePaginationButtons();
  }

  updatePaginationButtons();
}


// Create a single pagination number button
const appendPageNumber = (pageNumber) => {
  const button = document.createElement("button");
  button.className = "pagination-number";
  button.innerHTML = pageNumber;
  button.setAttribute("page-index", pageNumber);
  button.setAttribute("aria-label", "Page " + pageNumber);

  button.addEventListener("click", () => {
    goToPage(pageNumber);
  });

  paginationNumbers.appendChild(button);
};



// Prev and Next button event listeners
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    goToPage(currentPage - 1);
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < noOfPages) {
    goToPage(currentPage + 1);
  }
});

// Initialize pagination


/*
const getPaginationNumbers = (pageCount) => {
  paginationNumbers.innerHTML = '';
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
};
*/
/* //Update Pagination Button Visibility
const updatePaginationButtons = () => {
  prevButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
  nextButton.style.visibility = currentPage === noOfPages ? 'hidden' : 'visible';
}

*/

let searchQuery = "";
const showUsers = async (page) => {
  console.log("Current page:", page);

  const token = localStorage.getItem('token');
  if (!token) {
    location.replace('/login.html');
    return;
  }

  try {
    const response = await axios.get(`/api/v1/users?page=${page}&search=${encodeURIComponent(searchQuery)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { users, totalUsers, numOfPages } = response.data;

    if (!users.length) {
      usersDOM.innerHTML = '<h5 class="empty-list">No users in your list</h5>';
       paginationNumbers.innerHTML = '';  // Clear pagination buttons
      updatePaginationButtons();
      return;
    }

    noOfPages = numOfPages;
console.log(noOfPages)
    renderUsers(users);
   // updatePaginationButtons();
    attachUserActionListeners(token);
    return numOfPages

  } catch (error) {
    console.error('Error fetching users:', error);

    let errorMsg = 'There was an error retrieving users. Please try again later.';
    if (error.response?.data?.msg) {
      errorMsg = error.response.data.msg;
    }

    usersDOM.innerHTML = `<h5 class="empty-list">${errorMsg}</h5>`;
    return 0;
  }
};

generatePaginationButtons();
await goToPage(currentPage); // Load first page and update buttons
//showUsers (currentPage)

 window.addEventListener('load', () => { 
  
  
  //console.log(noOfPages)
//getPaginationNumbers(noOfPages);

  
})

  
   
 /*  
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    showUsers(currentPage); // Show users for the updated page
    updatePaginationButtons(); // Update button visibility
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < noOfPages) {
    currentPage++;
    showUsers(currentPage); // Show users for the updated page
    updatePaginationButtons(); // Update button visibility
  }
});
*/
//showUsers(currentPage)

/*
// Handle previous page button click
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    showUsers(currentPage); // Show users for the updated page
    updatePaginationButtons(); // Update button visibility
  }
});

// Handle next page button click
nextButton.addEventListener("click", () => {
  if (currentPage < noOfPages) {
    currentPage++;
    showUsers(currentPage); // Show users for the updated page
    updatePaginationButtons(); // Update button visibility
  }
});

// Handle individual pagination number button clicks
const paginationButtons = paginationNumbers.querySelectorAll(".pagination-number");
console.log(paginationButtons);
paginationButtons.forEach((button1) => {
  const pageIndex = Number(button1.getAttribute("page-index"));
  if (pageIndex) {
    button1.addEventListener("click", () => showUsers(pageIndex));
  }
});


function updatePaginationButtons() {
  // If the current page is the first page, hide the 'prev' button
  if (currentPage === 1) {
    prevButton.style.visibility = 'hidden';
  } else {
    prevButton.style.visibility = 'visible';
  }

  // If the current page is the last page, hide the 'next' button
  if (currentPage === noOfPages) {
    nextButton.style.visibility = 'hidden';
  } else {
    nextButton.style.visibility = 'visible';
  }
}
*/
/*
 const paginationButtons = paginationNumbers.querySelectorAll(".pagination-number")
console.log(paginationButtons)
paginationButtons.forEach((button1) => {
    const pageIndex = Number(button1.getAttribute("page-index"));
    if (pageIndex) {
     // console.log(pageIndex)
      button1.addEventListener("click",
        showUsers(pageIndex)
      );
    }
  });
 */

//Bring Department
const bringDepartments = async () =>  {
  try
  {
      const token = localStorage.getItem('token')
const {
  data:{departments}
} = await axios.get(`/api/v1/department`, {
  headers: {
    Authorization: `Bearer ${token}`,
  }},)
//console.log(users)
if (departments.length < 1) {
  departmentInputDOM.innerHTML = '<h5 class="empty-list">No departments in your list</h5>'
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
<option data-id="${departmentID}">${name}</option>
`
})
.join('')
//categorySelectDOM.innerHTML = allCategorys
//console.log({users})
departmentInputDOM.insertAdjacentHTML('beforeend', allDepartments)
/* new assignedToInputUpdateDOM.selectedIndex="0"
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
      
    departmentInputDOM.innerHTML = error
      '<h5 class="empty-list">There was an error, please try later....</h5>'
  }
}



//const deleteBtnDOM = document.querySelector('.delete-btn')
//const editBtnDOMS = document.querySelectorAll('.edit-btn')
//Bring data for update
usersDOM.addEventListener('click', async (e) => {
    const el = e.target
    if (el.parentElement.classList.contains('edit-btn')) {
      //loadingDOM.style.visibility = 'visible'
      const id = el.parentElement.dataset.id

//editBtnDOMS.forEach((button) => {
//button.addEventListener('click', async (e) => {
    modalDOM.style.display = "block"
    overlayDOM.style.display = "block"
    //modalDOM.style.display = 'block'
  //  const id = e.target.dataset.id

  //if(departmentInputDOM.length===1){
  //  await bringDepartments ()
//}
    try
    {
        
        const token = localStorage.getItem('token')
const {
    data:{user},
} = await axios.get(`/api/v1/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }},)

    const {name, department, position, role, email, id:userID, listDepartment} = user
    nameInputDOM.value = name
    departmentInputDOM.value = listDepartment.departmentName
    console.log('listDepartment:', listDepartment)

    positionInputDOM.value = position
    emailInputDOM.value = email
    roleDOM.value = role
    /*
    for (var i = 0; i < departmentInputDOM.length; i++) {
      if (departmentInputDOM[i].dataset.id === listDepartment.departmentid) {
        departmentInputDOM[i].selected = true;
      }
   }
*/
    btnUpdateDOM.dataset.id = userID

} catch(error) {
    console.log(error)
}
}
})

closeDOM.addEventListener('click', async ( ) => {
    overlayDOM.style.display = "none"
})

////Update Role
btnUpdateDOM.addEventListener('click', async (e) => {
    e.preventDefault()
    
    const id = btnUpdateDOM.dataset.id
      //loadingDOM.style.visibility = 'visible'
      
    try
    
   {
        const token = localStorage.getItem('token')
const userRole = roleDOM.value

console.log(userRole)
const {
    data:{user},
} = await axios.patch(`/api/v1/users/${id}/updateRole`, {role:userRole, }, {
    headers: {
      Authorization: `Bearer ${token}`,
    }}, 
    
)
formAlertDOM.style.display = 'block'
formAlertDOM.textContent = `success, edited role`
formAlertDOM.classList.add('text-success')
showUsers(currentPage)
    } catch (error) {
        formAlertDOM.style.display = 'block'
        formAlertDOM.innerHTML = `error, please try again`
        //formAlertDOM.innerHTML = error
    }

    setTimeout(() => {
        formAlertDOM.style.display = 'none'
        formAlertDOM.classList.remove('text-success')
      }, 3000)
})
//})
//showSingleUser ()


    

  searchButtonDOM.addEventListener('click', async () => {
  const searchName = searchInputDOM.value.trim();
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Authentication token not found.");
    return;
  }
 searchQuery = searchName;  //  Set global search state
  await goToPage(1);  
/*
  try {
    const {
      data: { users, totalUsers, numOfPages },
    } = await axios.get(`/api/v1/users/?search=${encodeURIComponent(searchName)}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!users.length) {
      usersDOM.innerHTML = '<h5 class="empty-list">No users in your list</h5>';
      return;
    }

    renderUsers(users);
    updatePaginationButtons();
    attachUserActionListeners(token);

  } catch (error) {
    console.error('Error fetching users:', error);

    let errorMsg = 'There was an error fetching the users. Please try again later.';
    if (error.response?.data?.msg) {
      errorMsg = error.response.data.msg;
    }

    usersDOM.innerHTML = `<h5 class="empty-list">${errorMsg}</h5>`;
  }
*/
}


);

function renderUsers(users) {
  const userRows = users.map(user => {
    const { name, department, position, role, email, id: userID, listDepartment } = user;
    return `
      <tr>
        <td>${name}</td>
        <td data-id="${listDepartment.departmentid}" title="${listDepartment.departmentName}">
          ${listDepartment.departmentName}
        </td>
        <td>${position}</td>
        <td>${role}</td>
        <td>${email}</td>
        <td>
          <div class="user-links">
            <button data-id="${userID}" data-toggle="modal" data-target="#exampleModal" class="edit-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn" data-id="${userID}">
              <i class="fas fa-trash"></i>
            </button>
            <button type="button" class="reset-btn" data-id="${userID}">
              <i class="fas fa-window-restore"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  usersDOM.innerHTML = userRows;
}

function attachUserActionListeners(token) {
  document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', async event => {
      const userID = event.currentTarget.dataset.id;
      const confirmed = window.confirm('Are you sure you want to delete this user?');

      if (confirmed) {
        try {
          await axios.delete(`/api/v1/users/${userID}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          showUsers(currentPage);
        } catch (error) {
          console.error('Error deleting user:', error);
          let errorMsg = 'There was an error deleting the user. Please try again later.';
          if (error.response?.data?.msg) {
            errorMsg = error.response.data.msg;
          }
          alert(errorMsg);
        }
      }
    });
  });

  document.querySelectorAll('.reset-btn').forEach(button => {
    button.addEventListener('click', async event => {
      const userID = event.currentTarget.dataset.id;
      const confirmed = window.confirm('Are you sure you want to reset this user\'s password?');

      if (confirmed) {
        try {
          const newPassword = "1234";
          await axios.patch(`/api/v1/users/${userID}/resetPassword`, { newPassword }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          showUsers(currentPage);
        } catch (error) {
          console.error('Error resetting password:', error);
          alert("There was an error resetting the user password. Please try again later.");
        }
      }
    });
  });
}
