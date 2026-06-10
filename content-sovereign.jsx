/* ====================================================================
   SOVEREIGN STACK — the sovereign-money narrative layered on top of the
   payment rail. Why sovereign · national stablecoin architecture ·
   market entry · network-asset moat · NeoBank.

   Red-line discipline: anything not yet shipped is tagged `planned` /
   `in dev`. lokachain / NeoBank / cross-chain atomic swap are spoken of
   as direction ("building toward"), never as live with hard numbers.
   ==================================================================== */

const SV_SUBTABS = [
  { id: 'why',          label: 'Why Sovereign' },
  { id: 'architecture', label: 'National Stablecoin Architecture' },
  { id: 'markets',      label: 'Market Entry' },
  { id: 'moat',         label: 'Network-Asset Moat' },
  { id: 'neobank',      label: 'NeoBank & Roadmap' },
];

function PageSovereign({ sub, setSub, registerSections }) {
  const active = sub || 'why';

  useEffect(() => {
    const sections = {
      why: [{ title: 'Why Sovereign', items: [
        { id: 'sv-rent',     label: 'From renting to owning' },
        { id: 'sv-gap',      label: "What the old rails can't reach" },
        { id: 'sv-what',     label: 'What a sovereign stack means' },
        { id: 'sv-proof',    label: 'The three proofs' },
      ]}],
      architecture: [{ title: 'Architecture', items: [
        { id: 'sv-arch-map', label: 'The four layers' },
        { id: 'sv-issuance', label: 'Issuance layer' },
        { id: 'sv-deploy',   label: 'Deployment shape' },
        { id: 'sv-settle',   label: 'Settlement layer' },
        { id: 'sv-comply',   label: 'Compliance layer' },
      ]}],
      markets: [{ title: 'Market Entry', items: [
        { id: 'sv-why-em',   label: 'Why emerging markets first' },
        { id: 'sv-regions',  label: 'LatAm · Africa · South/SE Asia' },
        { id: 'sv-logic',    label: 'The wedge logic' },
      ]}],
      moat: [{ title: 'Network-Asset Moat', items: [
        { id: 'sv-moat',     label: 'The real moat' },
        { id: 'sv-liq',      label: 'Corridor liquidity' },
        { id: 'sv-data',     label: 'Operating data' },
        { id: 'sv-lic',      label: 'On/off-ramp & licensing' },
      ]}],
      neobank: [{ title: 'NeoBank & Roadmap', items: [
        { id: 'sv-nb',       label: 'Sovereign financial services' },
        { id: 'sv-phases',   label: 'Three-phase roadmap' },
        { id: 'sv-oss',      label: 'Open source, no lock-in' },
      ]}],
    };
    if (registerSections) registerSections(sections[active]);
  }, [active]);

  return (
    <>
      <ProjectHero
        eyebrow="Vision · Sovereign"
        title={<>Sovereign money,<br/><em>you can git clone.</em></>}
        subtitle="The same open Lightning + multi-chain stack that settles agent payments also lets a nation run its own money — its own currency, its own rails, that nobody can quietly switch off. This section is the narrative and the architecture for that: issuance, settlement, compliance, market entry, and the moat that only real operation builds."
        repo="https://github.com/loka-network/loka-chain"
        stats={[
          { v: '1 codebase', k: 'per-nation instances' },
          { v: '0',          k: 'bridge custodians' },
          { v: 'git clone',  k: 'the sovereignty primitive' },
        ]}
      />

      {active === 'why'          && <SV_Why />}
      {active === 'architecture' && <SV_Architecture />}
      {active === 'markets'      && <SV_Markets />}
      {active === 'moat'         && <SV_Moat />}
      {active === 'neobank'      && <SV_NeoBank />}
    </>
  );
}

