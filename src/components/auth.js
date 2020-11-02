import Cookies from 'js-cookie';
export default {
  setUserLoged(user) {
    if (!Cookies.get('usuario')) {
      Cookies.set('usuario', JSON.stringify(user));
    }
  },
  getUserLoged() {
    return Cookies.get('usuario');
  },
  setLogout() {
    // if (Cookies.get('usuario'))
      return Cookies.remove('usuario');
  }
};
