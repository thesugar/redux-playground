import types from './types'

export const increment = (num = 1) => ({
  type: types.INCREMENT,
  payload: {
    num,
  },
})

export const decrement = (num = 1) => ({
  type: types.DECREMENT,
  payload: {
    num,
  },
})

export type CounterAction = ReturnType<typeof increment | typeof decrement>
