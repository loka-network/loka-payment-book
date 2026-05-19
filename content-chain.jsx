/* ====================================================================
   Settlement Chain — multi-chain panel. BTC + SUI + EVM family
   (loka-chain is one EVM-class chain among several).
   ==================================================================== */

const CH_SUBTABS = [
  { id: 'overview',   label: 'Multi-chain Overview' },
  { id: 'btc',        label: 'Bitcoin' },
  { id: 'sui',        label: 'SUI' },
  { id: 'evm',        label: 'EVM Chains' },
  { id: 'lokachain',  label: 'loka-chain' },
];

function PageChain({ sub, setSub, registerSections }) {
  const active = sub || 'overview';

  useEffect(() => {
    const sections = {
      overview: [{ title: 'On this page', items: [
        { id: 'ch-thesis',   label: 'One Lightning, many settlement chains' },
        { id: 'ch-roster',   label: 'Supported settlement chains' },
        { id: 'ch-routing',  label: 'How a payment routes between them' },
        { id: 'ch-which',    label: 'Which chain should I use?' },
      ]}],
      btc: [{ title: 'Bitcoin', items: [
        { id: 'btc-role',    label: 'Role in the stack' },
        { id: 'btc-htlc',    label: 'Native HTLC' },
        { id: 'btc-flags',   label: 'Operating Bitcoin backend' },
      ]}],
      sui: [{ title: 'SUI', items: [
        { id: 'sui-role',    label: 'Role in the stack' },
        { id: 'sui-move',    label: 'Move-enforced channels' },
        { id: 'sui-flags',   label: 'Operating SUI backend' },
      ]}],
      evm: [{ title: 'EVM Chains', items: [
        { id: 'evm-family',  label: 'The EVM family' },
        { id: 'evm-htlc',    label: 'Solidity HTLC pattern' },
        { id: 'evm-stable',  label: 'USDT / USDC channel support' },
      ]}],
      lokachain: [{ title: 'loka-chain', items: [
        { id: 'lc-what',     label: 'What it is' },
        { id: 'lc-why',      label: 'Why loka-chain' },
        { id: 'lc-arch',     label: 'Three-layer architecture' },
        { id: 'lc-blockstm', label: 'Block-STM parallel exec' },
        { id: 'lc-evm',      label: 'EVM compatibility' },
        { id: 'lc-finance',  label: 'Enterprise finance stack' },
        { id: 'lc-deploy',   label: 'Install & deploy' },
        { id: 'lc-roadmap',  label: 'Roadmap' },
      ]}],
    };
    registerSections(sections[active]);
  }, [active]);

  return (
    <>
      <ProjectHero
        eyebrow="05 · Settlement Layer"
        title={<>Settlement Chain<br/><em>BTC · SUI · EVM</em></>}
        subtitle="Loka Lightning settles on multiple base chains. Bitcoin (inherited from upstream lnd, rock-solid), SUI (Move-enforced channels, sub-second finality), and a family of EVM chains — Tempo, Base, Arbitrum, plus our own loka-chain. One adapter pattern, many backends."
        repo="https://github.com/loka-network/loka-chain"
        stats={[
          { v: '3 families', k: 'chain backends' },
          { v: '1 HTLC',    k: 'cross-chain primitive' },
          { v: '< 1s',      k: 'channel finality (SUI · loka-chain)' },
        ]}
      />

      {active === 'overview'  && <CH_Overview />}
      {active === 'btc'       && <CH_Btc />}
      {active === 'sui'       && <CH_Sui />}
      {active === 'evm'       && <CH_Evm />}
      {active === 'lokachain' && <CH_LokaChain />}
    </>
  );
}

