function getCookie(name) {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  return null;
}

function generateUniqueId() {
  return Date.now() + Math.random();
}

function setCookie(name, value) {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + 30);
  document.cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  return value;
}
