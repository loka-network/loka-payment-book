/* ====================================================================
   paycli — lokapay CLI + Go SDK
   ==================================================================== */

const PC_SUBTABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'install',   label: 'Install & Init' },
  { id: 'routes',    label: 'Custody Routes' },
  { id: 'commands',  label: 'Commands' },
  { id: 'skill',     label: 'AI Agent Skill' },
  { id: 'mcp',       label: 'MCP Server' },
];

function PagePaycli({ sub, setSub, registerSections, jump }) {
  const active = sub || 'overview';

  useEffect(() => {
    const sections = {
      overview: [{ title: 'On this page', items: [
        { id: 'pc-what',    label: 'What lokapay is' },
        { id: 'pc-design',  label: 'Design — why a separate binary' },
        { id: 'pc-layout',  label: 'Repository layout' },
      ]}],
      install: [{ title: 'Install & Init', items: [
        { id: 'pc-inst',    label: 'Install' },
        { id: 'pc-init',    label: 'lokapay init' },
        { id: 'pc-hosted',  label: 'Hosted quickstart' },
        { id: 'pc-node',    label: 'Node quickstart' },
      ]}],
      routes: [{ title: 'Custody Routes', items: [
        { id: 'pc-r-table', label: 'node vs hosted' },
        { id: 'pc-r-switch',label: 'Switching routes' },
        { id: 'pc-r-arch',  label: 'Routing internals' },
      ]}],
      commands: [{ title: 'Commands', items: [
        { id: 'pc-cmd-wallet',  label: 'wallets · whoami' },
        { id: 'pc-cmd-fund',    label: 'fund · pay' },
        { id: 'pc-cmd-request', label: 'request' },
        { id: 'pc-cmd-services',label: 'services · history' },
        { id: 'pc-cmd-node',    label: 'node (self-custody lifecycle)' },
        { id: 'pc-cmd-config',  label: 'config' },
      ]}],
      skill: [{ title: 'AI Agent Skill', items: [
        { id: 'pc-skill-mental', label: 'Mental model' },
        { id: 'pc-skill-intent', label: 'Intent → command map' },
        { id: 'pc-skill-fail',   label: 'Failure-mode dictionary' },
        { id: 'pc-skill-conv',   label: 'Conventions for the agent' },
      ]}],
      mcp: [{ title: 'MCP Server', items: [
        { id: 'pc-mcp-why',     label: 'Why an MCP server' },
        { id: 'pc-mcp-config',  label: 'Client config (Claude / Cursor / Continue)' },
        { id: 'pc-mcp-tools',   label: 'Exposed tools' },
        { id: 'pc-mcp-trust',   label: 'Trust model · stdio-only' },
        { id: 'pc-mcp-audit',   label: 'Audit log' },
      ]}],
    };
    registerSections(sections[active]);
  }, [active]);

  return (
    <>
      <ProjectHero
        eyebrow="04 · Client CLI & SDK"
        title="paycli — lokapay"
        subtitle="The agentic L402 payments client. One binary, one Go SDK, two custody modes. Pay any HTTP-402 API over Lightning from a single command."
        repo="https://github.com/loka-network/paycli"
        skill="https://raw.githubusercontent.com/loka-network/paycli/main/skill/SKILL.md"
        skillName="paycli.SKILL.md"
        stats={[
          { v: 'Go 1.25+', k: 'SDK' },
          { v: 'node · hosted', k: 'routes' },
          { v: 'MCP-ready', k: 'agent surface' },
        ]}
      />

      <SubTabs tabs={PC_SUBTABS} active={active} onChange={setSub} />

      {active === 'overview' && <PC_Overview />}
      {active === 'install'  && <PC_Install />}
      {active === 'routes'   && <PC_Routes />}
      {active === 'commands' && <PC_Commands />}
      {active === 'skill'    && <PC_Skill />}
      {active === 'mcp'      && <PC_MCP />}
    </>
  );
}

