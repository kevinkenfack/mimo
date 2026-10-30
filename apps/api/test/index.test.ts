import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

// Each test uses unique names to avoid edge cache collisions between tests

describe('mimo API', () => {
  it('returns SVG with correct headers', async () => {
    const res = await SELF.fetch('http://localhost:8786/test-svg');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/svg+xml; charset=utf-8');
    expect(res.headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect(res.headers.get('cdn-cache-control')).toBe('max-age=31536000');
    expect(res.headers.get('etag')).toBeTruthy();
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
    const body = await res.text();
    expect(body).toContain('<svg');
    expect(body).toContain('</svg>');
  });

  it('returns different SVG for different names', async () => {
    const a = await (await SELF.fetch('http://localhost:8786/diff-a')).text();
    const b = await (await SELF.fetch('http://localhost:8786/diff-b')).text();
    expect(a).not.toBe(b);
  });

  it('returns 404 for empty path', async () => {
    const res = await SELF.fetch('http://localhost:8786/');
    expect(res.status).toBe(404);
  });

  it('returns 405 for POST', async () => {
    const res = await SELF.fetch('http://localhost:8786/post-test', { method: 'POST' });
    expect(res.status).toBe(405);
  });

  it('handles OPTIONS preflight', async () => {
    const res = await SELF.fetch('http://localhost:8786/options-test', { method: 'OPTIONS' });
    expect(res.status).toBe(200);
    expect(res.headers.get('access-control-allow-methods')).toBe('GET');
  });

  it('applies mood param', async () => {
    const plain = await (await SELF.fetch('http://localhost:8786/mood-plain')).text();
    const happy = await (await SELF.fetch('http://localhost:8786/mood-plain?mood=happy')).text();
    expect(plain).not.toBe(happy);
  });

  it('picks one of several moods deterministically per name', async () => {
    const url = (name: string, mood: string) => `http://localhost:8786/${name}?mood=${mood}`;
    const first = await (await SELF.fetch(url('multi-mood-a', 'happy,cool'))).text();
    const again = await (await SELF.fetch(url('multi-mood-a', 'happy,cool'))).text();
    expect(again).toBe(first);

    const happy = await (await SELF.fetch(url('multi-mood-a', 'happy'))).text();
    const cool = await (await SELF.fetch(url('multi-mood-a', 'cool'))).text();
    expect([happy, cool]).toContain(first);

    const picks = new Set<string>();
    for (const name of [
      'multi-mood-1',
      'multi-mood-2',
      'multi-mood-3',
      'multi-mood-4',
      'multi-mood-5',
      'multi-mood-6',
    ]) {
      const chosen = await (await SELF.fetch(url(name, 'happy,cool'))).text();
      const asHappy = await (await SELF.fetch(url(name, 'happy'))).text();
      picks.add(chosen === asHappy ? 'happy' : 'cool');
    }
    expect(picks.size).toBe(2);

    const mixed = await (await SELF.fetch(url('multi-mood-b', 'happy,nope'))).text();
    const onlyHappy = await (await SELF.fetch(url('multi-mood-b', 'happy'))).text();
    expect(mixed).toBe(onlyHappy);
  });

  it('applies background param for faces variant', async () => {
    const gradient = await (
      await SELF.fetch('http://localhost:8786/variant-test?variant=faces&background=gradient')
    ).text();
    const solid = await (
      await SELF.fetch('http://localhost:8786/variant-test?variant=faces&background=solid')
    ).text();
    expect(gradient).not.toBe(solid);
  });

  it('rejects unsupported variants', async () => {
    const res = await SELF.fetch('http://localhost:8786/invalid-variant?variant=bad');
    expect(res.status).toBe(400);
  });

  it('ignores invalid faces params when variant is valid', async () => {
    const res = await SELF.fetch('http://localhost:8786/invalid-params?variant=faces&mood=nope');
    expect(res.status).toBe(200);
    expect(await res.text()).toContain('<svg');
  });
});
