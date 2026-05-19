/* ====================================================================
   loka-prism-l402 — Prism L402 Paywall Proxy
   ==================================================================== */

const PR_SUBTABS = [
  { id: 'overview',     label: 'Overview' },
  { id: 'register',     label: 'Register on hosted gateway' },
  { id: 'protocols',    label: 'Payment Protocols' },
  { id: 'config',       label: 'Configuration' },
  { id: 'admin',        label: 'Admin API · CLI · MCP' },
  { id: 'ratelimits',   label: 'Rate Limiting' },
];

function PagePrism({ sub, setSub, registerSections, jump }) {
  const active = sub || 'overview';

  useEffect(() => {
    const sections = {
      overview: [{ title: 'On this page', items: [
        { id: 'pr-what',      label: 'What it is' },
        { id: 'pr-position',  label: 'Position in the stack' },
        { id: 'pr-deploy',    label: 'Two deployment paths' },
        { id: 'pr-install',   label: 'Install & run (self-host)' },
      ]}],
      register: [{ title: 'Register on hosted gateway', items: [
        { id: 'reg-why',     label: 'Why register (vs self-host)' },
        { id: 'reg-needed',  label: 'What you\'ll submit' },
        { id: 'reg-macaroon',label: 'Bake an invoice-only macaroon' },
        { id: 'reg-pricing', label: 'Decide pricing & routing' },
        { id: 'reg-apply',   label: 'Submit the application' },
        { id: 'reg-flow',    label: 'Activation flow' },
        { id: 'reg-scope',   label: 'What Loka stores · privacy' },
        { id: 'reg-update',  label: 'Updating your service later' },
      ]}],
      protocols: [{ title: 'Payment Protocols', items: [
        { id: 'pr-three',     label: 'Three protocols, one proxy' },
        { id: 'pr-l402',      label: 'L402' },
        { id: 'pr-mpp-charge',label: 'MPP charge' },
        { id: 'pr-mpp-sess',  label: 'MPP session' },
      ]}],
      config: [{ title: 'Configuration', items: [
        { id: 'pr-yaml',      label: 'aperture.yaml' },
        { id: 'pr-fields',    label: 'Field reference' },
        { id: 'pr-storage',   label: 'Storage backends' },
      ]}],
      admin: [{ title: 'Admin surface', items: [
        { id: 'pr-admin-api', label: 'Admin gRPC + REST API' },
        { id: 'pr-cli',       label: 'prismcli' },
        { id: 'pr-mcp',       label: 'MCP server' },
        { id: 'pr-dash',      label: 'Dashboard' },
      ]}],
      ratelimits: [{ title: 'Rate Limiting', items: [
        { id: 'pr-rl',        label: 'Per-endpoint token bucket' },
        { id: 'pr-rl-cfg',    label: 'Configuration' },
        { id: 'pr-rl-resp',   label: 'Response semantics' },
      ]}],
    };
    registerSections(sections[active]);
  }, [active]);

  return (
    <>
      <ProjectHero
        eyebrow="02 · HTTP Paywall Gateway"
        title="loka-prism-l402"
        subtitle="Transform any HTTP / gRPC backend into a Lightning-metered API. Reverse proxy + L402 + MPP token engine, with an admin surface designed for both humans and AI agents."
        repo="https://github.com/loka-network/loka-prism-l402"
        stats={[
          { v: '3',     k: 'payment protocols' },
          { v: 'gRPC + REST', k: 'admin' },
          { v: 'MCP',   k: 'agent-native' },
        ]}
      />

      <SubTabs tabs={PR_SUBTABS} active={active} onChange={setSub} />

      {active === 'overview'   && <PR_Overview />}
      {active === 'register'   && <PR_Register />}
      {active === 'protocols'  && <PR_Protocols />}
      {active === 'config'     && <PR_Config />}
      {active === 'admin'      && <PR_Admin />}
      {active === 'ratelimits' && <PR_RateLimits />}
    </>
  );
}

