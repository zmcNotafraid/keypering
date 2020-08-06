<p align="center">
  <img src="https://raw.githubusercontent.com/Keith-CY/keypering/develop/docs/_media/icon.png" alt="logo" width=120 />
</p>

<p align="center">
  A desktop wallet for DApp developers working on <a href="https://github.com/nervosnetwork/ckb/" alt="ckb">Nervos Network CKB</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Window%20%7C%20MacOS%20%7C%20Linux-3CC68A?style=flat-square" alt="Platform" />

  <img src="https://img.shields.io/badge/Application-Insider-brightgreen?style=flat-square&color=3A8FB7" alt="Insider" />

  <a href="https://ezcook.de/keypering/#/manual" alt="Manual" style="text-decoration: none">
    <img src="https://img.shields.io/badge/Docs-Manual-green?style=flat-square&color=69B0AC" alt="Manual" />
  </a>

  <a href="https://ezcook.de/keypering/#/protocol" alt="Protocol" style="text-decoration: none">
    <img src="https://img.shields.io/badge/Docs-Protocol-blue?style=flat-square&color=2D6D4B" alt="Protocol" />
  </a>

  <img src="https://img.shields.io/github/license/keith-cy/keypering?style=flat-square&color=0089A7" alt="License" />

  <a href="https://github.com/keith-cy/keypering/releases" alt="Release" style="text-decoration: none">
    <img src="https://img.shields.io/github/v/release/keith-cy/keypering?include_prereleases&style=flat-square&color=006284" alt="Release" />
  </a>

  <a href="https://github.com/Keith-CY/keypering/actions" alt="Workflow" style="text-decoration: none">
    <img src="https://img.shields.io/github/workflow/status/keith-cy/keypering/Package%20Keypering?style=flat-square&color=005CAF" alt="Workflow" />
  </a>
</p>

<p align="center">
  👉 <mark>Keypering is still under active development and considered to be a work in progress</mark> 👈
</p>

---

# Getting Started

```bash
$ git clone https://github.com/Keith-CY/keypering.git
$ cd keypering
$ npm run bootstrap
$ npm run build:specs
$ cp ./packages/app/.env.example ./packages/app/.env
$ npm start
```

Then the Keypering Application should launch as this

![](https://raw.githubusercontent.com/Keith-CY/keypering/develop/docs/_media/screenshots/01.welcome.png)

- Keypring Main Interface runs on `localhost:3000`
- Keypering Agency Server runs on `localhost:3102`, the `3102` is specified in `./packages/app/.env`

# Components

Keypering consists of 3 components:

1. [@keypering/specs](https://github.com/Keith-CY/keypering/tree/develop/packages/specs) defines APIs between [renderer process](https://www.electronjs.org/docs/api/ipc-renderer), [main process](https://www.electronjs.org/docs/api/ipc-main#ipcmain) and [DApp](https://github.com/duanyytop/simplestdapp);
2. [@keypering/ui](https://github.com/Keith-CY/keypering/tree/develop/packages/ui) renders the main interface of Keypering;
3. [@keypering/app](https://github.com/Keith-CY/keypering/tree/develop/packages/app) maintains data and handle requests from renderer process and DApp.

# Resources

- [Keypering Manual](https://ezcook.de/keypering/#/manual) - User Guide of Keypering
- [Keypering Agency Protocol](https://ezcook.de/keypering/#/protocol) - DApp Developer Guide of Keypering
- [Keyper](https://github.com/ququzone/keyper) - Lock Script Manager used in Keypering
- [CKB Rich Node](https://github.com/ququzone/ckb-rich-node) - Remote server used in Keypering
- [CKB Indexer](https://github.com/quake/ckb-indexer) - Core Module of CKB Rich Node
- [CKB Explorer](https://explorer.nervos.org)
- [CKB Faucet](https://faucet.nervos.org)
- [Simplest DApp](https://prototype.ckbapp.dev/simplest-dapp) - The simplest DApp to interact with Keypering
- [Lock Scripts](https://github.com/Keith-CY/keyper_lock_scripts) - Basic lock scripts