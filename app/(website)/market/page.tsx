"use client";

import Link from "next/link";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";

import styles from "@/styles/app/auth.module.css";

const MarketsPage = () => {
	return (
		<>
			<Header />
			<section className={`${styles.section} flat-title-page inner`}>
				<div className="overlay"></div>
				<div className="themesflat-container">
					<div className="row">
						<div className="col-md-12">
							<div className="page-title-heading mg-bt-12">
								<h1 className="heading text-center">Market</h1>
							</div>
							<div className="breadcrumbs style2">
								<ul>
									<li>
										<Link href="/">Home</Link>
									</li>
									<li>
										<Link href="/market">Market</Link>
									</li>
									<li>Global Market</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="tf-contact tf-section">
				<div className="themesflat-container">
					<div className="row">
						<div className="col-lg-6 col-md-6 col-12">
							<div className="box-feature-contact">
								<img src="images/forex.png" alt="Image" />
							</div>
						</div>
						<div className="col-lg-6 col-md-6 col-12">
							<h2 className="tf-title-heading style-2 size_30-36 mg-bt-12">
								FOREX
							</h2>
							<h4 className="tf-title-heading style-2 mg-bt-12">
								Trade the most popular currency pairs with limited risk and low
								cost
							</h4>
							<h5 className="sub-title style-1">
								Top Metro Investment Forex market (short for “foreign exchange”)
								is the largest and the most liquid financial market where the
								global currencies are traded. Forex traders purchase currencies
								with the intent to make money off of the difference between the
								buying and the selling prices. Get in on the action of the most
								traded market in the world. The largest volume market in the
								world is currency exchange, with an average daily turnover of
								five trillion dollars. Traded across the global banking system,
								the spot forex market offers tremendous liquidity and
								opportunity. Top Metro Investment offers 10 of the most popular
								forex pairs as limited-risk binary options and spreads. You can
								trade them 24 hours a day, 5 days a week. The forex market has
								an average daily turnover of $5 trillion as traders strive to
								turn a profit by speculating on the value of one currency
								compared to another. Ready to be part of the market moves with a
								global leader in online currency trading?
							</h5>
						</div>
					</div>

					<hr />

					<div className="row">
						<div className="col-lg-6 col-md-6 col-12">
							<h2 className="tf-title-heading style-2 mg-bt-12 size_30-36">
								Cryptocurrency
							</h2>
							<h4 className="tf-title-heading style-2 mg-bt-12">
								Bitcoin opportunity without the hassle
							</h4>
							<h5 className="sub-title style-1">
								Since its &apos;hacker&apos; beginnings, Bitcoin and
								cryptocurrency have gone mainstream and soared in value. More
								traders than ever want to add cryptocurrencies to their
								portfolios. However, the volatility makes the Bitcoin market
								good for short-term trades, not just &quot;buy and hold.&quot;
								Our Bitcoin Spreads allow you to take short-term positions on
								the price of Bitcoin, with risk-reward protections built in.
								Selling is as easy as buying, meaning you have profit
								opportunities no matter which direction the Bitcoin market is
								trending. Trade the price of Bitcoin without buying and selling
								the bitcoins themselves. No &quot;mining,&quot; no risk exposure
								outside your comfort level—you can just trade with all the
								benefits of our platform: limited risk, transparent price, and
								CFTC regulation.
							</h5>
							<h4 className="tf-title-heading style-2 mg-bt-12">
								Bitcoin Spreads: A Better Way
							</h4>
							<h5 className="sub-title style-1">
								Our Bitcoin Spreads let you trade the price of Bitcoin (based on
								the trusted TeraBit IndexSM) without having to own bitcoins.
								There&apos;s no need for wallets or conversion, since the
								contracts are settled in US dollars. Best of all, it&apos;s as
								easy to trade price drops as it is to trade rallies.
								Short-selling Bitcoin is as easy as buying when you use Bitcoin
								Spreads. As the price of Bitcoin varies up and down, the
								spread&apos;s value moves as well, but with limits. Above the
								ceiling or below the floor, the value of the spread stops moving
								and remains at its upper or lower limit (depending on whether
								you are a buyer or seller). In this way, your risk-reward
								remains within a defined range. One limit is your profit target.
								The other is your guaranteed protection against unlimited
								losses.
							</h5>
						</div>
						<div className="col-lg-6 col-md-6 col-12">
							<div className="box-feature-contact">
								<img src="images/bitcoin.jpg" alt="Image" />
							</div>
						</div>
					</div>

					<hr />

					<div className="row">
						<div className="col-lg-6 col-md-6 col-12">
							<h2 className="tf-title-heading style-2 mg-bt-12 size_30-36">
								Commodities
							</h2>
							<img src="images/gold.jpg" alt="Image" />
							<h4 className="tf-title-heading style-2 mg-bt-12">
								Trade the Basic Commodities of Life
							</h4>
							<h5 className="sub-title style-1">
								Commodities are basic to our daily life, which makes the
								commodity futures markets among the largest, with huge trading
								volumes. Binary options and spreads give you a different way to
								trade commodities—with limited risk and a lower cost of entry.
								You can never be stopped out or get a margin call.
								<br />
								We offer binaries on these metals, energies and agricultural
								products:
								<br />
								Metal: gold, silver, copper
								<br />
								Energy: crude oil and natural gas
								<br />
								Agricultural: corn and soybeans
							</h5>
						</div>
						<div className="col-lg-6 col-md-6 col-12">
							<h2 className="tf-title-heading style-2 mg-bt-12 size_30-36">
								Make Volatility Your Ally
							</h2>
							<img src="images/d.jpg" alt="Image" />

							<h5 className="sub-title style-1">
								In 2014, the price of crude oil fell by more than half.
								Oil-dependent economies like Russia’s suffered, while consumers
								enjoyed lower gas prices. Volatility was widespread. Most
								traders are not prepared or lack the capital to trade commodity
								futures alongside the big players, especially when things are
								volatile. With our binary options and spreads, you trade
								commodity futures prices with smaller risk. You set your maximum
								possible loss before you enter the trade. If the market spikes
								against your position, your loss is limited and you won’t get
								stopped out even if your binary&apos;s value goes to zero. With
								our binary options and spreads, you can exit the trade prior to
								expiration, to take profits or avoid taking the maximum loss.
							</h5>
						</div>
					</div>

					<hr />

					<div className="row">
						<div className="col-lg-6 col-md-6 col-12">
							<h2 className="tf-title-heading style-2 mg-bt-12 size_30-36">
								Small Opening Balance, Big Opportunity
							</h2>
							<img src="images/opportunity.jpg" alt="Image" />
							<h4 className="tf-title-heading style-2 mg-bt-12">
								Small Opening Balance, Big Opportunity
							</h4>
							<h5 className="sub-title style-1">
								Most successful traders start off small, with the goal of
								learning and improving. However, in the world of commodity
								futures, small accounts face a lot of challenges. Most commodity
								trading educators assume you have $25,000 or more to start with,
								so that you can handle drawdowns of several thousand dollars and
								still come out on top. While that works for some, many traders
								want a different risk/reward profile, even if they have ample
								funds. That’s why we require a low initial deposit to fund your
								account (though most of our members do start with more). That’s
								also why we don’t promise “unlimited profit potential.” We have
								found that most traders are comfortable with capped profit in
								exchange for limited risk.
							</h5>
						</div>
						<div className="col-lg-6 col-md-6 col-12">
							<h2 className="tf-title-heading style-2 mg-bt-12 size_30-36">
								Protection of a Stop-Loss, Without Getting Stopped Out
							</h2>
							<img src="images/stoploss.jpg" alt="Image" />

							<h5 className="sub-title style-1">
								Commodity traders traditionally use stop-loss orders to limit
								risk. However, even with a stop, you still have the risk of
								slippage. You may incur a greater loss than you were prepared
								for or even get a margin call. With binary options and spreads,
								your maximum risk is set before you enter the trade. No
								unpleasant surprises if a trade doesn’t go your way. In fact, we
								doesn’t issue margin calls. Our binary options and spreads give
								you staying power in fast-moving, volatile markets. Most traders
								know the frustration of having the market move against you,
								getting stopped out, and watching it move back into profit
								territory. With us, you don&apos;t get stopped out, ever. If and
								when the market comes back, you&apos;re still in the trade. You
								can exit when you decide or hold to expiration.
							</h5>
						</div>
					</div>

					<hr />

					<div className="row">
						<div className="col-lg-6 col-md-6 col-12">
							<div className="box-feature-contact">
								<img src="images/crude.jpg" alt="Image" />
							</div>
						</div>
						<div className="col-lg-6 col-md-6 col-12">
							<h2 className="tf-title-heading style-2 mg-bt-12 size_30-36">
								Crude Oil
							</h2>
							<h4 className="tf-title-heading style-2 mg-bt-12">
								Trade the most popular currency pairs with limited risk and low
								cost
							</h4>
							<h5 className="sub-title style-1">
								Crude Oil is a trading instrument that offers a guaranteed
								return for a correct prediction about an asset’s price direction
								within a selected timeframe. An in-the-money option offers up to
								30% of profit every 30 days, while an unsuccessful one will
								result in the loss of the investment. With Crude Oil one can
								speculate on the price movements of various stocks, currency
								pairs, indices, commodities and even Cryptocurrencies.
							</h5>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
};

export default MarketsPage;
