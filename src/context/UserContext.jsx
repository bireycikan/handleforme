import { createContext, useReducer } from "react"

export const UserContext = createContext();

const userReducer = (state, action) => {
  if (action.type === "LOG_IN") {
    return { ...state, isLoggedIn: action.payload }
  }
  else if (action.type === "LOG_OUT") {
    return { ...state, ...action.payload }
  }
  else if (action.type === "SET_USER_INFO") {
    return { ...state, user: action.payload }
  }
  else {
    return state;
  }
}

export function UserProvider({children}) {

  const [state, dispatch] = useReducer(userReducer, {
    isLoggedIn: false,
    user: {}
  })

  const logIn = () => {
    dispatch({ type: "LOG_IN", payload: true })
  }
  
  const logOut = () => {
    dispatch({ type: "LOG_OUT", payload: { user: {}, isLoggedIn: false } })
  }
  
  const setUserInfo = (user) => {
    dispatch({ type: "SET_USER_INFO", payload: user })
  }

  return (
    <UserContext.Provider value={{ ...state, logIn, logOut, setUserInfo }}>
      {children}
    </UserContext.Provider>
  )
}