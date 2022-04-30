let user_id = localStorage.getItem("exchange-inrx-userid");
let role = localStorage.getItem("exchange-role");
let usrtoken = localStorage.getItem("usr-token");
let getUserRole = {1:'editor',2:"admin"} 
const initialState = {
  user: {
    id: 0,
    email: "",
    kyc: 0,
    verify: 0,
    role: role ? parseInt(role): "",
    token: usrtoken ? usrtoken: "",
    user_id:user_id?user_id:'',
  },
  isLoggedIn: user_id ? true : false,
  userRole: getUserRole[role] ? getUserRole[role] : '',
};
export const login = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_WITH_EMAIL": {
      return { ...state, values: action.payload }
    }
    case "AUTH_LOGIN":
      console.log("AUTH_LOGIN:Role ",getUserRole[action.data.params.role],action.data.params.role)
      localStorage.setItem("exchange-inrx-userid", action.data.params.user_id);
      localStorage.setItem("exchange-role", action.data.params.role);
      localStorage.setItem("usr-token", action.data.params.token);
      return {
        ...state,
        user: { ...action.data },
        isLoggedIn: true,
        userRole: getUserRole[action.data.params.role] ? getUserRole[action.data.params.role] : '',
      };
    case "LOGIN_WITH_FB": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_TWITTER": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_GOOGLE": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_GITHUB": {
      return { ...state, values: action.payload }
    }
    case "LOGIN_WITH_JWT": {
      return { ...state, values: action.payload }
    }
    case "LOGOUT_WITH_JWT": {
      return { ...state, values: action.payload }
    }
    case "LOGOUT_WITH_NODE": {
      localStorage.removeItem("exchange-inrx-userid");
      localStorage.removeItem("exchange-role");
      localStorage.removeItem("usr-token");
      return {
        ...state,
        user: { ...action.data },
        isLoggedIn: false,
        userRole: '',
      };
    }
    case "LOGOUT_WITH_FIREBASE": {
      return { ...state, values: action.payload }
    }
    case "CHANGE_ROLE": {
      return { ...state, userRole: action.userRole }
    }
    default: {
      return state
    }
  }
}
