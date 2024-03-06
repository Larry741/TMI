const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    phone: {
      type: String,
      required: true
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    referrer: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    address: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      default: "ACTIVE",
      enum: ["ACTIVE", "DISABLED"]
    },
    otp: {
      type: String
    },
    token: {
      type: String
    },
    autoTopUpEnabled: {
      type: Boolean,
      default: false
    },
    gender: {
      type: String
    },
    avatar: {
      type: String
    },
    timeZone: {
      type: String
    },
    isKYCVerified: {
      type: Boolean,
      default: false
    },
    hasDeposited: {
      type: Boolean,
      default: false
    },
    notifications: {
      sendCurrency: {
        type: Boolean,
        default: true
      },
      merchantOrder: {
        type: Boolean,
        default: true
      },
      recommendations: {
        type: Boolean,
        default: true
      }
    },
    currency: {
      type: String,
      default: "USD"
    },
    balance: {
      fiat: {
        USD: {
          type: Number,
          default: 0
        },
        EUR: {
          type: Number,
          default: 0
        },
        GBP: {
          type: Number,
          default: 0
        },
        CAD: {
          type: Number,
          default: 0
        }
      },
      crypto: {
        BTC: {
          type: Number,
          default: 0
        },
        ETH: {
          type: Number,
          default: 0
        },
        USDT: {
          type: Number,
          default: 0
        }
      },
      commodity: {
        GOLD: {
          type: Number,
          default: 0
        },
        SILVER: {
          type: Number,
          default: 0
        },
        OIL: {
          type: Number,
          default: 0
        }
      }
    },
    walletAddress: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
