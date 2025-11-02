// Pagination
let pending = 0;
let accepted = 0;
let all = 1;

const paginationNumbers = document.getElementById("pagination-numbers");
const listItems = ticketsDOM.querySelectorAll("td");
const nextButton = document.getElementById("next-button");
const prevButton = document.getElementById("prev-button");

let currentPage = 1;
let noOfPages = 0;

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);
  pageNumber.setAttribute("aria-label", "Page " + index);
  paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = (pageCount) => {
  paginationNumbers.innerHTML = ''; // Clear previous buttons
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
};

// Show Ticket Stats
const showTicketStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data: { defaultStats } } = await axios.get(`/api/v1/tickets/departmentStats`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log({ defaultStats });
    pendingStatDOM.innerHTML = defaultStats.pending;
    acceptedStatDOM.innerHTML = defaultStats.accepted;
  } catch (error) {
    console.error(error);
  }
};

showTicketStats();

// Handle Modal
btnAddDOM.addEventListener('click', async () => {
  addModal.style.display = 'block';
  if (categorySelectDOM.length === 1) {
    await bringCategorys();
  }
});

span.onclick = function () {
  addModal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == addModal) {
    addModal.style.display = "none";
  }
}

// Fetch Categories
const bringCategorys = async () => {
  try {
    const token = localStorage.getItem('token');
    const { data: { categorys } } = await axios.get(`/api/v1/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (categorys.length < 1) {
      categorySelectDOM.innerHTML = '<h5 class="empty-list">No category in your list</h5>';
      return;
    }

    const allCategorys = categorys.map(category => `
      <option data-id="${category.id}">${category.name}</option>
    `).join('');

    categorySelectDOM.insertAdjacentHTML('beforeend', allCategorys);
  } catch (error) {
    categorySelectDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
}

// Fetch Pending Tickets
const showPendingTickets = async (page) => {
  await fetchTickets(`/api/v1/tickets/departmentPendingTickets?page=${page}`);
};

// Fetch Accepted Tickets
const showAcceptedTickets = async (page) => {
  await fetchTickets(`/api/v1/tickets/departmentAcceptedTickets?page=${page}`);
};

// General function to fetch tickets
const fetchTickets = async (url) => {
  try {
    const token = localStorage.getItem('token');
    const { data: { user } } = await axios.get(`/api/v1/users/showMe`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const userID = user.userId;
    const { data: { tickets, numOfPages } } = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (tickets.length < 1) {
      ticketsDOM.innerHTML = '<h5 class="empty-list">No tickets in your list</h5>';
      return;
    }

    noOfPages = numOfPages;
    renderTickets(tickets, userID);
    updatePaginationButtons();
  } catch (error) {
    ticketsDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
}

// Render Tickets
const renderTickets = (tickets, userID) => {
  const allTickets = tickets.map(ticket => {
    const { subject, approval, status, createdAt, createdByUser, assignedToUser, id: ticketID } = ticket;
    const date = createdAt.slice(0, 10).split('-').reverse().join('/');

    return `<tr>
      <td>${subject}</td>
      <td>${approval}</td>
      <td>${status}</td>
      <td>${date}</td>
      <td>${createdByUser.createdBy}</td>
      <td>${assignedToUser ? assignedToUser.assignedTo : '-'}</td>
      <td>
        <div class="user-links">
          <button data-id="${ticketID}" class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          ${createdByUser.userID === userID ? `<button type="button" class="delete-btn" data-id="${ticketID}"><i class="fas fa-trash"></i></button>` : ''}
        </div>
      </td>
    </tr>`;
  }).join('');

  ticketsDOM.innerHTML = allTickets;
}

// Update Pagination Button Visibility
const updatePaginationButtons = () => {
  prevButton.style.visibility = currentPage === 1 ? 'hidden' : 'visible';
  nextButton.style.visibility = currentPage === noOfPages ? 'hidden' : 'visible';
}

// Event Listeners for Pagination
prevButton.addEventListener("click", () => {
  currentPage--;
  if (pending) showPendingTickets(currentPage);
  else if (accepted) showAcceptedTickets(currentPage);
  else showTickets(currentPage);
  updatePaginationButtons();
});

nextButton.addEventListener('click', () => {
  currentPage++;
  if (pending) showPendingTickets(currentPage);
  else if (accepted) showAcceptedTickets(currentPage);
  else showTickets(currentPage);
  updatePaginationButtons();
});

// Setup Pagination Button Clicks
const paginationButtons = paginationNumbers.querySelectorAll(".pagination-number");
paginationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pageIndex = Number(button.getAttribute("page-index"));
    currentPage = pageIndex;
    if (pending) showPendingTickets(currentPage);
    else if (accepted) showAcceptedTickets(currentPage);
    else showTickets(currentPage);
    updatePaginationButtons();
  });
});

// Initial Ticket Load
showTickets(currentPage);
