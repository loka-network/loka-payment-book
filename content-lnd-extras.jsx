/* ====================================================================
   loka-p2p-lnd — HTLC Atomic Swap + USDT on EVM deep-dives
   Both components are attached to window so content-lnd.jsx can use them.
   ==================================================================== */

/* ===================================================================
   LND_HTLC — How BTC ⇄ SUI ⇄ EVM atomic settlement actually works
   =================================================================== */
function LND_HTLC() {
  return (
    <>
      <Callout kind="cyan" label="reading time · 4 min">
        Why the Loka stack can move value between Bitcoin, SUI, and EVM-class
        chains without a custodial bridge — no wrapped assets, no validator
        set, no relayer. Just one cryptographic primitive that ships with
        every chain we touch.
      </Callout>

      <H2 id="htlc-why" n={1}>The problem: cross-chain payment, no trust anchor</H2>
      <p>
        An agent holds BTC. The merchant prices their API in USDT on Tempo.
        How do funds move without one party trusting the other (or trusting a
        third party that holds both)?
      </p>
      <p>
        The market answer for the last six years has been <em>bridges</em>:
        lock funds on chain A, mint a wrapped IOU on chain B. The problem is
        well-known.
      </p>

      <div className="card">
        <h3>Protocol-layer losses, last 3 years</h3>
        <table className="tight" style={{margin: 0}}>
          <tbody>
            <tr><td>Ronin (Axie)</td><td className="num">$625M</td></tr>
            <tr><td>Binance Bridge</td><td className="num">$570M</td></tr>
            <tr><td>Poly Network</td><td className="num">$611M</td></tr>
            <tr><td>Wormhole</td><td className="num">$326M</td></tr>
            <tr><td>Multichain</td><td className="num">~$210M</td></tr>
            <tr><td>Nomad</td><td className="num">$190M</td></tr>
            <tr><td>Harmony · Orbit · etc.</td><td className="num">$300M+</td></tr>
            <tr style={{borderTop:'1px solid var(--border)'}}>
              <td><strong>Total &gt; <span style={{color:'var(--red)'}}>$2.5B</span></strong></td>
              <td className="num"><strong>EVM bridges</strong></td>
            </tr>
            <tr>
              <td>Lightning HTLC, network-wide</td>
              <td className="num" style={{color:'var(--green)'}}><strong>$0</strong></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>
        Bridges fail because the trust boundary lives at a validator set or
        multisig that you have to <em>trust</em>. HTLC-based atomic swap
        moves that boundary back to each chain's own consensus + SHA-256.
        That's the whole pitch.
      </p>

      <H2 id="htlc-primitive" n={2}>The HTLC primitive</H2>
      <p>
        An HTLC — <strong>Hash Time Locked Contract</strong> — is the same
        primitive Lightning channels use internally for forwarding payments
        across hops. It says: <em>"this output can be claimed by anyone who
        reveals a preimage X such that SHA-256(X) = h, or refunded to the
        sender after timeout T."</em>
      </p>

      <Mermaid>{`
flowchart LR
  classDef o fill:#10172c,stroke:#FFD86B,color:#FFD86B,font-weight:600;
  classDef p fill:#0e1424,stroke:#5EEAD4,color:#cdd5e8;
  classDef d fill:#0a0f1a,stroke:#fb7185,color:#fb7185;

  s["Sender locks N units<br/>output script:"]:::o
  c["claimable<br/>if preimage X<br/>where SHA256(X)=h"]:::p
  r["refundable to sender<br/>after timeout T"]:::d
  s --> c
  s --> r
      `}</Mermaid>

      <p>
        The crucial property: <strong>the preimage <code>X</code> is the same
        secret on every chain that supports HTLC</strong>. If Alice locks
        funds on chain A with hash <code>h</code>, and Bob locks funds on
        chain B with the same hash <code>h</code>, then the moment <em>either
        side</em> spends by revealing <code>X</code>, the other side can
        watch the chain, learn <code>X</code>, and spend the matching output.
      </p>

      <p>The same secret unlocks both sides — that's "atomic".</p>

      <H2 id="htlc-flow" n={3}>The swap sequence</H2>
      <p>
        Walk-through: Alice has BTC, wants Bob's SUI. No custodian, no
        bridge.
      </p>

      <Mermaid>{`
sequenceDiagram
  autonumber
  participant A as Alice (BTC)
  participant B as Bob (SUI)

  Note over A,B: 1. Alice generates secret X<br/>computes h = SHA256(X)
  A->>B: send h (only the hash)

  Note over A,B: 2. Alice locks BTC<br/>HTLC(h, timeout 48h)
  A->>A: HTLC on BTC chain ready

  Note over A,B: 3. Bob verifies BTC HTLC,<br/>locks SUI HTLC(h, timeout 24h)
  B->>B: HTLC on SUI chain ready

  Note over A,B: 4. Alice claims SUI<br/>by revealing X
  A->>B: spend SUI HTLC, publishing X

  Note over A,B: 5. Bob sees X on SUI chain,<br/>uses same X to claim BTC
  B->>A: spend BTC HTLC, publishing X

  Note over A,B: Done. Both balances swapped.<br/>Zero trust, zero custodian.
      `}</Mermaid>

      <Callout kind="amber" label="why the timeouts differ">
        Bob's timeout (24h) is <em>shorter</em> than Alice's (48h). This is
        intentional. If Bob doesn't act, Alice can refund first; Bob can't
        steal Alice's BTC and then refund his SUI. The longer-side party
        must always be the first to commit.
      </Callout>

      <H2 id="htlc-safety" n={4}>Why it cannot fail to "half-pay"</H2>
      <p>Three branches, all safe:</p>

      <Grid cols={3}>
        <div className="card">
          <h3 style={{color:'var(--green)'}}>Happy path</h3>
          <p style={{margin:0}}>Alice claims SUI → Bob claims BTC. Both swapped, both win.</p>
        </div>
        <div className="card">
          <h3 style={{color:'var(--amber)'}}>Bob disappears</h3>
          <p style={{margin:0}}>Alice's BTC HTLC times out → BTC refunds to Alice. Bob's SUI HTLC times out → SUI refunds to Bob. No loss.</p>
        </div>
        <div className="card">
          <h3 style={{color:'var(--amber)'}}>Alice disappears</h3>
          <p style={{margin:0}}>Neither HTLC was ever claimed. Both refund on timeout. No state change.</p>
        </div>
      </Grid>

      <p>
        What you <em>cannot</em> reach: a state where one side is claimed and
        the other isn't. Because revealing <code>X</code> on one chain makes
        it public — the other side just reads it and claims.
      </p>

      <H2 id="htlc-vs-bridge" n={5}>Side-by-side: bridge vs HTLC swap</H2>
      <table>
        <thead>
          <tr><th>Trait</th><th>Lock-and-mint bridge</th><th>HTLC swap</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>What you receive</td>
            <td>Wrapped IOU (wBTC, USDC.e, …)</td>
            <td><strong>Native asset on the destination chain</strong></td>
          </tr>
          <tr>
            <td>Who you trust</td>
            <td>Validator set / multisig / oracle</td>
            <td><strong>Each chain's own consensus + SHA-256</strong></td>
          </tr>
          <tr>
            <td>Capital efficiency</td>
            <td>Locked forever on origin chain</td>
            <td>Settles in seconds, capital freed</td>
          </tr>
          <tr>
            <td>If "bridge" goes offline</td>
            <td>Funds stuck or rugged</td>
            <td>Timeout → automatic refund, same path</td>
          </tr>
          <tr>
            <td>Failure mode</td>
            <td>One smart-contract hack → systemic loss</td>
            <td>One side disappears → just no trade, no loss</td>
          </tr>
          <tr>
            <td>New chain support</td>
            <td>Months of integration + audit per chain</td>
            <td>Any chain with HTLC primitive (every reasonable L1)</td>
          </tr>
        </tbody>
      </table>

      <Callout kind="cyan" label="in Loka's stack">
        The Sui adapter implements HTLC via the on-chain{' '}
        <code>lightning.move</code> module. The Bitcoin adapter inherits
        upstream lnd's Script-based HTLC verbatim. The EVM adapter (roadmap)
        will use a Solidity HTLC contract. <strong>One preimage, three
        chains, atomic.</strong>
      </Callout>
    </>
  );
}

