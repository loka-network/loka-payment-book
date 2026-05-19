/* ====================================================================
   agents-pay-service — LNbits-based per-agent wallet service
   ==================================================================== */

const APS_SUBTABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'concepts',     label: 'Concepts' },
  { id: 'security',     label: 'Security · TEE · ZK' },
  { id: 'install',      label: 'Install & Run' },
  { id: 'api',          label: 'REST API' },
  { id: 'skill',        label: 'AI Agent Skill' },
];

function PageAps({ sub, setSub, registerSections, jump }) {
  const active = sub || 'overview';

  useEffect(() => {
    const sections = {
      overview: [{ title: 'On this page', items: [
        { id: 'aps-what',   label: 'What it is' },
        { id: 'aps-adapts', label: 'Adaptations vs LNbits' },
        { id: 'aps-arch',   label: 'Architecture' },
        { id: 'aps-funding',label: 'Funding sources' },
      ]}],
      concepts: [{ title: 'Concepts', items: [
        { id: 'aps-accounts', label: 'Accounts & sub-wallets' },
        { id: 'aps-keys',     label: 'Admin & invoice keys' },
        { id: 'aps-units',    label: 'SUI · MIST · msat' },
        { id: 'aps-extensions', label: 'Extensions' },
      ]}],
      security: [{ title: 'Security · TEE · ZK', items: [
        { id: 'sec-threat',   label: 'Threat model · custodial wallets' },
        { id: 'sec-tee',      label: 'TEE-isolated key store' },
        { id: 'sec-zk',       label: 'ZKP payment attestation' },
        { id: 'sec-quorum',   label: 'Multi-party quorum signing' },
        { id: 'sec-audit',    label: 'Auditable settlement trail' },
      ]}],
      install: [{ title: 'Install & Run', items: [
        { id: 'aps-prereq',   label: 'Prerequisites' },
        { id: 'aps-quick',    label: 'Quick install' },
        { id: 'aps-prod',     label: '10k+ agents · production' },
        { id: 'aps-env',      label: 'Environment variables' },
      ]}],
      api: [{ title: 'REST API', items: [
        { id: 'aps-api-acct', label: 'Create account' },
        { id: 'aps-api-wal',  label: 'Create / batch sub-wallets' },
        { id: 'aps-api-inv',  label: 'Generate invoice' },
        { id: 'aps-api-pay',  label: 'Pay invoice' },
        { id: 'aps-api-audit',label: 'Audit & history' },
        { id: 'aps-internal', label: 'Internal transfers' },
      ]}],
      skill: [{ title: 'AI Agent Skill', items: [
        { id: 'aps-skill-custody', label: 'Custody model' },
        { id: 'aps-skill-keys',    label: 'Credential rules' },
        { id: 'aps-skill-l402',    label: 'Auto-pay L402 challenge' },
        { id: 'aps-skill-howto',   label: 'When NOT to use this' },
      ]}],
    };
    registerSections(sections[active]);
  }, [active]);

  return (
    <>
      <ProjectHero
        eyebrow="03 · Wallet & Account Service"
        title="agents-pay-service"
        subtitle="A free and open-source Lightning payment + account system for AI multi-agents. Each agent gets an isolated wallet and API key behind one HTTP-only interface. Built on LNbits."
        repo="https://github.com/loka-network/agents-pay-service"
        skill="https://raw.githubusercontent.com/loka-network/agents-pay-service/loka/skill/loka_pay_skill.md"
        skillName="loka_pay_skill.md"
        stats={[
          { v: '10k+',  k: 'concurrent agents' },
          { v: 'REST',  k: 'transport' },
          { v: 'MIST',  k: 'native unit' },
        ]}
      />

      <SubTabs tabs={APS_SUBTABS} active={active} onChange={setSub} />

      {active === 'overview' && <APS_Overview />}
      {active === 'concepts' && <APS_Concepts />}
      {active === 'security' && <window.APS_Security />}
      {active === 'install'  && <APS_Install />}
      {active === 'api'      && <APS_Api />}
      {active === 'skill'    && <APS_Skill />}
    </>
  );
}

