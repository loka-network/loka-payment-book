/* ====================================================================
   SDK · Go — github.com/loka-network/paycli/pkg/sdk
   Importable Go library that backs the lokapay CLI. This page is the
   user-facing reference: install, types, examples for both routes.
   ==================================================================== */

function PageSdk({ sub, setSub, registerSections }) {
  const active = sub || 'overview';

  useEffect(() => {
    const sections = {
      overview: [{ title: 'SDK overview', items: [
        { id: 'sdk-what',     label: 'What it is' },
        { id: 'sdk-shape',    label: 'Surface area' },
        { id: 'sdk-when',     label: 'When to use the SDK' },
      ]}],
      install: [{ title: 'Install', items: [
        { id: 'sdk-go',       label: 'go get' },
        { id: 'sdk-versions', label: 'Versioning' },
      ]}],
      quickstart: [{ title: 'Quickstart', items: [
        { id: 'qs-hosted',    label: 'Hosted route — 20 lines' },
        { id: 'qs-node',      label: 'Node route — local lnd' },
        { id: 'qs-l402',      label: 'Auto-pay an L402 endpoint' },
      ]}],
      wallet: [{ title: 'Wallet interface', items: [
        { id: 'iface-sig',    label: 'Wallet interface' },
        { id: 'iface-hosted', label: 'HostedWallet' },
        { id: 'iface-node',   label: 'NodeWallet' },
        { id: 'iface-custom', label: 'Custom adapters' },
      ]}],
      l402: [{ title: 'L402Doer', items: [
        { id: 'doer-what',    label: 'L402Doer' },
        { id: 'doer-options', label: 'Options' },
        { id: 'doer-cache',   label: 'Token cache' },
      ]}],
      examples: [{ title: 'Examples', items: [
        { id: 'ex-agent',     label: 'AI agent paying for a paid API' },
        { id: 'ex-bot',       label: 'Discord/Slack bot · BOLT11 charge' },
        { id: 'ex-fanout',    label: 'Fan-out: 1000 sub-wallets' },
        { id: 'ex-server',    label: 'Embedding in a Go server' },
      ]}],
    };
    registerSections(sections[active]);
  }, [active]);

  return (
    <>
      <ProjectHero
        eyebrow="MORE · Developer surface"
        title="SDK · Go"
        subtitle="The Go library that backs the lokapay CLI — importable as github.com/loka-network/paycli/pkg/sdk. Same two-route Wallet abstraction, same L402 auto-pay loop. Drop it into any Go service to give it native L402 payment capability."
        repo="https://github.com/loka-network/paycli"
        stats={[
          { v: 'pkg/sdk', k: 'import path' },
          { v: 'Go 1.25+', k: 'requires' },
          { v: '~600 LoC', k: 'core surface' },
        ]}
      />

      {active === 'overview'   && <SDK_Overview />}
      {active === 'install'    && <SDK_Install />}
      {active === 'quickstart' && <SDK_Quickstart />}
      {active === 'wallet'     && <SDK_Wallet />}
      {active === 'l402'       && <SDK_L402 />}
      {active === 'examples'   && <SDK_Examples />}
    </>
  );
}