/* ============================ WHY =============================== */
function SV_Why() {
  return (
    <>
      <H2 id="sv-rent" n={1}>From renting to owning</H2>
      <p>
        Today's money rails — card networks, custodial stablecoins — are, at
        bottom, <strong>permission you rent from someone else</strong>. They
        skim a percentage, they can freeze a balance, and the currency itself
        belongs to a head office somewhere far away. Useful, often excellent
        for users. But a country running its economy on them is a tenant, not
        an owner.
      </p>
      <p>
        Picture a gorgeous bank branch opening on your street — new jobs, shiny
        cards, dollars on tap. Now notice that the vault keys, the rulebook, and
        the currency all belong to a head office elsewhere. You <em>host</em> the
        money. You don't <em>own</em> it. That is the gap this stack closes.
      </p>
      <Callout kind="gold" label="the feeling we're after">
        Money that moves like the internet — instant, global, no permission
        slip — <strong>and is actually yours</strong>. Not a nicer branch of
        someone else's bank.
      </Callout>

      <H2 id="sv-gap" n={2}>What the old rails can't reach</H2>
      <Grid cols={2}>
        <Tile index="01 · COST" title="Sub-cent payments don't fit a card rail">
          A rail built for humans carries ~2–3% + a fixed fee. Fine for a $400
          flight; fatal for an agent (or a remittance) moving a fraction of a
          cent at a time. The toll costs more than the goods.
        </Tile>
        <Tile index="02 · CONTROL" title="A rented dollar can be switched off">
          A licensed, custodial dollar coin still sits with a custodian, can be
          frozen by its issuer, and stays pegged to someone else's currency.
          Great for users; for a nation it is renting, not owning.
        </Tile>
        <Tile index="03 · REACH" title="The unbanked aren't a 'future market'">
          Half the world already lives the pain — remittance fees that eat a
          day's wage, savings melting to inflation, accounts frozen by someone
          they'll never meet. They want money that's theirs.
        </Tile>
        <Tile index="04 · CUSTODY" title="Cross-border still routes through custodians">
          Correspondent banking and lock-and-mint bridges insert a trusted
          party at every hop. The whole point of this stack is to remove that
          party, not relocate it.
        </Tile>
      </Grid>

      <H2 id="sv-what" n={3}>What a sovereign stack means</H2>
      <p>
        Sovereignty here is not a slogan — it is a deployment property. A nation
        (or a community) gets the <em>whole</em> stack as open source: issue your
        own currency as a stablecoin, settle it over your own Lightning rails,
        clear cross-border without a custodial bridge, and wire compliance in at
        the layers your law requires. The contract is just the bookkeeping
        format; <strong>the sovereignty lives in who runs the consensus and the
        rails</strong>.
      </p>
      <Callout kind="amber" label="planned · direction, not a ship date">
        The full national-issuance path (lokachain-based L1, NeoBank suite,
        end-to-end cross-chain atomic settlement) is where this is heading, not
        a shipped product. Below, anything not yet live is tagged
        <span className="badge amber" style={{margin:'0 4px'}}>planned</span> or
        <span className="badge" style={{margin:'0 4px'}}>in dev</span>. The
        payment rail underneath it (BTC + SUI Lightning, L402, agent wallets) is
        already live.
      </Callout>

      <H2 id="sv-proof" n={4}>The three proofs</H2>
      <p className="muted">Why this is credible today, not just a pitch.</p>
      <Grid cols={3}>
        <div className="card">
          <h3>Zero-intrusion multi-chain <span className="badge green">live · BTC·SUI</span></h3>
          <p>
            Fork of <code>lightningnetwork/lnd</code> with BOLT / routing / HTLC
            switch left untouched; a chain plugs in as a ChainControl adapter,
            <code> --chain=sui</code> flips the settlement layer.
            <span className="badge amber" style={{marginLeft:6}}>EVM + USDT planned</span>
          </p>
        </div>
        <div className="card">
          <h3>Bridge-free atomic cross-chain <span className="badge amber">in dev</span></h3>
          <p>
            BTC ⇄ SUI by one SHA-256 preimage: both legs lock on the same hash,
            one secret settles both, timeout refunds. Custodial bridges have lost
            <code> $2.5B+</code>; the HTLC primitive has lost <code>$0</code>.
          </p>
        </div>
        <div className="card">
          <h3>Lightning channels on Move <span className="badge green">live</span></h3>
          <p>
            ~700 lines of Move enforce a BOLT channel state machine on Sui —
            force-close, breach penalty, directional HTLC table. Verifiability is
            written into the contract, not assumed.
          </p>
        </div>
      </Grid>
    </>
  );
}

