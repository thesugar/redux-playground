import types from './types'

export const signIn = (userName: string) => ({
  type: types.SIGN_IN,
  payload: {
    userName,
  },
})

export const signOut = () => ({
  type: types.SIGN_OUT,
})

export type LoggedAction = ReturnType<typeof signIn | typeof signOut>
