import { useMemo, useState } from "react";
import styles from "./Faq.module.scss";
import FaqItem from "./FaqItem";
import { Poppins, Work_Sans } from "next/font/google";

type FaqNavTypes = "general" | "investments" | "withdrawal" | "referral";

export interface FaqQuestion {
	title: string;
	answer: string;
}

const ft = Poppins({
	subsets: ["latin"],
	display: "swap",
	weight: ["300", "400", "700"],
});

const FaqSection = () => {
	const [faqNavState, setFaqNavState] = useState<FaqNavTypes>("general");

	const selectedFaq = useMemo(() => {
		if (faqNavState === "general") {
			return generalFaqList;
		} else if (faqNavState === "investments") {
			return investmentFaqList;
		} else if (faqNavState === "referral") {
			return referralFaqList;
		} else {
			return withdrawalFaqList;
		}
	}, [faqNavState]);

	return (
		<section className={`${styles.section} col-md-12`}>
			<h2 className="tf-title size_30-36">FAQ</h2>
			<div className="heading-line margin_max"></div>

			<div className={`${styles.question} ${ft.className} size_15_18`}>
				Have questions? Explore our frequently asked questions to find answers
				and gain a deeper understanding of our Platform.
			</div>

			<nav className={`${styles.navbar} nav_sm  bold`}>
				<div className={"nav_control size_16_24"}>
					<button
						className={faqNavState === "general" ? "activeNav" : undefined}
						disabled={faqNavState === "general"}
						onClick={() => setFaqNavState("general")}>
						General
					</button>
					<button
						className={faqNavState === "investments" ? "activeNav" : undefined}
						disabled={faqNavState === "investments"}
						onClick={() => setFaqNavState("investments")}>
						Investments
					</button>
					<button
						className={faqNavState === "withdrawal" ? "activeNav" : undefined}
						disabled={faqNavState === "withdrawal"}
						onClick={() => setFaqNavState("withdrawal")}>
						Withdrawal
					</button>
					<button
						className={faqNavState === "referral" ? "activeNav" : undefined}
						disabled={faqNavState === "referral"}
						onClick={() => setFaqNavState("referral")}>
						Referral
					</button>
				</div>
			</nav>

			<div className={styles.faq_item_control}>
				{selectedFaq.map((faq, idx) => {
					return <FaqItem key={idx} faq={faq} />;
				})}
			</div>
		</section>
	);
};

export default FaqSection;

const generalFaqList = [
	{
		title: "How do I become a member",
		answer: `Simply click the Sign Up button, fill out the form and that's it.`,
	},
	{
		title: "How can I make money with Top Metro Investment?",
		answer: `You can make money by investing in our `,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
];

const investmentFaqList = [
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
];

const withdrawalFaqList = [
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
];

const referralFaqList = [
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
	{
		title: "How do I get started with ShareOwnership?",
		answer: `At Top Metro Investments, we believe that everyone should have the opportunity to invest in real estate and build their financial future. We understand the complexities that often deter potential investors, and we're here to simplify them.`,
	},
];