/* ---------- Overview ----------- */
function PR_Overview() {
  return (
    <>
      <H2 id="pr-what" n={1}>What it is</H2>
      <p>
        Prism is a downstream fork of{' '}
        <a className="link" href="https://github.com/lightninglabs/aperture" target="_blank">lightninglabs/aperture</a>{' '}
        — the HTTP 402 paywall proxy that mints and verifies L402 tokens. Prism
        extends it for the Loka stack with an MPP session engine, a typed admin
        API, a CLI / dashboard / MCP surface, and rate limiting.
      </p>
      <p>
        Drop it in front of any HTTP or gRPC service. Configure a service
        definition, pick a price, point it at your <code>loka-p2p-lnd</code> node,
        and every unauthenticated request gets <code>402 Payment Required</code>
        back with a Lightning invoice.
      </p>

      <H2 id="pr-position" n={2}>Position in the stack</H2>
      <Mermaid>{`
flowchart TB

  agent(("AI Agents / humans"))
  prism["loka-prism-l402<br/>• L402 / MPP paywalls<br/>• Reverse proxy<br/>• Admin API · dashboard · MCP"]
  aps["agents-pay-service<br/>• per-agent wallet + API key<br/>• BOLT11 / LNURL invoices<br/>• SUI / MIST denomination"]
  node["loka-p2p-lnd<br/>• BOLT routing<br/>• multi-chain adapter<br/>• Move-enforced channels"]

  agent -- "HTTP / gRPC<br/>L402 / MPP token" --> prism
  agent -- "REST API<br/>per-wallet key" --> aps
  prism -- "invoice<br/>settle" --> node
  aps -- "funding source" --> node
      `}</Mermaid>

      <H2 id="pr-deploy" n={3}>Two deployment paths</H2>
      <p>
        You have a choice. Both end at the same set of L402 protocols and the
        same merchant economics — they differ only in who runs the proxy.
      </p>
      <Grid cols={2}>
        <div className="card" style={{borderColor:'rgba(94,234,212,0.4)'}}>
          <h3 style={{color:'var(--cyan)'}}>A · Register on hosted gateway <span className="badge cyan" style={{marginLeft:6}}>recommended</span></h3>
          <p style={{margin:'4px 0'}}>
            Fill a short form, hand over an invoice-only macaroon from your
            own LND, get paywall-as-a-service. <strong>You never hand over
            funds</strong> — payments settle straight to your LND.
          </p>
          <p style={{margin:'4px 0 0'}}>
            <a className="link" href="#prism/register">Go to registration →</a>
          </p>
        </div>
        <div className="card">
          <h3>B · Self-host Prism</h3>
          <p style={{margin:'4px 0'}}>
            Run the binary yourself. Full control over policy, storage, and
            the admin surface. Operate your own DB, TLS, and uptime.
          </p>
          <p style={{margin:'4px 0 0'}}>
            <a className="link" href="#prism/overview#pr-install">Install &amp; run →</a>
          </p>
        </div>
      </Grid>

      <H2 id="pr-install" n={4}>Install &amp; run (self-host)</H2>
      <Code lang="bash">{`# prerequisites: Go 1.25+, a reachable loka-p2p-lnd, port 8081 open

make build                 # produces ./prism (proxy daemon) and ./prismcli (admin CLI)
make install               # installs to $GOPATH/bin
make build-withdashboard   # also embeds the Next.js dashboard

# launch
prism --configfile=/path/to/aperture.yaml
# or
prism                       # reads ~/.aperture/aperture.yaml`}</Code>
      <Callout kind="cyan" label="Behind a TLS-terminating LB">
        Make sure the ingress ALPN policy advertises <code>h2</code>. On AWS NLB use
        <code> HTTP2Preferred</code> or <code>HTTP2Only</code> — gRPC clients otherwise fail
        with <code>missing selected ALPN property</code>.
      </Callout>
    </>
  );
}

