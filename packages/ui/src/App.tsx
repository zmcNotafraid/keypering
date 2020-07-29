import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Main from './containers/Main'
import Welcome from './containers/Welcome'
import Mnemonic from './containers/Mnemonic'
import Setting from './containers/Setting'
import HomePage from './pages/home_page'
import ChangeWalletNamePage from './pages/change_wallet_name_page'
import ChangePasswordPage from './pages/change_password_page'
import DeleteWalletPage from './pages/delete_wallet_page'
import AuthorizationRequestPage from './pages/authorization_request_page'
import TransactionRequestPage from './pages/transaction_request_page'
import ImportWalletPage from './pages/import_wallet_page'
import TransferCapacityPage from './pages/transfer_capacity_page'
import { Routes } from './utils'
import Keystore from './containers/Keystore'

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
        <Route path="/import_wallet">
          <ImportWalletPage />
        </Route>
        <Route path="/change_wallet_name">
          <ChangeWalletNamePage />
        </Route>
        <Route path="/change_password">
          <ChangePasswordPage />
        </Route>
        <Route path="/delete_wallet">
          <DeleteWalletPage />
        </Route>
        <Route path="/authorization_request">
          <AuthorizationRequestPage />
        </Route>
        <Route path="/transaction_request">
          <TransactionRequestPage />
        </Route>
        <Route path="/transfer_capacity">
          <TransferCapacityPage />
        </Route>
        <Route path={Routes.HomePage}>
          <HomePage />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
