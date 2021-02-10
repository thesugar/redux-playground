const SIGN_IN = 'users/signIn'
const SIGN_OUT = 'users/signOut'

export default {
  SIGN_IN,
  SIGN_OUT,
} as const
/*
上記を as const としないと、reducer の switch の部分で、
payload を使う case において 'Property Payload does not exist on type' というエラーが出る
（signIn の場合は payload.userName が存在するが signOut の場合は payload は不要である。
しかし、本 types.ts において const として型をつけないとリテラル型（'users/signIn' 型 or 'users/signOut' 型）としてではなく
string 型としてしか扱えず、うまく型による推論処理ができない）
*/
