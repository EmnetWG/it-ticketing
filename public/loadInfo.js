// auth.js
window.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');

  // 1️⃣ Only redirect if not on login page
  const isLoginPage = window.location.pathname.includes('login.html');
  if (!token && !isLoginPage) {
    return location.replace('/login.html');
  }
  /*
  // If no token, redirect to login page
  if (!token) {
    location.replace('/login.html');
    return;
  }
*/
  // If token exists, try to refresh user info
  try {
    // const res = await fetch('/api/auth/me', {
    const res = await fetch(' /api/v1/users/showMe', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      // Token may be expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
       if (!isLoginPage) location.replace('/login.html');
     // location.replace('/login.html');
      return;
    }

    const data = await res.json();
   // console.log(data)
    
    // Update stored user info (including new role)
     //localStorage.setItem('token', JSON.stringify(data.token));
    // localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user));


 const role = data.user.role;
    const path = window.location.pathname;

    // Avoid redirect if already on the correct page
    if (role === "supervisor" && !path.includes("/ticket/allTickets.html")) {
      window.location.replace("/ticket/allTickets.html");
    } else if (role === "manager" && !path.includes("/ticket/department.html")) {
      window.location.replace("/ticket/department.html");
    } else if (role === "IT staff" && !path.includes("/ticket/staffTicket.html")) {
      window.location.replace("/ticket/staffTicket.html");
    } else if (role === "user" && !path.includes("/ticket/userTicket.html")) {
      window.location.replace("/ticket/userTicket.html");
    }


/*
if(data.user.role=="supervisor") {
      window.open("/ticket/allTickets.html", '_self')
    }

    if(data.user.role=="manager") {
      window.open("/ticket/department.html", '_self')
    }

    if(data.user.role=="IT staff") {
      window.open("/ticket/staffTicket.html", '_self')
    }

    if(data.user.role=="user") {
      window.open("/ticket/userTicket.html", '_self')
    }

*/
    console.log('✅ User info refreshed:', data.user);
  } catch (err) {
    console.error('Error refreshing user info:', err);
     if (!isLoginPage) location.replace('/login.html');
   // location.replace('/login.html');
  }
});


// Call this once on page load
//window.addEventListener('DOMContentLoaded', refreshUserInfo);
