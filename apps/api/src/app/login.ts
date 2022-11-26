import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const chromium = require('@sparticuz/chromium');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer-core');

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body; // {username: 'kortstra', password: 'b88Z#B0o9138'};
  if (!username || !password) {
    res.status(400).send('Username and password are required');
    return;
  }

  let cookies: string;
  let uBase: string;

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: false,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.goto(
      'https://mijn.ista.nl/Identity/Account/Login?ReturnUrl=%2F',
      {
        waitUntil: 'networkidle0',
      }
    );

    //* adds email
    await page.waitForSelector('input[id="txtUserName"]');
    await page.type('input[id="txtUserName"]', username, {
      delay: 30,
    });
    await page.type('input[type="password"]', password);

    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // let period: string;
    // await page.waitForSelector('#measperiod');
    // try {
    //   period = (await page.$('#measperiod'))?.textContent.match(
    //     /- (\d{2}-\d{2}-\d{4})/
    //   )[1];
    // } catch (e) {
    //   console.log(e);
    // }

    //* get the current browser page session
    cookies = await page.cookies();
    uBase = await page.evaluate(() => {
      return JSON.parse(window.sessionStorage.getItem('uBase'));
    });

    await browser.close();
  } catch (e) {
    console.log('error logging in with puppepteer');
    console.log(e);
  }

  if (uBase === null) {
    res.status(401).send('Invalid username or password');
    return;
  }

  res.json({ cookies, uBase });
  return;
};
