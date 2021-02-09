import { combineReducers } from 'redux';
import { reducers } from './ducks'

export const rootReducer = combineReducers(reducers)

export type RootState = ReturnType<typeof rootReducer>