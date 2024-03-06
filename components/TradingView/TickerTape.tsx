import React, { memo } from "react";
import { ColorTheme, CopyrightStyles, Locales } from "@/interface/tradingview";
import Widget from "./Widget";

export type TickerTapeSymbols = TickerTapeSymbol[];

export type TickerTapeSymbol = {
	proName: string;
	title: string;
};

const defaultSymbols: TickerTapeSymbols = [
	{
		proName: "FOREXCOM:SPXUSD",
		title: "S&P 500",
	},
	{
		proName: "FOREXCOM:NSXUSD",
		title: "Nasdaq 100",
	},
	{
		proName: "FX_IDC:EURUSD",
		title: "EUR/USD",
	},
	{
		proName: "BITSTAMP:BTCUSD",
		title: "BTC/USD",
	},
	{
		proName: "BITSTAMP:ETHUSD",
		title: "ETH/USD",
	},
];

const cryptoSymbol = [
	{
		title: "Solana",
		proName: "BINANCE:SOLUSDT",
	},
	{
		title: "Link",
		proName: "BINANCE:LINKUSDT",
	},
	{
		title: "BNB",
		proName: "BINANCE:BNBUSDT",
	},
	{
		title: "XRP",
		proName: "BITSTAMP:XRPUSD",
	},
	{
		title: "RUNE",
		proName: "BINANCE:RUNEUSDT",
	},
	{
		title: "Matic",
		proName: "BINANCE:MATICUSDT",
	},
	{
		title: "BTC",
		proName: "BINANCE:BTCUSDT",
	},
];

const forexSymbols = [
	{
		proName: "FX_IDC:EURUSD",
		title: "EURUSD",
	},
	{
		title: "GBPUSD",
		proName: "FX:GBPUSD",
	},
	{
		title: "USDJPY",
		proName: "FX:USDJPY",
	},
	{
		title: "GBPJPY",
		proName: "OANDA:GBPJPY",
	},
	{
		title: "USDCAD",
		proName: "FX:USDCAD",
	},
	{
		title: "AUDUSD",
		proName: "OANDA:AUDUSD",
	},
	{
		title: "NZDUSD",
		proName: "FX:NZDUSD",
	},
];

const commoditySymbols = [
	{
		description: "Oil",
		proName: "TVC:USOIL",
	},
	{
		description: "Gold",
		proName: "TVC:GOLD",
	},
	{
		description: "Silver",
		proName: "TVC:SILVER",
	},
];

export type TickerTapeProps = {
	colorTheme?: ColorTheme;
	isTransparent?: boolean;
	showSymbolLogo?: boolean;
	locale?: Locales;
	symbols?: "forex" | "crypto" | "commodity";
	children?: never;
	containerId?: string;
	copyrightStyles?: CopyrightStyles;
};

const TickerTape: React.FC<TickerTapeProps> = ({
	colorTheme = "light",
	isTransparent = false,
	showSymbolLogo = true,
	locale = "en",
	symbols = defaultSymbols,
	copyrightStyles,
	containerId,
	...props
}) => {
	return (
		<Widget
			scriptHTML={{
				colorTheme,
				isTransparent,
				showSymbolLogo,
				locale,
				symbols:
					symbols === "forex"
						? forexSymbols
						: symbols === "crypto"
						? cryptoSymbol
						: commoditySymbols,
				...props,
			}}
			containerId={containerId}
			scriptSRC="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
			copyrightProps={{
				copyrightStyles,
				href: `https://www.tradingview.com/`,
				spanText: `Quotes`,
			}}
		/>
	);
};

export default memo(TickerTape);
