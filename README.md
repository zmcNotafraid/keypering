<p align="center">
  <img src="https://raw.githubusercontent.com/nervosnetwork/keypering/develop/docs/_media/icon.png" alt="logo" width=120 />
</p>

<p align="center">
  A desktop wallet for DApp developers working on <a href="https://github.com/nervosnetwork/ckb/" alt="ckb">Nervos Network CKB</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Window%20%7C%20MacOS%20%7C%20Linux-3CC68A?style=flat-square" alt="Platform" />

  <img src="https://img.shields.io/badge/Application-Insider-brightgreen?style=flat-square&color=3A8FB7" alt="Insider" />

  <a href="https://nervosnetwork.github.io/keypering/#/manual" alt="Manual" style="text-decoration: none">
    <img src="https://img.shields.io/badge/Docs-Manual-green?style=flat-square&color=69B0AC" alt="Manual" />
  </a>

  <a href="https://nervosnetwork.github.io/keypering/#/protocol" alt="Protocol" style="text-decoration: none">
    <img src="https://img.shields.io/badge/Docs-Protocol-blue?style=flat-square&color=2D6D4B" alt="Protocol" />
  </a>

  <img src="https://img.shields.io/github/license/nervosnetwork/keypering?style=flat-square&color=0089A7" alt="License" />

  <a href="https://github.com/nervosnetwork/keypering/releases" alt="Release" style="text-decoration: none">
    <img src="https://img.shields.io/github/v/release/nervosnetwork/keypering?include_prereleases&style=flat-square&color=006284" alt="Release" />
  </a>

  <a href="https://github.com/nervosnetwork/keypering/actions" alt="Workflow" style="text-decoration: none">
    <img src="https://img.shields.io/github/workflow/status/nervosnetwork/keypering/Package%20Keypering?style=flat-square&color=005CAF" alt="Workflow" />
  </a>
</p>

<p align="center">
  👉 <mark>Keypering is still under active development and considered to be a work in progress</mark> 👈
</p>

---

# Getting Started

```bash
$ git clone https://github.com/nervosnetwork/keypering.git
$ cd keypering
$ npm run bootstrap
$ npm run build:specs
$ cp ./packages/app/.env.example ./packages/app/.env
$ npm start
```

Then the Keypering Application should launch as this

![](https://raw.githubusercontent.com/nervosnetwork/keypering/develop/docs/_media/screenshots/01.welcome.png)

- Keypring Main Interface runs on `localhost:3000`
- Keypering Agency Server runs on `localhost:3102`, the `3102` is specified in `./packages/app/.env`

# Components

Keypering consists of 3 components:

1. [@keypering/specs](https://github.com/nervosnetwork/keypering/tree/develop/packages/specs) defines APIs between [renderer process](https://www.electronjs.org/docs/api/ipc-renderer), [main process](https://www.electronjs.org/docs/api/ipc-main#ipcmain) and [DApp](https://github.com/duanyytop/simplestdapp);
2. [@keypering/ui](https://github.com/nervosnetwork/keypering/tree/develop/packages/ui) renders the main interface of Keypering;
3. [@keypering/app](https://github.com/nervosnetwork/keypering/tree/develop/packages/app) maintains data and handle requests from renderer process and DApp.

# Tutorials

- [How to Develop a CKB DApp with Keypering (Video, Chinese + English Subtitles)](https://youtu.be/i-gQ0enK5cY)
- [How to Develop a CKB DApp with Keypering (Slides)](https://docs.google.com/presentation/d/1bswEhjSYwZZnUCF4rRL5x5vfOVXO_kDlbjsojsG94w8/edit?usp=sharing)

# Develop in devnet

1. Clone [perkins-tent](https://github.com/xxuejie/perkins-tent)
2. Run `docker run -e CKB_NETWORK=dev --rm -p 8114:9115 -v ~/.ckb-docker-devnet:/data xxuejie/perkins-tent`
3. Go to `~/.ckb-docker-devnet/confs/nginx.conf` change `location = /indexer_rpc` to `location = /indexer`
4. Open keypering setting page then click Rich Node RPC setting icon, set `http://localhost:8114/indexer` in devent input
5. Finish!
6. If you want to run a miner, append ` miner: ckb miner -C /data/ckb-data` to `~/.ckb-docker-devnet/confs/Procfile`

# Resources

- [Keypering Manual](https://nervosnetwork.github.io/keypering/#/manual) - User Guide of Keypering
- [Keypering Agency Protocol](https://nervosnetwork.github.io/keypering/#/protocol) - DApp Developer Guide of Keypering
- [Keyper](https://github.com/nervosnetwork/keyper) - Lock Script Manager used in Keypering
- [CKB Rich Node](https://github.com/ququzone/ckb-rich-node) - Remote server used in Keypering
- [CKB Indexer](https://github.com/quake/ckb-indexer) - Core Module of CKB Rich Node
- [CKB Explorer](https://explorer.nervos.org)
- [CKB Faucet](https://faucet.nervos.org)
- [Simplest DApp](https://prototype.ckbapp.dev/simplest-dapp) - The simplest DApp to interact with Keypering
- [Lock Scripts](https://github.com/Keith-CY/keyper_lock_scripts) - Basic lock scripts