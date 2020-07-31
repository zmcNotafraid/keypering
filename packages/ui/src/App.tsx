import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Main from './containers/Main'
import Welcome from './containers/Welcome'
import Mnemonic from './containers/Mnemonic'
import Keystore from './containers/Keystore'
import ChangeWalletName from './containers/ChangeWalletName'
import Setting from './containers/Setting'
import { Routes } from './utils'

require('typeface-source-code-pro')
require('typeface-lato')

function App() {
  return (
    <Router>
      <Switch>
        <Route path={`${Routes.Main}/:tab?`}>
          <Main />
        </Route>
        <Route path={Routes.Welcome}>
          <Welcome />
        </Route>
        <Route path={Routes.Setting}>
          <Setting />
        </Route>
        <Route path={`${Routes.CreateWallet}/:type`}>
          <Mnemonic />
        </Route>
        <Route path={Routes.ImportKeystore}>
          <Keystore />
        </Route>
        <Route path={Routes.ChangeWalletName}>
          <ChangeWalletName />
        </Route>
      </Switch>
    </Router>
  )
}

export default App