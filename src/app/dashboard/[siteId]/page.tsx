'use client';

import { useEffect, useRef, useState, use } from 'react';
import JSZip from 'jszip';
import { createClient } from '@/lib/supabase/client';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import Link from 'next/link';

/* ─── Types ──────────────────────────────────────────────────────────────────── */

interface Site {
  id: string;
  name: string;
  subdomain: string;
}

interface SiteFile {
  id: string;
  file_path: string;
  content: string;
}

interface Generation {
  id: string;
  prompt: string;
  created_at: string;
}

type DeviceWidth = '100%' | '768px' | '390px';
type RightPanel = 'preview' | 'code';

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

function fileDotColor(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  if (ext === 'html') return 'bg-orange-500';
  if (ext === 'css') return 'bg-blue-500';
  if (ext === 'js') return 'bg-yellow-500';
  return 'bg-zinc-500';
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit', minute: '2-digit',
  });
}

/* ─── Icons ──────────────────────────────────────────────────────────────────── */

function MonitorIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

function TabletIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function SiteEditorPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = use(params);
  const supabase = createClient();

  const [site, setSite] = useState<Site | null>(null);
  const [files, setFiles] = useState<SiteFile[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>('100%');
  const [rightPanel, setRightPanel] = useState<RightPanel>('preview');
  const [iframeKey, setIframeKey] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const [siteRes, filesRes, gensRes] = await Promise.all([
        supabase.from('sites').select('id, name, subdomain').eq('id', siteId).single(),
        supabase.from('site_files').select('id, file_path, content').eq('site_id', siteId),
        supabase.from('generations').select('id, prompt, created_at').eq('site_id', siteId).order('created_at', { ascending: true }),
      ]);
      if (siteRes.data) setSite(siteRes.data as Site);
      if (filesRes.data) {
        setFiles(filesRes.data as SiteFile[]);
        if (filesRes.data.length > 0) setSelectedFile((filesRes.data[0] as SiteFile).file_path);
      }
      if (gensRes.data) setGenerations(gensRes.data as Generation[]);
    }
    load();
  }, [siteId]);

  // Scroll chat to bottom when generations change
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [generations, isGenerating]);

  async function handleDownload() {
    if (!site) return;
    const zip = new JSZip();
    files.forEach((f) => zip.file(f.file_path, f.content));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${site.name}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSend(prompt: string) {
    if (!prompt.trim()) return;
    setEditError(null);
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, siteId }),
      });
      const data = await res.json() as { files?: SiteFile[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Generation failed');
      if (data.files) setFiles(data.files as SiteFile[]);
      setIframeKey((k) => k + 1);
      const { data: gensData } = await supabase
        .from('generations')
        .select('id, prompt, created_at')
        .eq('site_id', siteId)
        .order('created_at', { ascending: true });
      if (gensData) setGenerations(gensData as Generation[]);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setIsGenerating(false);
    }
  }

  const selectedContent = files.find((f) => f.file_path === selectedFile)?.content ?? '';

  const devices: { icon: React.ReactNode; value: DeviceWidth; label: string }[] = [
    { icon: <MonitorIcon />, value: '100%', label: 'Desktop' },
    { icon: <TabletIcon />, value: '768px', label: 'Tablet' },
    { icon: <PhoneIcon />, value: '390px', label: 'Mobile' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0f0f0f' }}>

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL — Chat history + prompt input
      ══════════════════════════════════════════════════════════ */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-white/5" style={{ background: '#141414' }}>

        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors text-xs shrink-0">
              ← Back
            </Link>
            <span className="text-zinc-600 text-xs">/</span>
            <span className="text-sm font-medium text-white truncate">
              {site?.name ?? '…'}
            </span>
          </div>
          {site && (
            <a
              href={`https://${site.subdomain}.vibbr.app`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors shrink-0 ml-2"
              title="Open live site"
            >
              <ExternalLinkIcon />
            </a>
          )}
        </div>

        {/* Chat history */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {generations.length === 0 && !isGenerating && (
            <p className="text-xs text-zinc-600 text-center mt-8">
              No edits yet. Ask AI to change something.
            </p>
          )}

          {generations.map((g) => (
            <div key={g.id} className="flex flex-col gap-1">
              {/* User bubble */}
              <div className="self-end max-w-[85%]">
                <div className="bg-white/8 border border-white/10 text-zinc-200 text-sm px-3 py-2 rounded-2xl rounded-tr-sm">
                  {g.prompt}
                </div>
                <p className="text-[10px] text-zinc-600 text-right mt-0.5 px-1">
                  {formatTime(g.created_at)}
                </p>
              </div>
              {/* AI response bubble */}
              <div className="self-start max-w-[85%]">
                <div className="bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs px-3 py-2 rounded-2xl rounded-tl-sm">
                  Site updated ✓
                </div>
              </div>
            </div>
          ))}

          {isGenerating && (
            <div className="flex flex-col gap-1">
              <div className="self-start">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500">Generating…</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-white/5 shrink-0">
          {editError && (
            <div className="mb-2 flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <span>{editError}</span>
              <button type="button" onClick={() => setEditError(null)} className="text-red-300 hover:text-red-200 font-medium underline shrink-0">
                Dismiss
              </button>
            </div>
          )}
          <PromptInputBox
            onSend={handleSend}
            isLoading={isGenerating}
            placeholder="Make the hero darker..."
          />
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════
          RIGHT PANEL — Preview / Code
      ══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="h-12 flex items-center gap-2 px-4 border-b border-white/5 shrink-0" style={{ background: '#141414' }}>

          {/* Preview / Code toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 mr-1">
            <button
              type="button"
              onClick={() => setRightPanel('preview')}
              className={[
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                rightPanel === 'preview'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white',
              ].join(' ')}
            >
              <MonitorIcon />
              Preview
            </button>
            <button
              type="button"
              onClick={() => setRightPanel('code')}
              className={[
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                rightPanel === 'code'
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:text-white',
              ].join(' ')}
            >
              <CodeIcon />
              Code
            </button>
          </div>

          <div className="w-px h-4 bg-white/10" />

          {/* Device buttons (preview only) */}
          {rightPanel === 'preview' && (
            <>
              {devices.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  title={d.label}
                  onClick={() => setDeviceWidth(d.value)}
                  className={[
                    'p-1.5 rounded-md transition-colors',
                    deviceWidth === d.value
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-500 hover:text-white',
                  ].join(' ')}
                >
                  {d.icon}
                </button>
              ))}
              <div className="w-px h-4 bg-white/10" />
            </>
          )}

          {/* URL pill */}
          {site && rightPanel === 'preview' && (
            <div className="flex-1 min-w-0">
              <div className="bg-white/5 border border-white/8 rounded-md px-3 py-1 text-xs text-zinc-400 font-mono truncate max-w-xs">
                {site.subdomain}.vibbr.app
              </div>
            </div>
          )}

          <div className="flex-1" />

          {/* Action buttons */}
          <button
            type="button"
            title="Refresh preview"
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-1.5 rounded-md text-zinc-500 hover:text-white transition-colors"
          >
            <RefreshIcon />
          </button>
          <button
            type="button"
            title="Download ZIP"
            onClick={handleDownload}
            className="p-1.5 rounded-md text-zinc-500 hover:text-white transition-colors"
          >
            <DownloadIcon />
          </button>
        </div>

        {/* Panel content */}
        {rightPanel === 'preview' ? (
          /* ── iframe preview ── */
          <div className="flex-1 overflow-hidden flex items-center justify-center p-3" style={{ background: '#0a0a0a' }}>
            <iframe
              key={iframeKey}
              src={`/api/preview/${siteId}`}
              style={{
                width: deviceWidth,
                height: '100%',
                border: 'none',
                borderRadius: deviceWidth === '100%' ? 0 : 12,
                background: '#fff',
                transition: 'width 0.2s ease',
              }}
              title="Site preview"
            />
          </div>
        ) : (
          /* ── Code viewer ── */
          <div className="flex-1 flex overflow-hidden">
            {/* File tree */}
            <div className="w-48 shrink-0 border-r border-white/5 overflow-y-auto py-2" style={{ background: '#141414' }}>
              <p className="px-3 mb-2 text-[10px] font-medium text-zinc-600 uppercase tracking-wider">Files</p>
              {files.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFile(f.file_path)}
                  className={[
                    'flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors',
                    selectedFile === f.file_path
                      ? 'bg-white/8 text-white'
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${fileDotColor(f.file_path)}`} />
                  <span className="truncate">{f.file_path}</span>
                </button>
              ))}
            </div>

            {/* Code content */}
            <div className="flex-1 overflow-auto" style={{ background: '#0d0d0d' }}>
              {selectedContent ? (
                <pre
                  className="text-xs text-zinc-300 p-5 leading-relaxed"
                  style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                >
                  {selectedContent}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-zinc-600">Select a file to view its code</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
