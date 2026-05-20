/* ====================================================================
   APP — sidebar-based shell with collapsible 2-level project tree.
   No top nav; brand + tree + theme/star CTA all live in the sidebar.
   ==================================================================== */

const PROJECTS = [
  {
    id: 'overview', label: 'Overview', group: 'start',
    repo: 'https://github.com/loka-network',
    Component: window.PageOverview,
    subs: [
      { id: 'intro',    label: 'Introduction' },
      { id: 'stack',    label: 'Tech Stack' },
      { id: 'dataflow', label: 'Data Flow' },
    ],
  },
  {
    id: 'paycli', label: 'Pay CLI', group: 'projects',
    repo: 'https://github.com/loka-network/paycli',
    skill: 'https://raw.githubusercontent.com/loka-network/paycli/main/skill/SKILL.md',
    skillName: 'paycli.SKILL.md',
    Component: window.PagePaycli,
    subs: [
      { id: 'overview', label: 'Overview' },
      { id: 'install',  label: 'Install & Init' },
      { id: 'routes',   label: 'Custody Routes' },
      { id: 'commands', label: 'Commands' },
      { id: 'skill',    label: 'AI Agent Skill' },
      { id: 'mcp',      label: 'MCP Server' },
    ],
  },
  {
    id: 'prism', label: 'L402 Gateway', group: 'projects',
    repo: 'https://github.com/loka-network/loka-prism-l402',
    Component: window.PagePrism,
    subs: [
      { id: 'overview',   label: 'Overview' },
      { id: 'register',   label: 'Register on hosted gateway' },
      { id: 'protocols',  label: 'Payment Protocols' },
      { id: 'config',     label: 'Configuration' },
      { id: 'admin',      label: 'Admin · CLI · MCP' },
      { id: 'ratelimits', label: 'Rate Limiting' },
    ],
  },
  {
    id: 'aps', label: 'Agent Wallets', group: 'projects',
    repo: 'https://github.com/loka-network/agents-pay-service',
    skill: 'https://raw.githubusercontent.com/loka-network/agents-pay-service/loka/skill/loka_pay_skill.md',
    skillName: 'loka_pay_skill.md',
    Component: window.PageAps,
    subs: [
      { id: 'overview', label: 'Overview' },
      { id: 'concepts', label: 'Concepts' },
      { id: 'security', label: 'Security · TEE · ZK' },
      { id: 'install',  label: 'Install & Run' },
      { id: 'api',      label: 'REST API' },
      { id: 'skill',    label: 'AI Agent Skill' },
    ],
  },
  {
    id: 'lnd', label: 'Lightning Node', group: 'projects',
    repo: 'https://github.com/loka-network/loka-p2p-lnd',
    skill: 'https://raw.githubusercontent.com/loka-network/loka-p2p-lnd/main/SKILL/loka-agentic-payment/SKILL.md',
    skillName: 'loka-agentic-payment.SKILL.md',
    Component: window.PageLnd,
    subs: [
      { id: 'overview',     label: 'Overview' },
      { id: 'architecture', label: 'Architecture' },
      { id: 'htlc',         label: 'HTLC Atomic Swap' },
      { id: 'evm-usdt',     label: 'USDT on EVM' },
      { id: 'quickstart',   label: 'Quick Start' },
      { id: 'skill',        label: 'AI Agent Skill' },
      { id: 'reference',    label: 'Reference' },
    ],
  },
  {
    id: 'chain', label: 'Settlement Chain', group: 'projects',
    repo: 'https://github.com/loka-network/loka-chain',
    Component: window.PageChain,
    subs: [
      { id: 'overview',  label: 'Multi-chain Overview' },
      { id: 'btc',       label: 'Bitcoin' },
      { id: 'sui',       label: 'SUI' },
      { id: 'evm',       label: 'EVM Chains' },
      { id: 'lokachain', label: 'loka-chain' },
    ],
  },
  {
    id: 'sdk', label: 'SDK · Go', group: 'more',
    repo: 'https://github.com/loka-network/paycli',
    Component: window.PageSdk,
    subs: [
      { id: 'overview',   label: 'Overview' },
      { id: 'install',    label: 'Install' },
      { id: 'quickstart', label: 'Quickstart' },
      { id: 'wallet',     label: 'Wallet interface' },
      { id: 'l402',       label: 'L402Doer' },
      { id: 'examples',   label: 'Examples' },
    ],
  },
  {
    id: 'ecosystem', label: 'Ecosystem', group: 'more',
    repo: 'https://github.com/loka-network',
    Component: window.PageEcosystem,
    subs: [],
  },
];

const GROUP_LABELS = {
  start:    'Start here',
  projects: 'Projects',
  more:     'More',
};

window.PROJECT_BY_ID = Object.fromEntries(PROJECTS.map(p => [p.id, p]));