/* ---------- Protocols ----------- */
function PR_Protocols() {
  return (
    <>
      <H2 id="pr-three" n={1}>Three protocols, one proxy</H2>
      <p>Prism speaks three payment protocols. A single service can enable any combination.</p>
      <table>
        <thead>
          <tr><th>Protocol</th><th>Challenge header</th><th>Token reuse</th><th>Typical use</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>L402</strong></td>
            <td><code>WWW-Authenticate: LSAT macaroon=…, invoice=…</code></td>
            <td>until caveat expires</td>
            <td>one-time paid subscription (e.g. 1 year)</td>
          </tr>
          <tr>
            <td><strong>MPP charge</strong></td>
            <td><code>WWW-Authenticate: Payment id=…, intent=charge</code></td>
            <td>each charge = one payment</td>
            <td>L402-equivalent, RFC-draft protocol</td>
          </tr>
          <tr>
            <td><strong>MPP session</strong></td>
            <td><code>WWW-Authenticate: Payment id=…, intent=session</code></td>
            <td>bearer balance across N calls</td>
            <td>high-frequency agent traffic</td>
          </tr>
        </tbody>
      </table>

      <H2 id="pr-l402" n={2}>L402 — Lightning HTTP 402</H2>
      <Mermaid>{`
sequenceDiagram
  autonumber
  participant C as client
  participant P as Prism

  C->>P: GET /resource
  P-->>C: 402 — LSAT macaroon=…,<br/>invoice=lnbc1…
  Note over C,P: pay invoice via any LN wallet
  C->>P: GET /resource<br/>Authorization: LSAT m:p
  P-->>C: 200 OK + forwarded body
  Note over C,P: token reusable until macaroon<br/>caveat expires (default 1y)
      `}</Mermaid>

      <H2 id="pr-mpp-charge" n={3}>MPP charge</H2>
      <p>
        Same one-time-payment semantics as L402, expressed in the newer{' '}
        <a className="link" href="https://mpp.dev/overview" target="_blank">MPP</a> draft
        protocol. The macaroon can be reused; each spend creates a fresh charge.
      </p>

      <H2 id="pr-mpp-sess" n={4}>MPP session</H2>
      <Mermaid>{`
sequenceDiagram
  autonumber
  participant C as client
  participant P as Prism
  participant L as lnd

  C->>P: POST /open
  P-->>C: 402 — deposit invoice<br/>≈ 20 × unit price
  C->>L: pay deposit
  L-->>P: settled
  P-->>C: session token

  loop bearer calls (no further invoices)
    C->>P: GET /req?token=…
    P->>P: balance −1
    P-->>C: 200 OK
  end

  C->>P: POST /close
  P->>C: PaySend(refund = deposit − spent)<br/>→ return-invoice
      `}</Mermaid>
      <Callout kind="amber" label="Operational note">
        The deposit briefly resides in the proxy's LND wallet during the session and is paid
        back to a client-provided return-invoice on close. Tune the lifetime via
        <code> sessionidletimeout</code>.
      </Callout>
    </>
  );
}