/* ======================= ARCHITECTURE =========================== */
function SV_Architecture() {
  return (
    <>
      <H2 id="sv-arch-map" n={1}>The four layers <span className="badge amber">planned · overall</span></H2>
      <p>
        A national-currency stablecoin, end to end, is four layers: <strong>who
        mints it</strong>, <strong>how it's deployed</strong>, <strong>how it
        settles</strong>, and <strong>where compliance attaches</strong>. The
        diagram below is the target design — the rail at the bottom is live; the
        issuance L1 on top is the direction.
      </p>

      <Mermaid>{`
flowchart TB
  subgraph ISS["Issuance — lokachain L1 · planned"]
    direction LR
    i1["central bank / licensed issuer<br/>holds mint · burn"]
    i2["local-currency 1:1 reserve<br/>on-chain auditable"]
  end
  subgraph DEP["Deployment"]
    direction LR
    d1["default: one sovereign instance per nation"]
    d2["small states: shared instance → graduate out"]
  end
  subgraph SET["Settlement — Lightning · live (BTC·SUI)"]
    direction LR
    s1["channels: instant local clearing"]
    s2["cross-border: HTLC atomic swap · in dev"]
  end
  subgraph CMP["Compliance"]
    direction LR
    c1["KYC hook @ account layer"]
    c2["KYC hook @ fiat on/off-ramp"]
  end

  ISS --> SET
  DEP --> SET
  SET --> CMP
      `}</Mermaid>

      <H2 id="sv-issuance" n={2}>Issuance layer <span className="badge amber">planned</span></H2>
      <p>
        <strong>lokachain</strong> is envisioned as a stablecoin-native L1 (EVM
        compatible, Block-STM parallel execution). A central bank or designated
        issuer holds mint/burn; the local currency is issued 1:1 against reserves,
        with reserve and supply auditable on-chain.
      </p>
      <Callout kind="cyan" label="why a chain, not just a token">
        The token is still an EVM contract — the difference is <em>who runs the
        chain</em>. Validators are the central bank plus licensed domestic
        institutions; governance, upgrades, and the fee currency all stay inside
        the border. Issue on someone else's public chain and consensus, ordering,
        fees, and upgrade authority belong to them. <strong>The contract is just
        the ledger format; sovereignty is in the consensus layer.</strong>
      </Callout>

      <H2 id="sv-deploy" n={3}>Deployment shape</H2>
      <Grid cols={2}>
        <div className="card">
          <h3>One instance per nation <span className="badge amber">planned</span></h3>
          <p>
            Same codebase, each country runs its own — like each nation running
            its own RTGS. Cross-border interop is solved at the Lightning / HTLC
            layer, so <strong>more chains add no interop burden</strong> and no
            shared consensus is required.
          </p>
        </div>
        <div className="card">
          <h3>Shared instance to start <span className="badge amber">planned</span></h3>
          <p>
            A state without operating capacity can begin on a shared lokachain
            instance (coalition-validated), then "graduate" to its own chain once
            ready. Onboarding is the funnel; graduation is the sovereignty
            commitment.
          </p>
        </div>
      </Grid>

      <H2 id="sv-settle" n={4}>Settlement layer <span className="badge green">live · BTC·SUI</span></H2>
      <p>
        <strong>Lightning channels</strong> carry everyday high-frequency, small
        payments: the local stablecoin clears instantly inside channels and
        settles to chain periodically (net, not transaction-by-transaction).
        Cross-border runs over the
        <span className="badge amber" style={{margin:'0 4px'}}>in dev</span>
        HTLC atomic-swap corridor — local currency leaves, hard currency arrives
        on the far side, no custodial bridge in between.
      </p>

      <H2 id="sv-comply" n={5}>Compliance layer</H2>
      <table>
        <thead>
          <tr><th>Where</th><th>What it enforces</th><th>Status</th></tr>
        </thead>
        <tbody>
          <tr><td>Account layer (lokachain)</td><td>KYC on issuance &amp; large transfers</td><td><span className="badge amber">planned</span></td></tr>
          <tr><td>Fiat on/off-ramp</td><td>KYC at the exchange points (the real bottleneck)</td><td><span className="badge amber">planned</span></td></tr>
          <tr><td>In-channel small payments</td><td>Threshold-based exemption — inclusion + oversight</td><td><span className="badge amber">planned</span></td></tr>
          <tr><td>Risk / anti-fraud</td><td>Module calibrated on real corridor data</td><td><span className="badge amber">planned</span></td></tr>
        </tbody>
      </table>
      <Callout kind="cyan" label="reconciliation">
        Channel-level second-by-second clearing → periodic on-chain settlement.
        Reconciliation is dual-track: on-chain state commitment cross-checked
        against channel balance snapshots. Channel capital committed = the
        corridor's liquidity budget, sized to forecast remittance flow.
      </Callout>
    </>
  );
}