/* ---------- Overview ----------- */
function APS_Overview() {
  return (
    <>
      <H2 id="aps-what" n={1}>What it is</H2>
      <p>
        <code>agents-pay-service</code> is a fork of{' '}
        <a className="link" href="https://github.com/lnbits/lnbits" target="_blank">lnbits/lnbits</a>{' '}
        customised for the Loka agentic ecosystem. It sits between your AI agents
        and the underlying payment network, giving each agent its own isolated
        wallet and API key while exposing a unified interface for BOLT11 Lightning
        and SUI / Mist payments.
      </p>

      <H2 id="aps-adapts" n={2}>Adaptations vs LNbits</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>SUI / MIST denomination</h3>
          <p style={{margin:0}}>Native display formatting, exchange-rate fetching, and invoice creation in SUI units (1 SUI = 10⁹ MIST).</p>
        </div>
        <div className="card">
          <h3>Multi-agent account isolation</h3>
          <p style={{margin:0}}>Every agent gets its own wallet and scoped API key. No agent can touch another's funds.</p>
        </div>
        <div className="card">
          <h3>Agentic payment extensions</h3>
          <p style={{margin:0}}><code>orders</code>, <code>tpos</code>, <code>lnurlp</code> pre-installed and tuned for programmatic use.</p>
        </div>
        <div className="card">
          <h3>SUI price feeds</h3>
          <p style={{margin:0}}>CoinGecko + Binance rate providers for real-time SUI ↔ fiat conversion (display only).</p>
        </div>
      </Grid>

      <H2 id="aps-arch" n={3}>Architecture</H2>
      <Mermaid>{`
flowchart TB

  agent(("AI Agent(s)"))

  subgraph SVC["agents-pay-service · Python / FastAPI"]
    direction TB
    a1["per-agent wallet · scoped API keys"]
    a2["extensions · history · admin UI"]
    a1 --- a2
  end

  back["Lightning node /<br/>DAG L2 payment backend<br/>(loka-p2p-lnd, CLN, …)"]

  agent -- "REST API<br/>per-wallet key" --> SVC
  SVC -- "funding-source<br/>abstraction" --> back
      `}</Mermaid>

      <H2 id="aps-funding" n={4}>Funding sources</H2>
      <p>Drop in any LNbits-compatible backend. Recommended: <strong>loka-p2p-lnd</strong>.</p>
      <Grid cols={3}>
        <Tile title="loka-p2p-lnd" meta={[<span key="r" className="badge gold">recommended</span>]}>
          Multi-chain Lightning Network Daemon (BTC · SUI · EVM).
        </Tile>
        <Tile title="CoreLightning / CLNRest">CLN-family backends.</Tile>
        <Tile title="SparkL2">SUI Lightning-compatible alt-implementation.</Tile>
        <Tile title="Boltz · Blink · Alby">Hosted custodial LN providers.</Tile>
        <Tile title="Breez">Mobile-first SDK backend.</Tile>
        <Tile title="…">Any new <code>FundingSource</code> subclass.</Tile>
      </Grid>
    </>
  );
}

