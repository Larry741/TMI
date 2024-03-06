import Image from "next/legacy/image";
import moment from "moment";
import { useContext, useState } from "react";
import { SwiperSlide } from "swiper/react";
import Link from "../../../../UI/Link";
import StatCardContainer from "../../../../Cards/StatCardContainer";
import TransactionsTable from "./TransactionsTable";
import ActivitiesTable from "./ActivitiesTable";

import styles from "./InvestorDetail.module.scss";
import {
  returnIconBlue,
  investValueIcon,
  stackedSquaresIconWhite,
  accruedInterestsIcon,
  calendarIcon,
  individualAcctIcon,
  corporateAcctIcon,
  jointAccountIcon
} from "@/helpers/image-imports";
import { statCardBreakpoints } from "@/utils/cardBreakpoints";
import getUserTotalBal from "@/utils/getUserTotalBal";
import { UserSliceType } from "@/store/userSlice";
import useSession from "@/hooks/use-Session";
import { CURRENCY_SYMBOLS } from "@/utils/constants";
import Button from "@/components/UI/Button";
import Input from "@/components/Inputs/Inputs";
import useHttp from "@/hooks/use-Http";
import NotificationContext from "@/context/notification";

type Nav = "INVESTSUMMARY" | "ACTIVITES" | "TRANSACTHISTORY" | "INVESTACCT";
type PersonalInfoNav = "INFO" | "NEXTOFKIN";

