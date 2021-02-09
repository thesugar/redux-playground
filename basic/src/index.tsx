import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { createStore } from 'redux'
import { rootReducer } from './state/store'
import { Provider } from 'react-redux'
import { devToolsEnhancer } from 'redux-devtools-extension'

const store = createStore(rootReducer, undefined, devToolsEnhancer({})) /* (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__() でもよい*/

ReactDOM.render(
  <Provider store={store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>,
  document.getElementById('root')
)
