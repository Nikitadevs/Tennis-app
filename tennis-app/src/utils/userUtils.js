// Utility for user data and personalization
export function getUserName() {
  return localStorage.getItem('userName') || 'Your Name';
}

export function getUserAvatar() {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName())}&background=40916c&color=fff`;
}

export function getUserTheme() {
  return localStorage.getItem('theme') || 'light';
}

export function setUserName(name) {
  localStorage.setItem('userName', name);
}

export function setUserTheme(theme) {
  localStorage.setItem('theme', theme);
}
