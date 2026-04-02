export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    let cookieVal = parts.pop().split(';').shift();
    return decodeURIComponent(cookieVal);
  }
  return null;
};

export const updateCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
};

export const deleteCookie = (name) => {
  document.cookie = name + '=; Max-Age=-99999999; path=/';
};

export const getUserFromCookie = () => {
  const userCookie = getCookie("user");
  if (userCookie) {
    try {
      return JSON.parse(userCookie);
    } catch (e) {
      console.error("Error parsing user cookie", e);
      return null;
    }
  }
  return null;
};
