/* ====================================================================
   PRIMITIVES — shared rendering helpers exported to window for use
   across content-*.jsx files.
   ==================================================================== */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ---------------- Mermaid setup --------------------------------- */
const MERMAID_THEMES = {
  dark: {
    background:'#07090f',  primaryColor:'#101a32',     primaryTextColor:'#e6eaf5',
    primaryBorderColor:'#FFD86B', lineColor:'#5EEAD4', secondaryColor:'#0e1424',
    tertiaryColor:'#161f33',      tertiaryTextColor:'#e6eaf5',
    mainBkg:'#10172c',     altBackground:'#0e1424',    textColor:'#e6eaf5',
    nodeBorder:'#FFD86B',  clusterBkg:'#0a0f1a',       clusterBorder:'#2a3760',
    actorBkg:'#0e1424',    actorBorder:'#FFD86B',      actorTextColor:'#FFD86B',
    actorLineColor:'#2a3760', signalColor:'#cdd5e8',   signalTextColor:'#cdd5e8',
    labelBoxBkgColor:'#0e1424', labelBoxBorderColor:'#FFD86B', labelTextColor:'#FFD86B',
    loopTextColor:'#5EEAD4', noteBkgColor:'#0e1424',   noteBorderColor:'#5EEAD4',
    noteTextColor:'#cdd5e8', activationBkgColor:'#FFD86B', activationBorderColor:'#FFD86B',
  },
  light: {
    background:'#fbf8ef',  primaryColor:'#fffaeb',     primaryTextColor:'#1a1d2a',
    primaryBorderColor:'#a8780a', lineColor:'#0a7d6d', secondaryColor:'#f5f1e3',
    tertiaryColor:'#ffffff',      tertiaryTextColor:'#1a1d2a',
    mainBkg:'#fffaeb',     altBackground:'#f5f1e3',    textColor:'#1a1d2a',
    nodeBorder:'#a8780a',  clusterBkg:'#f5f1e3',       clusterBorder:'#c9c0a3',
    actorBkg:'#fffaeb',    actorBorder:'#a8780a',      actorTextColor:'#a8780a',
    actorLineColor:'#c9c0a3', signalColor:'#2e3344',   signalTextColor:'#2e3344',
    labelBoxBkgColor:'#fffaeb', labelBoxBorderColor:'#a8780a', labelTextColor:'#a8780a',
    loopTextColor:'#0a7d6d', noteBkgColor:'#fffaeb',   noteBorderColor:'#0a7d6d',
    noteTextColor:'#2e3344', activationBkgColor:'#a8780a', activationBorderColor:'#a8780a',
  },
};

let currentThemeName = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme')) || 'dark';
window.__setLokaTheme = (name) => {
  currentThemeName = name;
  if (window.mermaid) {
    try {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        securityLevel: 'loose',
        themeVariables: { fontFamily:'"JetBrains Mono","Fira Code",monospace', fontSize:'14px', ...MERMAID_THEMES[name] },
        flowchart: { curve: 'basis', htmlLabels: true, padding: 18, nodeSpacing: 36, rankSpacing: 54 },
        sequence: { diagramMarginX: 28, diagramMarginY: 12, actorMargin: 56, boxMargin: 10, noteMargin: 8, messageMargin: 32, mirrorActors: false },
      });
    } catch (e) {}
  }
  // Force re-render of all Mermaid components by bumping the global theme key
  window.__lokaThemeKey = (window.__lokaThemeKey || 0) + 1;
  window.dispatchEvent(new CustomEvent('loka-theme-change'));
};

let mermaidReady = null;
function ensureMermaid() {
  if (mermaidReady) return mermaidReady;
  mermaidReady = new Promise((resolve) => {
    const tick = () => {
      if (window.mermaid && typeof window.mermaid.render === 'function') {
        window.__setLokaTheme(currentThemeName);
        resolve(window.mermaid);
      } else {
        setTimeout(tick, 80);
      }
    };
    tick();
  });
  return mermaidReady;
}

function extractText(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && children.props && children.props.children !== undefined) {
    return extractText(children.props.children);
  }
  return '';
}

function Mermaid({ children, src: srcProp }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [themeRev, setThemeRev] = useState(0);
  const src = (srcProp || extractText(children) || '').trim();

  useEffect(() => {
    const onChange = () => setThemeRev(r => r + 1);
    window.addEventListener('loka-theme-change', onChange);
    return () => window.removeEventListener('loka-theme-change', onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!src) return;
    ensureMermaid().then((m) => {
      if (cancelled) return;
      const id = 'mmd-' + Math.random().toString(36).slice(2, 9);
      return m.render(id, src).then((res) => {
        if (!cancelled) setSvg(res.svg);
      });
    }).catch((e) => {
      if (!cancelled) setError(String((e && e.message) || e));
    });
    return () => { cancelled = true; };
  }, [src, themeRev]);

  if (error) {
    return <pre className="terminal" style={{borderColor:'var(--red)',color:'var(--red)'}}>{error}{'\n\n'}{src}</pre>;
  }
  if (!svg) {
    return <div className="mermaid-wrap loading"></div>;
  }
  return <div className="mermaid-wrap" dangerouslySetInnerHTML={{__html: svg}} />;
}