/* ---------- Config ----------- */
function PR_Config() {
  return (
    <>
      <H2 id="pr-yaml" n={1}><code>aperture.yaml</code></H2>
      <p>Compare your config against the in-repo <code>sample-conf.yaml</code> — every option is documented inline.</p>
      <Code lang="yaml">{`authenticator:
  network: "devnet"
  lndhost: "localhost:10009"
  tlspath: "/path/to/lnd/tls.cert"
  macdir:  "/path/to/lnd/data/chain/sui/devnet"
  enablempp:      true
  enablesessions: true

services:
  - name: "service1"
    hostregexp: '^service1.com$'
    address: "127.0.0.1:9998"   # HTTP backend URL (not a wallet address)
    protocol: http
    price: 10000000             # in lnd base units

  - name: "service2"
    hostregexp: '^service2.com$'
    address: "10.0.0.5:8443"
    protocol: https

admin:
  enabled: true
  macaroonpath: "~/.aperture/admin.macaroon"`}</Code>

      <Callout kind="cyan" label="Path expansion">
        <code>configfile</code>, <code>basedir</code>, <code>sqlite.dbfile</code>,
        <code> admin.macaroonpath</code>, <code>authenticator.tlspath</code>, and
        <code> authenticator.macdir</code> all accept <code>~</code>, <code>$VAR</code>,
        absolute, and CWD-relative forms.
      </Callout>

      <H2 id="pr-fields" n={2}>Field reference</H2>
      <table className="tight">
        <thead><tr><th>Field</th><th>Type</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>authenticator.network</code></td><td>string</td><td><code>mainnet</code> · <code>testnet</code> · <code>devnet</code></td></tr>
          <tr><td><code>authenticator.lndhost</code></td><td>string</td><td>gRPC endpoint of the LND node Prism mints invoices through</td></tr>
          <tr><td><code>services[].name</code></td><td>string</td><td>logical service ID (used in admin API / accounting)</td></tr>
          <tr><td><code>services[].hostregexp</code></td><td>regex</td><td>matched against the request Host header</td></tr>
          <tr><td><code>services[].pathregexp</code></td><td>regex</td><td>optional path match for fine-grained routing</td></tr>
          <tr><td><code>services[].address</code></td><td>string</td><td><strong>HTTP backend target</strong> — not a wallet address</td></tr>
          <tr><td><code>services[].protocol</code></td><td>enum</td><td><code>http</code> / <code>https</code> / <code>grpc</code></td></tr>
          <tr><td><code>services[].price</code></td><td>int</td><td>per-request price in LND base units</td></tr>
          <tr><td><code>services[].dynamicprice</code></td><td>object</td><td>optional gRPC pricer endpoint for runtime pricing</td></tr>
          <tr><td><code>services[].whitelistpaths</code></td><td>[]regex</td><td>paths served without authentication</td></tr>
          <tr><td><code>services[].ratelimits</code></td><td>[]rule</td><td>token-bucket rules — see Rate Limiting tab</td></tr>
        </tbody>
      </table>

      <H2 id="pr-storage" n={3}>Storage backends</H2>
      <Grid cols={3}>
        <div className="card">
          <h3>SQLite <span className="badge gold">default</span></h3>
          <p style={{margin:0}}>Single-file, zero-dependency. Good for dev + single-node deployments.</p>
        </div>
        <div className="card">
          <h3>PostgreSQL</h3>
          <p style={{margin:0}}>Production multi-node. Required if running multiple Prism replicas behind a load balancer.</p>
        </div>
        <div className="card">
          <h3>etcd</h3>
          <p style={{margin:0}}>Distributed KV. <strong>Does not support the admin transaction store</strong> — pick SQLite/Postgres for full features.</p>
        </div>
      </Grid>
    </>
  );
}

