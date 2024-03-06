interface Balance {
  fiat: {
    USD: number;
    EUR: number;
    GBP: number;
    CAD: number;
  };
  crypto: {
    BTC: number;
    ETH: number;
    USDT: number;
  };
  commodity: {
    GOLD: number;
    SILVER: number;
    OIL: number;
  };
}

interface Rates {
  BTC: number;
  ETH: number;
  GOLD: number;
  SILVER: number;
  OIL: number;
  EUR: number;
  CAD: number;
  GBP: number;
  USD: number;
  USDT: number;
}

const getUserTotalBal = (
  userCurrency: "USD" | "GBP" | "EUR" | "CAD",
  balance: Balance,
  rates: Rates
) => {
  let totalBal = 0;
  let totalFx = 0;
  let totalCrypto = 0;
  let totalComm = 0;
  for (let key in balance.fiat) {
    totalFx += balance.fiat[key as "GBP"] / rates[key as "GBP"];
  }

  for (let key in balance.crypto) {
    if (key === "USDT") {
      totalCrypto += balance.crypto[key as "BTC"];
    } else {
      totalCrypto += balance.crypto[key as "BTC"] * rates[key as "BTC"];
    }
  }

  for (let key in balance.commodity) {
    totalComm += balance.commodity[key as "GOLD"] * rates[key as "GBP"];
  }

  // convert to user preferred currency
  totalFx = totalFx * rates[userCurrency as "GBP"];
  totalCrypto = totalCrypto * rates[userCurrency as "GBP"];
  totalComm = totalComm * rates[userCurrency as "GBP"];
  totalBal = totalFx + totalCrypto + totalComm;

  return {
    fiat: totalFx,
    crypto: totalCrypto,
    commodity: totalComm,
    total: totalBal
  };
};

export default getUserTotalBal;
