import types from './types'
import { CounterAction } from './actions'

export type CounterState = Readonly<{
  count: number
}>

const initialState: CounterState = {
  count: 0
}

const counterReducer = (state = initialState, action: CounterAction): CounterState => {
    switch (action.type) {
      case types.INCREMENT:
        return {count: state.count + action.payload.num}
    
      case types.DECREMENT:
        return {count: state.count - action.payload.num}
      
      default:
        return state
    }
}

export { counterReducer }