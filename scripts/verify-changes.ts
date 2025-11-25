import { chromium } from 'playwright';

(async () => {
  try {
    console.log('Connecting to browser...');
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    const defaultContext = browser.contexts()[0];
    const page = defaultContext ? defaultContext.pages()[0] : await browser.newPage();
    
    if (!page) {
        throw new Error('No page found');
    }

    console.log('Navigating to home...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Desktop Screenshot
    console.log('Taking desktop screenshot...');
    await page.setViewportSize({ width: 1600, height: 1200 });
    // Wait a sec for resizing
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '.playwright-mcp/08-navigation-desktop-refined.png' });

    // Mobile Screenshot
    console.log('Taking mobile screenshot...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1000);

    // Click Menu
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Wait for transition
      await page.waitForTimeout(1000);
      await page.screenshot({ path: '.playwright-mcp/09-navigation-mobile-refined.png' });
    } else {
      console.error('Menu button not found!');
    }

    console.log('Done.');
    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
