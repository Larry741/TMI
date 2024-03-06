import {
  createAsyncThunk,
  createSlice,
  current,
  Dispatch
} from "@reduxjs/toolkit";
import { CustomError } from "@/hooks/use-Http";
import getUserTotalBal from "@/utils/getUserTotalBal";

export const TOKEN_KEY = "auth_token";
export const USER_KEY = "user";

export interface UserSliceType {
  _id: any;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  emailVerified: boolean;
  role: string | null;
  address: string | null;
  country: string | null;
  gender: string | null;
  token: string | null;
  status: string;
  sessionStatus: "loading" | "unauthenticated" | "authenticated";
  expireDate: number | null;
  avatar: string | null;
  currency: "USD" | "GBP" | "EUR" | "CAD";
  timeZone: string;
  isKYCVerified: boolean;
  hasDeposited: boolean;
  totalBalance: {
    fiat: number;
    crypto: number;
    commodity: number;
    total: number;
  };
  autoTopUpEnabled: false;
  balance: {
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
  };
  notifications: {
    sendCurrency: boolean;
    merchantOrder: boolean;
    recommendations: boolean;
  };
  walletAddress: string;
  activeInvestment:
    | {
        amount: number;
        userId: string;
        type: string;
        status: string;
        level: number;
        profits: number;
        currency: string;
      }
    | any;
  rates: {
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
  };
}

