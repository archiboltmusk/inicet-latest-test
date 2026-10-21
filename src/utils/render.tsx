import React from 'react';
import { esc } from '../state';

export function md(s: string): string {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');
}

export function clozeHTML(text: string, n: number, reveal: boolean): string {
  return esc(text)
    .replace(/\{\{c(\d+)::(.+?)(?:::(.+?))?\}\}/g, (_, k, ans, hint) =>
      +k === n || n === -1
        ? reveal
          ? `<span class="cloze">${ans}</span>`
          : `<span class="cloze">[${hint ? hint : '…'}]</span>`
        : ans
    )
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');
}

export function stemHTML(t: string): string {
  const out: string[] = [];
  const lines = String(t).split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*\|/.test(lines[i])) {
      const rows: string[] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) {
        if (!/^\s*\|[\s:|-]+\|\s*$/.test(lines[i])) rows.push(lines[i]);
        i++;
      }
      i--;
      const cells = (r: string) =>
        r
          .trim()
          .replace(/^\||\|$/g, '')
          .split('|')
          .map(x => esc(x.trim()));
      out.push(
        `<div class="tbl"><table>${rows
          .map(
            (r, k) =>
              `<tr>${cells(r)
                .map(x => (k ? `<td>${x}</td>` : `<th>${x}</th>`))
                .join('')}</tr>`
          )
          .join('')}</table></div>`
      );
    } else {
      out.push(esc(lines[i]) + '<br>');
    }
  }
  return out.join('').replace(/(<br>)+$/, '');
}

interface FlowNode {
  t: string;
  k: FlowNode[];
  d: number;
  arrow: boolean;
}

export function renderFlowchart(txt: string): string {
  const root: FlowNode = { t: '', k: [], d: -1, arrow: false };
  const st: FlowNode[] = [root];
  txt.split('\n').forEach(raw => {
    if (!raw.trim()) return;
    const d = (raw.match(/^ */)?.[0] || '').length;
    let t = raw.trim();
    const arrow = /^→/.test(t);
    t = t.replace(/^→\s*/, '');
    const n: FlowNode = { t, k: [], d, arrow };
    while (st.length > 1 && st[st.length - 1].d >= d) st.pop();
    st[st.length - 1].k.push(n);
    st.push(n);
  });

  const node = (n: FlowNode, lvl: number): string =>
    `<div class="fl"><div class="fn l${Math.min(lvl, 3)}${
      /\?|\bif\b|\bvs\b/i.test(n.t) ? ' q' : ''
    }">${md(n.t)}</div>${
      n.k.length ? `<div class="fk">${n.k.map(c => node(c, lvl + 1)).join('')}</div>` : ''
    }</div>`;

  return root.k.map(n => node(n, 0)).join('<div class="far">↓</div>');
}
