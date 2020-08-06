# Keypering Manual

## First Launch

<div class="center">
  <img src="_media/screenshots/01.welcome.png" alt="Welcome">
</div>

There're three method to create your first wallet

- [Create a Wallet](manual?id=create-a-wallet) Create a wallet by randomly generated mnemonic(seed)
- [Import Wallet Seed](manual?id=import-wallet-seed) Import your own mnemonic(seed) to create a wallet
- [Import from Keystore](manual?id=import-from-keystore) Import your own keystore file

---

### Create a Wallet

There're three steps to create a wallet from scratch

1. Randomly generate a mnemonic(seed)
2. Confirm and backup the mnemonic(seed)
3. Set wallet name and password for new wallet

<div class="center">
  <b><small>Genearete mnemonic(seed)</small></b>
  <img src="_media/screenshots/02.generate_mnemonic.png" alt="Generate Mnemonic">
</div>

<div class="center">
  <b><small>Confirm Mnemonic</small></b>
  <img src="_media/screenshots/03.confirm_mnemonic.png" alt="Confirm Mnemonic">
</div>

<div class="center">
  <b><small>Add Wallet Info</small></b>
  <img src="_media/screenshots/04.add_wallet_info.png" alt="Add Wallet Info">
</div>

---

### Import Wallet Seed

There're two steps to create a wallet from an existing mnemonic(seed)

1. Input mnemonic(seed)
2. Set wallet name and password for new wallet

<div class="center">
  <b><small>Confirm Mnemonic</small></b>
  <img src="_media/screenshots/03.confirm_mnemonic.png" alt="Confirm Mnemonic">
</div>

<div class="center">
  <b><small>Add Wallet Info</small></b>
  <img src="_media/screenshots/04.add_wallet_info.png" alt="Add Wallet Info">
</div>

---

### Import from Keystore

Import an existing wallet from a keystore file

**Keypering is not an HD wallet and doesn't have a specific wallet path, which means the wallet exported from [Neuron](https://github.com/nervosnetwork/neuron) cannot be recovered in Keypering theoratically.**

<div class="center">
  <b><small>Import Keystore</small></b>
  <img src="_media/screenshots/05.import_keystore.png" alt="Import Keystore">
</div>

---

## Addresses

Addresses will be speculated from enabled lock scripts in Keypering.

There're two types of balance belong to an adress

- Free - total capacity of cells who has no data and no type script thus they are safe to consume;
- In Use - total capacity of cells who has data or type script and require doublethink to use.

<div class="center">
  <b><small>Addresses</small></b>
  <img src="_media/screenshots/06.wallet_addresses.png" alt="Addresses">
</div>

---

## Send Transaction from Keypering

Three're 3 steps to send a transaction from Keypering

1. Specify address and amount to send
2. Check the transaction information
3. Confirm to sign the transaction

<small><b>Tip</b>: Click the right arrow in the Transaction panel to view details on Explorer.</small>

<div class="center">
  <b><small>Send Transaction From Keypering</small></b>
  <img src="_media/screenshots/07.request_tx_from_keypering.png" alt="Send Tx From Keypering">
</div>

<div class="center">
  <b><small>Check Transaction From Keypering</small></b>
  <img src="_media/screenshots/08.check_tx_from_keypering.png" alt="Check Tx From Keypering">
</div>

<div class="center">
  <b><small>Confirm Transaction From Keypering</small></b>
  <img src="_media/screenshots/09.confirm_tx_from_keypering.png" alt="Confirm Tx From Keypering">
</div>

<div class="center">
  <b><small>History updated</small></b>
  <img src="_media/screenshots/10.history_updated.png" alt="History updated">
</div>

---

## DApp

DApp can send JSON RPC conforming to [Keypering Agency Protocal](/protocol) to interact with Keypering.

### Grant DApp Authorization

<div class="center">
  <b><small>Request Auth from DApp</small></b>
  <img src="_media/screenshots/11.dapp_request_auth.png" alt="Request Auth from DApp">
</div>

<div class="center">
  <b><small>Grant DApp Token</small></b>
  <img src="_media/screenshots/12.grant_dapp_token.png" alt="Grant DApp Token">
</div>

<div class="center">
  <b><small>Authorizations</small></b>
  <img src="_media/screenshots/13.authorizations.png" alt="Authorizations">
</div>

<div class="center">
  <b><small>Set Authorization Header</small></b>
  <img src="_media/screenshots/14.dapp_set_authorization_header.png" alt="Set Authorization Header">
</div>

---

### DApp Query Addresses

<div class="center">
  <b><small>Query Addresses</small></b>
  <img src="_media/screenshots/15.dapp_query_addresses.png" alt="Query Addresses">
</div>

---

### Sign Transaction from DApp

<div class="center">
  <b><small>DApp Request Sign Transaction</small></b>
  <img src="_media/screenshots/16.dapp_request_sign_tx.png" alt="DApp Request Sign Transaction">
</div>

<div class="center">
  <b><small>Check Transaction from DApp</small></b>
  <img src="_media/screenshots/17.check_tx_from_dapp.png" alt="Check Transaction from DApp">
</div>

<div class="center">
  <b><small>Approved Transaction</small></b>
  <img src="_media/screenshots/18.approved_sign_tx.png" alt="Approved Transaction">
</div>

---

### Send Signed Transaction from DApp

<div class="center">
  <b><small>Send Signed Transaction from DApp</small></b>
  <img src="_media/screenshots/19.dapp_request_send_tx.png" alt="Send Signed Transaction from DApp">
</div>

<div class="center">
  <b><small>Check Signed Transaction from DApp</small></b>
  <img src="_media/screenshots/20.check_tx_from_dapp.png" alt="Check Signed Transaction from DApp">
</div>

---

### Sign and Send Transaction from DApp

<div class="center">
  <b><small>Transaction from DApp</small></b>
  <img src="_media/screenshots/21.dapp_request_sign_and_send_tx.png" alt="Transaction from DApp">
</div>

---

## Setting

![Sidebar](_media/screenshots/22.sidebar.png)
![Setting](_media/screenshots/23.setting.png)

### Lock plug-ins

The lock plug-ins setting is used to specify which lock scripts are used to generate addresses and sign transactions.

Custom lock scripts can be loaded by specifying a directory containing your scripts. After that your scripts will be parsed and whose in right fomrat will be imported.

> Custom Lock Script should implement the [LockScript](https://github.com/ququzone/keyper/blob/d324671d2dc6e886e0a7a5cc102d7c3a3ed62335/packages/specs/src/lock.ts#L22) interface and be exported as default. [Lock Script Example](https://github.com/Keith-CY/keyper_lock_scripts)

### Rich Node RPC

There're three types of [CKB Rich Nodes](https://github.com/ququzone/ckb-rich-node) and the Devnet one is configurable for your local development.
