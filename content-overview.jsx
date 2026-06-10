/* ====================================================================
   OVERVIEW PAGE
   Subtabs: introduction · tech-stack · data-flow
   ==================================================================== */

const OV_SUBTABS = [
  { id: 'intro',     label: 'Introduction' },
  { id: 'stack',     label: 'Tech Stack' },
  { id: 'dataflow',  label: 'Data Flow' },
];

function PageOverview({ sub, setSub, registerSections, jump }) {
  const active = sub || 'intro';

  useEffect(() => {
    const sections = {
      intro: [
        { title: 'Introduction', items: [
          { id: 'ov-what',       label: 'What is Loka Payment' },
          { id: 'ov-why',        label: 'Why Lightning for agents' },
          { id: 'ov-quickstart', label: 'Quick start' },
          { id: 'ov-modules',    label: 'The five modules' },
          { id: 'ov-quick',      label: 'Pick a starting point' },
        ]},
      ],
      stack: [
        { title: 'Tech Stack', items: [
          { id: 'st-layered',  label: 'Layered architecture' },
          { id: 'st-matrix',   label: 'Module responsibility matrix' },
          { id: 'st-protocols',label: 'Protocols & specs' },
          { id: 'st-deps',     label: 'Dependency graph' },
          { id: 'st-storage',  label: 'Storage & databases' },
        ]},
      ],
      dataflow: [
        { title: 'Data Flow', items: [
          { id: 'df-l402',     label: 'L402 paywall round-trip' },
          { id: 'df-channels', label: 'Channel lifecycle (Sui)' },
          { id: 'df-mpp',      label: 'MPP session lifecycle' },
          { id: 'df-routes',   label: 'Custody routes A & B' },
        ]},
      ],
    };
    registerSections(sections[active]);
  }, [active]);

  return (
    <>
      <ProjectHero
        eyebrow={<span>00 · Overview</span>}
        title={<>The payment rail for the<br/><em>agentic economy.</em></>}
        subtitle="A composable, Lightning-native payment stack for AI agents. Five purpose-built services, settled over Loka's multi-chain Lightning Network — Bitcoin · SUI · EVM (loka-chain), accessed from a single CLI or SDK."
        figure={<PaymentPulse />}
        stats={[
          { v: '5', k: 'core repos' },
          { v: 'BTC · SUI · EVM', k: 'settlement' },
          { v: '0', k: 'bridge custodians' },
        ]}
      />

      <SubTabs tabs={OV_SUBTABS} active={active} onChange={setSub} />

      {active === 'intro'    && <OV_Intro jump={jump} setSub={setSub} />}
      {active === 'stack'    && <OV_Stack jump={jump} />}
      {active === 'dataflow' && <OV_DataFlow jump={jump} />}
    </>
  );
}