/* ========================= MARKETS ============================== */
function SV_Markets() {
  return (
    <>
      <H2 id="sv-why-em" n={1}>Why emerging markets first</H2>
      <p>
        Not because they're easy — because the pain is real and the incumbents
        can't reach it. These markets carry <strong>light infrastructure legacy,
        short regulatory chains, and the strongest appetite for a "don't rent a
        foreign platform" story</strong>. The wedge is sharpest where the old
        rails are weakest.
      </p>

      <H2 id="sv-regions" n={2}>LatAm · Africa · South/SE Asia</H2>
      <Grid cols={3}>
        <div className="card">
          <h3>Latin America</h3>
          <p>
            Bitcoin-as-legal-tender precedent, existing Lightning mindshare,
            dollarized economies. Remittances can top a fifth of GDP; the pain is
            corridor fees and dependence on custodial wallets.
          </p>
        </div>
        <div className="card">
          <h3>Africa</h3>
          <p>
            Highest mobile-money penetration in the world, but cross-border
            remittance averages ~8% and local currencies swing hard. A sovereign
            stablecoin + Lightning corridor replaces the correspondent-bank chain
            directly.
          </p>
        </div>
        <div className="card">
          <h3>South / SE Asia</h3>
          <p>
            Labor-export remittance corridors plus large unbanked populations.
            The NeoBank suite becomes a digital-inclusion on-ramp, not just a
            payment pipe.
          </p>
        </div>
      </Grid>

      <H2 id="sv-logic" n={3}>The wedge logic</H2>
      <p>
        Start with 1–2 flagship nations, produce a citable case, then replicate
        sideways. The same code that an agent developer <code>git clone</code>s to
        accept micropayments is what a central bank deploys to issue its own
        money — one stack, two economies the incumbents structurally can't serve.
      </p>
      <Callout kind="gold" label="for investors, in one line">
        We don't fight Visa for retail checkout — that's its home turf. We own the
        two markets it can't enter: the machine-to-machine economy and
        sovereign / emerging-market money infrastructure. Picks-and-shovels for
        two long waves.
      </Callout>
    </>
  );
}