const InvestorDetail = ({ data }: { data: UserSliceType }) => {
  const [personalInfoNavState, setPersonalInfoNavState] =
    useState<PersonalInfoNav>("INFO");
  const [navState, setNavState] = useState<Nav>("INVESTSUMMARY");
  const { data: sessionData } = useSession();
  const { setNotification } = useContext(NotificationContext);
  const { httpIsLoading, sendRequest } = useHttp();
  const [loadingBtn, setLoadingBtn] = useState<string>();

  const userBal = getUserTotalBal(
    data.currency,
    data.balance,
    sessionData.rates
  );

  const httpSaveBal = async (updateBal: string, e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formInputs = form.elements;
    setLoadingBtn(updateBal);

    const formData: any = {};
    let isValid = true;
    // Iterate through form elements
    for (let i = 0; i < formInputs.length; i++) {
      const input = formInputs[i] as HTMLInputElement;

      // Check if the element is an input or textarea
      if (
        input.tagName === "INPUT" ||
        input.tagName === "SELECT" ||
        input.tagName === "TEXTAREA"
      ) {
        if (input.value === "") isValid = false;

        if (input.name === "email") continue;
        formData[input.name] = input.value;
      }
    }

    const { error, message, status } = await sendRequest(
      "PUT",
      "user/admin/topup",
      {
        userId: data._id,
        updateBal: updateBal,
        bal: formData
      },
      "JSON"
    );

    setLoadingBtn("");
    if (error) {
      return setNotification({
        message: `${message}`,
        status: "ERROR",
        title: "Error"
      });
    }

    return setNotification({
      message: `${message}`,
      status: "SUCCESS",
      title: "Success"
    });
  };

  return (
    <div className={`${styles.investor_detail} content_sec`}>
      <div className={styles.return_link}>
        <Link href={"/admin/investors"} className="size_14-15 bold">
          <Image alt="Back logo" src={returnIconBlue} objectFit="contain" />{" "}
          Back To Investors
        </Link>
      </div>

      <div>
        <div className={styles.personal_info_container}>
          <div className={styles.personal_info}>
            <div
              style={{ color: "black" }}
              className={`${styles.avatar_control} size_27-36 bold`}>
              {data.avatar ? (
                <Image
                  className="avatar"
                  alt=""
                  layout="fill"
                  src={`${data.avatar}`}
                  objectFit="contain"
                />
              ) : (
                <>
                  {data.firstName?.slice(0, 1)}
                  {data.lastName?.slice(0, 1)}
                </>
              )}
            </div>
            <div className={styles.user_status}>
              <h2
                style={{ color: "black" }}
                className={`${styles.user_name} size_24 bold`}>
                {data.firstName} {data.lastName}
              </h2>
              <div className={styles.user_cta}>
                <button
                  className={`${styles.status} ${
                    data.status === "enabled"
                      ? styles.active_user
                      : styles.disabled_user
                  } size_14 bold`}>
                  {data.status === "enabled" ? "Active" : "Disabled"}
                </button>
                <button className={`${styles.message_cta} size_14 bold`}>
                  Message
                </button>
              </div>
            </div>
          </div>

          <nav
            style={{ marginTop: "4rem" }}
            className={`nav_sm size_16-17 bold`}>
            <div style={{ marginBottom: "0" }} className="nav_control">
              <button
                onClick={() => setPersonalInfoNavState("INFO")}
                className={`${
                  personalInfoNavState === "INFO" ? `activeNav` : null
                } size_16 bold`}>
                Personal Information
              </button>
              <button
                onClick={() => setPersonalInfoNavState("NEXTOFKIN")}
                className={`${
                  personalInfoNavState === "NEXTOFKIN" ? `activeNav` : null
                } size_16 bold`}>
                Next Of Kin
              </button>
            </div>
          </nav>

          {personalInfoNavState === "INFO" ? (
            <div className={`${styles.user_details} size_15`}>
              <div className={styles.detail_container}>
                <span>Email:</span>
                <span className="size_15 bold">{data?.email || "N/A"}</span>
              </div>
              <div className={styles.detail_container}>
                <span>Phone:</span>
                <span className="size_15 bold">{data.phone || "N/A"}</span>
              </div>

              <div className={styles.detail_container}>
                <span>Gender:</span>
                <span
                  style={{ textTransform: "capitalize" }}
                  className="size_15 bold">
                  {data.gender || "N/A"}
                </span>
              </div>
              <div className={styles.detail_container}>
                <span>Country:</span>
                <span className="size_15 bold">{data?.country || "N/A"}</span>
              </div>
            </div>
          ) : (
            <div className={`${styles.user_details} size_15`}>
              <div className={styles.detail_container}>
                <span>Full Name:</span>
                <span className="size_15 bold">
                  {/* {data.kin.firstName
                    ? `${data.firstName} ${data.kin.lastName}`
                    : "N/A"} */}
                </span>
              </div>

              <div className={styles.detail_container}>
                <span>Phone:</span>
                {/* <span className="size_15 bold">
                  {data.kin.phoneNumber || "N/A"}
                </span> */}
              </div>

              <div className={styles.detail_container}>
                <span>Email:</span>
                {/* <span className="size_15 bold">{data.kin.email || "N/A"}</span> */}
              </div>

              <div className={styles.detail_container}>
                <span>Relationship:</span>
                {/* <span
                  style={{ textTransform: "capitalize" }}
                  className="size_15 bold">
                  {data.kin.relationship || "N/A"}
                </span> */}
              </div>

              <div className={styles.detail_container}>
                <span>Gender:</span>
                {/* <span className="size_15 bold">{data.kin.gender || "N/A"}</span> */}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.form_control}>
        <form
          onSubmit={httpSaveBal.bind(this, "fiat")}
          className={styles.role_form}>
          <h1
            className="bold size_18"
            style={{ gridColumn: "1 / -1", color: "black", width: "100%" }}>
            Edit Fiat
          </h1>
          <Input
            label="USD Balance"
            initRenderUpdate={false}
            placeholder="USD Balance"
            value={`${data.balance.fiat.USD}`}
            required
            name="USD"
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Input
            label="GBP Balance"
            initRenderUpdate={false}
            placeholder="GBP Balance"
            required
            name="GBP"
            value={`${data.balance.fiat.GBP}`}
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Input
            label="EUR Balance"
            initRenderUpdate={false}
            placeholder="EUR Balance"
            required
            name="EUR"
            value={`${data.balance.fiat.EUR}`}
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Input
            label="CAD Balance"
            initRenderUpdate={false}
            placeholder="CAD Balance"
            required
            name="CAD"
            value={`${data.balance.fiat.CAD}`}
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Button showLoader={loadingBtn === "fiat"} type="submit">
            Save
          </Button>
        </form>

        <form
          style={{ marginTop: "5rem" }}
          onSubmit={httpSaveBal.bind(this, "crypto")}
          className={styles.role_form}>
          <h1
            className="bold size_18"
            style={{ gridColumn: "1 / -1", color: "black", width: "100%" }}>
            Edit Crypto
          </h1>
          <Input
            label="BTC Balance"
            initRenderUpdate={false}
            placeholder="BTC Balance"
            value={`${data.balance.crypto.BTC}`}
            required
            name="BTC"
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Input
            label="ETH Balance"
            initRenderUpdate={false}
            placeholder="ETH Balance"
            required
            name="ETH"
            value={`${data.balance.crypto.ETH}`}
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Input
            label="USDT Balance"
            initRenderUpdate={false}
            placeholder="USDT Balance"
            required
            name="USDT"
            value={`${data.balance.crypto.USDT}`}
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Button showLoader={loadingBtn === "crypto"} type="submit">
            Save
          </Button>
        </form>

        <form
          style={{ marginTop: "5rem" }}
          onSubmit={httpSaveBal.bind(this, "commodity")}
          className={styles.role_form}>
          <h1
            className="bold size_18"
            style={{ gridColumn: "1 / -1", color: "black", width: "100%" }}>
            Edit Commodity
          </h1>
          <Input
            label="GOLD Balance"
            initRenderUpdate={false}
            placeholder="GOLD Balance"
            value={`${data.balance.commodity.GOLD}`}
            required
            name="GOLD"
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Input
            label="OIL Balance"
            initRenderUpdate={false}
            placeholder="OIL Balance"
            required
            name="OIL"
            value={`${data.balance.commodity.OIL}`}
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Input
            label="SILVER Balance"
            initRenderUpdate={false}
            placeholder="SILVER Balance"
            required
            name="SILVER"
            value={`${data.balance.commodity.SILVER}`}
            updateInput={() => {}}
            validationFn={() => true}
          />

          <Button showLoader={loadingBtn === "commodity"} type="submit">
            Save
          </Button>
        </form>
      </div>

      <div className={styles.transaction_info}>
        <nav className={`nav_sm size_16-17 bold`}>
          <div className={"nav_control"}>
            <button
              onClick={() => setNavState("INVESTSUMMARY")}
              className={`${
                navState === "INVESTSUMMARY" ? `activeNav` : null
              } size_16 bold`}>
              Investment Summary
            </button>
            <button
              onClick={() => setNavState("ACTIVITES")}
              className={`${
                navState === "ACTIVITES" ? `activeNav` : null
              } size_16 bold`}>
              Activities
            </button>
          </div>
        </nav>
      </div>

      <>
        {navState === "INVESTSUMMARY" ? (
          <StatCardContainer
            breakpoints={statCardBreakpoints}
            hasContainer={true}
            heading={""}>
            <SwiperSlide>
              <div className={`stats_card stats_card_blue`}>
                <Image
                  alt=""
                  width={35}
                  height={25}
                  src={investValueIcon}
                  objectFit="contain"
                />
                <span className={`size_22 bold`}>
                  <span>
                    {CURRENCY_SYMBOLS[data.currency]}
                    {Number(userBal.total).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </span>
                <span className="size_16">Total Balance</span>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className={`stats_card stats_card_blue`}>
                <Image
                  alt=""
                  width={35}
                  height={25}
                  src={stackedSquaresIconWhite}
                  objectFit="contain"
                />
                <span className={`acc_bal size_22 bold`}>
                  <span>
                    {CURRENCY_SYMBOLS[data.currency]}
                    {Number(userBal.fiat).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </span>
                <span className="size_16">Total Fiat Bal</span>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className={`stats_card stats_card_blue`}>
                <Image
                  alt=""
                  width={35}
                  height={25}
                  src={accruedInterestsIcon}
                  objectFit="contain"
                />
                <span className={`acc_bal size_22 bold`}>
                  <span>
                    {CURRENCY_SYMBOLS[data.currency]}
                    {Number(userBal.crypto).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </span>
                <span className="size_16">Total crypto Bal</span>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className={`stats_card stats_card_blue`}>
                <Image
                  alt=""
                  width={35}
                  height={25}
                  src={calendarIcon}
                  objectFit="contain"
                />
                <span className={`acc_bal size_22 bold`}>
                  <span>
                    {CURRENCY_SYMBOLS[data.currency]}
                    {Number(userBal.commodity).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </span>
                <span className="size_16">Total Commodity Bal</span>
              </div>
            </SwiperSlide>
          </StatCardContainer>
        ) : navState === "ACTIVITES" ? (
          <div>
            <ActivitiesTable
              userId={data._id}
              userName={`${data.firstName} ${data.lastName}`}
              userAvatar={data.avatar!}
            />
          </div>
        ) : null}
      </>
    </div>
  );
};

export default InvestorDetail;