/* ---------- Concepts ----------- */
function APS_Concepts() {
  return (
    <>
      <H2 id="aps-accounts" n={1}>Accounts & sub-wallets</H2>
      <p>
        The service mirrors a corporate-treasury model: one <strong>account</strong>{' '}
        owns many <strong>wallets</strong>. Each wallet is independently scoped —
        compromising one wallet's keys never exposes the rest.
      </p>
      <Mermaid>{`
flowchart TB

  subgraph ACC["account · user_xxx"]
    direction LR
    w1["wallet «Treasury»<br/>id wallet_aaa<br/>admin_key · invoice_key<br/>balance_msat …"]
    w2["wallet «Agent A»<br/>id wallet_bbb<br/>admin_key · invoice_key<br/>balance_msat …"]
    w3["wallet «Agent B»"]
    w4["wallet «Agent C»"]
  end
      `}</Mermaid>

      <H2 id="aps-keys" n={2}>Admin & invoice keys</H2>
      <table>
        <thead><tr><th>Key</th><th>Auth header</th><th>Allows</th><th>Treat as</th></tr></thead>
        <tbody>
          <tr><td><code>admin_key</code></td><td><code>X-Api-Key: …</code></td><td>send + receive + introspect</td><td>service-account password</td></tr>
          <tr><td><code>invoice_key</code></td><td><code>X-Api-Key: …</code></td><td>receive + read-only</td><td>safe to share with payers</td></tr>
        </tbody>
      </table>
      <Callout kind="amber" label="Blast-radius hygiene">
        Issue a separate sub-wallet (and therefore a separate <code>admin_key</code>) per task or
        peer. If a key leaks, only that wallet drains — the rest of the fleet is unaffected.
        Rotate keys aggressively.
      </Callout>

      <H2 id="aps-units" n={3}>SUI · MIST · msat</H2>
      <ul>
        <li><strong>SUI</strong> — display unit. <code>1 SUI = 10⁹ MIST</code>.</li>
        <li><strong>MIST</strong> — base unit (Sui equivalent of satoshi).</li>
        <li><strong>msat</strong> — millisatoshi, the unit Lightning uses internally. <code>balance_msat</code> in API responses is in msat; <code>1 MIST = 1000 msat</code>.</li>
        <li>The <code>unit</code> field in payment payloads may be ignored depending on server config — never assume sats.</li>
      </ul>

      <H2 id="aps-extensions" n={4}>Extensions</H2>
      <p>Non-core features ship as loadable extensions. Pre-installed for agentic flows:</p>
      <table className="tight">
        <thead><tr><th>Extension</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>orders</code></td><td>Agent-to-agent order / payment flows</td></tr>
          <tr><td><code>tpos</code></td><td>Point-of-sale for agent services</td></tr>
          <tr><td><code>lnurlp</code></td><td>LNURL-pay endpoint per agent wallet</td></tr>
        </tbody>
      </table>
    </>
  );
}

/* ---------- Install ----------- */
function APS_Install() {
  return (
    <>
      <H2 id="aps-prereq" n={1}>Prerequisites</H2>
      <ul>
        <li>Python <code>3.11+</code></li>
        <li><a className="link" href="https://github.com/astral-sh/uv" target="_blank">uv</a> (recommended) or pip</li>
        <li>A funding-source backend (e.g. <code>loka-p2p-lnd</code>) — gRPC reachable, TLS cert + macaroon paths handy</li>
      </ul>

      <H2 id="aps-quick" n={2}>Quick install</H2>
      <Code lang="bash">{`git clone https://github.com/loka-network/agents-pay-service
cd agents-pay-service
uv sync
uv run lnbits --port 5000
# or
make dev`}</Code>

      <H2 id="aps-prod" n={3}>10k+ agents · production deployment</H2>
      <Callout kind="amber" label="SQLite will not survive">
        SQLite uses file-level locking and crashes under high concurrency with
        <code> database is locked</code>. Use PostgreSQL for any multi-agent simulation.
      </Callout>
      <Code lang="bash">{`# 1. Switch to PostgreSQL in .env
echo 'LNBITS_DATABASE_URL="postgres://user:password@localhost:5432/agents_pay"' >> .env

# 2. Start with Uvicorn (multi-worker)
make prod
# under the hood:
# uv run uvicorn lnbits.__main__:app --host 0.0.0.0 --port 5000 \\
#   --workers 8 --limit-concurrency 1000`}</Code>

      <H2 id="aps-env" n={4}>Environment variables</H2>
      <Code lang="dotenv">{`# === Server ===
HOST=127.0.0.1
PORT=5001
LNBITS_DATA_FOLDER="./data"

# === Admin UI ===
LNBITS_ADMIN_UI=true

# === Denomination ===
LNBITS_DENOMINATION=MIST

# === Funding Source (LND example) ===
LNBITS_BACKEND_WALLET_CLASS=LndWallet
LND_GRPC_ENDPOINT=127.0.0.1
LND_GRPC_PORT=10009
LND_GRPC_CERT="/path/to/lnd/tls.cert"
LND_GRPC_MACAROON="/path/to/lnd/data/chain/sui/devnet/admin.macaroon"

# === Extensions ===
LNBITS_EXTENSIONS_DEFAULT_INSTALL="tpos"
LNBITS_USER_DEFAULT_EXTENSIONS="lnurlp"

# === Invoice expiry ===
LIGHTNING_INVOICE_EXPIRY=3600`}</Code>
    </>
  );
}

