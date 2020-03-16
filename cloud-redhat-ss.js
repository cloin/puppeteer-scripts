'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  console.info("Starting browser");
  let browser;
  try {
    browser = await puppeteer.launch({});
  } catch (e) {
    console.info("Unable to launch browser mode in sandbox mode. Lauching Chrome without sandbox.");
    browser = await puppeteer.launch({args:['--no-sandbox']});
  }
  console.info("Browser successfully started");
  
  // navigate to cloud.redhat.com
  // with a specific browser window size

  let page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 })
  await page.goto('https://cloud.redhat.com', { waitUntil: 'networkidle2' });

  // click on the "Login" button
  // enter login details and click login

  console.info("Login to portal");

  const [login] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#page > header > div.pf-c-page__header-tools > button'),
  ]);

  await page.focus('#username');
  await page.keyboard.type(""); // username
  await page.focus("#password");
  await page.keyboard.type(""); // password

  const [submitLogin] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#_eventId_submit'),
  ]);

  // navigate to 3 different pages
  // and take screenshots of each page

  console.info(". Goto analytics");
  await page.goto('https://cloud.redhat.com/ansible/automation-analytics/clusters', { waitUntil: 'networkidle0' });
  console.info(".   Take screenshot");
  await page.screenshot({ path: './screenshots/analytics.jpg', type: 'jpeg', fullPage: true });

  console.info(". Goto hub");
  await page.goto('https://cloud.redhat.com/ansible/automation-hub', { waitUntil: 'networkidle0' });
  console.info(".   Take screenshot");
  await page.screenshot({ path: './screenshots/hub.jpg', type: 'jpeg', fullPage: true });

  console.info(". Goto vulnerability");
  await page.goto('https://cloud.redhat.com/rhel/vulnerability/cves?impact=7&page=1&sort=-public_date', { waitUntil: 'networkidle0' });
  console.info(".   Take screenshot");
  await page.screenshot({ path: './screenshots/vulnerability.jpg', type: 'jpeg', fullPage: true });

  // all done close page close browser

  console.info("Closing browser");
  await page.close();
  await browser.close();
  console.info("Done");
})();