/* ---------- Admin ----------- */
function PR_Admin() {
  return (
    <>
      <H2 id="pr-admin-api" n={1}>Admin gRPC + REST API</H2>
      <p>
        Enable in config with <code>admin.enabled: true</code>. On first start
        Prism generates a 32-byte root key and a macaroon at
        <code> admin.macaroonpath</code> — all endpoints except <code>GetHealth</code> require it,
        hex-encoded in the <code>Grpc-Metadata-Macaroon</code> header.
      </p>
      <table className="tight">
        <thead><tr><th>RPC</th><th>REST</th><th>Description</th></tr></thead>
        <tbody>
          <tr><td><code>GetHealth</code></td><td><code>GET /api/admin/health</code></td><td>Health check (no auth)</td></tr>
          <tr><td><code>GetInfo</code></td><td><code>GET /api/admin/info</code></td><td>Server info · network · TLS · MPP config</td></tr>
          <tr><td><code>ListServices</code></td><td><code>GET /api/admin/services</code></td><td>List proxied services</td></tr>
          <tr><td><code>CreateService</code></td><td><code>POST /api/admin/services</code></td><td>Register a new service (live)</td></tr>
          <tr><td><code>UpdateService</code></td><td><code>PUT /api/admin/services/{`{name}`}</code></td><td>Partial update</td></tr>
          <tr><td><code>DeleteService</code></td><td><code>DELETE /api/admin/services/{`{name}`}</code></td><td>Remove</td></tr>
          <tr><td><code>ListTransactions</code></td><td><code>GET /api/admin/transactions</code></td><td>Query L402 transactions</td></tr>
          <tr><td><code>ListTokens</code></td><td><code>GET /api/admin/tokens</code></td><td>List issued tokens</td></tr>
          <tr><td><code>RevokeToken</code></td><td><code>DELETE /api/admin/tokens/{`{id}`}</code></td><td>Revoke</td></tr>
          <tr><td><code>GetStats</code></td><td><code>GET /api/admin/stats</code></td><td>Revenue + per-service breakdown</td></tr>
        </tbody>
      </table>
      <p className="muted" style={{fontSize:'12.5px'}}>
        Services created through the admin API are persisted and survive restarts.
        Routing-table updates take effect immediately — pricing changes or backend swaps
        require no downtime.
      </p>

      <H2 id="pr-cli" n={2}><code>prismcli</code></H2>
      <p>Designed to be ergonomic for humans (tables when stdout is a TTY) and AI agents (JSON when piped, semantic exit codes).</p>
      <Code lang="bash">{`prismcli --insecure health
prismcli --insecure services list
prismcli --insecure services create --name myapi --address 127.0.0.1:8080 --price 100
prismcli --insecure services update --name myapi --price 500
prismcli --insecure stats

prismcli schema --all              # dump full command tree as JSON
prismcli --dry-run services delete --name myapi`}</Code>

      <H2 id="pr-mcp" n={3}>MCP server</H2>
      <p>
        <code>prismcli</code> embeds an MCP (Model Context Protocol) server that exposes every admin
        RPC as a typed tool over stdio JSON-RPC. Drop it into Claude Code, Cursor, or any
        agent framework:
      </p>
      <Code lang="json">{`{
  "mcpServers": {
    "prism": {
      "command": "prismcli",
      "args": ["--insecure", "mcp", "serve"]
    }
  }
}`}</Code>

      <H2 id="pr-dash" n={4}>Dashboard</H2>
      <p>
        Built with <code>make build-withdashboard</code>, Prism embeds a Next.js dashboard
        served at <code>/</code>: service management, transaction history with filtering /
        pagination, revenue charts, and token administration. The dashboard talks to the
        admin API through a server-side proxy that injects the macaroon — loopback only.
      </p>
    </>
  );
}

/* ---------- Rate Limits ----------- */
function PR_RateLimits() {
  return (
    <>
      <H2 id="pr-rl" n={1}>Per-endpoint token bucket</H2>
      <p>
        Per-endpoint token-bucket rate limiting, keyed on L402 token ID (or IP
        for unauthenticated requests). Multiple rules layer — a request is
        rejected if <em>any</em> matching rule denies it.
      </p>

      <H2 id="pr-rl-cfg" n={2}>Configuration</H2>
      <Code lang="yaml">{`services:
  - name: "myservice"
    hostregexp: "api.example.com"
    address: "127.0.0.1:8080"
    protocol: https

    ratelimits:
      - requests: 100          # 100/s per client, global
        per: 1s
        burst: 100
      - pathregexp: '^/api/v1/expensive.*$'
        requests: 5
        per: 1m
        burst: 5`}</Code>

      <table className="tight">
        <thead><tr><th>Option</th><th>Required</th><th>Meaning</th></tr></thead>
        <tbody>
          <tr><td><code>pathregexp</code></td><td>no</td><td>Regex on path. Matches all paths if omitted.</td></tr>
          <tr><td><code>requests</code></td><td><strong>yes</strong></td><td>Requests per window</td></tr>
          <tr><td><code>per</code></td><td><strong>yes</strong></td><td>Time window: <code>1s</code> · <code>1m</code> · <code>1h</code> · …</td></tr>
          <tr><td><code>burst</code></td><td>no</td><td>Burst capacity; defaults to <code>requests</code></td></tr>
        </tbody>
      </table>

      <H2 id="pr-rl-resp" n={3}>Response semantics</H2>
      <p>Protocol-aware:</p>
      <ul>
        <li><strong>REST</strong> → HTTP <code>429 Too Many Requests</code> with a <code>Retry-After</code> header</li>
        <li><strong>gRPC</strong> → status code <code>ResourceExhausted</code></li>
      </ul>
    </>
  );
}