/* ---------------- Code block with simple syntax shading ---------- */
function Code({ children, lang }) {
  // Render text untouched; the CSS styles only the language label.
  const raw = typeof children === 'string' ? children : children;
  return (
    <pre className="terminal" data-lang={lang || ''}>
      {raw}
    </pre>
  );
}

/* ---------------- ASCII diagram (no syntax-highlighting yet) ----- */
function Ascii({ children }) {
  return <div className="ascii">{children}</div>;
}

/* ---------------- Callout boxes ---------------------------------- */
function Callout({ kind = 'gold', label, children }) {
  return (
    <div className={`callout ${kind === 'cyan' ? 'info' : kind === 'amber' ? 'warn' : ''}`}>
      {label && <div className="label">{label}</div>}
      <div>{children}</div>
    </div>
  );
}

/* ---------------- Card / Tile ------------------------------------ */
function Tile({ index, title, children, onClick, meta }) {
  return (
    <div className={`tile ${onClick ? 'clickable' : ''}`} onClick={onClick}>
      {index && <div className="index">{index}</div>}
      <h3>{title}{onClick && <span className="arrow">→</span>}</h3>
      <p>{children}</p>
      {meta && <div className="meta">{meta}</div>}
    </div>
  );
}

/* ---------------- Headings with hash anchor ---------------------- */
function H2({ id, n, children }) {
  return (
    <h2 id={id}>
      {n != null && <span className="hash">#{String(n).padStart(2, '0')}</span>}
      {children}
    </h2>
  );
}

/* ---------------- Project Hero ----------------------------------- */
function ProjectHero({ eyebrow, title, subtitle, repo, skill, skillName, stats, figure }) {
  const repoSlug = repo ? repo.replace(/^https?:\/\/github\.com\//, '') : null;
  return (
    <>
      {eyebrow && <div className="eyebrow">{eyebrow}</div>}
      <div className={`proj-hero ${figure ? 'has-figure' : ''}`}>
        <div className="proj-hero__main">
          <h1 className="page">{title}</h1>
          <div className="subtitle">{subtitle}</div>
          <div className="proj-hero__ctas">
            {repo && <StarCta repo={repo} repoSlug={repoSlug} />}
            {skill && <SkillInstallButton url={skill} name={skillName} />}
          </div>
        </div>
        {figure && <div className="proj-hero__figure">{figure}</div>}
        {stats && (
          <div className="stats">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="v">{s.v}</div>
                <div>{s.k}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function SkillInstallButton({ url, name }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(null);   // id of the tool just copied
  const ref = useRef(null);
  const safeName = (name || 'SKILL.md').replace(/[^a-zA-Z0-9._-]/g, '_');
  const skillDir = safeName.replace(/\.md$/, '').replace(/\.SKILL$/, '');

  // Close on outside click / Esc
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey  = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Tool registry — name, logo, install command template
  const TOOLS = [
    {
      id: 'claude', label: 'Claude Code',
      hint: '~/.claude/skills/',
      logo: (
        <svg viewBox="0 0 32 32" width="16" height="16" fill="currentColor">
          <path d="M5 16c0-4.5 3-8.5 7.5-10C13.5 4 14.5 3 16 3c4.5 0 8.5 3 10 7.5 1 1 2 2 2 3.5 0 4.5-3 8.5-7.5 10-1 2-2 3-3.5 3-4.5 0-8.5-3-10-7.5C6 18.5 5 17.5 5 16zm10.5-6.5l-3 8 1 .5 3-8-1-.5zm-1.5 4l1.5 1.5-1.5 1.5L13 15l1-1.5zm5 0l-1 1.5 1.5 1.5L21 15l-1.5-1.5z"/>
        </svg>
      ),
      cmd: `mkdir -p ~/.claude/skills/${skillDir} && curl -fsSL ${url} -o ~/.claude/skills/${skillDir}/SKILL.md`,
    },
    {
      id: 'openclaw', label: 'OpenClaw',
      hint: '~/.openclaw/skills/',
      logo: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 11c0-2.5 1.5-4.5 4-5"/>
          <path d="M8 14c-1.5-1.5-2-3.5-1.5-5.5"/>
          <path d="M19 11c0-2.5-1.5-4.5-4-5"/>
          <path d="M16 14c1.5-1.5 2-3.5 1.5-5.5"/>
          <path d="M5 12c0 4 3 7 7 7s7-3 7-7"/>
          <circle cx="12" cy="14" r="1" fill="currentColor"/>
        </svg>
      ),
      cmd: `mkdir -p ~/.openclaw/skills/${skillDir} && curl -fsSL ${url} -o ~/.openclaw/skills/${skillDir}/SKILL.md`,
    },
    {
      id: 'codex', label: 'Codex CLI',
      hint: '~/.codex/skills/',
      logo: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      ),
      cmd: `mkdir -p ~/.codex/skills/${skillDir} && curl -fsSL ${url} -o ~/.codex/skills/${skillDir}/SKILL.md`,
    },
    {
      id: 'cursor', label: 'Cursor',
      hint: '.cursor/rules/',
      logo: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M3 4l9 5.5L21 4 12 22 3 4z" opacity="0.85"/>
        </svg>
      ),
      cmd: `mkdir -p .cursor/rules && curl -fsSL ${url} -o .cursor/rules/${skillDir}.md`,
    },
    {
      id: 'mcp', label: 'Generic MCP / stdout',
      hint: 'print to terminal',
      logo: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="4 17 10 11 4 5"/>
          <line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
      ),
      cmd: `curl -fsSL ${url}`,
    },
  ];

  const copyCmd = async (tool, e) => {
    if (e) e.preventDefault();
    try {
      await navigator.clipboard.writeText(tool.cmd);
    } catch (err) {
      const t = document.createElement('textarea');
      t.value = tool.cmd; document.body.appendChild(t);
      t.select(); document.execCommand('copy'); t.remove();
    }
    setCopied(tool.id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="skill-cta" ref={ref}>
      <a className="skill-cta__view" href={url} target="_blank" rel="noopener"
         title="View raw SKILL.md on GitHub">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="9" y1="13" x2="15" y2="13"/>
          <line x1="9" y1="17" x2="13" y2="17"/>
        </svg>
        <span>SKILL.md</span>
      </a>
      <button className={`skill-cta__action ${open ? 'open' : ''}`}
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              title="Install in your agent runtime">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        <span>Install skill</span>
        <span className="skill-cta__hint">— for AI agents</span>
        <svg className="skill-cta__chev" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="skill-pop">
          <div className="skill-pop__title">
            Copy install command for:
          </div>
          {TOOLS.map(t => (
            <button key={t.id} className="skill-pop__row"
                    onClick={(e) => copyCmd(t, e)}>
              <span className="skill-pop__logo">{t.logo}</span>
              <span className="skill-pop__name">{t.label}</span>
              <span className="skill-pop__path">{t.hint}</span>
              <span className="skill-pop__copy">
                {copied === t.id ? (
                  <>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="11" height="11" rx="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copy
                  </>
                )}
              </span>
            </button>
          ))}
          <div className="skill-pop__foot">
            Same SKILL.md, different runtimes. Open the raw file on GitHub to read it.
          </div>
        </div>
      )}
    </div>
  );
}

function StarCta({ repo, repoSlug }) {
  return (
    <div className="star-cta">
      <a className="star-cta__repo" href={repo} target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
        </svg>
        <span className="star-cta__slug">{repoSlug || 'loka-network'}</span>
      </a>
      <a className="star-cta__action"
         href={repo + (repo.includes('/loka-network') && !repo.endsWith('/loka-network') ? '' : '')}
         target="_blank" rel="noopener" title="Star on GitHub">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <span>Star</span>
        <span className="star-cta__hint">— support this project</span>
      </a>
    </div>
  );
}

/* ---------------- SubTabs (legacy — sidebar now drives nav) ------ */
function SubTabs({ tabs, active, onChange }) {
  return null;
}

/* ---------------- Sidebar — auto-generated from page outline ---- */
function Sidebar({ sections, active, onJump }) {
  return (
    <aside className="sidebar">
      {sections.map((sec, si) => (
        <div key={si}>
          <h4>{sec.title}</h4>
          {sec.items.map((it) => (
            <a
              key={it.id}
              className={active === it.id ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onJump(it.id); }}
              href={`#${it.id}`}>
              {it.label}
            </a>
          ))}
        </div>
      ))}
    </aside>
  );
}

/* ---------------- Two-column grid helper ------------------------- */
function Grid({ cols = 2, children }) {
  return <div className={`grid cols-${cols}`}>{children}</div>;
}

Object.assign(window, {
  Code, Ascii, Callout, Tile, H2, ProjectHero, SubTabs, Sidebar, Grid, Mermaid,
});
