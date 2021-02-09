# Redux - basic

Action (Event) <--> Store <--> Reducer (Event Handler)

- Store: the single source of truth
- Action: a user's event
- Reducer: a pure function which takes a store and a type of action as arguments and returns a new store

## 基本的なステップ

### Step 0. インストール

```bash
yarn add redux@4.0
```

### Step 1. store を設計する

基本的な store の構造は以下のようになる。

```js
[
    {
        id: 1,
        description: "",
        resolevd: false,
    },
    {...},
    {...},
]
```

ただし、実際には、以下のように複数のプロパティを持つオブジェクトとなることが多い。以下の場合には、2 つの異なる reducer が必要になる。

```js
{ 
    bugs: [
        {
            id: 1,
            description: "",
            resolevd: false,
        },
        {...},
        {...},
    ],
    currentUser: {}
}
```

以降は、まず reducer の使い方を見るために、前者の構造でやっていく。

### Step 2. action を決める

Action(s) とはまさにユーザーが取りうるアクションのこと。たとえば以下がある。

- Add a Bug
- Mark as Resolved
- Delete a Bug

実際のアプリではもっと多くのアクションが必要になるだろうが、今回はこれでやる。

Action とは、何が起こったかを示す、プレーンな JavaScript オブジェクト。

e.g.

```js
{
    type: 'ADD_BUG',
    description: '...', 
    // もしくは:
    // payload: {
    //    description: '...'
    //}
}
```

- `type`: Redux を使ううえでは type プロパティが必要。UPPER_SNAKE_CASE で書くことが多いが、'bugAdded' のように別の書き方でも当然 OK。このように過去形にしたほうがわかりやすい（Action とは「何が起こったか」を表すものであるため）。
- `description`: description という key である必要はない（このアプリでは説明文を扱うため description という変数名にしている）。Action に関連させるデータ。たとえば、ユーザーが Bug を追加するためにテキストボックスに文字を書き込んだら、その値（文字列）が `description` プロパティに保存される。
    - `payload: { ... }` は Flux 流の書き方で、Redux を使ううえでは必須ではないが、あえて `payload: {...}` としたほうが書き方が統一的になってわかりやすい感はある。
    - payload の中には、（`payload: ...` という書き方をするかどうかにかかわらず、）action に関して、必要最小限の情報が含まれるようにすること。たとえば、Bug を削除する Action においては、Bug を識別する ID があればよく、その場合は `payload: { id: 1 }` などとすればよい。このときは payload として description を持つ必要はない。

### Step 3. reducer を作る

```js
// src/store.js

// Step 1. で見たように、今回 state は単純な Array
let lastId = 0

const reducer = (state = [] /* [] は initial state（初期値）*/, action) => {
    if (action.type === 'bugAdded') {
        return [
            ...state,
            {
                // id, resolved は reducer で計算・処理すればよく、
                // payload で持つ必要はない（“payload の中身は必要最小限に留める”）
                id: ++lastId,
                description: action.payload.description,
                resolved: false,
            }
        ]
    } else if (action.type === 'bugRemoved') {
        return state.filter(bug => bug.id !== action.payload.id)
    }
    // if the title of our action is neither of this ('bugAdded', 'bugRemoved')
    return state
}

export { reducer }
```

実際には、switch 文を使うことが多い。

```js
// src/store.js

// Step 1. で見たように、今回 state は単純な Array
let lastId = 0

const reducer = (state = [] /* [] は initial state（初期値）*/, action) => {
    switch (action.type) {
        case 'bugAdded':
            return [
                ...state,
                {
                    id: ++lastId,
                    description: action.payload.description,
                    resolved: false,
                }
            ]

        case 'bugRemoved':
            return state.filter(bug => bug.id !== action.payload.id)

        default:
            return state
    }
}

export { reducer }
```

reducer の中の処理は、関数型プログラミング色の強いものになっている。スプレッド構文を使って配列のミューテートを回避することや、filter を使って同様にミューテートを回避することなど。

reducer は純粋（この実装だと「純粋*風*」。lastId が `reducer()` 外にあるので純粋ではない。action.type が bugAdded の場合も、id も `action.payload` に含めてしまえば純粋になるはず）関数（参照等価、副作用なし）であり、つまり DOM 操作をしない、グローバル変数を扱わない、API コールを行わない、

### Step 4. store をセットアップ