/* -------------------- INTRO subtab ------------------------------- */
function OV_Intro({ jump, setSub }) {
  return (
    <>
      <H2 id="ov-what" n={1}>What is Loka Payment</H2>
      <p>
        Loka Payment is a Lightning-native settlement stack purpose-built for
        machine-speed micropayments — the kind autonomous AI agents need to pay
        each other thousands of times a second without burning their margin on
        gas. Each component is a focused fork of a well-known upstream project,
        adapted at the seams to settle on the <strong>Sui</strong> chain (and
        soon EVM L2s) while keeping every BOLT-compliant primitive of the
        Lightning Network intact.
      </p>

      <p>
        The stack is <em>composable, not monolithic</em>. The five modules
        below talk to each other only through standard Lightning Network
        invoices and preimages — no proprietary RPCs between them. You can
        replace any one piece, run a subset, or wire them together for the
        end-to-end agent payment loop.
      </p>

      <H2 id="ov-why" n={2}>Why Lightning for agents</H2>

      <a className="tweet-card" href="https://x.com/Mr_chen5694/status/2054554707222499633" target="_blank" rel="noopener">
        <div className="tweet-card__play">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div className="tweet-card__body">
          <div className="tweet-card__eyebrow">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" style={{verticalAlign:'-1px',marginRight:6}}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
            </svg>
            <span>2-min pitch · video on X</span>
          </div>
          <div className="tweet-card__title">Why AI agents need their own payment rail</div>
          <div className="tweet-card__hint">The case for an L402 + Lightning stack purpose-built for agentic micropayments. Click to watch ↗</div>
        </div>
      </a>

      <Grid cols={2}>
        <Tile index="01 · ECONOMICS" title="Micropayments stay profitable">
          An agent making 10,000 micro-payments/day at $0.0001 each costs <code>~$10/day</code> on
          the cheapest L1 — and earns $1. On Lightning the channel-open fee amortizes across an
          unlimited stream of payments, so per-call cost asymptotes to zero.
        </Tile>
        <Tile index="02 · ATOMICITY" title="Bridge-free cross-chain">
          HTLC preimage compatibility means BTC ⇄ Sui ⇄ EVM swap atomically by SHA-256, with no
          wrapped assets, validator set, or relayer. A failed swap auto-refunds via timeout.
        </Tile>
        <Tile index="03 · SECURITY" title="Battle-tested routing core">
          The lnd routing engine, gossip layer, watchtower, and pathfinder are preserved verbatim
          from upstream. Loka only extends underneath, at the chain backend.
        </Tile>
        <Tile index="04 · PRIVACY" title="Channel-private balances">
          Channel balance, counterparties, timing, and amounts are not on-chain. Routing nodes
          see only "N sats passed through" — no agent footprint.
        </Tile>
      </Grid>

      <H2 id="ov-quickstart" n={3}>Quick start <span className="h2-tag">try it in 60 seconds</span></H2>
      <p>
        The fastest way to feel the stack is the CLI. Install <code>lokapay</code>, run
        <code> init</code> (it walks you through hosted or self-custody mode), and pay
        an L402-protected API in one command.
      </p>

      <div className="quickstart-grid">
        <div className="quickstart-step">
          <div className="quickstart-step__num">1</div>
          <div className="quickstart-step__body">
            <div className="quickstart-step__title">Install the CLI</div>
            <Code lang="bash">{`curl -fsSL https://github.com/loka-network/paycli/releases/latest/download/install.sh | sh`}</Code>
            <p className="muted" style={{margin: '6px 0 0', fontSize: 12.5}}>
              Or <code>go install github.com/loka-network/paycli/cmd/lokapay@latest</code> if you have Go 1.25+.
            </p>
          </div>
        </div>

        <div className="quickstart-step">
          <div className="quickstart-step__num">2</div>
          <div className="quickstart-step__body">
            <div className="quickstart-step__title">Pick a custody route &amp; sign in</div>
            <Code lang="bash">{`lokapay init
# ↳ hosted  — wallet on agents-pay.loka.cash (one click, no node to run)
# ↳ node    — downloads loka-lnd, funds via faucet, opens a 5 SUI channel`}</Code>
          </div>
        </div>

        <div className="quickstart-step">
          <div className="quickstart-step__num">3</div>
          <div className="quickstart-step__body">
            <div className="quickstart-step__title">Top up &amp; sanity-check</div>
            <Code lang="bash">{`lokapay whoami                                      # balance + wallet meta
lokapay fund --amount 100000                        # BOLT11 invoice — pay from any LN wallet
lokapay fund --amount 5 --unit USD --via stripe --open   # hosted only: Stripe credit-card top-up
lokapay services                                    # browse the Prism gateway catalog`}</Code>
          </div>
        </div>

        <div className="quickstart-step">
          <div className="quickstart-step__num">4</div>
          <div className="quickstart-step__body">
            <div className="quickstart-step__title">Pay an L402-protected API</div>
            <Code lang="bash">{`# 402 → invoice → pay → retry-with-LSAT, all in one shot
lokapay request -i --debug https://service1.prism.loka.cash/data.json`}</Code>
            <p className="muted" style={{margin: '6px 0 0', fontSize: 12.5}}>
              The <code>--debug</code> flag renders the L402 dance as a sequence diagram on
              stderr — useful when something goes wrong.
            </p>
          </div>
        </div>
      </div>

      <Callout kind="cyan" label="under the hood">
        Every <code>lokapay request</code> is just a thin wrapper around the same Lightning
        primitives any LN node speaks. That's the point of the stack — once you're settled on
        the rail, the <a className="link" href="#lnd">Lightning Node</a> is what actually
        moves the money. The CLI exists so you don't have to operate it by hand.
      </Callout>

      <H2 id="ov-modules" n={4}>The five modules</H2>
      <p className="muted">
        Click any tile to dive into that module's documentation.
      </p>

      <div className="stack-diagram">
        <div className="stack-row">
          <div className="layer-label">L4 · CLIENT</div>
          <div className="layer-box" onClick={() => location.hash = 'paycli'}>
            <span className="dot"></span>
            <span className="ttl">paycli</span>
            <span className="desc">— one-binary CLI + Go SDK that drives both custody routes</span>
            <span className="arrow">→</span>
          </div>
        </div>
        <div className="stack-row">
          <div className="layer-label">L3 · GATEWAY</div>
          <div className="layer-box" onClick={() => location.hash = 'prism'}>
            <span className="dot"></span>
            <span className="ttl">loka-prism-l402</span>
            <span className="desc">— HTTP 402 reverse proxy that mints/verifies L402 + MPP tokens</span>
            <span className="arrow">→</span>
          </div>
        </div>
        <div className="stack-row">
          <div className="layer-label">L2 · WALLET</div>
          <div className="layer-box" onClick={() => location.hash = 'aps'}>
            <span className="dot"></span>
            <span className="ttl">agents-pay-service</span>
            <span className="desc">— per-agent isolated wallets behind a clean REST API</span>
            <span className="arrow">→</span>
          </div>
        </div>
        <div className="stack-row">
          <div className="layer-label">L1 · ROUTING <span className="layer-tag">core</span></div>
          <div className="layer-box highlight" onClick={() => location.hash = 'lnd'}>
            <span className="dot"></span>
            <span className="ttl">loka-p2p-lnd</span>
            <span className="desc">— BOLT-compliant Lightning routing, multi-chain (BTC · SUI · EVM)</span>
            <span className="arrow">→</span>
          </div>
        </div>
        <div className="stack-row">
          <div className="layer-label">L0 · SETTLEMENT</div>
          <div className="layer-box" onClick={() => location.hash = 'chain'}>
            <span className="dot"></span>
            <span className="ttl">Settlement chains</span>
            <span className="desc">— Bitcoin · SUI · EVM family (Tempo · Base · Arbitrum · loka-chain)</span>
            <span className="arrow">→</span>
          </div>
        </div>
      </div>

      <Callout kind="gold" label="beyond agents — sovereign money">
        The same rail that lets agents pay each other also lets a nation run its
        own money: its own currency, its own rails, that nobody can quietly
        switch off. From renting money to owning it.{' '}
        <a className="link" href="#sovereign">See the Sovereign Stack →</a>
      </Callout>

      <H2 id="ov-quick" n={5}>Pick a starting point</H2>
      <Grid cols={3}>
        <Tile title="I want to pay an L402 API" onClick={() => location.hash = 'paycli'}>
          Install <code>lokapay</code> · <code>lokapay init</code> · <code>lokapay request URL</code>.
          One command, two custody modes.
        </Tile>
        <Tile title="I want to put a paywall on my API" onClick={() => location.hash = 'prism/register'}>
          <strong>Register on the hosted gateway</strong> — fill a short form, hand over an
          invoice-only macaroon from your own LND, get paywall-as-a-service. No Prism to operate.
          Or self-host Prism if you need full control.
        </Tile>
        <Tile title="I want to operate the rail" onClick={() => location.hash = 'lnd'}>
          Run loka-p2p-lnd on Sui devnet/testnet, peer with the Loka seed nodes, open channels,
          start routing.
        </Tile>
        <Tile title="I'm a sovereign / institution" onClick={() => location.hash = 'sovereign'}>
          See how a nation issues its own stablecoin and clears cross-border on this stack —
          architecture, market entry, and what only real operation builds.
        </Tile>
      </Grid>
    </>
  );
}