/* ---------- Overview ----------- */
function SDK_Overview() {
  return (
    <>
      <H2 id="sdk-what" n={1}>What it is</H2>
      <p>
        <code>github.com/loka-network/paycli/pkg/sdk</code> is the Go SDK that
        powers the <a className="link" href="#paycli">lokapay CLI</a>. Every
        command in the CLI is a thin wrapper around one of the SDK's
        functions — which means the SDK is at least as battle-tested as the
        CLI, and a perfectly fine way to embed L402 payments in any Go program.
      </p>
      <p>
        The SDK gives you three things:
      </p>
      <Grid cols={3}>
        <Tile index="01" title="Wallet interface">
          A small Go interface satisfied by both backends — a hosted{' '}
          <code>agents-pay-service</code> account and a local{' '}
          <code>lnd-grpc</code> wallet. Same call site, swap the implementation.
        </Tile>
        <Tile index="02" title="L402Doer">
          An <code>http.RoundTripper</code> that catches 402 responses, pays
          the invoice using your <code>Wallet</code>, and replays the request
          with the LSAT token. Transparent to your call site.
        </Tile>
        <Tile index="03" title="Helpers">
          BOLT11 invoice decoding, MCP schema export, event log writer,
          config persistence (<code>~/.lokapay/</code>) — everything the CLI
          uses except its <code>urfave/cli</code> command layer.
        </Tile>
      </Grid>

      <H2 id="sdk-shape" n={2}>Surface area</H2>
      <Code lang="go">{`package sdk // github.com/loka-network/paycli/pkg/sdk

// ---- Wallet — backend-agnostic interface ---------------
type Wallet interface {
    WhoAmI(ctx context.Context) (Identity, error)
    Balance(ctx context.Context) (Balance, error)
    NewInvoice(ctx context.Context, req InvoiceReq) (Invoice, error)
    Pay(ctx context.Context, bolt11 string) (PaymentResult, error)
    History(ctx context.Context, opts HistoryOpts) ([]Payment, error)
}

// ---- Concrete wallets ----------------------------------
func NewHostedWallet(cfg HostedConfig) (Wallet, error) // agents-pay-service
func NewNodeWallet(cfg NodeConfig) (Wallet, error)     // lnd gRPC

// ---- L402 auto-pay loop --------------------------------
type L402Doer struct {
    Wallet  Wallet
    Client  *http.Client       // default: http.DefaultClient
    Cache   TokenCache         // default: in-memory
    Retries int                // default: 1
}
func (d *L402Doer) Do(req *http.Request) (*http.Response, error)

// ---- Misc helpers --------------------------------------
func DecodeBOLT11(s string) (*BOLT11Invoice, error)
func LoadConfig(path string) (*Config, error)
func SaveConfig(path string, c *Config) error`}</Code>

      <H2 id="sdk-when" n={3}>When to use the SDK</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>Use the SDK when…</h3>
          <ul style={{margin: '4px 0 0', paddingLeft: 20}}>
            <li>Embedding L402 payment in an existing Go service</li>
            <li>Building an agent framework that needs programmatic wallet access</li>
            <li>You want the same code to work against hosted + node routes</li>
            <li>You want the wire protocol but don't need a CLI binary</li>
          </ul>
        </div>
        <div className="card">
          <h3>Use the CLI when…</h3>
          <ul style={{margin: '4px 0 0', paddingLeft: 20}}>
            <li>You're a human/operator (or your tooling shells out)</li>
            <li>You want the interactive <code>init</code> wizard</li>
            <li>You want the bundled <code>node</code> lifecycle helper</li>
            <li>You're driving things from a non-Go language</li>
          </ul>
        </div>
      </Grid>
    </>
  );
}

/* ---------- Install ----------- */
function SDK_Install() {
  return (
    <>
      <H2 id="sdk-go" n={1}><code>go get</code></H2>
      <Code lang="bash">{`go get github.com/loka-network/paycli/pkg/sdk@latest

# in your Go file
import "github.com/loka-network/paycli/pkg/sdk"`}</Code>

      <H2 id="sdk-versions" n={2}>Versioning</H2>
      <p>
        The SDK ships as part of the <code>paycli</code> module — the same
        release tags. SemVer: breaking changes bump the major version, new
        features bump minor, fixes bump patch. The <code>main</code> branch
        is pinned to the latest stable release.
      </p>
      <Callout kind="cyan" label="stability">
        Anything documented on this page is considered stable. Anything in
        an <code>internal/</code> package or prefixed with <code>x</code> is
        explicitly unstable — don't rely on it across versions.
      </Callout>
    </>
  );
}