```js
// src/store.js
import { createStore } from 'redux'
import { reducer } from './reducer'

const store = createStore(reducer)

export { store }
```

createStore は Higher-order-function.

###

```js
// src/index.js
import { store } from './store'

console.log(store)
```

console.log することで store オブジェクトがどんなものか大体わかる。

action を dispatch するメソッド `dispatch` や store を subscribe するメソッド `subscribe` を持つ。subscribe すれば、store の state が変わるたびに通知される（これは UI レイヤーで使われる）。

また、store の現在の状態を取得するメソッド `getState` や、reducer を replace する `replaceReducer`、`observable` の Symbol `Symbol(observable)` も存在する。

ここで注目すべきは、`getState` というメソッドはあるものの、その一方で、store の状態をセットするメソッドはないということ。つまり **store は読み取り専用** で、store の状態を変更するためには、action を dispatch するしかないのである。

```js
// src/index.js
import { store } from './store'

console.log(store.getState())
```

まだ何も Bug を登録していないのでこの時点ではコンソールには空配列しか表示されない。

```js
// src/index.js
import { store } from './store'

store.dispatch({
    type: 'bugAdded',
    payload: {
        description: 'Bug1',
    }
})

console.log(store.getState())
```

このようにすると、`store.dispatch()` で Bug が Add されるので、コンソールにはその登録された Bug1 が（ID, resolved というプロパティも伴って）表示される。

```js
// src/index.js
import { store } from './store'

store.dispatch({
    type: 'bugAdded',
    payload: {
        description: 'Bug1',
    }
})

store.dispatch({
    type: 'bugRemoved',
    payload: {
        id: '1',
    }
})

console.log(store.getState())
```

このようにすると、Bug が登録されたあと、削除されるため、結果としてコンソールには空配列 `[]` が表示される。

### Subscribing to the Store

```js
// src/index.js
import { store } from './store'

store.subscribe(() => {
    console.log('Store has been changed.', store.getState())
})

store.dispatch({
    type: 'bugAdded',
    payload: {
        description: 'Bug1',
    }
})

store.dispatch({
    type: 'bugRemoved',
    payload: {
        id: '1',
    }
})

console.log(store.getState())
```

`store.subscribe()`: store の状態が変更されるたびに呼ばれる。UI レイヤーで使用する（ことが多い）。

上記のコードでは、store の状態が 2 回変更されている（bugAdded, bugRemoved）ので、2 回 `store.subscribe()` が呼ばれ、コンソールには 2 回「Store has been changed.」と表示される。

`store.subscribe()` は unsubscribe するための関数を戻り値として返す。

そのため、以下のようにすると:

```js
// src/index.js
import { store } from './store'

// subscribe 関数は unscribe するための関数を戻り値として返す
const unsubscribe = store.subscribe(() => {
    console.log('Store has been changed.', store.getState())
})

store.dispatch({
    type: 'bugAdded',
    payload: {
        description: 'Bug1',
    }
})

// 購読解除
unsubscribe()

store.dispatch({
    type: 'bugRemoved',
    payload: {
        id: '1',
    }
})

console.log(store.getState())
```

コンソールには “Store has been changed.” というログは 1 回しか表示されなくなる。

### Action Types

ここまでは、Action の type をハードコーディングしていた（'bugAdded' など）。あまり望ましくはないので改良する。

`src/actionTypes.js` を作成する。

```js
// src/actionTypes.js
export const BUG_ADDED = 'bugAdded'
export const BUG_REMOVED = 'bugRemoved'
```

`src/reducer.js` では以下のように import する。

```js
import * as actions from './actionTypes'
```

そして、`src/reducer.js` の中で `case 'bugAdded':` などとしていた部分を、`case actions.BUG_ADDED` のように変更する。

また、`src/index.js` も以下のように追加・変更すればよい。

```js
// src/index.js
import * as actions from './actionTypes'

// ...

store.dispatch({
    type: actions.BUG_ADDED,
    ...
})
```

### Action Creators

ここまでは、`index.js` の中で `store.dispatch` の中身をいちいち書いていたが、複数箇所で同じアクションを dispatch する場合などに冗長なコードになる。そこで、このような Action のオブジェクトを作る関数（アクション・クリエイター）を定義する。

`src/actions.js`（`src/actionCreators.js` などとしてもよい）