const initialState: UserSliceType = {
  _id: "",
  phone: null,
  gender: null,
  email: null,
  firstName: null,
  lastName: null,
  emailVerified: false,
  role: null,
  address: null,
  country: null,
  token: null,
  sessionStatus: "loading",
  status: "",
  expireDate: null,
  avatar: "",
  currency: "USD",
  autoTopUpEnabled: false,
  timeZone: "",
  isKYCVerified: false,
  hasDeposited: false,
  totalBalance: { fiat: 0, crypto: 0, commodity: 0, total: 0 },
  balance: {
    fiat: {
      CAD: 0,
      EUR: 0,
      GBP: 0,
      USD: 0
    },
    crypto: {
      BTC: 0,
      ETH: 0,
      USDT: 0
    },
    commodity: {
      GOLD: 0,
      OIL: 0,
      SILVER: 0
    }
  },
  notifications: {
    sendCurrency: false,
    merchantOrder: false,
    recommendations: false
  },
  walletAddress: "",
  activeInvestment: {},
  rates: {
    BTC: 0,
    ETH: 0,
    GOLD: 0,
    SILVER: 0,
    OIL: 0,
    EUR: 0,
    CAD: 0,
    GBP: 0,
    USD: 1,
    USDT: 1
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUserDetails(state, action) {
      let data: UserSliceType = action.payload;
      const sessionExpDate = Date.now() + 60 * 60 * 3 * 1000;

      if (data.activeInvestment?.currency) {
        data.balance.fiat[data.activeInvestment?.currency as "GBP"] +=
          data.activeInvestment?.amount;
        data.balance.fiat[data.activeInvestment?.currency as "GBP"] +=
          data.activeInvestment?.profits;
      }

      sessionStorage.setItem(
        USER_KEY,
        JSON.stringify({
          ...data,
          totalBalance: getUserTotalBal(
            data.currency,
            data.balance,
            data.rates
          ),
          sessionStatus: "authenticated",
          status: data.status,
          expireDate: sessionExpDate
        })
      );

      sessionStorage.setItem(TOKEN_KEY, data.token!);

      return {
        _id: data._id,
        phone: data.phone,
        gender: data.gender,
        address: data.address,
        country: data.country,
        email: data.email,
        emailVerified: data.emailVerified,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        token: data.token,
        sessionStatus: "authenticated",
        status: data.status,
        expireDate: sessionExpDate,
        avatar: data.avatar,
        currency: data.currency,
        balance: data.balance,
        timeZone: data.timeZone,
        notifications: data.notifications,
        walletAddress: data.walletAddress,
        activeInvestment: data.activeInvestment,
        totalBalance: getUserTotalBal(data.currency, data.balance, data.rates),
        rates: data.rates,
        hasDeposited: data.hasDeposited,
        isKYCVerified: data.isKYCVerified,
        autoTopUpEnabled: data.autoTopUpEnabled
      };
    },
    reSaveUserDetails(state, action) {
      const user = JSON.parse(sessionStorage.getItem(USER_KEY)!)!;

      return {
        _id: user._id,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        address: user.address,
        country: user.country,
        autoTopUpEnabled: user.autoTopUpEnabled,
        email: user.email,
        emailVerified: user.emailVerified,
        firstName: user.firstName,
        lastName: user.lastName,
        token: user.token,
        sessionStatus: "authenticated",
        status: user.status,
        expireDate: user.expireDate,
        avatar: user.avatar,
        currency: user.currency,
        balance: user.balance,
        timeZone: user.timeZone,
        notifications: user.notifications,
        walletAddress: user.walletAddress,
        activeInvestment: user.activeInvestment,
        totalBalance: getUserTotalBal(user.currency, user.balance, user.rates),
        rates: user.rates,
        hasDeposited: user.hasDeposited,
        isKYCVerified: user.isKYCVerified
      };
    },
    updateUserDetails(state, action) {
      const parsedData = JSON.parse(sessionStorage.getItem(USER_KEY)!);
      let data: UserSliceType = { ...parsedData, ...action.payload };

      // if (data.activeInvestment?.currency) {
      //   data.balance.fiat[data.activeInvestment?.currency as "GBP"] +=
      //     data.activeInvestment?.amount;
      //   data.balance.fiat[data.activeInvestment?.currency as "GBP"] +=
      //     data.activeInvestment?.profits;
      // }

      data.totalBalance = getUserTotalBal(
        data.currency,
        data.balance,
        data.rates
      );

      // console.log(action.payload);
      sessionStorage.setItem(
        USER_KEY,
        JSON.stringify({
          ...data
        })
      );

      return {
        ...data
      };
    },
    logOut(state, action) {
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);

      return {
        _id: "",
        phone: null,
        gender: null,
        email: null,
        firstName: null,
        lastName: null,
        emailVerified: false,
        role: null,
        address: null,
        country: null,
        token: null,
        status: "",
        sessionStatus: "unauthenticated",
        expireDate: null,
        avatar: "",
        hasDeposited: false,
        isKYCVerified: false,
        currency: "USD",
        autoTopUpEnabled: false,
        notifications: {
          sendCurrency: false,
          merchantOrder: false,
          recommendations: false
        },
        timeZone: "",
        walletAddress: "",
        balance: {
          fiat: {
            CAD: 0,
            EUR: 0,
            GBP: 0,
            USD: 0
          },
          crypto: {
            BTC: 0,
            ETH: 0,
            USDT: 0
          },
          commodity: {
            GOLD: 0,
            OIL: 0,
            SILVER: 0
          }
        },
        totalBalance: {
          fiat: 0,
          crypto: 0,
          commodity: 0,
          total: 0
        },
        activeInvestment: {},
        rates: {
          BTC: 0,
          ETH: 0,
          GOLD: 0,
          SILVER: 0,
          OIL: 0,
          EUR: 0,
          CAD: 0,
          GBP: 0,
          USD: 1,
          USDT: 1
        }
      };
    }
  }
});

export const userSliceActions = userSlice.actions;

export const fetchUserAction = createAsyncThunk<
  {
    error: boolean;
    message: any;
    status: any;
  },
  string | number,
  { dispatch: Dispatch }
>("fetchUser/fetch", async (propertyId: string | number, thunkApi) => {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);

    const response = await fetch(`/api/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: "include"
    });

    const res = await response.json();
    if (!response.ok) {
      throw new CustomError(res.error, response.status);
    }

    thunkApi.dispatch(userSliceActions.updateUserDetails(res.data));
    return {
      error: false,
      message: res.data,
      status: response.status
    };
  } catch (err: any) {
    return {
      error: true,
      message: err?.message,
      status: err?.status
    };
  }
});

export default userSlice;
