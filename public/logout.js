 export function removeToken  ()  { // export function from module 
    localStorage.removeItem("token");
   // setToken(null);
  // window.open('/login.html', '_self')
   
    window.location.replace("/login.html");
  }

  