/* ---------- Quickstart ----------- */
function SDK_Quickstart() {
  return (
    <>
      <H2 id="qs-hosted" n={1}>Hosted route — 20 lines</H2>
      <p>
        Open a wallet against the hosted <code>agents-pay-service</code>,
        check the balance, generate an invoice, and pay one — all without
        running a node.
      </p>
      <Code lang="go">{`package main

import (
    "context"
    "fmt"
    "log"

    "github.com/loka-network/paycli/pkg/sdk"
)

func main() {
    ctx := context.Background()

    w, err := sdk.NewHostedWallet(sdk.HostedConfig{
        BaseURL:  "https://agents-pay.loka.cash",
        AdminKey: os.Getenv("LOKA_ADMIN_KEY"),
    })
    if err != nil { log.Fatal(err) }

    bal, _ := w.Balance(ctx)
    fmt.Printf("balance: %d msat\\n", bal.MillisatTotal)

    inv, _ := w.NewInvoice(ctx, sdk.InvoiceReq{
        AmountSat: 1000,
        Memo:      "topup",
    })
    fmt.Println(inv.BOLT11) // share this with the payer
}`}</Code>

      <H2 id="qs-node" n={2}>Node route — local lnd</H2>
      <Code lang="go">{`w, err := sdk.NewNodeWallet(sdk.NodeConfig{
    GRPCEndpoint: "127.0.0.1:10009",
    TLSCertPath:  "/home/me/.lnd/tls.cert",
    MacaroonPath: "/home/me/.lnd/data/chain/sui/devnet/admin.macaroon",
})
// every subsequent call is identical to the hosted route
who, _ := w.WhoAmI(ctx)
fmt.Println(who.PubKey)`}</Code>

      <H2 id="qs-l402" n={3}>Auto-pay an L402 endpoint</H2>
      <p>
        The whole 402 → invoice → pay → retry-with-LSAT dance is one
        <code>L402Doer</code> wrapped around an <code>http.Client</code>:
      </p>
      <Code lang="go">{`doer := &sdk.L402Doer{ Wallet: w }
http := &http.Client{ Transport: doer }

resp, err := http.Get("https://service1.prism.loka.cash/data.json")
// resp.Body is the merchant response; the payment + retry happened
// inside the round-tripper — your call site only sees the final 200.
defer resp.Body.Close()
io.Copy(os.Stdout, resp.Body)`}</Code>
      <Callout kind="cyan" label="that's the whole CLI">
        The <code>lokapay request</code> command is literally these four
        lines wrapped in a urfave/cli action. Once you understand
        <code> L402Doer</code>, you understand the entire CLI.
      </Callout>
    </>
  );
}

