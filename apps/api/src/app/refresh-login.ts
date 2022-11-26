import { Request, Response } from 'express';

export const refreshToken = async (req: Request, res: Response) => {
  const { jwt, cookies } = req.body; // {username: 'kortstra', password: 'b88Z#B0o9138'};
  if (!jwt || !cookies) {
    res.status(400).send('JWT and cookie are required');
    return;
  }

  const body = JSON.stringify({
    JWT: jwt,
    LANG: 'en-US',
  });

  const result = await fetch(
    'https://mijn.ista.nl/api/Authorization/JWTRefresh',
    {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7',
        'content-type': 'application/json',
        'sec-ch-ua':
          '"Microsoft Edge";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-requested-with': 'XMLHttpRequest',
        cookie: cookies,
      },
      referrerPolicy: 'no-referrer',
      body,
      method: 'POST',
    }
  );

  res.send(await result.json());
  return;
};
