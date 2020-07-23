import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import Welcome from './containers/Welcome'
import Mnemonic from './containers/Mnemonic'
import SettingPage from './pages/setting_page'
import HomePage from './pages/home_page'
import ChangeWalletNamePage from './pages/change_wallet_name_page'
import ChangePasswordPage from './pages/change_password_page'
import DeleteWalletPage from './pages/delete_wallet_page'
import AuthorizationRequestPage from './pages/authorization_request_page'
import TransactionRequestPage from './pages/transaction_request_page'
import ImportWalletPage from './pages/import_wallet_page'
import ImportKeystorePage from './pages/import_keystore_page'
import TransferCapacityPage from './pages/transfer_capacity_page'
import { Routes } from './utils'

require('typeface-source-code-pro')
require('typeface-lato')

function App() {
  return (
    <Router>
      <div className="root">
        <Switch>
          <Route path={Routes.Welcome}>
            <Welcome />
          </Route>
          <Route path={Routes.Setting}>
            <SettingPage />
          </Route>
          <Route path={`${Routes.CreateWallet}/:type`}>
            <Mnemonic />
          </Route>
          <Route path="/import_wallet">
            <ImportWalletPage />
          </Route>
          <Route path="/import_keystore">
            <ImportKeystorePage />
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
      </div>
    </Router>
  )
}

export default App
