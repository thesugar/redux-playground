import { counterReducer } from './counter/reducers'
import { userReducer } from './users/reducers'

export const reducers = {
    counter: counterReducer,
    user: userReducer,
}