/* ---------- Overview ----------- */
function PC_Overview() {
  return (
    <>
      <H2 id="pc-what" n={1}>What lokapay is</H2>
      <p>
        <code>lokapay</code> is the Loka Payment CLI and Go SDK. It pays
        L402-protected (HTTP 402) APIs over Lightning — settlement chain is
        whatever your lnd backend speaks (today: BTC and SUI; EVM-class chains
        on the roadmap), and the same one-liner CLI works against two custody
        models.
      </p>

      <Mermaid>{`
flowchart LR

  cli["lokapay<br/>CLI / SDK"]
  hosted["agents-pay-service<br/>+ lnd backend"]
  node["loka-lnd<br/>BTC / SUI / …"]
  prism["Prism<br/>prism.loka.cash"]

  cli -- "hosted route" --> hosted
  cli -- "node route" --> node
  cli -. "L402 challenge<br/>preimage replay" .-> prism
      `}</Mermaid>

      <H2 id="pc-design" n={2}>Design — why a separate binary</H2>
      <Grid cols={3}>
        <div className="card">
          <h3>1 · Rebase friction</h3>
          <p style={{margin:0}}><code>lncli</code> is vendored from upstream lnd. Mixing custodial REST commands
          into <code>cmd/commands/*</code> makes every upstream merge harder.</p>
        </div>
        <div className="card">
          <h3>2 · Different audience</h3>
          <p style={{margin:0}}><code>lncli</code> is a node-operator's gRPC tool. <code>lokapay</code> is an end-user / AI-agent
          payments CLI with HTTP, L402, fiat-onramp, and managed-node lifecycle.</p>
        </div>
        <div className="card">
          <h3>3 · Decoupled deps</h3>
          <p style={{margin:0}}><code>lokapay</code> needs only <code>net/http</code>, <code>urfave/cli</code>,
          and <code>survey/v2</code>. No lnd build tree, no SUI compiler.</p>
        </div>
      </Grid>

      <H2 id="pc-layout" n={3}>Repository layout</H2>
      <Code lang="text">{`pkg/sdk/         Go client SDK (import as github.com/loka-network/paycli/pkg/sdk)
cmd/lokapay/     CLI binary
docs/            CLI + SDK + onramp + integration-test playbooks
scripts/         install.sh + local integration-test runner
.goreleaser.yml  release config — tag-driven multi-platform build`}</Code>
    </>
  );
}

/* ---------- Install ----------- */
function PC_Install() {
  return (
    <>
      <H2 id="pc-inst" n={1}>Install</H2>
      <Code lang="bash">{`# curl (recommended — macOS / Linux)
curl -fsSL https://github.com/loka-network/paycli/releases/latest/download/install.sh | sh

# Homebrew — coming soon
# brew install loka-network/tap/lokapay

# Go (installs from main; requires Go 1.25+)
go install github.com/loka-network/paycli/cmd/lokapay@latest`}</Code>

      <H2 id="pc-init" n={2}><code>lokapay init</code></H2>
      <p>
        <code>init</code> is a fully interactive wizard. It detects existing
        config, asks for custody mode (<code>hosted</code> or <code>node</code>),
        and walks through the per-route setup.
      </p>
      <Code lang="bash">{`lokapay init`}</Code>
      <p>It asks:</p>
      <ol>
        <li>Existing config detected? — keep / modify / wipe</li>
        <li>Custody mode: <code>hosted</code> or <code>node</code></li>
        <li><strong>hosted:</strong> endpoint URL (default <code>https://agents-pay.loka.cash</code>), register vs log in, credentials</li>
        <li><strong>node:</strong> <code>guided</code> (lokapay downloads + runs lnd) or <code>manual</code> (point at an existing one), Sui chain, faucet, seed peers</li>
      </ol>
      <Callout kind="cyan" label="Don't run init non-interactively">
        It's a TTY wizard. In a non-TTY context, use the individual
        sub-commands it orchestrates: <code>register</code> / <code>login</code> /
        <code> node start</code>.
      </Callout>

      <H2 id="pc-hosted" n={3}>Hosted quickstart</H2>
      <Code lang="bash">{`lokapay init                                             # pick route=hosted
lokapay services                                         # browse Prism catalog
lokapay fund --amount 5 --unit USD --via stripe --open   # top up (operator-controlled)
lokapay request -i --debug https://service1.prism.loka.cash/data.json`}</Code>

      <H2 id="pc-node" n={4}>Node quickstart</H2>
      <p>
        <code>init</code> downloads + starts a local Sui-backed lnd, hits the
        faucet on devnet/testnet, connects to Loka seed peers, and opens a
        5 SUI outbound channel so routing works immediately.
      </p>
      <Code lang="bash">{`lokapay init                # pick route=node + guided
lokapay node status         # confirm pubkey + channel is active
lokapay services
lokapay request -i --debug https://service1.prism.loka.cash/data.json

# need more SUI later (devnet/testnet only):
lokapay node faucet`}</Code>
    </>
  );
}

/* ---------- Routes ----------- */
function PC_Routes() {
  return (
    <>
      <H2 id="pc-r-table" n={1}>node vs hosted</H2>
      <table>
        <thead><tr><th>Route</th><th>Wallet location</th><th>Funding</th><th>Best for</th></tr></thead>
        <tbody>
          <tr>
            <td><span className="badge gold">node</span></td>
            <td>User's own machine</td>
            <td>BOLT11 only (real on-chain SUI)</td>
            <td>"Self-custody, programmatic agent-to-agent, real Lightning"</td>
          </tr>
          <tr>
            <td><span className="badge cyan">hosted</span></td>
            <td>Loka custodial server <code>agents-pay-service</code></td>
            <td>BOLT11 invoice (also fiat onramp via operator)</td>
            <td>"Just pay APIs — don't make me run anything"</td>
          </tr>
        </tbody>
      </table>

      <H2 id="pc-r-switch" n={2}>Switching routes</H2>
      <Code lang="bash">{`lokapay route             # prints the active route
lokapay route hosted      # switch to custodial
lokapay route node        # switch to self-custody
lokapay route toggle      # flip`}</Code>
      <p>
        Switching does <em>not</em> wipe the other side's credentials — both
        buckets (<code>hosted.*</code> and <code>node.*</code>) coexist in
        config. Once <code>init</code> ran once per route, you can flip freely.
      </p>

      <H2 id="pc-r-arch" n={3}>Routing internals</H2>
      <p>
        Every command dispatches through a <code>Wallet</code> interface in
        <code> pkg/sdk</code>. Both backends — agents-pay-service REST and a
        local lnd gRPC — satisfy that interface. The <code>L402Doer</code> takes
        a <code>Wallet</code> and runs the same 402 → invoice → preimage replay
        regardless of which is plugged in.
      </p>

      <Mermaid>{`
flowchart TB

  cmd["lokapay request URL"]
  doer["L402Doer<br/>(parse LSAT · pay invoice · replay request)"]
  wif{{"Wallet interface"}}
  hosted["HostedWallet<br/>POST /api/v1/payments"]
  nodew["NodeWallet<br/>lnd gRPC SendPaymentV2"]

  cmd --> doer
  doer --> wif
  wif --> hosted
  wif --> nodew
      `}</Mermaid>
    </>
  );
}

/* ---------- Commands ----------- */
function PC_Commands() {
  return (
    <>
      <H2 id="pc-cmd-wallet" n={1}><code>wallets · whoami</code></H2>
      <p>Hosted route is multi-wallet (one per agent). Node route is single-wallet.</p>
      <Code lang="bash">{`lokapay whoami                # hosted: balance, wallet meta; node: pubkey, channels

# hosted only
lokapay wallets add <alias>   # creates a sub-wallet
lokapay wallets list
lokapay wallets use <alias>   # switch active
lokapay wallets show <alias>  # print admin + invoice keys
lokapay wallets remove <alias>`}</Code>

      <H2 id="pc-cmd-fund" n={2}><code>fund · pay</code></H2>
      <table className="tight">
        <thead><tr><th>User says</th><th><code>--unit</code></th><th>Notes</th></tr></thead>
        <tbody>
          <tr><td>"100k sats"</td><td><code>sat</code> (default)</td><td>Lightning native</td></tr>
          <tr><td>"0.001 SUI" / "100000 mist"</td><td><code>mist</code></td><td>SUI base unit</td></tr>
          <tr><td>"$5" / "5 USD"</td><td><code>USD</code> (or <code>EUR</code>, …)</td><td>requires <code>--via stripe | paypal</code> (operator-controlled)</td></tr>
        </tbody>
      </table>
      <Code lang="bash">{`# BOLT11 top-up (returns invoice to pay from another wallet)
lokapay fund --amount 100000 --memo "agent budget"

# Pay any BOLT11 invoice from the active route
lokapay pay <bolt11>`}</Code>

      <H2 id="pc-cmd-request" n={3}><code>request</code></H2>
      <p>The 402 dance — GET → 402 → pay → retry with <code>LSAT</code> header → 200 — is automatic.</p>
      <Code lang="bash">{`# production: real domain, real TLS
lokapay request -i https://api.some-merchant.com/v1/data

# with body
lokapay request -X POST -d '{"k":"v"}' \\
    -H "Content-Type: application/json" \\
    -i https://api.some-merchant.com/v1/echo

# local dev: faked Host header + self-signed cert
lokapay request -H "Host: service1.com" --insecure-target -i --debug \\
    https://127.0.0.1:8080/data.json`}</Code>
      <table className="tight">
        <thead><tr><th>Flag</th><th>Purpose</th></tr></thead>
        <tbody>
          <tr><td><code>-i</code></td><td>also print response status + headers</td></tr>
          <tr><td><code>--debug</code></td><td>render the L402 exchange as a sequence diagram on stderr</td></tr>
          <tr><td><code>-H "Host: X"</code></td><td>override Host (local dev with no DNS)</td></tr>
          <tr><td><code>--insecure-target</code></td><td>skip TLS verify — only for <code>127.0.0.1</code> / self-signed</td></tr>
          <tr><td><code>--max-retries N</code></td><td>retry the whole 402 cycle on transient failures (default 1)</td></tr>
        </tbody>
      </table>

      <H2 id="pc-cmd-services" n={4}><code>services · history · events</code></H2>
      <Code lang="bash">{`lokapay services              # full Prism catalog (host_regexp, price, etc.)
lokapay services -s research  # filter by substring

lokapay history --limit 20    # wallet-backend ledger (lnbits or lnd)
lokapay events  -n 20         # local L402 settlement log (~/.lokapay/events.jsonl)
lokapay events  -t L402_PAID --json
lokapay payment-status <payment_hash>

lokapay rate                  # spot rate (default USD)
lokapay rate EUR`}</Code>

      <H2 id="pc-cmd-node" n={5}><code>node</code> — self-custody lnd lifecycle</H2>
      <p>Only meaningful when <code>route=node</code>. Wraps the bundled loka-lnd binary so users never see raw <code>lncli</code>.</p>
      <table className="tight">
        <thead><tr><th>Intent</th><th>Command</th></tr></thead>
        <tbody>
          <tr><td>Install lnd binary</td><td><code>lokapay node install</code></td></tr>
          <tr><td>Start lnd</td><td><code>lokapay node start [--network …]</code></td></tr>
          <tr><td>Stop lnd</td><td><code>lokapay node stop</code></td></tr>
          <tr><td>Restart</td><td><code>lokapay node restart</code></td></tr>
          <tr><td>Health check</td><td><code>lokapay node status</code></td></tr>
          <tr><td>Tail logs</td><td><code>lokapay node logs -f</code></td></tr>
          <tr><td>Top up dev wallet</td><td><code>lokapay node faucet</code> (devnet/testnet only)</td></tr>
          <tr><td>Connect Loka seeds</td><td><code>lokapay node start --connect-seeds</code></td></tr>
        </tbody>
      </table>

      <H2 id="pc-cmd-config" n={6}><code>config</code></H2>
      <Code lang="bash">{`lokapay config show              # full config, secrets masked
lokapay config show --reveal     # include secrets
lokapay config keys              # list every editable key
lokapay config get prism_url
lokapay config set prism_url https://prism.example.com`}</Code>
      <p className="muted">Common keys: <code>route</code>, <code>prism_url</code>, <code>insecure_tls</code>, <code>hosted.base_url</code>, <code>hosted.active_wallet</code>, <code>node.endpoint</code>, <code>node.macaroon_path</code>.</p>
    </>
  );
}

/* ---------- Skill ----------- */
function PC_Skill() {
  return (
    <>
      <Callout kind="cyan" label="machine-readable skill">
        The canonical Skill is <code>skill/SKILL.md</code> in the repo — every line maps a
        natural-language user intent to the exact lokapay command(s). This page is the
        human view of that mapping.
      </Callout>

      <H2 id="pc-skill-mental" n={1}>Mental model — two custody routes</H2>
      <p>
        Every command dispatches through one of two routes, chosen during
        <code> lokapay init</code> and stored as <code>route: hosted | node</code> in
        <code> ~/.lokapay/config.json</code>. An agent must <strong>know which route is active</strong>
        before running any command — many behave differently.
      </p>

      <H2 id="pc-skill-intent" n={2}>Intent → command map</H2>
      <table>
        <thead><tr><th>User says</th><th>Command</th></tr></thead>
        <tbody>
          <tr><td>"who am I?" / "what account?"</td><td><code>lokapay whoami</code></td></tr>
          <tr><td>"what's my balance?"</td><td>hosted: <code>whoami</code> · node: <code>node status</code></td></tr>
          <tr><td>"add a new agent wallet"</td><td><code>lokapay wallets add &lt;alias&gt;</code> (hosted only)</td></tr>
          <tr><td>"top up my wallet"</td><td><code>lokapay fund --amount …</code></td></tr>
          <tr><td>"pay this invoice"</td><td><code>lokapay pay &lt;bolt11&gt;</code></td></tr>
          <tr><td>"buy something on a paid API"</td><td><code>lokapay request URL</code></td></tr>
          <tr><td>"show me what I've spent"</td><td><code>lokapay history</code> / <code>events</code></td></tr>
          <tr><td>"show me the FX rate"</td><td><code>lokapay rate [CCY]</code></td></tr>
          <tr><td>"switch routes"</td><td><code>lokapay route hosted | node | toggle</code></td></tr>
        </tbody>
      </table>

      <H2 id="pc-skill-fail" n={3}>Failure-mode dictionary</H2>
      <table className="tight">
        <thead><tr><th>Symptom (error substring)</th><th>Meaning · next step</th></tr></thead>
        <tbody>
          <tr><td><code>payment failed: insufficient_balance</code></td><td>Hosted: wallet too low. Node: no channels or no outbound capacity.</td></tr>
          <tr><td><code>FAILURE_REASON_INCORRECT_PAYMENT_DETAILS</code></td><td>Invoice expired in transit. Retry once with <code>--max-retries 2</code>.</td></tr>
          <tr><td><code>FAILURE_REASON_NO_ROUTE</code></td><td>No path through the LN graph. Topology issue — not client-side.</td></tr>
          <tr><td><code>x509: certificate is valid for X, not Y</code></td><td>TLS hostname mismatch. Add <code>--insecure-target</code> for local dev.</td></tr>
          <tr><td><code>apikey is invalid</code> / <code>401</code></td><td>Stale or wrong admin key. Re-run <code>lokapay login</code> or <code>init</code>.</td></tr>
          <tr><td><code>lnd RPC didn't come up within 60s</code></td><td>lnd boot stuck. Check <code>lokapay node logs</code>.</td></tr>
          <tr><td><code>self-payments not allowed</code></td><td>Operator needs <code>--allow-circular-route</code>, or test against a different service.</td></tr>
          <tr><td><code>502 Bad Gateway</code> after step 3</td><td>LSAT auth OK — Prism's upstream backend is down. Operator problem.</td></tr>
          <tr><td>status <code>pending</code> for a long time</td><td>Force re-query with <code>lokapay payment-status &lt;hash&gt;</code>.</td></tr>
        </tbody>
      </table>

      <H2 id="pc-skill-conv" n={4}>Conventions for the agent</H2>
      <ol>
        <li><strong>Confirm before spending.</strong> Any command that locks SUI on-chain or sends real money should be confirmed — print amount, destination, ask "go ahead?".</li>
        <li><strong>Never invent flags.</strong> If unsure, <code>lokapay &lt;cmd&gt; --help</code>. If intent is ambiguous, ask — don't guess.</li>
        <li><strong>Don't run <code>init</code> on a working setup.</strong> Mostly idempotent now, but it prompts many times.</li>
        <li><strong>Read stderr.</strong> <code>--debug</code>, errors, and progress notices go to stderr; response bodies go to stdout.</li>
        <li><strong>Surface the route in your responses.</strong> "I'll pay from your <em>hosted</em> wallet" beats "I'll run <code>lokapay pay</code>".</li>
        <li><strong>Quote exit codes.</strong> <code>lokapay</code> returns <code>0</code> on success, <code>1</code> on any error with a stderr message. Show the message — don't paraphrase.</li>
      </ol>
    </>
  );
}

/* ---------- MCP server ----------- */
function PC_MCP() {
  return (
    <>
      <Callout kind="cyan" label="lokapay mcp · stdio MCP server">
        Run <code>lokapay mcp</code> and an MCP-aware AI client (Claude Desktop,
        Cursor, Continue, …) can drive lokapay through structured JSON tool
        calls instead of shell-execing the CLI. Shipped in
        <code> cmd/lokapay/cmd_mcp.go</code>.
      </Callout>

      <H2 id="pc-mcp-why" n={1}>Why an MCP server</H2>
      <p>
        Most agent integrations end up parsing CLI stdout — brittle, can't
        distinguish a real error from a transient log, breaks when flags
        evolve. The Model Context Protocol gives the same operations a
        typed RPC surface: schemas are auto-derived from Go struct tags,
        errors come back as <code>IsError</code> on the tool result, and the
        client never has to reach for <code>grep</code>.
      </p>
      <p>
        Two paths now coexist:
      </p>
      <Grid cols={2}>
        <div className="card">
          <h3>Shell-exec agents</h3>
          <p style={{margin:0}}>Claude Code, cursor-cli, anything that can
          <code> run lokapay …</code>. Use the SKILL document for intent → command
          mapping.</p>
        </div>
        <div className="card">
          <h3>MCP-aware agents</h3>
          <p style={{margin:0}}>Claude Desktop, Cursor, Continue, Zed, etc. Use the
          MCP server — they can't shell-exec, but they can call typed tools.</p>
        </div>
      </Grid>

      <H2 id="pc-mcp-config" n={2}>Client config</H2>
      <p>
        Before first use, run <code>lokapay init</code> once in a terminal —
        the MCP server reuses the same <code>~/.lokapay/config.json</code>. The
        wizard is TTY-interactive so it can't be run from inside an MCP session.
      </p>
      <p><strong>Claude Desktop</strong> (<code>~/Library/Application Support/Claude/claude_desktop_config.json</code> on macOS):</p>
      <Code lang="json">{`{
  "mcpServers": {
    "lokapay": {
      "command": "lokapay",
      "args": ["mcp"]
    }
  }
}`}</Code>
      <p><strong>Cursor</strong> — same shape in <code>~/.cursor/mcp.json</code>.</p>
      <p><strong>Continue</strong> — same shape in <code>~/.continue/mcp.json</code>.</p>
      <p className="muted">Restart the client; the <code>lokapay</code> tools appear in the tool picker.</p>

      <H2 id="pc-mcp-tools" n={3}>Exposed tools</H2>
      <p>Input schemas auto-derived from Go struct tags; descriptions surface the side-effect class directly to the LLM.</p>
      <table className="tight">
        <thead><tr><th>Tool</th><th>Side effect</th><th>Args</th><th>Notes</th></tr></thead>
        <tbody>
          <tr>
            <td><code>whoami</code></td>
            <td>read-only</td>
            <td>—</td>
            <td>route + identity + balance. <strong>Secrets stripped</strong> — no admin_key / bearer / invoice_key.</td>
          </tr>
          <tr>
            <td><code>services</code></td>
            <td>read-only</td>
            <td><code>search?</code></td>
            <td>Lists Prism's L402 service catalog. Optional case-insensitive substring filter.</td>
          </tr>
          <tr>
            <td><code>pay</code></td>
            <td>⚠️ spends real funds</td>
            <td><code>bolt11</code></td>
            <td>Returns <code>payment_hash + preimage + amount + status</code>.</td>
          </tr>
          <tr>
            <td><code>request</code></td>
            <td>⚠️ may spend real funds</td>
            <td><code>url</code>, <code>method?</code>, <code>headers?</code>, <code>host?</code>, <code>body?</code>, <code>insecure_target?</code>, <code>max_retries?</code></td>
            <td>HTTP with auto-L402 handling. Body truncated to 64 KiB.</td>
          </tr>
          <tr>
            <td><code>history</code></td>
            <td>read-only</td>
            <td><code>limit?</code> (default 10, max 100), <code>offset?</code></td>
            <td>Recent payments on active wallet. Hosted + node both supported.</td>
          </tr>
        </tbody>
      </table>

      <p className="muted">
        Intentionally <strong>not exposed</strong> (TTY-interactive or operator-only):{' '}
        <code>init</code>, <code>node start/stop/restart/install/faucet</code>,{' '}
        <code>topup</code>, <code>admin-set</code>, <code>auth-login</code>,{' '}
        <code>register</code>, <code>login</code>, <code>route</code>.
      </p>

      <H2 id="pc-mcp-trust" n={4}>Trust model — stdio only, by design</H2>
      <Callout kind="amber" label="No network surface. Ever.">
        <code>lokapay mcp</code> only speaks MCP over stdio. There is no
        listening socket, no SSE endpoint, no HTTP transport. SSE / HTTP
        modes <strong>will not</strong> be added without first solving the
        remote-auth + remote-asset-control threat model from first
        principles. This is a wallet — exposing it on the network means
        anyone who reaches the port can pay invoices.
      </Callout>
      <ul>
        <li><strong>Process-scoped reach.</strong> Only the parent process that spawned <code>lokapay mcp</code> can talk to it (stdin/stdout). No remote attack vector.</li>
        <li><strong>Credentials read, never returned.</strong> Wallet keys live in <code>~/.lokapay/config.json</code>. The server reads them to call Lightning APIs but strips them from every tool response.</li>
        <li><strong>Bounded blast radius.</strong> Tools that spend money have ⚠️ in their description so the LLM client can warn / confirm. Operator-only ops are simply not registered.</li>
        <li><strong>Stdout is reserved for the JSON-RPC protocol.</strong> All MCP server logs go to <code>stderr</code> — writing anything else to stdout would corrupt the transport.</li>
      </ul>

      <H2 id="pc-mcp-audit" n={5}>Audit log</H2>
      <p>
        Every tool invocation appends one-line JSON to <code>~/.lokapay/mcp-audit.log</code>
        {' '}(mode <code>0600</code>) so you can see exactly what the agent did:
      </p>
      <Code lang="json">{`{"ts":"2026-05-20T10:24:18Z","tool":"whoami","args":null}
{"ts":"2026-05-20T10:24:19Z","tool":"services","args":{"search":"research"}}
{"ts":"2026-05-20T10:24:32Z","tool":"pay","args":{"bolt11":"lnbcrt1m1p4q…"}}
{"ts":"2026-05-20T10:25:05Z","tool":"request","args":{"url":"https://service1.prism.loka.cash/data.json","method":"","host":""}}`}</Code>
      <p className="muted">
        Secret-bearing args (full <code>bolt11</code>) are truncated; the audit row
        records intent + outcome, not the recoverable payment data.
      </p>
    </>
  );
}

window.PagePaycli = PagePaycli;
