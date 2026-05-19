/* ====================================================================
   Ecosystem — other repos in the loka-network org
   ==================================================================== */

const ECO = [
  {
    id: 'aegean',
    name: 'aegean-consensus',
    tagline: 'BFT consensus protocol for multi-agent LLM systems',
    description: 'A research-oriented consensus protocol for coordinating populations of LLM agents (AutoGen, OpenClaw frameworks) — orthogonal to chain consensus, used when agents themselves must reach agreement.',
    repo: 'https://github.com/loka-network/aegean-consensus',
    tags: ['research', 'multi-agent', 'consensus'],
  },
  {
    id: 'zk',
    name: 'loka-zk-middleware',
    tagline: 'ZKP Payment proof and verify in Loka Payment Protocol',
    description: 'Zero-knowledge middleware that lets agents prove payment without revealing the underlying invoice, preimage, or wallet — used as an attestation layer between Prism and downstream auditors.',
    repo: 'https://github.com/loka-network/loka-zk-middleware',
    tags: ['ZKP', 'attestation', 'middleware'],
  },
  {
    id: 'nostr',
    name: 'loka-nostr-middleware',
    tagline: 'High-performance scalable Nostr relay (Rust) for the Loka payment stack',
    description: 'A Rust-based Nostr relay tuned for agent-to-agent signalling and event coordination around payment flows — invoice broadcast, settlement notifications, agent discovery.',
    repo: 'https://github.com/loka-network/loka-nostr-middleware',
    tags: ['Nostr', 'Rust', 'p2p signalling'],
  },
  {
    id: 'did',
    name: 'agent-did-8004',
    tagline: 'Sign-in with Agent in the Loka ecosystem',
    description: 'ERC-8004 style decentralised identifier scheme adapted for AI agents — pair a DID with a wallet, scope sessions, prove capabilities cryptographically across the stack.',
    repo: 'https://github.com/loka-network/agent-did-8004',
    tags: ['DID', 'ERC-8004', 'agent identity'],
  },
  {
    id: 'cometbft',
    name: 'cometbft',
    tagline: 'Distributed BFT state-machine replication engine (CometBFT fork)',
    description: 'A fork and successor to Tendermint Core, used as a building block in some loka-chain configurations.',
    repo: 'https://github.com/loka-network/cometbft',
    tags: ['consensus', 'fork'],
  },
  {
    id: 'loadtest',
    name: 'loka-loadtest',
    tagline: 'Load-testing tool for loka-chain',
    description: 'Stress-test the NeoBFT + Block-STM pipeline against varied transaction workloads. Used for the published TPS / latency benchmarks.',
    repo: 'https://github.com/loka-network/loka-loadtest',
    tags: ['benchmark', 'test infra'],
  },
];

function PageEcosystem({ sub, setSub, registerSections }) {
  useEffect(() => {
    registerSections([
      { title: 'Ecosystem', items: [
        { id: 'eco-intro', label: 'Beyond the core five' },
        { id: 'eco-list',  label: 'Repositories' },
      ]},
    ]);
  }, []);

  return (
    <>
      <ProjectHero
        eyebrow="++ · Ecosystem"
        title="Around the core five"
        subtitle="Adjacent projects in the loka-network organisation that ride on, extend, or support the core payment stack. Linked here for navigation — each has its own README in the repo."
        repo="https://github.com/loka-network"
        stats={[
          { v: ECO.length.toString(), k: 'projects featured' },
          { v: 'orbit', k: 'around core' },
        ]}
      />

      <p id="eco-intro" className="muted" style={{marginTop: 16}}>
        The five projects in the main tabs are the load-bearing pillars of the
        Loka Payment stack. The repos below extend it in specific directions —
        identity, attestation, signalling, consensus, observability — and
        are documented in their own READMEs. Click through for the deep dive.
      </p>

      <div className="divider" id="eco-list">repositories · click to open on GitHub</div>

      <div className="grid cols-2">
        {ECO.map(p => (
          <a key={p.id} href={p.repo} target="_blank" rel="noopener"
             className="tile clickable" style={{ textDecoration: 'none' }}>
            <div className="index">{p.tags.join(' · ')}</div>
            <h3 style={{color: 'var(--gold)'}}>{p.name}<span className="arrow">↗</span></h3>
            <p style={{color: 'var(--fg-1)', fontWeight: 500, marginTop: 4}}>{p.tagline}</p>
            <p style={{marginTop: 8}}>{p.description}</p>
          </a>
        ))}
      </div>

      <div className="card" style={{marginTop: 32}}>
        <h3>Want the full org listing?</h3>
        <p style={{margin: '4px 0 0'}}>
          Browse all repositories under{' '}
          <a className="link" href="https://github.com/loka-network" target="_blank">github.com/loka-network</a>{' '}
          — the org is active across consensus, settlement, observability, and AI-agent
          coordination research. The five entries on this site's top nav are the ones an
          integrator needs to know first.
        </p>
      </div>
    </>
  );
}

window.PageEcosystem = PageEcosystem;
