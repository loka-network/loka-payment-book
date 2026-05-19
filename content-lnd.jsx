/* ====================================================================
   loka-p2p-lnd — LokaPay P2P Lightning Node
   ==================================================================== */

const LND_SUBTABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'htlc',         label: 'HTLC Atomic Swap' },
  { id: 'evm-usdt',     label: 'USDT on EVM' },
  { id: 'quickstart',   label: 'Quick Start' },
  { id: 'skill',        label: 'AI Agent Skill' },
  { id: 'reference',    label: 'Reference' },
];

function PageLnd({ sub, setSub, registerSections, jump }) {
  const active = sub || 'overview';

  useEffect(() => {
    const sections = {
      overview: [{ title: 'On this page', items: [
        { id: 'lnd-what',     label: 'What it is' },
        { id: 'lnd-why',      label: 'Why a fork (and not a bridge)' },
        { id: 'lnd-chains',   label: 'Supported chains' },
        { id: 'lnd-bolt',     label: 'BOLT compliance' },
      ]}],
      architecture: [{ title: 'Architecture', items: [
        { id: 'lnd-zia',      label: 'Zero-Intrusion adapter pattern' },
        { id: 'lnd-interfaces', label: 'Chain abstraction interfaces' },
        { id: 'lnd-sui',      label: 'Sui adapter modules' },
        { id: 'lnd-types',    label: 'Type mapping at the boundary' },
        { id: 'lnd-move',     label: 'Move smart-contract primitives' },
        { id: 'lnd-crypto',   label: 'Crypto compatibility' },
      ]}],
      htlc: [{ title: 'HTLC Atomic Swap', items: [
        { id: 'htlc-why',     label: 'Why HTLC, not bridge' },
        { id: 'htlc-primitive', label: 'The HTLC primitive' },
        { id: 'htlc-flow',    label: 'Swap sequence' },
        { id: 'htlc-safety',  label: 'Why it cannot fail' },
        { id: 'htlc-vs-bridge', label: 'Bridges vs HTLC' },
      ]}],
      'evm-usdt': [{ title: 'USDT on EVM', items: [
        { id: 'usdt-why',     label: 'Why this matters' },
        { id: 'usdt-shape',   label: 'Shape of the integration' },
        { id: 'usdt-tempo',   label: 'Tempo · Base · Arbitrum' },
        { id: 'usdt-flow',    label: 'End-to-end flow' },
        { id: 'usdt-roadmap', label: 'Roadmap' },
      ]}],
      quickstart: [{ title: 'Quick Start', items: [
        { id: 'lnd-docker',   label: 'Run with Docker' },
        { id: 'lnd-release',  label: 'Run from release binary' },
        { id: 'lnd-source',   label: 'Build from source' },
        { id: 'lnd-seeds',    label: 'Loka seed nodes' },
      ]}],
      skill: [{ title: 'AI Agent SKILL', items: [
        { id: 'lnd-skill-intent', label: 'Intent & prerequisites' },
        { id: 'lnd-skill-start',  label: 'Step 1 · Start LND' },
        { id: 'lnd-skill-wallet', label: 'Step 2 · Wallet & funding' },
        { id: 'lnd-skill-peer',   label: 'Step 3 · Peer' },
        { id: 'lnd-skill-chan',   label: 'Step 4 · Open channel' },
        { id: 'lnd-skill-pay',    label: 'Step 5 · Pay invoice' },
        { id: 'lnd-skill-gotchas',label: 'Gotchas' },
      ]}],
      reference: [{ title: 'Reference', items: [
        { id: 'lnd-ref-flags', label: 'CLI flags (Sui mode)' },
        { id: 'lnd-ref-make',  label: 'Make targets' },
        { id: 'lnd-ref-docs',  label: 'In-repo docs' },
      ]}],
    };
    registerSections(sections[active]);
  }, [active]);

  return (
    <>
      <ProjectHero
        eyebrow="01 · Lightning Routing Layer"
        title={<>loka-p2p-lnd <span className="badge gold" style={{verticalAlign:'middle',marginLeft:8}}>β</span></>}
        subtitle="Multi-chain Lightning routing for the agentic economy. One BOLT-compliant routing engine, multiple ledger backends — Bitcoin · Sui · EVM (planned)."
        repo="https://github.com/loka-network/loka-p2p-lnd"
        skill="https://raw.githubusercontent.com/loka-network/loka-p2p-lnd/main/SKILL/loka-agentic-payment/SKILL.md"
        skillName="loka-agentic-payment.SKILL.md"
        stats={[
          { v: 'BOLT 1–11', k: 'compliance' },
          { v: 'BTC · SUI · EVM', k: 'backends' },
          { v: 'Go 1.25+',  k: 'language' },
        ]}
      />

      <SubTabs tabs={LND_SUBTABS} active={active} onChange={setSub} />

      {active === 'overview'     && <LND_Overview />}
      {active === 'architecture' && <LND_Architecture />}
      {active === 'htlc'         && <window.LND_HTLC />}
      {active === 'evm-usdt'     && <window.LND_EvmUsdt />}
      {active === 'quickstart'   && <LND_Quickstart />}
      {active === 'skill'        && <LND_Skill />}
      {active === 'reference'    && <LND_Reference />}
    </>
  );
}

