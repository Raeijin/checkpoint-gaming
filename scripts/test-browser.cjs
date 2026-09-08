const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { root } = require('./build-articles.cjs');

async function main() {
  const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml' })[path.extname(file)] || 'application/octet-stream');
    res.end(fs.readFileSync(file));
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await chromium.launch();
    fs.mkdirSync(path.join(root, 'test-results'), { recursive: true });
    const samples = ['asus-vy279hgr-review', 'best-budget-gaming-monitors-uk', 'moza-r5-vs-fanatec-csl-dd', 'elden-ring-first-hours-guide'];
    for (const width of [1440, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } });
      // Keep comparisons deterministic: use existing local fallback artwork for
      // third-party images, without downloading retailer assets or visiting shops.
      await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
      for (const slug of samples) {
        const legacy = await context.newPage();
        const page = await context.newPage();
        await legacy.goto(`${base}/article.html?slug=${slug}`);
        await page.goto(`${base}/articles/${slug}/`);
        await legacy.waitForSelector('#main h2');
        const geometry = p => p.evaluate(() => ['h1', '#articleIntro', '#main', '#pick', '#related', '.toc'].map(selector => {
          const el = document.querySelector(selector);
          const rect = el.getBoundingClientRect();
          return { selector, x: rect.x, width: rect.width, display: getComputedStyle(el).display, font: getComputedStyle(el).fontSize };
        }));
        assert.deepEqual(await geometry(page), await geometry(legacy), `${slug}: layout at ${width}px`);
        assert.equal(await page.locator('#main').innerText(), await legacy.locator('#main').innerText());
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${slug}: horizontal overflow`);
        assert.equal(await legacy.locator('link[rel="canonical"]').getAttribute('href'), `https://checkpointloadout.com/articles/${slug}/`);
        await page.screenshot({ path: path.join(root, 'test-results', `${slug}-${width}.png`), fullPage: true });
        if (slug === 'moza-r5-vs-fanatec-csl-dd') {
          await page.screenshot({ path: path.join(root, 'test-results', `sim-hero-${width}.png`) });
          await page.locator('#pick').scrollIntoViewIfNeeded();
          await page.screenshot({ path: path.join(root, 'test-results', `sim-picks-${width}.png`) });
        }
        // Hit-test real buttons at both sizes. Intercept navigation before it
        // leaves localhost so no affiliate requests or purchases are made.
        for (const domain of ['amazon.co.uk', 'mozaracing.com', 'fanatec.com']) {
          const button = page.locator(`#pick a.btn[href*="${domain}"]`).first();
          if (!await button.count()) continue;
          await button.click({ trial: true });
          const target = await button.getAttribute('href');
          await page.route(target, route => route.fulfill({ contentType: 'text/html', body: '<p>Navigation verified</p>' }));
          await button.click();
          await page.waitForURL(target);
          await page.goto(`${base}/articles/${slug}/`);
        }
        if (slug === 'moza-r5-vs-fanatec-csl-dd') {
          const fanatec = page.locator('.recommendation-card').filter({ has: page.locator('h3', { hasText: 'Fanatec' }) }).locator('a.btn').first();
          const target = await fanatec.getAttribute('href');
          assert(target.includes('amazon.co.uk'), 'Preserve the existing Fanatec product destination');
          await page.route(target, route => route.fulfill({ contentType: 'text/html', body: '<p>Fanatec product navigation verified</p>' }));
          await fanatec.click();
          await page.waitForURL(target);
        }
        await legacy.close();
        await page.close();
      }
      await context.close();
      const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width, height: 900 } });
      await noJS.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
      for (const slug of samples) {
        const page = await noJS.newPage();
        const response = await page.goto(`${base}/articles/${slug}/`);
        const source = await response.text();
        assert(source.includes(await page.locator('h1').innerText()));
        assert((await page.locator('#main').innerText()).length > 1000);
        assert(await page.locator('h1').isVisible());
        if (await page.locator('.faq-item').count()) {
          const details = page.locator('.faq-item').first();
          await details.locator('summary').click();
          assert.equal(await details.getAttribute('open'), null);
        }
        await page.close();
      }
      await noJS.close();
    }
    console.log('Browser checks passed: four article types, desktop/mobile layout parity, no overflow, JS-disabled content/FAQ, Amazon/MOZA navigation and Fanatec product navigation via its existing Amazon link.');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