/* ============================ MOAT ============================== */
function SV_Moat() {
  return (
    <>
      <H2 id="sv-moat" n={1}>The real moat</H2>
      <p>
        The code is open source — so the defensibility isn't the code. A payment
        business is defended by <strong>three things only real operation can
        accumulate</strong>. Open the source; you still can't clone these.
      </p>

      <H2 id="sv-liq" n={2}>Corridor liquidity</H2>
      <p>
        A "corridor" is the total flow between two countries (US → El Salvador
        runs into the billions a year). Lightning is P2P — anyone can open a
        channel, and there are many paths between two points. The barrier isn't
        owning a path; it's that <strong>remittance is one-directional</strong>:
        channel balance drains toward the receiving side, so serving a corridor
        means continuously committing capital and rebalancing it. The liquidity a
        first mover sinks in, and how efficiently it rebalances, is the
        late-comer's cold-start cost.
      </p>

      <H2 id="sv-data" n={3}>Operating data</H2>
      <p>
        Real route-success rates, fee elasticity, failure/retry patterns, traffic
        peaks and troughs — used to calibrate fee estimation, channel rebalancing,
        and a
        <span className="badge amber" style={{margin:'0 4px'}}>planned</span>
        risk / anti-fraud model. None of these parameters live in public code;
        they only emerge from running the rail.
      </p>

      <H2 id="sv-lic" n={4}>On/off-ramp &amp; licensing</H2>
      <p>
        On-chain transfer is only the middle. The real bottleneck is at the two
        ends — fiat in, local-currency / mobile-money out — which needs licensed
        local partners and integrations. Agreements with central banks and
        licensed institutions, and the compliance corridors built with them,
        replicate on a timescale measured in years.
      </p>
      <Callout kind="gold" label="the one-liner">
        What's open source is the code. What isn't open-sourceable is the
        liquidity and the relationships.
      </Callout>
    </>
  );
}

/* ========================== NEOBANK ============================= */
function SV_NeoBank() {
  return (
    <>
      <H2 id="sv-nb" n={1}>Sovereign financial services <span className="badge amber">planned</span></H2>
      <p>
        On top of the payment rail, a white-label <strong>NeoBank</strong> suite
        for partner nations: local-currency stablecoin issuance &amp; exchange,
        Lightning cross-border remittance, merchant acceptance (L402 / scan-to-pay),
        and compliance / risk modules. Delivered white-label, operated by a
        licensed local entity.
      </p>
      <Callout kind="cyan" label="where it starts today">
        The account layer already exists: <code>agents-pay-service</code> —
        per-agent / per-user isolated custodial wallets behind a clean REST API —
        is the live starting point the NeoBank suite builds on.
      </Callout>

      <H2 id="sv-phases" n={2}>Three-phase roadmap</H2>
      <div className="stack-diagram">
        <div className="stack-row">
          <div className="layer-label">PHASE 1 <span className="badge green">now</span></div>
          <div className="layer-box">
            <span className="dot"></span>
            <span className="ttl">Narrative + developer onboarding</span>
            <span className="desc">— open rail, docs, demo; seed merchants × seed agents close the loop</span>
          </div>
        </div>
        <div className="stack-row">
          <div className="layer-label">PHASE 2 <span className="badge amber">planned</span></div>
          <div className="layer-box">
            <span className="dot"></span>
            <span className="ttl">Sovereign wedge + NeoBank pilot</span>
            <span className="desc">— private-deploy the stack for a flagship nation; build the network-asset moat</span>
          </div>
        </div>
        <div className="stack-row">
          <div className="layer-label">PHASE 3 <span className="badge amber">planned</span></div>
          <div className="layer-box">
            <span className="dot"></span>
            <span className="ttl">Verifiable payment &amp; finance infrastructure</span>
            <span className="desc">— settlement API + NeoBank revenue + network flywheel (building toward)</span>
          </div>
        </div>
      </div>
      <p className="muted" style={{fontSize:'12.5px'}}>
        Targets for institution / nation / agent-platform counts are vision goals,
        stated as "building toward," not commitments.
      </p>

      <H2 id="sv-oss" n={3}>Open source, no lock-in</H2>
      <p>
        The whole stack stays open: node, agent wallets, L402 gateway, CLI — no
        license fee, no vendor lock-in. A nation adopts it the way a developer
        adopts any open-source dependency, and can walk away with it.
      </p>
      <Callout kind="gold" label="the thesis, compressed">
        Sovereignty you can <code>git clone</code>. The second road to "sovereign"
        money: not renting a foreign dollar and hosting it, but running your own
        currency, on your own rails, that nobody can quietly switch off.
      </Callout>
    </>
  );
}

window.PageSovereign = PageSovereign;