function App() {
  const parseHash = () => {
    const h = (window.location.hash || '').replace(/^#/, '');
    if (!h) return { project: 'overview', sub: null, anchor: null };
    const [path, anchor] = h.split('#');
    const [project, sub] = path.split('/');
    return { project: project || 'overview', sub: sub || null, anchor: anchor || null };
  };

  const [route, setRoute] = useState(parseHash);

  // expanded sidebar groups — default = current project only
  const [expanded, setExpanded] = useState(() => new Set([parseHash().project]));

  // ---- theme ----
  const initialTheme = (() => {
    try { return localStorage.getItem('loka-theme') || 'dark'; } catch (e) { return 'dark'; }
  })();
  const [theme, setTheme] = useState(initialTheme);
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('loka-theme', theme); } catch (e) {}
    if (window.__setLokaTheme) window.__setLokaTheme(theme);
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const onHash = () => {
      const r = parseHash();
      setRoute(r);
      setExpanded(prev => { const s = new Set(prev); s.add(r.project); return s; });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [route.project, route.sub]);

  useEffect(() => {
    if (route.anchor) {
      const el = document.getElementById(route.anchor);
      if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 30);
    }
  }, [route.anchor, route.sub, route.project]);

  const goProj = (id) => { window.location.hash = id; };
  const goSub = (projId, subId) => { window.location.hash = `${projId}/${subId}`; };
  const toggleProj = (id) => {
    setExpanded(prev => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id); else s.add(id);
      return s;
    });
  };

  const proj = PROJECTS.find(p => p.id === route.project) || PROJECTS[0];
  const PageComp = proj.Component;

  // mobile drawer state (sidebar slides in on < 760px)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useEffect(() => { setMobileNavOpen(false); }, [route.project, route.sub]);

  return (
    <div className={`shell ${mobileNavOpen ? 'mobile-nav-open' : ''}`}>
      <button
        className="mobile-nav-toggle"
        onClick={() => setMobileNavOpen(v => !v)}
        aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}>
        {mobileNavOpen ? (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18M3 12h18M3 18h18"/>
          </svg>
        )}
      </button>
      {mobileNavOpen && <div className="mobile-nav-scrim" onClick={() => setMobileNavOpen(false)} />}
      <DocSidebar
        projects={PROJECTS}
        groupLabels={GROUP_LABELS}
        route={route}
        expanded={expanded}
        onNav={(p, s) => s ? goSub(p, s) : goProj(p)}
        onToggle={toggleProj}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="content">
        <div className="inner">
          <PageComp
            sub={route.sub}
            setSub={(s) => goSub(route.project, s)}
            registerSections={() => {}}
            jump={() => {}}
          />
        </div>
      </main>
    </div>
  );
}

/* ---------------- DocSidebar ------------------------------------ */
function DocSidebar({ projects, groupLabels, route, expanded, onNav, onToggle, theme, onToggleTheme }) {
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const q = query.trim().toLowerCase();
  const matches = (s) => s && s.toLowerCase().includes(q);

  // group projects by their `group` key, then optionally filter
  const groups = {};
  for (const p of projects) {
    // when searching, only include the project if name matches OR any sub matches
    if (q) {
      const projHit = matches(p.label) || matches(p.id);
      const subHits = (p.subs || []).filter(s => matches(s.label) || matches(s.id));
      if (!projHit && subHits.length === 0) continue;
      const filteredProj = projHit ? p : { ...p, subs: subHits };
      (groups[p.group] = groups[p.group] || []).push(filteredProj);
    } else {
      (groups[p.group] = groups[p.group] || []).push(p);
    }
  }
  const groupOrder = Object.keys(groupLabels);
  const totalShown = Object.values(groups).reduce((n, arr) => n + arr.length, 0);

  // Keyboard shortcut: '/' or 'cmd+k' focuses search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) &&
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setQuery('');
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <aside className="docnav">
      <a className="docnav-brand" href="#overview"
         onClick={(e) => { e.preventDefault(); onNav('overview'); }}>
        <span className="mark"></span>
        <span className="name">LOKA <span>PAYMENT</span></span>
      </a>

      <div className="docnav-search">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor"
             strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          ref={searchRef}
          type="text"
          placeholder="Search docs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query
          ? <button className="docnav-search-clear" onClick={() => setQuery('')}
                    aria-label="Clear search"
                    title="Clear">×</button>
          : <span className="docnav-search-kbd" aria-hidden="true">/</span>}
      </div>

      <div className="docnav-tree">
        {q && totalShown === 0 && (
          <div className="docnav-empty">
            No matches for <code>{query}</code>
          </div>
        )}
        {groupOrder.map(g => {
          const items = groups[g] || [];
          if (!items.length) return null;
          return (
          <div key={g} className="docnav-group">
            <div className="docnav-group-label">{groupLabels[g]}</div>
            {items.map(p => {
              const isExpanded = q ? true : expanded.has(p.id);
              const isActive = route.project === p.id;
              const hasSubs = p.subs && p.subs.length > 0;
              return (
                <div key={p.id} className="docnav-item-wrap">
                  <button
                    className={`docnav-item ${isActive ? 'active' : ''} ${hasSubs ? 'has-subs' : ''}`}
                    onClick={() => {
                      onNav(p.id);
                      if (hasSubs && !isExpanded) onToggle(p.id);
                    }}
                  >
                    <span className="label">{p.label}</span>
                    {hasSubs && (
                      <span
                        className={`chev ${isExpanded ? 'open' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onToggle(p.id); }}
                        role="button"
                        aria-label={isExpanded ? 'collapse' : 'expand'}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 6 15 12 9 18"/>
                        </svg>
                      </span>
                    )}
                  </button>
                  {hasSubs && isExpanded && (
                    <div className="docnav-subs">
                      {p.subs.map((s, i) => {
                        const subActive = isActive && (route.sub === s.id || (!route.sub && i === 0));
                        return (
                          <button
                            key={s.id}
                            className={`docnav-sub ${subActive ? 'active' : ''}`}
                            onClick={() => onNav(p.id, s.id)}>
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>);
        })}
      </div>

      <div className="docnav-footer">
        <a className="docnav-foot-btn" href="https://github.com/loka-network/loka-p2p-lnd"
           target="_blank" rel="noopener" title="loka-network/loka-p2p-lnd">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
          </svg>
        </a>
        <a className="docnav-foot-btn" href="https://x.com/lokachain"
           target="_blank" rel="noopener" title="@lokachain on X">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/>
          </svg>
        </a>
        <span className="docnav-foot-divider"></span>
        <button
          className="docnav-foot-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          aria-label="Toggle theme">
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