```js
// src/actions.js
import * as actions from './actionTypes'

const bugAdded = (description) => ({
    type: actions.BUG_ADDED,
    payload: {
        description, // description: description,
    }
})

export { bugAdded }
```

`src/index.js` は以下のように変更する。`import * as actions from './actionTypes'` は不要なので削除。

```js
// src/index.js
import { bugAdded } from './actions'

store.dispatch(bugAdded('Bug 1'))

console.log(store.getState())
```

### Exercise

バグを解決済みにする機能を実装する。

Redux で新しい機能を実装するときはつねに action から考える。その後 reducer を考える。

まず `actionTypes.js`:

```js
export const BUG_RESOLVED = 'bugResolved'
```

続いて `src/actions.js`:

```js
export const bugResolved = id => ({
    type: actions.BUG_RESOLVED,
    payload: {
        id, // id: id,
    }
})
```

その後、`src/reducer.js` で以下を追加:

```js
case actions.BUG_RESOLVED:
    return state.map(bug => bug.id !== action.payload.id ? bug : {...bug, resolved: true})
```

そして、`src/index.js` には以下のように追記してみよう。

```js
// bugResolved の import を追加
import { bugAdded, bugResolved } from './actions'

store.dispatch(bugADded('Bug 1'))

// 以下を追加
store.dispatch(bugResolved(1))

// ...
```

ここまでは React は使っていないことに注目。Redux は React との併用が必須というわけではない。

## React と使う

今までとは例が異なるが、だいたいやっていることはわかるはず。

### 基本

まず、基本的には以下のようになる。ここでは TypeScript を導入している。

```ts
// src.index.tsx
import { createStore } from 'redux'

// action
const increment = () => ({
  type: 'INCREMENT',
}) as const

const decrement = () => ({
  type: 'DECREMENT'
}) as const

// Reducer
type CounterAction = {
  type: 'INCREMENT' | 'DECREMENT',
}

const counter = (state = 0, action: CounterAction) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
  
    case 'DECREMENT':
      return state - 1
    
    default:
      return state
  }
}

const store = createStore(counter)

// display it in the console
store.subscribe(() => console.log(store.getState()))

// dispatch
store.dispatch(increment())
store.dispatch(decrement())
store.dispatch(decrement())
```

### 実用的な例

上記は、簡単に流れを追うための例。より実用的に書いていく。

App コンポーネントは以下のようになる。

```jsx
// App.js
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { increment } from './actions'

const App = () => {
    const counter = useSelector(state => state.counter)
    const isLogged = useSelector(state => state.isLogged)
    const dispatch = useDispatch()

    return (
        <div className="App">
            <h1>Counter {counter}</h1>
            <button onClick = {() => dispatch(() => dispatch(increment()))}>+</button>
            <button onClick = {() => dispatch(() => dispatch(decrement()))}>-</button>

            {isLogged ? <h3>Valuable Information I shouldn't see when logged out</h3> : ''}
        </div>
    )
}

export default App
```

複数の reducer を扱うには以下のように、`reducers/index.js` で `combineReducers` を使って reducer をまとめて、それを `src/index.js` で import し、それを `createStore` に渡せばよい。

```js
// src/index.js
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { createStore } from 'redux'
import { allReducers } from './reducers' // i.e. 'reducers/index.js'

const store = createStore(allReducers)

ReactDOM.render(<App />, document.getElementById('root'))
```

```js
// src/reducers/index.js
import { counterReducer } from './counter'
import { loggedReducer } from './isLogged'
import { combineReducer } from 'redux'

const allReducers = combineReducers({
    counter: counterReducer,
    isLogged: loggedReducer,
})

export { allReducers }
```

また、`src/index.js` を以下のように変更。

- Redux の開発者ツールを使えるようにする。
- Provider を使って App コンポーネントから Store を参照できるようにする。

```js
// src/index.js
...
import { Provider } from 'react-redux'

const store = createStore(
    allReducers,
    window.__REDUX_DEVTOOLS_EXTENTION__ && window.__REDDUX_DEVTOOLS_EXTENSION__()
)

ReactDOM.render(
    <Provider>
    <App />
    </Provider>,
    document.getElementById('root')
)
```

## TypeScript と使う

```bash
npx create-react-app {project-name} --template typescript
```

```bash
cd {project-name}
yarn add redux react-redux @types/redux @types/react-redux #react-devtools-extension
```