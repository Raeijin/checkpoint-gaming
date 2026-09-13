const { chromium } = require('@playwright/test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { root } = require('./build-articles.cjs');

async function main() {
  const server = http.createServer((req, res) => {
    let file = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname));
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
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
    for (const width of [1440, 768, 390]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      // Keep comparisons deterministic: use existing local fallback artwork for
      // third-party images, without downloading retailer assets or visiting shops.
      await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
      const home = await context.newPage();
      const errors = [];
      home.on('pageerror', error => errors.push(error.message));
      await home.goto(base + '/');
      await home.waitForSelector('.content-card');
      assert(await home.locator('.ticker .wrap').evaluate(el => {
        const children = [...el.children];
        return children.every((child, i) => i === 0 || child.getBoundingClientRect().left >= children[i - 1].getBoundingClientRect().right);
      }), 'Ticker links must not overlap');
      assert(await home.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `homepage: overflow at ${width}`);
      await home.screenshot({ path: path.join(root, 'test-results', `home-hero-${width}.png`) });
      for (const href of ['#reviews', '#buying', '#tech', '#games', '#sim']) {
        await home.locator(`.nav nav a[href="${href}"]`).click();
        assert.equal(new URL(home.url()).hash, href);
        assert(await home.locator(href).evaluate(el => el.getBoundingClientRect().top >= document.querySelector('.topbar').getBoundingClientRect().bottom), 'Navigation target clears sticky header');
      }
      await home.locator('#buying').scrollIntoViewIfNeeded();
      await home.screenshot({ path: path.join(root, 'test-results', `home-buying-${width}.png`) });
      await home.locator('#searchBtn').click();
      await home.locator('#searchInput').fill('moza');
      assert(await home.locator('.searchable:not(.hidden)').count() > 0);
      assert(await home.locator('.searchable.hidden').count() > 0);
      await home.locator('#searchInput').fill('');
      await home.locator('#searchBtn').click();
      assert.deepEqual(errors, []);
      await home.close();
      for (const slug of samples) {
        const legacy = await context.newPage();
        const page = await context.newPage();
        page.on('pageerror', error => errors.push(error.message));
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
        await page.locator('.toc a[href="#main"]').click();
        await page.waitForFunction(() => document.querySelector('.toc a[href="#main"]').getAttribute('aria-current') === 'location');
        assert(await page.locator('#main').evaluate(el => el.getBoundingClientRect().top >= document.querySelector('.topbar').getBoundingClientRect().bottom), 'TOC target clears sticky header');
        assert(await page.locator('.reading-progress').evaluate(el => getComputedStyle(el).transform !== 'matrix(0, 0, 0, 1, 0, 0)'));
        await page.evaluate(() => scrollTo(0, 0));
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
      assert.deepEqual(errors, []);
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
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `JS disabled: overflow at ${width}`);
        await page.locator('.toc a[href="#main"]').click();
        assert.equal(new URL(page.url()).hash, '#main');
        if (await page.locator('.faq-item').count()) {
          const details = page.locator('.faq-item').first();
          await details.locator('summary').click();
          assert.equal(await details.getAttribute('open'), null);
        }
        await page.close();
      }
      await noJS.close();
    }
    const motion = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await motion.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
    const page = await motion.newPage();
    await page.goto(base + '/');
    await page.locator('#buying').scrollIntoViewIfNeeded();
    await page.waitForSelector('.section-arrived');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert(await page.locator('.hero').evaluate(el => getComputedStyle(el, '::before').animationName === 'none'));
    assert(await page.locator('.section-arrived').evaluate(el => getComputedStyle(el).animationName === 'none'));
    assert(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior === 'auto'));
    await motion.close();
    console.log('Browser checks passed: homepage, navigation/search, four article types at 390/768/1440px, TOC/progress, reduced motion, no overflow, JS-disabled content/FAQ and intercepted affiliate navigation.');
  } finally {
    if (browser) await browser.close();
    server.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
