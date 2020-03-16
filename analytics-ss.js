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
  
  let page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://cloud.redhat.com', { waitUntil: 'networkidle2' });

  console.info("Login to portal");

  const [response] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#page > header > div.pf-c-page__header-tools > button'),
  ]);

  await page.focus('#username');
  await page.keyboard.type(""); // username
  await page.focus("#password");
  await page.keyboard.type(""); // password

  const [response1] = await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('#_eventId_submit'),
  ]);

  await page.goto('https://cloud.redhat.com/ansible/automation-analytics/clusters', { waitUntil: 'networkidle2' });

  console.info("Take screenshot");

  await page.screenshot({ path: './image.jpg', type: 'jpeg', fullPage: true });
  console.info("Closing browser");
	await page.close();
  await browser.close();
  console.info("Done");
})();

