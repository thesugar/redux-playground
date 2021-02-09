import React, { useState } from 'react'
import './App.css'
import { useDispatch, useSelector } from 'react-redux'
import { increment, decrement } from './state/ducks/counter/actions'
import { signIn, signOut } from './state/ducks/users/actions'
import { RootState } from './state/store'

function App() {
  const counter = useSelector((state: RootState) => state.counter)
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch()
  const [num, setNum] = useState(1)
  const [error, setError] = useState('')

  const onChangeNum = (input: string) => {
    if (input.length === 0) {
      return
    }
    const inputNum = parseInt(input)
    if (Number.isNaN(inputNum)) {
      setError('整数値を入力してください')
      return 
    }
    setError('')
    setNum(inputNum)
  }

  return (
    <div className='App'>

      <header className='header'>
        <button className='login-button' onClick={() => dispatch(user.isLogged ? signOut() : signIn('taro'))}>{user.isLogged ? 'サインアウト' : 'サインイン'}</button>
      </header>

      <h1>Counter {counter.count}</h1>

      <input type='text' onChange={(event) => onChangeNum(event.target.value)}></input>

      <div className='current-number'>
        {num}
      </div>

      <div className='error-message'>
        {error && error}
      </div>

      <button className='calc' onClick={() => dispatch(increment(num))}>+</button>
      <button className='calc' onClick={() => dispatch(decrement(num))}>-</button>

      {user.isLogged &&
      <h3>ログインしています。ようこそ、{user.userName} さん</h3>}
    </div>
  )
}

export default App
