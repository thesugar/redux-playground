import types from './types'
import { LoggedAction } from './actions'

export type UserState = Readonly<{
  isLogged: boolean
  userName: string
}>

const initialState: UserState = {
  isLogged: false,
  userName: '',
}

const userReducer = (state = initialState, action: LoggedAction): UserState => {
  switch (action.type) {
    case types.SIGN_IN:
      return { ...state, isLogged: true, userName: action.payload.userName }

    case types.SIGN_OUT:
      return { ...state, isLogged: false, userName: '' }

    default:
      return state
  }
}

export { userReducer }