/* ---------- API ----------- */
function APS_Api() {
  return (
    <>
      <p>All endpoints are rooted at the deployment base URL — for the hosted instance, <code>https://agents-pay.loka.cash</code>. Full OpenAPI docs at <code>/docs</code>.</p>

      <H2 id="aps-api-acct" n={1}>Create account</H2>
      <p><strong>Anonymous quick path</strong> — no username, no password. One POST returns a user + first wallet with API keys ready:</p>
      <Code lang="http">{`POST /api/v1/account
Content-Type: application/json

{ "name": "Master Treasury Wallet" }`}</Code>

      <p><strong>Username + password path</strong> — for human-operated tenants:</p>
      <Code lang="http">{`POST /api/v1/auth/register
Content-Type: application/json

{ "username": "alice", "password": "…", "password_repeat": "…", "email": "…" }`}</Code>
      <p className="muted">Returns an <code>access_token</code> (JWT). Use it once with <code>GET /api/v1/wallets</code> to grab the auto-created wallet's API keys; after that, payment APIs use <code>X-Api-Key</code> only.</p>

      <H2 id="aps-api-wal" n={2}>Create / batch sub-wallets</H2>
      <Code lang="http">{`POST /api/v1/wallet
X-Api-Key: <existing_admin_key>

{ "name": "Worker Agent A" }`}</Code>

      <p>Batch — avoid round-trip overhead at scale:</p>
      <Code lang="http">{`POST /api/v1/wallet/batch
X-Api-Key: <master_admin_key>

{
  "wallets": [
    { "name": "Agent Worker 001" },
    { "name": "Agent Worker 002" },
    { "name": "Agent Worker 003" }
  ]
}`}</Code>

      <H2 id="aps-api-inv" n={3}>Generate invoice</H2>
      <Code lang="http">{`POST /api/v1/payments
X-Api-Key: <invoice_key OR admin_key>

{
  "out": false,
  "amount": 1000,
  "memo": "task-fee",
  "unit": "sat"
}`}</Code>
      <p className="muted">Returns <code>{`{ payment_request: "lnbc…", checking_id, … }`}</code>. Hand <code>payment_request</code> to the payer.</p>

      <H2 id="aps-api-pay" n={4}>Pay invoice</H2>
      <Code lang="http">{`POST /api/v1/payments
X-Api-Key: <admin_key>

{ "out": true, "bolt11": "lnbc1…" }`}</Code>
      <Callout kind="cyan" label="Internal short-circuit">
        If both endpoints live on the same <code>agents-pay-service</code> instance, the
        server short-circuits to a database-level swap — <strong>0 ms latency, no LN fees</strong>.
        You can't detect or force this; it just happens when applicable.
      </Callout>

      <H2 id="aps-api-audit" n={5}>Audit & history</H2>
      <table className="tight">
        <thead><tr><th>Need</th><th>Endpoint</th></tr></thead>
        <tbody>
          <tr><td>Wallet balance</td><td><code>GET /api/v1/wallet</code></td></tr>
          <tr><td>Recent payments</td><td><code>GET /api/v1/payments?limit=N&amp;offset=M</code></td></tr>
          <tr><td>Daily aggregate</td><td><code>GET /api/v1/payments/history?group=day</code></td></tr>
        </tbody>
      </table>
      <p className="muted"><code>balance_msat</code> is in msat. Divide by 1000 to get MIST.</p>

      <H2 id="aps-internal" n={6}>Internal treasury transfers</H2>
      <p>Move funds from a master wallet to a sub-agent without round-tripping through the network:</p>
      <Code lang="bash">{`# 1. With sub-agent's invoice_key
curl -X POST .../api/v1/payments \\
  -H "X-Api-Key: $INVOICE_KEY_SUB" \\
  -d '{"out": false, "amount": 50, "memo": "allowance"}'

# 2. With master admin_key — pay the invoice produced above
curl -X POST .../api/v1/payments \\
  -H "X-Api-Key: $ADMIN_KEY_MASTER" \\
  -d '{"out": true, "bolt11": "lnbc…"}'`}</Code>
    </>
  );
}

