import Rates from "@/server/models/Rate.mongo";
import { dbConnect, disconnectDb } from "@/utils/mongo";

const fetchRatesJob = async () => {
  let localRates: any;

  try {
    await dbConnect();

    localRates = await Rates.findOne({ id: "larry1" });
    if (!localRates) return;

    // fetch gold and silver rates
    const commodityRes = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${process.env.NEXT_PUBLIC_METAL_PRICE_API}&base=USD&currencies=XAU,XAG`
    );
    const commodityResponse = await commodityRes.json();

    if (!commodityRes.ok) {
      throw new Error(commodityResponse.error);
    }
    const { rates } = commodityResponse;
    if (rates?.XAG) {
      localRates.SILVER = 1 / +rates.XAG;
      localRates.GOLD = 1 / +rates.XAU;
    }

    // fetch oil rates
    const oilRes = await fetch(
      `https://www.alphavantage.co/query?function=BRENT&interval=daily&apikey=${process.env.NEXT_PUBLIC_ALPHAVANTAGE_API}`
    );
    const oilResponse = await oilRes.json();
    if (!oilRes.ok) {
      throw new Error(oilResponse.error);
    }
    const { data } = oilResponse;
    if (+data[0]?.value) {
      localRates.OIL = +data[0].value;
    }

    // fetch crypto rates
    ["BTC", "ETH"].forEach(async (crypto) => {
      let cryptoId: string = "";
      if (crypto === "BTC") {
        cryptoId = "bitcoin";
      } else if (crypto === "ETH") {
        cryptoId = "ethereum";
      }

      const res = await fetch(`https://api.coincap.io/v2/assets/${cryptoId}`);
      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error);
      }
      const { data } = response;

      if (+data?.priceUsd) {
        localRates[crypto as "BTC"] = +data.priceUsd;
      }
    });

    // fetch forex rates
    const rxRes = await fetch(
      `https://v6.exchangerate-api.com/v6/9eee23490d7ea87ee1f8cb2b/latest/USD`
    );
    const fxResponse = await rxRes.json();
    const { conversion_rates } = fxResponse;
    if (!rxRes.ok) {
      throw new Error(fxResponse.error);
    }
    if (conversion_rates["EUR"]) {
      localRates.EUR = conversion_rates["EUR"];
      localRates.GBP = conversion_rates["GBP"];
      localRates.CAD = conversion_rates["CAD"];
    }

    await localRates?.save();
    await disconnectDb();

    return localRates;
  } catch (err: any) {
    console.log(err.message);
    await disconnectDb();

    return localRates;
  }
};

export default fetchRatesJob;