/* ---------- Wallet ----------- */
function SDK_Wallet() {
  return (
    <>
      <H2 id="iface-sig" n={1}>Wallet interface</H2>
      <Code lang="go">{`type Wallet interface {
    WhoAmI(ctx context.Context) (Identity, error)
    Balance(ctx context.Context) (Balance, error)
    NewInvoice(ctx context.Context, req InvoiceReq) (Invoice, error)
    Pay(ctx context.Context, bolt11 string) (PaymentResult, error)
    History(ctx context.Context, opts HistoryOpts) ([]Payment, error)
}`}</Code>
      <p>Five methods. That's the whole abstraction.</p>

      <H2 id="iface-hosted" n={2}><code>HostedWallet</code></H2>
      <p>
        Talks to <code>agents-pay-service</code> over HTTPS using an
        <code> X-Api-Key</code>. Zero local key material — perfect for
        ephemeral containers or browser-driven agents.
      </p>
      <Code lang="go">{`type HostedConfig struct {
    BaseURL    string   // e.g. https://agents-pay.loka.cash
    AdminKey   string   // ⚠ spend authority
    InvoiceKey string   // receive-only (optional)
    HTTPClient *http.Client // override timeouts, transport, etc.
}`}</Code>

      <H2 id="iface-node" n={3}><code>NodeWallet</code></H2>
      <p>
        Talks gRPC to a local <code>lnd</code> (or any compatible
        <code> lnrpc</code> server — including <code>loka-p2p-lnd</code>).
        Self-custody: keys never leave your machine.
      </p>
      <Code lang="go">{`type NodeConfig struct {
    GRPCEndpoint string   // host:port
    TLSCertPath  string
    MacaroonPath string   // admin or invoice macaroon
    FeeLimitMsat int64    // default 1000
}`}</Code>

      <H2 id="iface-custom" n={4}>Custom adapters</H2>
      <p>
        Want to plug in CLN, a hardware wallet, or a mock for tests? Implement
        the five-method <code>Wallet</code> interface and you're done — the
        <code> L402Doer</code> and every helper takes it transparently.
      </p>
      <Code lang="go">{`type myCustomWallet struct { /* … */ }

func (w *myCustomWallet) WhoAmI(ctx context.Context) (sdk.Identity, error) { … }
func (w *myCustomWallet) Balance(ctx context.Context) (sdk.Balance, error) { … }
// … etc.

var _ sdk.Wallet = (*myCustomWallet)(nil) // compile-time check`}</Code>
    </>
  );
}

/* ---------- L402Doer ----------- */
function SDK_L402() {
  return (
    <>
      <H2 id="doer-what" n={1}><code>L402Doer</code></H2>
      <p>
        An <code>http.RoundTripper</code> that turns any <code>http.Client</code>
        into an L402-aware client. The auto-pay loop:
      </p>
      <ol>
        <li>Make the request as normal.</li>
        <li>If response is <code>402</code> with a <code>WWW-Authenticate: LSAT</code> challenge, parse the macaroon + invoice.</li>
        <li>Call <code>Wallet.Pay(invoice)</code> to settle, capture the preimage.</li>
        <li>Cache <code>(macaroon, preimage)</code> in <code>Cache</code> keyed by origin + service.</li>
        <li>Retry the original request with <code>Authorization: LSAT macaroon:preimage</code>.</li>
        <li>Surface the final response to the caller.</li>
      </ol>

      <H2 id="doer-options" n={2}>Options</H2>
      <Code lang="go">{`type L402Doer struct {
    Wallet  Wallet           // required
    Client  *http.Client     // default: http.DefaultClient
    Cache   TokenCache       // default: NewMemoryCache()
    Retries int              // default: 1 — retry on transient invoice expiry
    OnPaid  func(PaymentResult)  // optional callback, useful for logging
    Debug   io.Writer        // if set, prints the 402 dance as a sequence
}`}</Code>

      <H2 id="doer-cache" n={3}>Token cache</H2>
      <p>
        L402 tokens are reusable until the macaroon's caveat (TTL) expires.
        The default in-memory cache is fine for single-process; for a fleet
        of agents you'll want a shared backend.
      </p>
      <Code lang="go">{`type TokenCache interface {
    Get(key string) (token string, ok bool)
    Put(key, token string, ttl time.Duration)
}

// adapters
sdk.NewMemoryCache()                                     // in-process LRU
sdk.NewFileCache("~/.lokapay/events.jsonl")              // single-host disk
sdk.NewRedisCache(redisClient, "lokapay:tokens:")        // shared fleet`}</Code>
      <Callout kind="amber" label="rotate when you must">
        If a service rotates its macaroon, your cached token starts getting
        rejected. The <code>L402Doer</code> handles this automatically — on a
        repeat 402 with a different macaroon, it invalidates the cache entry
        and pays the new invoice.
      </Callout>
    </>
  );
}