/* -------------------- STACK subtab ------------------------------- */
function OV_Stack({ jump }) {
  return (
    <>
      <H2 id="st-layered" n={1}>Layered architecture</H2>
      <p>
        Loka Payment is structured as five strictly-layered services. Each layer
        only knows about the protocol primitives below it — no direct RPC
        dependencies between sibling modules.
      </p>

      <Mermaid>{`
flowchart TB

  subgraph L4["L4 · Pay CLI — paycli"]
    direction LR
    cli["single binary · Go SDK"]
    cli2["two custody routes · L402 auto-pay · MCP"]
  end

  subgraph L3["L3 · L402 Gateway — loka-prism-l402"]
    direction LR
    pr1["L402 + MPP charge + MPP session"]
    pr2["per-service routing · rate limit · admin"]
  end

  subgraph L2["L2 · Agent Wallets — agents-pay-service"]
    direction LR
    aps1["per-agent sub-wallets · REST API"]
    aps2["funding-source abstraction"]
  end

  subgraph L1["L1 · Lightning Node — loka-p2p-lnd"]
    direction LR
    lnd1["BOLT routing · HTLC switch · gossip"]
    lnd2["Sui adapter · EVM (planned)"]
  end

  subgraph L0["L0 · Settlement Chains — BTC · SUI · EVM"]
    direction LR
    ch1["Bitcoin · SUI"]
    ch2["EVM family<br/>(Tempo · Base · Arbitrum · loka-chain)"]
  end

  L4 --> L3
  L4 --> L2
  L3 --> L1
  L2 --> L1
  L1 --> L0
      `}</Mermaid>

      <H2 id="st-matrix" n={2}>Module responsibility matrix</H2>
      <table>
        <thead>
          <tr>
            <th>Module</th>
            <th>Upstream</th>
            <th>Language</th>
            <th>Speaks</th>
            <th>Owns</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>loka-p2p-lnd</code></td><td>lightningnetwork/lnd</td><td>Go</td><td>BOLT 1–11, lnrpc gRPC</td><td>HTLC, channel state, gossip</td></tr>
          <tr><td><code>loka-prism-l402</code></td><td>lightninglabs/aperture</td><td>Go</td><td>HTTP 402 · L402 · MPP</td><td>token mint/verify, rate-limit</td></tr>
          <tr><td><code>agents-pay-service</code></td><td>lnbits/lnbits</td><td>Python · FastAPI</td><td>REST + OpenAPI · LNURL</td><td>sub-wallets, sessions, extensions</td></tr>
          <tr><td><code>paycli</code></td><td>(original)</td><td>Go</td><td>L402 client · MCP · stdio</td><td>two-route dispatch, install lnd</td></tr>
          <tr><td><code>loka-chain</code></td><td>(original)</td><td>Go · Move</td><td>EVM JSON-RPC · Move</td><td>one of the EVM settlement chains</td></tr>
        </tbody>
      </table>

      <H2 id="st-protocols" n={3}>Protocols & specs</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>Lightning layer</h3>
          <ul>
            <li><strong>BOLT 1–11</strong> — full Lightning peer + onion + invoice protocol</li>
            <li><strong>HTLC</strong> — SHA-256 preimage commitment, atomic across chains</li>
            <li><strong>Gossip</strong> — node + channel announcements, P2P discovery</li>
            <li><strong>Macaroons</strong> — scoped delegation tokens for RPC + L402</li>
          </ul>
        </div>
        <div className="card">
          <h3>HTTP payment layer</h3>
          <ul>
            <li><strong>L402</strong> — Lightning HTTP 402, macaroon + invoice in <code>WWW-Authenticate</code></li>
            <li><strong>MPP charge</strong> — per-request payment, IETF draft</li>
            <li><strong>MPP session</strong> — prepaid deposit + bearer voucher</li>
            <li><strong>MCP</strong> — Model Context Protocol over stdio JSON-RPC</li>
          </ul>
        </div>
        <div className="card">
          <h3>Chain adapter interfaces</h3>
          <ul>
            <li><code>ChainNotifier</code> — block + tx notifications</li>
            <li><code>WalletController</code> — key derivation, tx construction</li>
            <li><code>Signer</code> — SECP256K1 + Sui-flavored Blake2B intent hashing</li>
            <li><code>BlockChainIO</code> — UTXO / event lookup</li>
          </ul>
        </div>
        <div className="card">
          <h3>Settlement / chain</h3>
          <ul>
            <li><strong>Move (Sui)</strong> — <code>lightning.move</code> channel state contract</li>
            <li><strong>EVM JSON-RPC</strong> — Solidity / Hardhat / Foundry compatible (Tempo · Base · Arbitrum · loka-chain)</li>
            <li><strong>NeoBFT</strong> — Byzantine-fault-tolerant consensus</li>
            <li><strong>Block-STM</strong> — optimistic parallel transaction execution</li>
          </ul>
        </div>
      </Grid>

      <H2 id="st-deps" n={4}>Dependency graph</H2>
      <p>
        Arrows show <em>runtime</em> dependency only — a service that runs and calls
        another at request time. Compile-time dependencies are zero between all five.
      </p>

      <Mermaid>{`
flowchart TB

  user(("agent / user"))
  cli["paycli"]
  aps["agents-pay-service"]
  lnd["user-local lnd-sui"]
  loka["operator loka-p2p-lnd"]
  chain["settlement chains<br/>BTC · SUI · EVM"]
  prism["loka-prism-l402<br/>(merchant)"]

  user --> cli
  cli -- "hosted" --> aps
  cli -- "node" --> lnd
  aps -- "funding-source" --> loka
  lnd -- "BOLT" --> loka
  loka -- "Move call<br/>event" --> chain
  user -. "HTTP 402" .-> prism
  prism -. "LN invoice" .-> loka
      `}</Mermaid>

      <H2 id="st-storage" n={5}>Storage & databases</H2>
      <table className="tight">
        <thead>
          <tr><th>Module</th><th>Default</th><th>Supported backends</th><th>Schema owner</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><code>loka-p2p-lnd</code></td>
            <td>bbolt</td>
            <td>bbolt · etcd · postgres · sqlite</td>
            <td><code>channeldb/</code></td>
          </tr>
          <tr>
            <td><code>loka-prism-l402</code></td>
            <td>SQLite</td>
            <td>SQLite · PostgreSQL · etcd<sup>*</sup></td>
            <td><code>aperturedb/</code></td>
          </tr>
          <tr>
            <td><code>agents-pay-service</code></td>
            <td>SQLite</td>
            <td>SQLite · PostgreSQL <span className="badge gold">10k+ agents</span></td>
            <td><code>lnbits/core/db.py</code></td>
          </tr>
          <tr>
            <td><code>paycli</code></td>
            <td><code>~/.lokapay/</code> JSON + JSONL</td>
            <td>local fs only</td>
            <td>config + event log</td>
          </tr>
          <tr>
            <td><code>loka-chain</code></td>
            <td>RocksDB</td>
            <td>RocksDB</td>
            <td>cosmos-sdk + EVM state</td>
          </tr>
        </tbody>
      </table>
      <p className="muted" style={{fontSize: '12.5px'}}>
        <sup>*</sup> etcd does not support Prism's admin transaction store — pick SQLite or Postgres for full feature parity.
      </p>
    </>
  );
}