window.PagePrism = PagePrism;

/* ====================================================================
   PR_Register — Onboard onto Loka's hosted L402 gateway.
   The flagship developer path: fill a form, hand over an invoice-only
   macaroon, get paywall-as-a-service. No Prism to operate.
   ==================================================================== */

const APPLY_URL = 'https://forms.lokachain.org/register-merchant';  // TODO: real URL

function PR_Register() {
  return (
    <>
      <Callout kind="cyan" label="recommended path for most developers">
        You don't have to run Prism yourself. Loka operates a production
        gateway at <code>prism.loka.cash</code>. Register your API,
        hand over an <strong>invoice-only macaroon</strong> from your own
        LND node, and Loka's gateway will paywall, meter, and route paying
        traffic to your backend — settlement goes straight to your wallet,
        Loka never holds your funds.
      </Callout>

      <H2 id="reg-why" n={1}>Why register (vs self-host)</H2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>Register on hosted gateway</th>
            <th>Self-host Prism</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Time-to-revenue</strong></td>
            <td>Minutes after the form approves</td>
            <td>Hours to days (build · deploy · TLS · ops)</td>
          </tr>
          <tr>
            <td><strong>What you operate</strong></td>
            <td>Just your existing backend + your own LND</td>
            <td>+ a Prism instance + a database + uptime</td>
          </tr>
          <tr>
            <td><strong>Who holds your funds</strong></td>
            <td>You — Loka never sees them (invoices settle straight to your LND)</td>
            <td>You</td>
          </tr>
          <tr>
            <td><strong>Macaroon scope you hand over</strong></td>
            <td><code>invoices:write</code> + <code>invoices:read</code> only</td>
            <td>n/a</td>
          </tr>
          <tr>
            <td><strong>Routing graph access</strong></td>
            <td>Loka's existing peering / liquidity</td>
            <td>You build channels & manage liquidity yourself</td>
          </tr>
          <tr>
            <td><strong>Best for</strong></td>
            <td>API merchants, indie devs, fast iteration</td>
            <td>Privacy-critical / regulated, large fleets, advanced policy</td>
          </tr>
        </tbody>
      </table>

      <H2 id="reg-needed" n={2}>What you'll submit</H2>
      <p>
        The application form mirrors the per-service config block from
        Prism's <code>sample-conf.yaml</code> — same field names, so once
        you've filled it in, you've effectively authored the YAML that
        Loka will load on your behalf.
      </p>

      <div className="card">
        <h3 style={{marginTop:0}}>Required</h3>
        <table className="tight" style={{margin:0}}>
          <tbody>
            <tr><td>Project name</td><td>Display name (alphanumeric + dashes)</td></tr>
            <tr><td>Contact email</td><td>For approval + outage notices</td></tr>
            <tr><td>Service identifier</td><td>Unique slug, e.g. <code>my-summariser</code>. Becomes <code>services[].name</code></td></tr>
            <tr><td><code>hostregexp</code></td><td>e.g. <code>^api.example.com$</code>. Matched against the request Host header</td></tr>
            <tr><td>Backend address</td><td>The HTTP/gRPC origin Prism forwards to (must be reachable from <code>prism.loka.cash</code>)</td></tr>
            <tr><td>Protocol</td><td><code>http</code> · <code>https</code> · <code>grpc</code></td></tr>
            <tr><td>Price per request</td><td>e.g. <code>10000000</code> MIST = 0.01 SUI; or a dynamic pricer endpoint</td></tr>
            <tr><td>Network</td><td><code>mainnet</code> · <code>testnet</code> · <code>devnet</code></td></tr>
            <tr><td>LND gRPC endpoint</td><td><code>host:port</code>, must be reachable from the gateway (public IP or VPN)</td></tr>
            <tr><td>LND TLS certificate</td><td>Paste the PEM contents</td></tr>
            <tr><td>Invoice-only macaroon</td><td>Hex-encoded. See <a className="link" href="#prism/register#reg-macaroon">below</a> for how to bake one</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3 style={{marginTop:0}}>Optional</h3>
        <table className="tight" style={{margin:0}}>
          <tbody>
            <tr><td><code>pathregexp</code></td><td>Path-level routing match (default <code>.*</code>)</td></tr>
            <tr><td>Whitelist paths</td><td>Paths served without authentication (health checks, docs)</td></tr>
            <tr><td>Rate limits</td><td>Token-bucket rules per path (see <a className="link" href="#prism/ratelimits">Rate Limiting</a>)</td></tr>
            <tr><td>MPP session</td><td>Enable prepaid-session billing on top of L402</td></tr>
            <tr><td>Dynamic pricer</td><td>gRPC endpoint Prism queries on every challenge for runtime pricing</td></tr>
            <tr><td>Macaroon root-key ID</td><td>So you can revoke later with <code>lncli deletemacaroonids</code></td></tr>
          </tbody>
        </table>
      </div>

      <H2 id="reg-macaroon" n={3}>Bake an invoice-only macaroon</H2>
      <p>
        Do <strong>not</strong> hand over <code>admin.macaroon</code>. Prism
        only ever needs to <em>create invoices</em> and <em>watch for
        settlement</em> — two permissions. Bake a fresh macaroon scoped to
        exactly that, with your own root-key ID so you can revoke it later
        without touching anything else.
      </p>

      <Code lang="bash">{`# 1. Bake a fresh invoice-only macaroon
lncli bakemacaroon \\
    --save_to ~/loka-prism.macaroon \\
    --root_key_id 42 \\
    invoices:write invoices:read

# 2. Hex-encode for the form (or copy the file)
xxd -ps -u -c 1000 ~/loka-prism.macaroon
# → 0201036c6e6402...

# 3. Sanity-check the scope
lncli printmacaroon --macaroon_file ~/loka-prism.macaroon`}</Code>

      <Callout kind="amber" label="why this is safe">
        <code>invoices:write</code> alone cannot send a single sat. It can
        only call <code>AddInvoice</code> (mint a receipt). <code>invoices:read</code>
        lets Prism poll <code>SubscribeInvoices</code> to learn when each
        is paid. No <code>onchain:*</code>, no <code>offchain:write</code>
        (sending) — Prism literally cannot drain your wallet with this token.
      </Callout>

      <Code lang="bash">{`# Revocation later — instantly invalidates everything signed by root key 42
lncli deletemacaroonids 42`}</Code>

      <H2 id="reg-pricing" n={4}>Decide pricing &amp; routing</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>Static price</h3>
          <p style={{margin:0}}>
            One number, applied to every request. Default for most APIs.
            Submit it as an integer in <code>MIST</code> (or sat / msat
            depending on network).
          </p>
        </div>
        <div className="card">
          <h3>Dynamic pricer</h3>
          <p style={{margin:0}}>
            For tiered or per-token billing, host a small gRPC pricer service
            that Prism calls on each challenge. Form asks for the endpoint
            URL and TLS cert. See <a className="link" href="#prism/config">Configuration → dynamicprice</a>.
          </p>
        </div>
      </Grid>

      <H2 id="reg-apply" n={5}>Submit the application</H2>
      <a className="apply-cta" href={APPLY_URL} target="_blank" rel="noopener">
        <div className="apply-cta__main">
          <div className="apply-cta__title">Apply for hosted gateway access</div>
          <div className="apply-cta__hint">
            ~5 min · returns approval within 1–2 business days · free for the first 12 months
          </div>
        </div>
        <div className="apply-cta__arrow">↗</div>
      </a>
      <p className="muted" style={{fontSize:12.5}}>
        Modelled on <a className="link" href="https://solanafoundation.typeform.com/to/oXJsTNvg" target="_blank">Solana Pay's merchant intake</a>.
        The form lives at <code>{APPLY_URL}</code> — same fields as in
        the previous section, plus signature on the Terms.
      </p>

      <H2 id="reg-flow" n={6}>Activation flow</H2>
      <Mermaid>{`
sequenceDiagram
  autonumber
  participant D as Developer
  participant F as Loka intake form
  participant O as Loka ops
  participant G as prism.loka.cash
  participant L as Your LND node

  D->>F: fill form<br/>+ paste invoice-only macaroon
  F->>O: queue for review
  O->>O: validate hostregexp,<br/>reachability,<br/>macaroon scope
  O->>G: PUT /api/admin/services<br/>via admin API
  G->>L: dial gRPC<br/>verify AddInvoice works
  L-->>G: ok
  G-->>O: service active
  O-->>D: email — your service is live
  Note over D,G: every paid request: G mints invoice on L,<br/>watches settlement, forwards traffic to your backend
      `}</Mermaid>

      <H2 id="reg-scope" n={7}>What Loka stores · privacy</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>Stored on Loka's side</h3>
          <ul style={{margin:0, paddingLeft:18}}>
            <li>Your service config (name, regexp, address, price)</li>
            <li>Your invoice-only macaroon (encrypted at rest)</li>
            <li>Per-request metering (timestamp, status, amount)</li>
            <li>Your contact email</li>
          </ul>
        </div>
        <div className="card">
          <h3>Never stored on Loka's side</h3>
          <ul style={{margin:0, paddingLeft:18}}>
            <li>Your settled funds (they go to your LND, not ours)</li>
            <li>End-user payloads or response bodies (Prism is a stateless proxy)</li>
            <li>Any LND credential beyond the scoped macaroon</li>
          </ul>
        </div>
      </Grid>
      <p className="muted">
        Macaroons are encrypted with a per-service key and stored in
        Prism's <code>aperturedb</code>. Revoke at any time by sending
        <code> lncli deletemacaroonids &lt;root_key_id&gt;</code> from your LND;
        Prism will see the next <code>AddInvoice</code> fail and disable the
        service on the spot.
      </p>

      <H2 id="reg-update" n={8}>Updating your service later</H2>
      <p>
        Once activated, you get an <strong>admin token</strong> scoped to
        your service. Use it with the standard{' '}
        <a className="link" href="#prism/admin">Prism admin API</a> to
        update pricing, swap backend addresses, or change rate limits —
        no form re-submission needed:
      </p>
      <Code lang="bash">{`# rotate the price
curl -X PUT https://prism.loka.cash/api/admin/services/my-summariser \\
  -H "Grpc-Metadata-Macaroon: $LOKA_MERCHANT_TOKEN" \\
  -d '{"price": 5000000}'

# pause the service (e.g. during a backend rollout)
curl -X PUT https://prism.loka.cash/api/admin/services/my-summariser \\
  -H "Grpc-Metadata-Macaroon: $LOKA_MERCHANT_TOKEN" \\
  -d '{"enabled": false}'

# query revenue
curl https://prism.loka.cash/api/admin/stats?service=my-summariser \\
  -H "Grpc-Metadata-Macaroon: $LOKA_MERCHANT_TOKEN"`}</Code>

      <Callout kind="gold" label="for operators reading this">
        If you're standing up your own Loka-style intake form, the field
        schema in §2 is the minimum you need. A Typeform / Tally / Google Form
        is fine for v1 — the backend is just{' '}
        <code>POST /api/admin/services</code> on Prism, so plug whatever
        form tool's webhook into a small worker that calls the admin API
        and you're done. Reference setup that Loka uses: Typeform → Vercel
        function → Prism admin API. The function also bakes a per-merchant
        admin token and emails it back to the applicant.
      </Callout>
    </>
  );
}