/* -------------------- Multi-chain Overview ---------------------- */
function CH_Overview() {
  return (
    <>
      <H2 id="ch-thesis" n={1}>One Lightning, many settlement chains</H2>
      <p>
        Loka Payment is <strong>chain-agnostic by design</strong>. The
        routing engine speaks BOLT; the chain just has to provide three
        primitives (notifier, wallet, signer) and an HTLC. Anything that
        does is a candidate settlement layer.
      </p>
      <p>
        That's why this section is called "Settlement Chain" in the singular
        — operationally there is no "the" settlement chain. Pick the chain
        that matches your liquidity, your jurisdiction, your denomination of
        choice, and your operator preferences. The same agent wallet talks
        to the same Prism gateway over the same routing graph regardless.
      </p>

      <H2 id="ch-roster" n={2}>Supported settlement chains</H2>

      <Grid cols={2}>
        <div className="card" style={{borderColor: 'rgba(255,216,107,0.4)'}}>
          <h3 style={{color:'var(--gold)'}}>
            <svg viewBox="0 0 24 24" width="16" height="16" style={{verticalAlign:'-3px',marginRight:6}} fill="currentColor">
              <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9 7h3.5c1.4 0 2.5.9 2.5 2.2 0 .9-.5 1.6-1.2 2 .9.4 1.5 1.2 1.5 2.3 0 1.5-1.2 2.5-2.8 2.5H9V7zm1.7 4.2h1.7c.6 0 1-.4 1-1s-.4-1-1-1h-1.7v2zm0 3.4h1.9c.7 0 1.2-.4 1.2-1.1 0-.6-.5-1.1-1.2-1.1h-1.9v2.2zM11 5v2M11 17v2M13 5v2M13 17v2" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
            Bitcoin
            <span className="badge green" style={{marginLeft: 8}}>production</span>
          </h3>
          <p>The original Lightning. Inherited <em>verbatim</em> from upstream lnd — bitcoind / btcd / neutrino backends, BOLT-compliant in full, Script-based HTLC. Most liquid, most battle-tested, no Loka-specific code.</p>
        </div>

        <div className="card" style={{borderColor: 'rgba(94,234,212,0.4)'}}>
          <h3 style={{color:'var(--cyan)'}}>
            <svg viewBox="0 0 24 24" width="16" height="16" style={{verticalAlign:'-3px',marginRight:6}} fill="currentColor">
              <path d="M12 2l9 16H3z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
            SUI
            <span className="badge green" style={{marginLeft: 8}}>live</span>
          </h3>
          <p>Loka's flagship. Move-enforced channel state via the on-chain <code>lightning.move</code> module. Sub-second DAG-BFT finality means channel open/close is instant. Native MIST-denominated channels.</p>
        </div>

        <div className="card" style={{borderColor: 'rgba(139,139,255,0.4)'}}>
          <h3 style={{color:'var(--violet)'}}>
            <svg viewBox="0 0 24 24" width="16" height="16" style={{verticalAlign:'-3px',marginRight:6}} fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12 2 19 12 12 16 5 12"/>
              <polygon points="12 17 19 13 12 22 5 13"/>
            </svg>
            EVM chains
            <span className="badge amber" style={{marginLeft: 8}}>roadmap</span>
          </h3>
          <p>One adapter pattern, many backends. Tempo (Stripe's stablecoin L1), Base, Arbitrum, OP, Polygon — all share the same Solidity HTLC, all reachable from the same routing engine. USDT/USDC channel support is the headline feature.</p>
        </div>

        <div className="card" style={{borderColor: 'rgba(255,216,107,0.32)'}}>
          <h3>
            <span className="badge gold" style={{marginRight: 8}}>EVM family</span>
            loka-chain
          </h3>
          <p>Loka's own EVM-compatible L1. NeoBFT consensus + Block-STM parallel execution, sub-second finality, full Ethereum tooling. <strong>One of the EVM chains the routing engine supports — not "the" settlement chain.</strong> Operate it yourself or settle on any of the others.</p>
        </div>
      </Grid>

      <H2 id="ch-routing" n={3}>How a payment routes between them</H2>
      <p>
        Lightning's HTLC primitive is the universal solvent. A payment that
        originates on one chain and terminates on another just routes through
        a hub node that has channels on both — the same preimage unlocks
        both sides atomically.
      </p>

      <Mermaid>{`
flowchart LR
  classDef btc fill:#10172c,stroke:#FFD86B,color:#FFD86B,font-weight:600;
  classDef sui fill:#0e1424,stroke:#5EEAD4,color:#5EEAD4,font-weight:600;
  classDef evm fill:#0a0f1a,stroke:#8b8bff,color:#8b8bff,font-weight:600;
  classDef hub fill:#161f33,stroke:#FFD86B,stroke-width:2px,color:#e6eaf5,font-weight:700;

  agent(("Agent<br/>holds BTC")):::btc
  hub["Loka multi-chain hub<br/>BTC · SUI · EVM channels"]:::hub
  merchant(("Merchant<br/>wants USDT on Base")):::evm

  agent -- "BTC channel" --> hub
  hub -- "EVM channel" --> merchant

  note["one HTLC preimage<br/>two chains<br/>atomic settlement"]:::sui
  hub -.- note
      `}</Mermaid>

      <p>
        The routing engine doesn't care that the input channel and output
        channel run on different chains — they're just two hops in the
        pathfinder graph. Cross-chain settlement is "free" in the sense that
        it adds no protocol complexity; the same machinery that routes a
        BTC-to-BTC payment routes a BTC-to-USDT-on-Base payment.
      </p>

      <p>
        See <a className="link" href="#lnd/htlc">HTLC Atomic Swap</a> for the
        cryptographic deep-dive.
      </p>

      <H2 id="ch-which" n={4}>Which chain should I use?</H2>
      <table>
        <thead>
          <tr><th>If you want…</th><th>Use</th><th>Why</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>Maximum liquidity + zero Loka-specific risk</td>
            <td><strong>Bitcoin</strong></td>
            <td>Inherited from upstream lnd, every existing LN tool works</td>
          </tr>
          <tr>
            <td>Sub-second finality + Move smart-contract programmability</td>
            <td><strong>SUI</strong></td>
            <td>Channel open/close is instant; <code>lightning.move</code> enforces state on-chain</td>
          </tr>
          <tr>
            <td>Stablecoin denomination (USDT / USDC)</td>
            <td><strong>EVM chains</strong></td>
            <td>Tempo · Base · Arbitrum host the deepest stablecoin liquidity</td>
          </tr>
          <tr>
            <td>An EVM L1 you operate yourself, with enterprise features</td>
            <td><strong>loka-chain</strong></td>
            <td>NeoBFT + Block-STM, fully EVM-compatible, KYC hooks if you need them</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

/* -------------------- Bitcoin ----------------------------------- */
function CH_Btc() {
  return (
    <>
      <H2 id="btc-role" n={1}>Role in the stack</H2>
      <p>
        Bitcoin is the <em>reference</em> settlement chain. Loka's BTC backend is{' '}
        <strong>inherited verbatim from upstream lnd</strong> — no fork, no
        wrapper, no Loka-specific glue. If you're a Lightning operator who
        already runs bitcoind, lnd, or neutrino, your existing node is
        already a Loka-compatible node.
      </p>

      <Callout kind="gold" label="why this matters">
        Treating BTC as a peer backend (not "the" backend) means Loka inherits
        Bitcoin's six years of LN battle-testing for free, and BTC liquidity
        is reachable from every Loka channel via HTLC routing.
      </Callout>

      <H2 id="btc-htlc" n={2}>Native HTLC</H2>
      <p>
        Bitcoin Script's <code>OP_HASH160</code> + <code>OP_CHECKLOCKTIMEVERIFY</code>
        is the original HTLC primitive — the one every other implementation
        models itself on. SHA-256 preimage hash, absolute or relative timelock,
        no smart contract required.
      </p>

      <H2 id="btc-flags" n={3}>Operating a Bitcoin backend</H2>
      <Code lang="bash">{`# bitcoind backend (recommended)
lnd --bitcoin.active --bitcoin.mainnet \\
    --bitcoin.node=bitcoind \\
    --bitcoind.rpchost=localhost:8332 \\
    --bitcoind.rpcuser=YOUR_USER \\
    --bitcoind.rpcpass=YOUR_PASS

# btcd backend
lnd --bitcoin.active --bitcoin.mainnet --bitcoin.node=btcd

# neutrino — light client, no full node required
lnd --bitcoin.active --bitcoin.mainnet --bitcoin.node=neutrino`}</Code>
      <p>
        All three modes are unchanged from upstream lnd — refer to the{' '}
        <a className="link" href="https://github.com/lightningnetwork/lnd/blob/master/docs/INSTALL.md" target="_blank">
          lnd install guide
        </a>{' '}
        for exhaustive configuration.
      </p>
    </>
  );
}

/* -------------------- SUI --------------------------------------- */
function CH_Sui() {
  return (
    <>
      <H2 id="sui-role" n={1}>Role in the stack</H2>
      <p>
        SUI is Loka's flagship adaptation — the first non-Bitcoin chain to
        host BOLT-compliant Lightning channels with a fork-free routing
        engine. Channels live as Move resources, finality is sub-second,
        and the standard lnrpc gRPC interface is preserved.
      </p>

      <H2 id="sui-move" n={2}>Move-enforced channels</H2>
      <p>
        Instead of Bitcoin's Script-based HTLC, SUI channels use the on-chain{' '}
        <code>lightning.move</code> module. Open / close / HTLC-claim /
        penalty enforcement are all Move calls that operate on a single
        <code> Channel</code> resource owned by the funding multisig.
      </p>
      <Code lang="move">{`// sui-contracts/lightning/sources/lightning.move (excerpt)
public struct Channel has key, store {
    id: UID,
    party_a: address,
    party_b: address,
    capacity: u64,
    balance_a: u64,
    balance_b: u64,
    commit_number: u64,
}

public fun open_channel(ctx: &mut TxContext, ...): Channel { ... }
public fun close_channel(channel: Channel, ...) { ... }
public fun htlc_claim(channel: &mut Channel, preimage: vector<u8>, ...) { ... }`}</Code>
      <p className="muted">
        The Move module is open-source and audited — see{' '}
        <code>sui-contracts/lightning/</code> in the{' '}
        <a className="link" href="https://github.com/loka-network/loka-p2p-lnd" target="_blank">
          loka-p2p-lnd repo
        </a>.
      </p>

      <H2 id="sui-flags" n={3}>Operating a SUI backend</H2>
      <Code lang="bash">{`lnd --suinode.active --suinode.devnet \\
    --suinode.rpchost=https://fullnode.devnet.sui.io:443 \\
    --suinode.packageid="<PACKAGE_ID>"`}</Code>
      <p>
        Package IDs (the deployed <code>lightning.move</code> address) per
        network are read from <code>sui-contracts/lightning/deploy_state_*.json</code>
        in the loka-p2p-lnd repo.
      </p>
    </>
  );
}

/* -------------------- EVM Chains -------------------------------- */
function CH_Evm() {
  return (
    <>
      <H2 id="evm-family" n={1}>The EVM family</H2>
      <p>
        Several EVM-compatible chains slot into the same EVM adapter — one
        codebase, many chain backends, selected by RPC endpoint at startup.
      </p>
      <table>
        <thead><tr><th>Chain</th><th>Type</th><th>Highlights</th><th>Status</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>Tempo</strong></td>
            <td>L1 · Stripe-system</td>
            <td>Stablecoin-native, payment-optimised, native USDC/USDT</td>
            <td><span className="badge amber">queued</span></td>
          </tr>
          <tr>
            <td><strong>Base</strong></td>
            <td>L2 · OP Stack</td>
            <td>Coinbase L2, deepest USDC liquidity outside CEX</td>
            <td><span className="badge amber">queued</span></td>
          </tr>
          <tr>
            <td><strong>Arbitrum</strong></td>
            <td>L2 · Arbitrum Stack</td>
            <td>Largest L2 by TVL, mature USDT pool</td>
            <td><span className="badge amber">queued</span></td>
          </tr>
          <tr>
            <td><strong>OP Mainnet</strong></td>
            <td>L2 · OP Stack</td>
            <td>OP Superchain reference implementation</td>
            <td><span className="badge muted">queued</span></td>
          </tr>
          <tr>
            <td><strong>Polygon PoS</strong></td>
            <td>L1 · sidechain</td>
            <td>High throughput, established stablecoin market</td>
            <td><span className="badge muted">queued</span></td>
          </tr>
          <tr>
            <td><strong>loka-chain</strong></td>
            <td>L1 · NeoBFT + Block-STM</td>
            <td>Loka's own; enterprise features, fully self-hostable</td>
            <td><span className="badge green">live</span></td>
          </tr>
        </tbody>
      </table>

      <H2 id="evm-htlc" n={2}>Solidity HTLC pattern</H2>
      <p>
        Every EVM chain in the family deploys the same{' '}
        <code>lightning.sol</code> contract — a direct port of the SUI Move
        module to Solidity. Funding is via <code>ERC-20 approve + deposit</code>;
        commitment state updates use EIP-712 typed-data signatures; HTLC claim
        emits an event the routing engine watches.
      </p>
      <Code lang="solidity">{`// lightning.sol (excerpt)
contract LightningChannel {
    struct Channel {
        address partyA;
        address partyB;
        IERC20  asset;
        uint256 capacity;
        uint256 balanceA;
        uint256 balanceB;
        uint64  commitNumber;
    }

    function openChannel(...) external returns (uint256 channelId);
    function closeChannel(uint256 id, Commitment calldata commit, bytes[2] calldata sigs) external;
    function htlcClaim(uint256 id, bytes32 preimage, ...) external;
}`}</Code>

      <H2 id="evm-stable" n={3}>USDT / USDC channel support</H2>
      <p>
        ERC-20 channels mean the unit-of-account inside a channel is whatever
        token funded it — not native ETH. An agent funds a USDT channel by
        depositing USDT; the on-chain contract escrows the ERC-20; every
        in-channel payment moves USDT balance between the two parties.
        Close-out withdraws the ERC-20 back to the participants.
      </p>
      <p>
        See <a className="link" href="#lnd/evm-usdt">USDT on EVM</a> in the
        Lightning Node section for the full end-to-end flow.
      </p>
    </>
  );
}

/* -------------------- loka-chain (one EVM among many) ----------- */
function CH_LokaChain() {
  return (
    <>
      <Callout kind="gold" label="loka-chain in context">
        loka-chain is <em>one of</em> the EVM-compatible chains the Lightning
        routing engine can settle on — not the canonical settlement chain.
        It exists because we needed an EVM-class chain we fully control for
        operator-grade features (KYC hooks, parachain isolation, TEE
        validators) that public chains don't offer. If you don't need those,
        any other EVM chain works — the routing engine is indifferent.
      </Callout>

      <H2 id="lc-what" n={1}>What it is</H2>
      <p>
        <strong>Loka Chain is a parallel-EVM Layer 1 for high-throughput on-chain finance.</strong>{' '}
        It pairs <strong>NeoBFT</strong> (Byzantine-fault-tolerant consensus with deterministic
        finality) with <strong>Block-STM</strong> (optimistic parallel execution at storage-slot
        granularity), then composes the network as a <strong>three-layer parachain model</strong>{' '}
        so independent applications run on dedicated lanes instead of stepping on each other.
      </p>
      <p>
        Existing Solidity contracts, Hardhat / Foundry pipelines, and MetaMask wallets work
        unchanged. No rewrite, no new tooling.
      </p>

      <Grid cols={3}>
        <Tile index="01 · THROUGHPUT" title="300K TPS sequencer">
          100K TPS per parachain · sub-second finality. Block-STM detects conflicts at the
          storage-slot level and commits deterministically.
        </Tile>
        <Tile index="02 · COMPATIBILITY" title="Drop-in EVM">
          Solidity bytecode, JSON-RPC, MetaMask, Hardhat, Foundry, The Graph — same standards,
          same audit trail, zero migration.
        </Tile>
        <Tile index="03 · ISOLATION" title="One viral app ≠ system-wide congestion">
          Parachains have separate gas markets and governance. A memecoin spike on one lane
          doesn't tank the others.
        </Tile>
      </Grid>

      <H2 id="lc-why" n={2}>Why loka-chain — four structural advantages</H2>

      <h3 style={{marginTop:24}}>1. Parallel execution, not a single-threaded VM</h3>
      <p>
        Most EVM-compatible chains execute transactions one at a time. Loka uses Block-STM:
        every tx in a block runs <em>optimistically in parallel</em>, the runtime watches for
        storage-slot read/write conflicts, and any conflicting tx is re-executed deterministically
        until the commit order matches a serial schedule.
      </p>
      <table>
        <thead>
          <tr><th>Chain</th><th>Execution model</th><th>Realistic TPS</th></tr>
        </thead>
        <tbody>
          <tr><td>Ethereum L1</td><td>Sequential EVM</td><td><span className="num">~15</span></td></tr>
          <tr><td>Polygon PoS</td><td>Sequential EVM</td><td><span className="num">~7,000</span> (reorg risk)</td></tr>
          <tr><td>Stock Cosmos SDK</td><td>Sequential</td><td><span className="num">~2,000</span></td></tr>
          <tr>
            <td><strong>loka-chain · sequencer</strong></td>
            <td><strong>Block-STM parallel</strong></td>
            <td><strong className="num" style={{color:'var(--gold)'}}>~300,000</strong></td>
          </tr>
          <tr>
            <td><strong>loka-chain · per parachain</strong></td>
            <td><strong>Block-STM parallel</strong></td>
            <td><strong className="num" style={{color:'var(--gold)'}}>~100,000</strong> sub-second</td>
          </tr>
        </tbody>
      </table>
      <p className="muted" style={{fontSize:12.5}}>
        Block-STM is the same primitive Aptos uses — except loka-chain keeps full EVM bytecode
        compatibility, so you don't rewrite contracts in Move.
      </p>

      <h3 style={{marginTop:24}}>2. Drop-in EVM, zero migration</h3>
      <p>
        Alternative high-TPS chains (Solana, Aptos, Sui) make you rewrite in Rust / Move /
        something else. Loka keeps the Solidity tooling moat intact.
      </p>
      <table className="tight">
        <thead><tr><th>What works unchanged</th><th>How</th></tr></thead>
        <tbody>
          <tr><td>Solidity contracts</td><td>Deploy existing bytecode — no recompile, no auditor re-review</td></tr>
          <tr><td>MetaMask</td><td>Add the JSON-RPC URL, that's it</td></tr>
          <tr><td>Hardhat / Foundry / Remix</td><td>Standard Ethereum JSON-RPC endpoints</td></tr>
          <tr><td>ERC-20 / 721 / 4337</td><td>Same standards, same audit trail</td></tr>
          <tr><td>The Graph subgraphs</td><td>Same event log format</td></tr>
        </tbody>
      </table>

      <h3 style={{marginTop:24}}>3. Modular parachains — apps don't share gas</h3>
      <p>
        Most L1s are monolithic: a viral game, NFT mint, or memecoin spam crashes the gas
        market for every other app. Loka isolates applications onto dedicated parachains:
      </p>
      <ul>
        <li>Per-parachain <strong>gas market</strong> — payments doesn't pay for a game's congestion</li>
        <li>Per-parachain <strong>governance</strong> — compliance-sensitive deployments set their own rules</li>
        <li>Per-parachain <strong>VM tuning</strong> — HFT parachain ≠ social parachain</li>
        <li>Shared <strong>Chain-S settlement</strong> layer for cross-parachain state anchoring (IBC-style)</li>
        <li>Optional <strong>TEE-secured validators</strong> (Intel SGX, AWS Nitro Enclaves) per parachain</li>
      </ul>

      <h3 style={{marginTop:24}}>4. Enterprise finance stack out of the box</h3>
      <p>
        You don't have to assemble stablecoin + DEX + KYC + AA from third parties. See{' '}
        <a className="link" href="#chain/lokachain#lc-finance">Enterprise finance stack</a>{' '}
        for the full list.
      </p>

      <H2 id="lc-arch" n={3}>Three-layer parachain model</H2>
      <p>
        Loka separates <em>what</em> is being computed from <em>where</em> and <em>how</em>{' '}
        it's settled. Apps live in parachains; state anchors back to a single main settlement
        chain; consensus and parallel execution are a shared substrate underneath everything.
      </p>

      <Mermaid>{`
flowchart TB

  subgraph APP["Application Layer"]
    direction LR
    a1["Solidity contracts"]
    a2["ERC-20 / 721 / 4337"]
    a3["LOKA Stable · LOKA DEX"]
  end

  subgraph PARA["Parachain Execution Layer (each independent)"]
    direction LR
    p1["pay parachain<br/>own gas · own gov<br/>100K TPS"]
    p2["trade parachain<br/>on-chain CLOB<br/>1ms matching"]
    p3["game parachain<br/>own VM tuning<br/>100K TPS"]
    p4["compliance parachain<br/>TEE-secured<br/>KYC + audit"]
  end

  subgraph SETT["Chain-S · Main Settlement Layer"]
    direction LR
    s1["state anchoring"]
    s2["IBC-style cross-parachain"]
    s3["optional core asset settlement"]
  end

  subgraph SUB["Consensus + Execution Substrate (shared by all parachains)"]
    direction LR
    c1["NeoBFT consensus<br/>deterministic finality"]
    c2["Block-STM<br/>parallel EVM"]
    c3["optional TEE validators<br/>(SGX / Nitro)"]
  end

  APP --> PARA --> SETT --> SUB
      `}</Mermaid>
      <Callout kind="cyan" label="why this composes">
        The substrate is uniform; the application layer is plural. Every parachain inherits
        NeoBFT's finality and Block-STM's throughput, but each one decides its own gas model,
        governance, and (optionally) VM. <strong>Adding a parachain does not cost throughput
        on the others — it adds throughput overall.</strong>
      </Callout>

      <H2 id="lc-blockstm" n={4}>Block-STM, in one paragraph</H2>
      <p>
        Inspired by the Aptos Block-STM paper. Every tx in a block is scheduled to run in
        parallel; the runtime tracks the read/write set per tx at <strong>storage-slot
        granularity</strong>. On conflict, the later tx is <em>re-executed</em>, not aborted
        — eventually the commit order converges with a serial schedule, so commits are
        deterministic regardless of how many cores executed in parallel.
      </p>
      <p>
        Combined with EVM bytecode, this means existing Solidity contracts get parallel
        execution <em>for free</em>; no programming-model changes for developers.
      </p>

      <H2 id="lc-evm" n={5}>EVM compatibility</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>JSON-RPC endpoints</h3>
          <p style={{margin:0}}>Standard <code>eth_*</code> and <code>net_*</code> methods. EIP-155 chain IDs. <code>eth_subscribe</code> over WebSocket. Connect MetaMask by adding the RPC URL.</p>
        </div>
        <div className="card">
          <h3>Standards</h3>
          <p style={{margin:0}}>ERC-20 / 721 / 1155 / 4337 are native. Existing audited contracts deploy without recompilation.</p>
        </div>
        <div className="card">
          <h3>Tooling</h3>
          <p style={{margin:0}}>Hardhat, Foundry, Remix, ethers.js, viem all work unchanged. The Graph subgraphs use the same event log format.</p>
        </div>
        <div className="card">
          <h3>Optional VMs</h3>
          <p style={{margin:0}}><strong>WASM</strong> for compute-heavy / non-Solidity workloads. <strong>TEE-enclave</strong> for verifiable off-chain computation and MEV-resistant ordering.</p>
        </div>
      </Grid>

      <H2 id="lc-finance" n={6}>Enterprise finance stack</H2>
      <p>The finance primitives ship with the chain runtime, not bolted on:</p>
      <table>
        <thead><tr><th>Component</th><th>What it gives you</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>LOKA Stable</strong></td>
            <td>Compliant stablecoin issuance with real-time on-chain auditability</td>
          </tr>
          <tr>
            <td><strong>LOKA DEX</strong></td>
            <td>On-chain order book with <strong>1 ms matching latency</strong> + unified liquidity across parachains</td>
          </tr>
          <tr>
            <td><strong>Account Abstraction (AA)</strong></td>
            <td>Sponsored transactions, social recovery, programmable accounts (EIP-4337)</td>
          </tr>
          <tr>
            <td><strong>Gas Abstraction</strong></td>
            <td>Pay gas in any whitelisted asset — USDC, your stablecoin, etc.</td>
          </tr>
          <tr>
            <td><strong>KYC whitelisting + audit logs</strong></td>
            <td>Built into the chain runtime; opt-in TEE attestation tightens it further</td>
          </tr>
        </tbody>
      </table>

      <H2 id="lc-deploy" n={7}>Install &amp; deploy</H2>

      <h3>Local node (single-machine)</h3>
      <Code lang="bash">{`# Go 1.23.3+ · macOS 15+ for the Apple Silicon build path
git clone https://github.com/loka-network/loka-chain
cd loka-chain
make install         # produces lokad in $GOPATH/bin
./local_node.sh      # spins up a local validator with sensible defaults`}</Code>

      <h3>Connect with standard Ethereum tooling</h3>
      <Code lang="bash">{`# JSON-RPC exposed at :8545 by default
export LOKA_RPC=http://127.0.0.1:8545

cast block-number --rpc-url $LOKA_RPC
cast chain-id     --rpc-url $LOKA_RPC

# MetaMask: Settings → Networks → Add network → RPC URL = $LOKA_RPC`}</Code>

      <h3>Production-style 4-validator network</h3>
      <Code lang="bash">{`# on each validator host with lokad in $PATH
./init_validators.sh <ip1> <ip2> <ip3> <ip4>
./start_node_archive.sh    # archive-mode full node`}</Code>

      <h3>Build / test</h3>
      <Code lang="bash">{`make install          # build and install lokad to $GOPATH/bin
make build            # produce build/lokad locally
make test             # unit tests
make test-race        # race detector
make lint             # golangci-lint
make release-dry-run  # verify the goreleaser pipeline locally

docker-compose up     # bundled local network (alternative to local_node.sh)`}</Code>

      <Callout kind="amber" label="beta">
        Loka Chain is in beta. NeoBFT consensus and the Block-STM execution engine must be
        configured per the <code>loka-consensus</code> deployment guide before mainnet.
      </Callout>

      <H2 id="lc-roadmap" n={8}>Roadmap</H2>
      <table className="tight">
        <thead><tr><th>Milestone</th><th>Status</th></tr></thead>
        <tbody>
          <tr><td>NeoBFT consensus on Chain-S main settlement</td><td><span className="badge green">live</span></td></tr>
          <tr><td>Block-STM parallel EVM execution</td><td><span className="badge green">live</span></td></tr>
          <tr><td>Parachain isolation (per-chain gas / governance)</td><td><span className="badge green">live</span></td></tr>
          <tr><td>EVM JSON-RPC · ERC-20/721/4337 support</td><td><span className="badge green">live</span></td></tr>
          <tr><td>LOKA Stable issuance module</td><td><span className="badge green">live</span></td></tr>
          <tr><td>LOKA DEX 1ms on-chain CLOB</td><td><span className="badge amber">in progress</span></td></tr>
          <tr><td>Account Abstraction (EIP-4337) end-to-end UX</td><td><span className="badge amber">in progress</span></td></tr>
          <tr><td>TEE-secured validator opt-in (SGX + Nitro)</td><td><span className="badge amber">in progress</span></td></tr>
          <tr><td>Ethereum L1 bridge for USDC / stETH on-ramp</td><td><span className="badge muted">queued</span></td></tr>
          <tr><td>WASM execution lane for non-Solidity workloads</td><td><span className="badge muted">queued</span></td></tr>
          <tr><td>Mainnet launch</td><td><span className="badge muted">queued</span></td></tr>
        </tbody>
      </table>

      <p className="muted" style={{marginTop: 18}}>
        Full reference + technical docs:{' '}
        <a className="link" href="https://github.com/loka-network/loka-chain" target="_blank">loka-network/loka-chain</a>{' '}
        ·{' '}
        <a className="link" href="https://lokachain.org/" target="_blank">lokachain.org</a>.
      </p>
    </>
  );
}

window.PageChain = PageChain;
