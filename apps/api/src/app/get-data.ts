import dayjs, { Dayjs } from 'dayjs';
import { Request, Response } from 'express';

export const getData = async (req: Request, res: Response) => {
  const { jwt, cuid, year } = req.body;

  if (!jwt || !cuid || !year) {
    res.status(400).send('jwt, cuid and year are required');
    return;
  }

  const startDate: Dayjs = dayjs(`${year}-01-01`);

  const billingPeriods: { y: string; s: string; e: string }[] = [
    ...new Array(12),
  ].map((value, index) => {
    return {
      y: year.toString(),
      s: startDate.add(index, 'months').format('YYYY-MM-DD[T]HH:mm:ss'),
      e: startDate
        .add(index + 1, 'months')
        .subtract(1, 'days')
        .format('YYYY-MM-DD[T]HH:mm:ss'),
    };
  });

  let results: Record<string, unknown>[];

  try {
    results = await Promise.all(
      (
        await Promise.all(
          billingPeriods.map((period) => {
            const body = JSON.stringify({
              JWT: jwt,
              Cuid: cuid,
              Billingperiod: period,
            });

            return fetch('https://mijn.ista.nl/api/Values/ConsumptionValues', {
              method: 'POST',
              headers: {
                accept: 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,nl;q=0.7',
                'content-type': 'application/json',
              },
              body,
            });
          })
        )
      ).map((res) => res.json())
    );
  } catch (e) {
    console.log(e);
  }

  res.send(results);
  return;
};