/* ---------- Overview ----------- */
function LND_Overview() {
  return (
    <>
      <H2 id="lnd-what" n={1}>What it is</H2>
      <p>
        <code>loka-p2p-lnd</code> is a downstream fork of{' '}
        <a className="link" href="https://github.com/lightningnetwork/lnd" target="_blank">lightningnetwork/lnd</a>
        {' '}— the reference Lightning Network daemon — that adds a clean adapter
        seam so the same battle-tested routing engine can settle channels on
        chains other than Bitcoin.
      </p>
      <p>
        The Lightning application layer (RPC, routing engine, HTLC switch,
        gossip, watchtower) is preserved <em>verbatim</em>. Loka's contribution
        is below the line: three adapter packages that satisfy lnd's
        <code>ChainNotifier</code> / <code>WalletController</code> / <code>Signer</code> interfaces
        against the Sui chain (with EVM and Setu on the roadmap).
      </p>

      <H2 id="lnd-why" n={2}>Why a fork (and not a bridge)</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>Bridges custody · HTLCs don't</h3>
          <p style={{margin:0}}>EVM lock-and-mint bridges have lost <strong>over $2.5B</strong> in the last
          three years (Ronin, Wormhole, Multichain, Nomad…). HTLC-based atomic swap losses at the protocol
          layer: <strong>$0</strong>. Same SHA-256 secret, no validator set.</p>
        </div>
        <div className="card">
          <h3>One routing engine, N chains</h3>
          <p style={{margin:0}}>The chain-abstraction interfaces in lnd were always there — Loka just builds new
          backends to slot in. Every BOLT spec, every test, every gossip-graph optimization
          carries over to Sui for free.</p>
        </div>
      </Grid>

      <H2 id="lnd-chains" n={3}>Supported chains</H2>
      <table>
        <thead><tr><th>Chain</th><th>Adapter</th><th>Status</th><th>When to use</th></tr></thead>
        <tbody>
          <tr><td><strong>Bitcoin</strong></td><td><code>bitcoind</code> · <code>btcd</code> · <code>neutrino</code></td><td><span className="badge green">live</span></td><td>Mainnet LN liquidity</td></tr>
          <tr><td><strong>Sui</strong></td><td><code>suinotify</code> · <code>suiwallet</code> · <code>chainfee/sui_estimator</code></td><td><span className="badge green">live</span></td><td>Sub-second DAG-BFT finality · Move-enforced channels</td></tr>
          <tr><td><strong>EVM</strong></td><td><code>evmnotify</code> · <code>evmwallet</code> · <code>chainfee/evm</code></td><td><span className="badge amber">roadmap</span></td><td>Tempo · Base · Arbitrum · OP · Polygon</td></tr>
          <tr><td><strong>Setu</strong></td><td>—</td><td><span className="badge muted">upcoming</span></td><td>Intent-carrying payment flows (Hetu)</td></tr>
        </tbody>
      </table>

      <H2 id="lnd-bolt" n={4}>BOLT compliance</H2>
      <p>All BOLT specs from the Lightning application layer are preserved unmodified.</p>
      <table className="tight">
        <thead><tr><th>Spec</th><th>Title</th><th></th></tr></thead>
        <tbody>
          {[
            ['1','Base Protocol'],['2','Peer Protocol for Channel Management'],
            ['3','Bitcoin Transaction and Script Formats'],['4','Onion Routing Protocol'],
            ['5','On-chain Transaction Handling'],['7','P2P Node and Channel Discovery'],
            ['8','Encrypted and Authenticated Transport'],['9','Assigned Feature Flags'],
            ['10','DNS Bootstrap and Assisted Node Location'],['11','Invoice Protocol'],
          ].map(([n, t]) => (
            <tr key={n}><td><strong>BOLT {n}</strong></td><td>{t}</td><td><span className="badge green">✓</span></td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/* ---------- Architecture ----------- */
function LND_Architecture() {
  return (
    <>
      <H2 id="lnd-zia" n={1}>Zero-Intrusion adapter pattern</H2>
      <p>
        Rather than fork the Lightning core, Loka abstracts <em>underneath</em> it.
        Each new chain plugs into three stable interfaces that lnd already
        defines. The application layer above the line never knows which chain
        is running.
      </p>

      <div className="arch-diagram">
        <div className="arch-band band-app">
          <div className="arch-band-title">
            <span>LND Application Layer</span>
            <span className="arch-tag">unchanged</span>
          </div>
          <div className="arch-band-items">
            <span className="arch-pill">RPC Server</span>
            <span className="arch-pill">Routing Engine</span>
            <span className="arch-pill">HTLC Switch</span>
            <span className="arch-pill">Channel FSM</span>
            <span className="arch-pill">Gossip · BOLT 7</span>
          </div>
        </div>

        <div className="arch-arrow"><span>satisfies</span></div>

        <div className="arch-band band-iface">
          <div className="arch-band-title">
            <span>Chain Abstraction Interfaces</span>
            <span className="arch-tag">never modify</span>
          </div>
          <div className="arch-band-items">
            <span className="arch-pill iface"><code>ChainNotifier</code></span>
            <span className="arch-pill iface"><code>WalletController</code></span>
            <span className="arch-pill iface"><code>Signer</code></span>
            <span className="arch-pill iface"><code>BlockChainIO</code></span>
            <span className="arch-pill iface"><code>FeeEstimator</code></span>
          </div>
        </div>

        <div className="arch-arrow"><span>plug-in backends</span></div>

        <div className="arch-adapters">
          <div className="arch-adapter live">
            <div className="arch-adapter-head">
              <span className="arch-adapter-status">●</span>
              <span className="arch-adapter-name">Bitcoin</span>
              <span className="arch-adapter-badge">verbatim from upstream</span>
            </div>
            <ul>
              <li><code>bitcoindnotify</code></li>
              <li><code>btcdnotify</code></li>
              <li><code>neutrinonotify</code></li>
              <li><code>btcwallet</code></li>
            </ul>
          </div>

          <div className="arch-adapter live">
            <div className="arch-adapter-head">
              <span className="arch-adapter-status">●</span>
              <span className="arch-adapter-name">SUI Adapter</span>
              <span className="arch-adapter-badge live">live</span>
            </div>
            <ul>
              <li><code>suinotify/</code></li>
              <li><code>suiwallet/</code></li>
              <li><code>input/sui_channel</code></li>
              <li><code>chainfee/sui</code></li>
            </ul>
          </div>

          <div className="arch-adapter roadmap">
            <div className="arch-adapter-head">
              <span className="arch-adapter-status">◐</span>
              <span className="arch-adapter-name">EVM Adapter</span>
              <span className="arch-adapter-badge plan">roadmap</span>
            </div>
            <ul>
              <li><code>evmnotify/</code></li>
              <li><code>evmwallet/</code></li>
              <li><code>chainfee/evm</code></li>
              <li className="muted">Tempo · Base · Arbitrum · OP · Polygon</li>
            </ul>
          </div>

          <div className="arch-adapter soon">
            <div className="arch-adapter-head">
              <span className="arch-adapter-status">○</span>
              <span className="arch-adapter-name">Setu Adapter</span>
              <span className="arch-adapter-badge soon">upcoming</span>
            </div>
            <ul>
              <li className="muted">intent-carrying payment flows</li>
            </ul>
          </div>
        </div>
      </div>

      <H2 id="lnd-interfaces" n={2}>Chain abstraction interfaces</H2>
      <p>Three Go interfaces, defined by upstream lnd, that a backend must satisfy:</p>
      <Grid cols={2}>
        <div className="card">
          <h3><code>ChainNotifier</code></h3>
          <p style={{margin:0}}>Spends, confirmations, block notifications. The Sui adapter implements this
          on top of Sui's event subscription RPC.</p>
        </div>
        <div className="card">
          <h3><code>WalletController</code></h3>
          <p style={{margin:0}}>Key derivation, UTXO selection (or coin-objects on Sui), funding-tx
          construction. <code>suiwallet</code> emits <code>BuildMoveCall</code> against the on-chain
          <code>lightning</code> Move module.</p>
        </div>
        <div className="card">
          <h3><code>Signer</code></h3>
          <p style={{margin:0}}>SECP256K1 signing. Sui's quirk: the signed payload must be
          <code>SHA256(Blake2B(intent))</code> matching the Mysten SDK spec. Loka adapts the existing
          signing pipeline rather than forking SECP256K1.</p>
        </div>
        <div className="card">
          <h3><code>BlockChainIO</code></h3>
          <p style={{margin:0}}>UTXO / event lookup by hash. Sui's Object-ID model maps cleanly:
          <code>OutPoint.Hash → ObjectID</code>, <code>Index → 0</code>.</p>
        </div>
      </Grid>

      <H2 id="lnd-sui" n={3}>Sui adapter modules</H2>
      <table>
        <thead><tr><th>Package</th><th>Implements</th><th>Responsibility</th></tr></thead>
        <tbody>
          <tr><td><code>suinotify/</code></td><td>ChainNotifier</td><td>Event tracking + block notifications via Sui RPC</td></tr>
          <tr><td><code>suiwallet/</code></td><td>WalletController + Signer</td><td>Key mgmt, address derivation, Move-call construction</td></tr>
          <tr><td><code>chainfee/sui_estimator</code></td><td>FeeEstimator</td><td>Dynamic fee estimation against live Sui conditions</td></tr>
          <tr><td><code>input/sui_channel</code></td><td>—</td><td>Channel input parsing for Sui transaction inputs</td></tr>
          <tr><td><code>sui-contracts/lightning</code></td><td>Move</td><td>On-chain <code>lightning.move</code>: open/close/HTLC/penalty</td></tr>
        </tbody>
      </table>

      <H2 id="lnd-types" n={4}>Type mapping at the boundary</H2>
      <p>The adapter reuses lnd types internally and translates at the seam — no codebase-wide type refactor.</p>
      <table className="tight">
        <thead><tr><th>LND type</th><th>Sui semantic</th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td><code>wire.OutPoint.Hash</code></td><td><code>ObjectID</code></td><td>Direct 32-byte mapping</td></tr>
          <tr><td><code>wire.OutPoint.Index</code></td><td><code>0</code></td><td>Sui has no UTXO index</td></tr>
          <tr><td><code>btcutil.Amount</code></td><td><code>u64</code></td><td>Sui base unit (MIST)</td></tr>
          <tr><td><code>wire.MsgTx</code></td><td>Sui Event bytes</td><td>Serialized Event payload</td></tr>
          <tr><td><code>chainhash.Hash</code></td><td><code>EventId / AnchorId</code></td><td>32 bytes</td></tr>
        </tbody>
      </table>

      <H2 id="lnd-move" n={5}>Move smart-contract primitives</H2>
      <p>
        All channel lifecycle events — <code>ChannelOpen</code>, <code>ChannelClose</code>,
        <code>HTLCClaim</code>, penalty enforcement — route through <code>suiwallet</code>,
        which constructs <code>BuildMoveCall</code> requests against the on-chain Move module.
        No Bitcoin scripting limitations; full programmability with Move's resource semantics.
      </p>

      <H2 id="lnd-crypto" n={6}>Crypto compatibility</H2>
      <p>
        Sui's TS SDK expects payloads in the form <code>SHA256(Blake2B(intent))</code>. The Go signing
        pipeline was extended to produce that deterministic envelope so SECP256K1 signatures
        validate 100% against Sui Devnet without forking the underlying SECP256K1 library.
      </p>
    </>
  );
}

/* ---------- Quickstart ----------- */
function LND_Quickstart() {
  return (
    <>
      <Callout kind="amber" label="beta">
        The multi-chain Lightning node is in beta (BTC stable inherited from upstream; SUI live;
        EVM on the roadmap). Read the in-repo
        <code> docs/safety.md</code> before connecting a mainnet wallet.
      </Callout>

      <H2 id="lnd-docker" n={1}>Run with Docker</H2>
      <Code lang="bash">{`docker pull hetuorg/lnd:v0.21.0

docker run -p 9735:9735 -p 10009:10009 \\
  -v ~/.lnd:/root/.lnd \\
  hetuorg/lnd:v0.21.0 \\
  --chain=sui --sui.rpc=<sui-rpc-endpoint>`}</Code>

      <H2 id="lnd-release" n={2}>Run from release binary</H2>
      <Code lang="bash">{`curl -L https://github.com/loka-network/loka-p2p-lnd/releases/download/v0.21.0/loka-lnd-linux-amd64-v0.21.0.tar.gz \\
  | tar xz
./lnd --chain=sui --sui.rpc=<sui-rpc-endpoint>`}</Code>

      <H2 id="lnd-source" n={3}>Build from source</H2>
      <Code lang="bash">{`git clone https://github.com/loka-network/loka-p2p-lnd
cd loka-p2p-lnd
make install     # produces lnd and lncli in $GOPATH/bin

# build flags worth knowing
make build           # debug binaries: lnd-debug, lncli-debug
make unit            # unit tests
make itest           # integration tests (needs Docker for postgres)
make release         # reproducible 15-target cross-compile`}</Code>
      <p className="muted">Required Go: <strong>1.25.5+</strong> (see <code>GO_VERSION</code> in <code>Makefile</code>).</p>

      <H2 id="lnd-seeds" n={4}>Loka seed nodes</H2>
      <p>To join the main network backbone and ensure persistent routing:</p>
      <Code lang="bash">{`# EU seed
lncli connect 0276bf6dc8fd0ce046c40c0c504d586419ecfdc456909b7f17e60e4da824e7afc7@lnd-seed-eu.loka.cash:9735

# US seed
lncli connect 0268e7d59cfe59230ac6d0af4750bc5042bd6209e9cae1da32f98f8ee9ef9596a9@lnd-seed-us.loka.cash:9735`}</Code>
    </>
  );
}

/* ---------- Skill ----------- */
function LND_Skill() {
  return (
    <>
      <Callout kind="cyan" label="machine-readable skill">
        The in-repo file <code>SKILL/loka-agentic-payment/SKILL.md</code> is the canonical
        Skill that any AI agent (Claude Code, Cursor, etc.) should ingest to operate a Loka
        node autonomously. This page is the same content, rendered for humans.
      </Callout>

      <H2 id="lnd-skill-intent" n={1}>Intent & prerequisites</H2>
      <p>
        The Skill instructs an agent to autonomously start its own Lightning
        node, manage non-custodial channels, and execute P2P payments — running
        as an independent process that holds its own keys.
      </p>
      <Code lang="bash">{`# 1. Clone & build
git clone https://github.com/loka-network/loka-p2p-lnd.git
cd loka-p2p-lnd
make release-install

# 2. PATH (already added to ~/.bashrc / ~/.zshrc by the installer)
export PATH=$PATH:/root/go/bin`}</Code>

      <div className="card">
        <h3>Pre-configured variables (agent should use these)</h3>
        <table className="tight" style={{margin: 0}}>
          <tbody>
            <tr><td>Network</td><td><code>devnet</code> or <code>testnet</code></td></tr>
            <tr><td>Package ID</td><td>parsed from <code>sui-contracts/lightning/deploy_state_&lt;net&gt;.json</code></td></tr>
            <tr><td>LND dir</td><td><code>~/.lnd-agent</code></td></tr>
            <tr><td>RPC</td><td><code>127.0.0.1:10009</code></td></tr>
            <tr><td>REST</td><td><code>127.0.0.1:8081</code></td></tr>
            <tr><td>Listen</td><td><code>0.0.0.0:9735</code></td></tr>
            <tr><td>Macaroon</td><td><code>~/.lnd-agent/data/chain/sui/&lt;net&gt;/admin.macaroon</code></td></tr>
          </tbody>
        </table>
      </div>

      <H2 id="lnd-skill-start" n={2}>Step 1 · Start the LND node on Sui</H2>
      <Code lang="bash">{`rm ~/.lnd-agent/lnd.log

nohup lnd --suinode.active \\
    --suinode.devnet \\
    --suinode.rpchost=https://fullnode.devnet.sui.io:443 \\
    --suinode.packageid="<PACKAGE_ID_FROM_DEPLOY_STATE_JSON>" \\
    --listen=0.0.0.0:9735 \\
    --rpclisten=127.0.0.1:10009 \\
    --restlisten=127.0.0.1:8081 \\
    --externalip=<YOUR_PUBLIC_IP>:9735 \\
    --protocol.wumbo-channels \\
    --protocol.no-anchors \\
    --allow-circular-route \\
    --lnddir=~/.lnd-agent \\
    > ~/.lnd-agent/lnd.log 2>&1 &`}</Code>

      <Callout kind="amber" label="External IP">
        <code>--externalip</code> encodes a reachable address into the gossip protocol so peers
        know how to dial back. Omit it and you'll be reachable for outbound channels only,
        and never used as a routing hop.
      </Callout>

      <H2 id="lnd-skill-wallet" n={3}>Step 2 · Wallet creation & funding</H2>
      <Code lang="bash">{`# First boot only — generates a fresh wallet (TTY required, no pipes)
lncli --lnddir=~/.lnd-agent --rpcserver=127.0.0.1:10009 create

# Every restart
lncli --lnddir=~/.lnd-agent --rpcserver=127.0.0.1:10009 --no-macaroons unlock

# Get a Sui address (command says p2wkh but the adapter returns 0x...)
lncli --lnddir=~/.lnd-agent newaddress p2wkh

# Faucet (devnet/testnet only — note /v2/gas)
curl -X POST 'https://faucet.devnet.sui.io/v2/gas' \\
  -H 'Content-Type: application/json' \\
  -d '{"FixedAmountRequest": {"recipient": "<YOUR_SUI_ADDRESS>"}}'`}</Code>

      <H2 id="lnd-skill-peer" n={4}>Step 3 · Connect to a peer</H2>
      <Code lang="bash">{`lncli --lnddir=~/.lnd-agent connect \\
  0276bf6dc8fd0ce046c40c0c504d586419ecfdc456909b7f17e60e4da824e7afc7@lnd-seed-eu.loka.cash:9735

lncli --lnddir=~/.lnd-agent listpeers   # verify`}</Code>

      <H2 id="lnd-skill-chan" n={5}>Step 4 · Open a channel</H2>
      <p>This emits a real on-chain Sui transaction against the <code>lightning.move</code> module:</p>
      <Code lang="bash">{`lncli --lnddir=~/.lnd-agent openchannel \\
  --node_key=<TARGET_PUBKEY> \\
  --local_amt=100000000          # = 0.1 SUI (in MIST)

lncli --lnddir=~/.lnd-agent listchannels  # wait until "active": true`}</Code>

      <H2 id="lnd-skill-pay" n={6}>Step 5 · Pay agent-to-agent</H2>
      <Code lang="bash">{`# Receiver
lncli --lnddir=~/.lnd-agent addinvoice --amt=1000 --memo="API Service Payment"
# → parse "payment_request": "lnsb1..."

# Payer
lncli --lnddir=~/.lnd-agent payinvoice --pay_req=<PAYMENT_REQUEST> --force
# → parse "payment_hash" — the cryptographic receipt`}</Code>

      <H2 id="lnd-skill-gotchas" n={7}>Gotchas</H2>
      <div className="card">
        <h3>1 · <code>--suinode.packageid</code> must match the network</h3>
        <p style={{margin:0}}>
          Devnet PID against testnet network yields <code>insufficient SUI balance: have 0 MIST</code>
          even if the address has funds. Read from <code>deploy_state_&lt;net&gt;.json</code>.
        </p>
      </div>
      <div className="card">
        <h3>2 · Faucet endpoint migrated</h3>
        <p style={{margin:0}}>
          <code>/gas</code> is deprecated — use <code>/v2/gas</code>.
        </p>
      </div>
      <div className="card">
        <h3>3 · <code>lncli create / unlock</code> require a TTY</h3>
        <p style={{margin:0}}>
          No pipes / heredocs for password input. Use <code>expect</code> or a PTY for automation.
        </p>
      </div>
      <div className="card">
        <h3>4 · Restart after rebuilding binaries</h3>
        <p style={{margin:0}}>
          <code>make install</code> does not hot-swap. Stop with <code>lncli stop</code>, restart,
          re-<code>unlock</code>.
        </p>
      </div>
      <div className="card">
        <h3>5 · "already connected to peer" is harmless</h3>
        <p style={{margin:0}}>Idempotent peer connect — safe to ignore.</p>
      </div>
    </>
  );
}

/* ---------- Reference ----------- */
function LND_Reference() {
  return (
    <>
      <H2 id="lnd-ref-flags" n={1}>CLI flags · Sui mode</H2>
      <table className="tight">
        <thead><tr><th>Flag</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>--suinode.active</code></td><td>Enable Sui chain backend</td></tr>
          <tr><td><code>--suinode.devnet</code> / <code>.testnet</code> / <code>.mainnet</code></td><td>Pick network</td></tr>
          <tr><td><code>--suinode.rpchost=URL</code></td><td>Sui fullnode endpoint</td></tr>
          <tr><td><code>--suinode.packageid=...</code></td><td>Deployed <code>lightning.move</code> Package ID</td></tr>
          <tr><td><code>--listen</code></td><td>P2P listen addr (default <code>0.0.0.0:9735</code>)</td></tr>
          <tr><td><code>--rpclisten</code></td><td>gRPC listen addr</td></tr>
          <tr><td><code>--restlisten</code></td><td>REST gateway listen addr</td></tr>
          <tr><td><code>--externalip</code></td><td>Address advertised in gossip</td></tr>
          <tr><td><code>--protocol.wumbo-channels</code></td><td>Allow channels &gt; 0.16 BTC equiv.</td></tr>
          <tr><td><code>--protocol.no-anchors</code></td><td>Disable anchor outputs (legacy commit format)</td></tr>
          <tr><td><code>--allow-circular-route</code></td><td>Allow self-payments / single-node routes</td></tr>
        </tbody>
      </table>

      <H2 id="lnd-ref-make" n={2}>Make targets</H2>
      <table className="tight">
        <thead><tr><th>Target</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>make build</code></td><td>Debug binaries: <code>lnd-debug</code>, <code>lncli-debug</code></td></tr>
          <tr><td><code>make install</code></td><td>Install to <code>$GOPATH/bin</code></td></tr>
          <tr><td><code>make unit</code></td><td>Unit tests (btcd auto-installed)</td></tr>
          <tr><td><code>make unit-module</code></td><td>Run sub-module tests: <code>actor/</code>, <code>fn/</code>, <code>tools/</code></td></tr>
          <tr><td><code>make unit-race</code></td><td>Race detector</td></tr>
          <tr><td><code>make itest</code></td><td>Integration tests (postgres needs Docker)</td></tr>
          <tr><td><code>make lint</code></td><td>golangci-lint via Docker</td></tr>
          <tr><td><code>make release</code></td><td>Reproducible 15-target cross-compile</td></tr>
        </tbody>
      </table>

      <H2 id="lnd-ref-docs" n={3}>In-repo docs</H2>
      <table className="tight">
        <thead><tr><th>Topic</th><th>File</th></tr></thead>
        <tbody>
          <tr><td>Sui integration plan</td><td><code>1-refactor-docs/sui/lnd-and-sui-integration.md</code></td></tr>
          <tr><td>Sui chain architecture</td><td><code>1-refactor-docs/sui/sui-architecture.md</code></td></tr>
          <tr><td>LND refactor plan</td><td><code>1-refactor-docs/sui/lnd-sui-refactor-plan.md</code></td></tr>
          <tr><td>LND engineering architecture</td><td><code>1-refactor-docs/lnd-architecture.md</code></td></tr>
          <tr><td>Sui ↔ LND interaction spec</td><td><code>1-refactor-docs/sui/sui-ln-interaction-spec.md</code></td></tr>
          <tr><td>Move-contract security audit</td><td><code>1-refactor-docs/sui/security-audit.md</code></td></tr>
          <tr><td>Docker deployment</td><td><code>docs/DOCKER.md</code></td></tr>
          <tr><td>Install guide</td><td><code>docs/INSTALL.md</code></td></tr>
        </tbody>
      </table>
    </>
  );
}

window.PageLnd = PageLnd;