/* ===================================================================
   LND_EvmUsdt — How USDT-on-EVM (Tempo, Base, Arbitrum…) plugs in
   =================================================================== */
function LND_EvmUsdt() {
  return (
    <>
      <Callout kind="cyan" label="roadmap · in design">
        How the same adapter pattern that runs Loka channels on SUI today
        will host stablecoin Lightning channels on EVM chains — without
        forking either the L1 contract or the lnd application layer. This is
        the path to AI agents paying merchants in USDT.
      </Callout>

      <H2 id="usdt-why" n={1}>Why this matters</H2>
      <p>
        SUI-denominated payments are technically beautiful, but the unit-of-
        account that AI workloads invoice in is overwhelmingly{' '}
        <strong>USD-pegged stablecoin</strong>. A merchant that posts an API
        for "$0.001 per call" doesn't want to track <code>MIST</code> price
        feeds — they want their balance in USDT, drawn down by the same
        Lightning routing engine that does everything else.
      </p>
      <p>
        Two EVM-class chains are particularly interesting:
      </p>
      <Grid cols={2}>
        <Tile index="01 · TEMPO" title="Stripe-system stablecoin chain">
          Tempo is Stripe's stablecoin L1, designed end-to-end for payment
          settlement. Native USDC / USDT, EVM-compatible, signed-message
          envelopes that already look a lot like LN invoices.
        </Tile>
        <Tile index="02 · BASE / ARBITRUM" title="High-volume L2s with deep USDT">
          Base and Arbitrum host the largest USDT and USDC pools outside CEX
          custody. EVM-equivalent execution, same Solidity tooling, same
          wallets agents already speak.
        </Tile>
      </Grid>

      <H2 id="usdt-shape" n={2}>Shape of the integration</H2>
      <p>
        Lightning channels on EVM are not a new idea — the original
        idea was floated as <em>"Raiden"</em> back in 2017. The reason it
        didn't take is that bare-metal channel state machines need first-
        class chain primitives that early EVM lacked. Today's EVMs solve
        that:
      </p>

      <Grid cols={2}>
        <div className="card">
          <h3>Solidity HTLC contract</h3>
          <p style={{margin:0}}>The same <code>lightning.move</code> module
          we run on SUI maps cleanly to a Solidity contract that holds USDT
          and accepts <code>SHA256(preimage)</code> claims with timeout
          refunds.</p>
        </div>
        <div className="card">
          <h3>ERC-20 escrow</h3>
          <p style={{margin:0}}>Channels lock USDT (an ERC-20), not native
          ETH. The funding tx is an <code>ERC-20 approve + deposit</code>
          pair. Withdrawal is the inverse.</p>
        </div>
        <div className="card">
          <h3>EIP-712 commit signatures</h3>
          <p style={{margin:0}}>Channel state updates use EIP-712 typed-data
          signatures — agent-friendly because every modern Ethereum wallet
          supports them natively.</p>
        </div>
        <div className="card">
          <h3>Lazy on-chain settlement</h3>
          <p style={{margin:0}}>Same as Bitcoin / SUI Lightning: only the
          channel <em>open</em> and <em>close</em> touch the chain. Every
          payment in between is off-chain LN HTLC, free.</p>
        </div>
      </Grid>

      <H2 id="usdt-tempo" n={3}>Tempo · Base · Arbitrum — one adapter, three backends</H2>
      <p>
        The Zero-Intrusion adapter pattern (see{' '}
        <a className="link" href="#lnd/architecture">Architecture</a>) means
        we don't fork lnd for each EVM chain. We implement the three
        interfaces once, against generic EVM JSON-RPC, and choose the L1
        endpoint at startup.
      </p>

      <Mermaid>{`
flowchart TB
  classDef app fill:#10172c,stroke:#FFD86B,color:#FFD86B,font-weight:600;
  classDef ad fill:#0e1424,stroke:#5EEAD4,color:#cdd5e8,font-weight:600;
  classDef ch fill:#0a0f1a,stroke:#8b8bff,color:#cdd5e8;

  app["lnd application layer · BOLT routing · HTLC switch · unchanged"]:::app
  evm["EVM adapter<br/>evmnotify · evmwallet · evmsigner<br/>chainfee/evm · evm_channel"]:::ad
  tempo["Tempo<br/>USDT · USDC"]:::ch
  base["Base<br/>USDT · USDC · DAI"]:::ch
  arb["Arbitrum<br/>USDT · USDC"]:::ch

  app --> evm
  evm -- "JSON-RPC<br/>chain=tempo" --> tempo
  evm -- "JSON-RPC<br/>chain=base" --> base
  evm -- "JSON-RPC<br/>chain=arbitrum" --> arb
      `}</Mermaid>

      <p>
        From the routing engine's perspective, an EVM channel looks
        identical to a Sui or Bitcoin channel — same gossip, same pathfinder,
        same Mission Control reputation. The only thing that changes is
        what's denominated inside the channel.
      </p>

      <H2 id="usdt-flow" n={4}>End-to-end flow: agent pays for an API in USDT</H2>
      <Mermaid>{`
sequenceDiagram
  autonumber
  participant A as Agent
  participant Aln as Agent lnd
  participant Mln as Merchant lnd
  participant P as Prism

  Note over Aln: Base · USDT
  Note over Mln: Tempo · USDT

  A->>P: GET /api/data
  P-->>A: 402 — LSAT macaroon=…,<br/>invoice=lnusdt1…
  A->>Aln: pay invoice
  Note over Aln,Mln: HTLC routes<br/>Base → Loka hub → Tempo<br/>same preimage, two chains
  Mln-->>P: preimage settled
  A->>P: GET /api/data — LSAT m:p
  P-->>A: 200 OK + body
      `}</Mermaid>

      <p>
        The agent doesn't have to know its USDT lives on Base or that the
        merchant's USDT lives on Tempo — Loka routes through whichever
        intermediate channel has liquidity, and HTLC preimage compatibility
        guarantees atomic settlement across the cross-chain hop.
      </p>

      <H2 id="usdt-roadmap" n={5}>Roadmap</H2>
      <table>
        <thead><tr><th>Milestone</th><th>Status</th><th>Notes</th></tr></thead>
        <tbody>
          <tr>
            <td>Solidity <code>lightning.sol</code> HTLC contract</td>
            <td><span className="badge amber">design</span></td>
            <td>Direct port of the Move module; OpenZeppelin audit pre-deploy</td>
          </tr>
          <tr>
            <td>EVM adapter package <code>evmnotify</code> / <code>evmwallet</code></td>
            <td><span className="badge amber">prototype</span></td>
            <td>Same interfaces as <code>suinotify</code> / <code>suiwallet</code></td>
          </tr>
          <tr>
            <td>Base mainnet devnet integration</td>
            <td><span className="badge muted">queued</span></td>
            <td>USDT + DAI channels first; pegged-asset support generalises</td>
          </tr>
          <tr>
            <td>Tempo integration</td>
            <td><span className="badge muted">queued</span></td>
            <td>Stripe-system stablecoin chain, payment-optimised L1</td>
          </tr>
          <tr>
            <td>Cross-chain swap (BTC ⇄ SUI ⇄ EVM)</td>
            <td><span className="badge muted">queued</span></td>
            <td>Requires the EVM HTLC primitive to be production. See <a className="link" href="#lnd/htlc">HTLC Atomic Swap</a>.</td>
          </tr>
        </tbody>
      </table>

      <Callout kind="cyan" label="contribute">
        The EVM adapter scaffold is being built in the open. If you operate
        an EVM L2 and want first-class Lightning channel support, drop into
        the{' '}
        <a className="link" href="https://github.com/loka-network/loka-p2p-lnd/discussions" target="_blank">
          loka-p2p-lnd discussions
        </a>.
      </Callout>
    </>
  );
}

window.LND_HTLC = LND_HTLC;
window.LND_EvmUsdt = LND_EvmUsdt;