/* ---------- Examples ----------- */
function SDK_Examples() {
  return (
    <>
      <H2 id="ex-agent" n={1}>AI agent paying for a paid API</H2>
      <p>
        An agent loop that polls a paid news feed, charged per request. The
        same <code>http.Client</code> handles both the unauthenticated
        discovery call and the metered fetch.
      </p>
      <Code lang="go">{`func agentLoop(ctx context.Context, w sdk.Wallet) error {
    client := &http.Client{
        Transport: &sdk.L402Doer{ Wallet: w, Retries: 2 },
        Timeout:   15 * time.Second,
    }

    for {
        resp, err := client.Get("https://news-api.merchant.com/v1/breaking")
        if err != nil { return err }

        var feed FeedResponse
        json.NewDecoder(resp.Body).Decode(&feed)
        resp.Body.Close()

        for _, item := range feed.Items {
            if act := decide(item); act != nil { execute(act) }
        }
        select {
        case <-ctx.Done(): return ctx.Err()
        case <-time.After(30 * time.Second):
        }
    }
}`}</Code>

      <H2 id="ex-bot" n={2}>Discord/Slack bot — BOLT11 charge</H2>
      <p>
        A chat bot that issues an invoice when a user runs <code>/pay 1000</code>
        and confirms once it settles. The hosted route makes this trivial —
        no node to operate.
      </p>
      <Code lang="go">{`func handlePayCommand(s *discordgo.Session, m *discordgo.MessageCreate,
                       w sdk.Wallet, amtSat int64) {
    inv, err := w.NewInvoice(context.Background(), sdk.InvoiceReq{
        AmountSat: amtSat,
        Memo:      fmt.Sprintf("tip from %s", m.Author.Username),
    })
    if err != nil { s.ChannelMessageSend(m.ChannelID, "invoice failed: "+err.Error()); return }

    s.ChannelMessageSend(m.ChannelID,
        "Invoice (paste into a Lightning wallet):\\n" + inv.BOLT11 + "\\nWaiting…")

    // poll for settlement
    for i := 0; i < 60; i++ {
        time.Sleep(2 * time.Second)
        bal, _ := w.Balance(context.Background())
        if bal.MillisatTotal >= inv.AmountMsat {
            s.ChannelMessageSend(m.ChannelID, "✓ paid, thank you!")
            return
        }
    }
}`}</Code>

      <H2 id="ex-fanout" n={3}>Fan-out: provisioning 1000 sub-wallets</H2>
      <p>
        For agent fleets. Use the hosted batch API to mint a thousand
        independently-keyed sub-wallets in one round-trip.
      </p>
      <Code lang="go">{`names := make([]string, 1000)
for i := range names { names[i] = fmt.Sprintf("agent-%04d", i+1) }

wallets, err := sdk.HostedBatchCreate(ctx, sdk.HostedConfig{
    BaseURL:  "https://agents-pay.loka.cash",
    AdminKey: masterKey,           // the org's root admin key
}, names)
if err != nil { log.Fatal(err) }

for _, sub := range wallets {
    // sub.AdminKey · sub.InvoiceKey · sub.ID
    persistToSecretStore(sub)
}`}</Code>

      <H2 id="ex-server" n={4}>Embedding in a Go server</H2>
      <p>
        Use the SDK to add metered upstream calls to an existing HTTP service
        — your service charges its own users in fiat, and uses Loka under the
        hood to pay metered upstream APIs.
      </p>
      <Code lang="go">{`var (
    metered = &http.Client{Transport: &sdk.L402Doer{Wallet: lokaWallet}}
)

func (s *Server) summariseHandler(w http.ResponseWriter, r *http.Request) {
    // paid upstream — L402Doer handles the 402 transparently
    resp, err := metered.Post(
        "https://summariser.merchant.com/v1/summarise",
        "application/json", r.Body)
    if err != nil { http.Error(w, err.Error(), 502); return }
    defer resp.Body.Close()
    io.Copy(w, resp.Body)
}`}</Code>
    </>
  );
}

window.PageSdk = PageSdk;