/* -------------------- DATAFLOW subtab ---------------------------- */
function OV_DataFlow({ jump }) {
  return (
    <>
      <H2 id="df-l402" n={1}>L402 paywall round-trip</H2>
      <p>
        The canonical "agent pays for an HTTP call" flow. Six hops, one preimage,
        cached for the lifetime of the macaroon's caveat.
      </p>

      <Mermaid>{`
sequenceDiagram
  autonumber
  participant A as agent
  participant P as Prism
  participant W as agent wallet
  participant M as merchant

  A->>P: GET /resource
  P->>P: AddInvoice (lnrpc)
  P-->>A: 402 — LSAT macaroon=…,<br/>invoice=lnbc1…
  A->>W: pay invoice
  W-->>P: settle (preimage)
  W-->>A: preimage
  A->>P: GET /resource<br/>LSAT m:p
  P->>P: verify preimage ✓
  P->>M: forward
  M-->>A: 200 OK + body
      `}</Mermaid>

      <Callout kind="cyan" label="Token reuse">
        The <code>{`<macaroon>:<preimage>`}</code> tuple is reusable until the macaroon's caveat
        expires (default: 1 year for L402, configurable per service). The agent caches it per
        <code>(origin, service)</code> tuple and never repays per-request.
      </Callout>

      <H2 id="df-channels" n={2}>Channel lifecycle (Sui adapter)</H2>
      <p>
        Channel open / update / close events all flow through the same adapter
        seam — Lightning sees normal HTLC primitives, the chain sees Move calls
        against <code>lightning.move</code>.
      </p>

      <Mermaid>{`
sequenceDiagram
  autonumber
  participant A as Node A
  participant L as loka-p2p-lnd
  participant S as Sui (Move)
  participant B as Node B

  A->>L: openchannel
  L->>S: BuildMoveCall — ChannelOpen
  Note over L,S: < 1s finality (DAG-BFT)
  S-->>L: ChannelOpened event
  L->>B: lightning gossip
  A->>L: payinvoice
  L->>B: HTLC add
  B-->>L: HTLC settle (preimage)
  A->>L: closechannel
  L->>S: HTLCClaim / ChannelClose
  S-->>L: ChannelClosed event
      `}</Mermaid>

      <H2 id="df-mpp" n={3}>MPP session lifecycle</H2>
      <p>
        MPP sessions trade the per-request invoice round-trip for a prepaid
        deposit + bearer voucher loop — better suited to agents that hit the
        same API thousands of times in a session.
      </p>

      <Mermaid>{`
sequenceDiagram
  autonumber
  participant C as client
  participant P as Prism
  participant L as lnd

  C->>P: POST /open
  P-->>C: 402  (deposit invoice ≈ 20× unit price)
  C->>L: pay deposit
  L-->>P: settled
  P-->>C: session token

  loop bearer calls
    C->>P: GET /req?token=…
    P-->>C: 200 OK
  end

  C->>P: POST /close
  P->>C: PaySend(refund = deposit − spent) → return-invoice
      `}</Mermaid>

      <Callout kind="amber" label="Operational note">
        MPP session deposits sit briefly in the proxy's wallet until close. The proxy is
        responsible for paying the refund-invoice back to the client at close time — see
        the Prism docs for the <code>sessionidletimeout</code> tuning knob.
      </Callout>

      <H2 id="df-routes" n={4}>Custody routes A & B</H2>
      <p>
        Both routes terminate at the same Prism gateway. Prism verifies the LN
        preimage and never sees how the payment was sourced — the routes are
        symmetric at the protocol layer.
      </p>
      <Grid cols={2}>
        <div className="card">
          <h3>Route A · Self-custody</h3>
          <ul>
            <li>Wallet runs <strong>locally</strong> on the agent's machine</li>
            <li><code>paycli</code> drives <code>SendPaymentV2</code> via gRPC</li>
            <li>Signing key is the user's own macaroon</li>
            <li>No backend account, no per-agent provisioning</li>
            <li>Best for crypto-native users with their own node</li>
          </ul>
        </div>
        <div className="card">
          <h3>Route B · Custodial</h3>
          <ul>
            <li>Wallet lives on <code>agents-pay-service</code></li>
            <li><code>paycli</code> drives <code>POST /api/v1/payments</code></li>
            <li>Signing key is the service's macaroon, scoped per agent</li>
            <li>One <code>X-Api-Key</code> per sub-wallet, easy to revoke</li>
            <li>Best for fleets of programmatic agents</li>
          </ul>
        </div>
      </Grid>
    </>
  );
}

window.PageOverview = PageOverview;