/* ---------- Skill ----------- */
function APS_Skill() {
  return (
    <>
      <Callout kind="cyan" label="machine-readable skill">
        The in-repo file <code>skill/loka_pay_skill.md</code> is the canonical Skill any
        AI agent should ingest to use this service autonomously. This page is the human view
        of the same content.
      </Callout>

      <H2 id="aps-skill-custody" n={1}>Custody model</H2>
      <p>Loka Payment supports two payment routes that terminate at the same Prism gateway. Choose per-deployment or per-call:</p>
      <table>
        <thead><tr><th>Route</th><th>Wallet location</th><th>Who signs</th><th>Credential</th></tr></thead>
        <tbody>
          <tr>
            <td><strong>A · Self-custody</strong></td>
            <td>User's own LN wallet (Phoenix / Muun / self-run lnd-sui)</td>
            <td>User's wallet, locally</td>
            <td>macaroon / seed</td>
          </tr>
          <tr>
            <td><strong>B · Custodial</strong></td>
            <td><code>agents-pay-service</code></td>
            <td>Service's lnd-sui, server-side</td>
            <td><code>X-Api-Key</code></td>
          </tr>
        </tbody>
      </table>

      <H2 id="aps-skill-keys" n={2}>Credential rules</H2>
      <ul>
        <li><code>admin_key</code> — full spend authority. Treat like a database root password.</li>
        <li><code>invoice_key</code> — read + receive only. Hand out freely.</li>
        <li>An attacker with <code>admin_key</code> drains that wallet. Mitigate via per-task sub-wallets, short-lived keys, and aggressive rotation.</li>
        <li>For automation, persist <code>(user_id, admin_key)</code> in your secret store at provisioning time and reuse on subsequent runs.</li>
      </ul>

      <H2 id="aps-skill-l402" n={3}>Auto-pay an L402 challenge</H2>
      <Mermaid>{`
sequenceDiagram
  autonumber
  participant A as agent
  participant P as Prism
  participant W as agents-pay-service

  A->>P: GET /resource
  P-->>A: 402 — LSAT macaroon=…,<br/>invoice=lnbc…
  A->>W: POST /api/v1/payments<br/>out:true, bolt11
  W-->>A: { preimage }
  A->>P: GET /resource<br/>Authorization: LSAT m:p
  P-->>A: 200 OK + body

  Note over A,P: cache macaroon:preimage<br/>per (origin, service)<br/>replay until expiry
      `}</Mermaid>

      <div className="card">
        <h3>Failure modes</h3>
        <table className="tight" style={{margin:0}}>
          <tbody>
            <tr><td><code>402</code> with same macaroon</td><td>Token expired / revoked. Repay.</td></tr>
            <tr><td><code>402</code> with new macaroon</td><td>Service rotated. Pay the new one.</td></tr>
            <tr><td><code>403</code></td><td>Out of session budget or revoked. <strong>Do not retry-pay.</strong></td></tr>
            <tr><td><code>502 / 503</code></td><td>Backend down. Don't pay — you'll waste sats.</td></tr>
          </tbody>
        </table>
      </div>

      <H2 id="aps-skill-howto" n={4}>When NOT to use this stack</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>Need non-custodial guarantees</h3>
          <p style={{margin:0}}>Run your own LND with <code>lnd-sui</code> and pay Prism invoices directly. Do not register on the hosted service.</p>
        </div>
        <div className="card">
          <h3>Audited custody required</h3>
          <p style={{margin:0}}>This service is not a licensed e-money issuer. Treat balances as platform credits, not bank deposits.</p>
        </div>
      </Grid>
    </>
  );
}

window.PageAps = PageAps;
