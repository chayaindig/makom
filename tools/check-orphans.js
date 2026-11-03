// Finds text blocks whose last line holds a single word (an "orphan"), and sideways overflow.
// Run it inside the page at each width (360, 375, 414, 768, 1280, 1440), e.g. paste into the
// browser tool's javascript_tool after resize_window (top-level await works there).
// It first scrolls through the page so content that only mounts on scroll (whileInView) is checked too.
// Returns { width, overflow: false, orphans: [] } when the page is clean.
(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  for (let y = 0; y < document.body.scrollHeight; y += 500) {
    scrollTo(0, y);
    await new Promise(r => setTimeout(r, 60));
  }
  await new Promise(r => setTimeout(r, 1200));
  scrollTo(0, 0);

  const SELECTOR = 'h1, h2, h3, h4, h5, h6, p, li, blockquote, dd, summary, figcaption, a, button';
  const found = [];
  document.querySelectorAll(SELECTOR).forEach(el => {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || el.closest('[aria-hidden="true"]')) return;
    if (el.classList.contains('sr-only')) return;
    // Flex/grid boxes lay their children out side by side, not as lines of text
    if (/flex|grid/.test(style.display)) return;
    const text = (el.textContent || '').trim();
    if (text.split(/\s+/).length < 3) return; // short labels are fine

    // Collect each word's line (by its top position)
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const words = [];
    let node;
    while ((node = walker.nextNode())) {
      const re = /[^\s]+/g;
      let m;
      while ((m = re.exec(node.nodeValue))) {
        const range = document.createRange();
        range.setStart(node, m.index);
        range.setEnd(node, m.index + m[0].length);
        const rect = range.getClientRects()[0];
        // Skip icons and symbols such as "+" or "→": only real words count
        if (rect && rect.width && /[\p{L}\p{N}]/u.test(m[0])) words.push({ word: m[0], top: Math.round(rect.top) });
      }
    }
    if (words.length < 3) return;
    const lastTop = words[words.length - 1].top;
    const onLastLine = words.filter(w => Math.abs(w.top - lastTop) < 4);
    const lines = new Set(words.map(w => w.top)).size;
    if (lines > 1 && onLastLine.length === 1) {
      found.push({ tag: el.tagName.toLowerCase(), lastWord: onLastLine[0].word, text: text.slice(0, 80) });
    }
  });
  const root = document.documentElement;
  return { width: innerWidth, overflow: root.scrollWidth - root.clientWidth > 1, orphans: found };
})();
