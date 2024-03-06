import { FaCircle } from "react-icons/fa";
import React, { useCallback, useContext, useRef, useState } from "react";
import { BiDollar } from "react-icons/bi";
import { BsCurrencyBitcoin } from "react-icons/bs";
import WithdrawIndex from "@/components/Modals/Withdraw/Index";
import NotificationContext from "@/context/notification";
import useSession from "@/hooks/use-Session";
import Button from "@/components/UI/Button";

import styles from "./withdawals.module.scss";
import { BANK_DETAIL, ETH_ADDRESS } from "@/utils/constants";

const IndexWithdrawal = () => {
  const { data } = useSession();
  const { setNotification } = useContext(NotificationContext);
  const [currency, setCurrency] = useState<"fiat" | "crypto">("fiat");
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>();
  const [detail, setDetail] = useState<string>("");
  const [paymentChannel, setPaymentChannel] = useState<
    "bank" | "paypal" | "BTC" | "ETH" | "USDT"
  >();
  const formRef = useRef<HTMLFormElement>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>({});

  const proceedWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();

    if (currency === "crypto" && data?.balance.crypto["BTC"] < amount!) {
      return setNotification({
        message: "Insufficient balance to perform this transaction",
        title: "Error",
        status: "ERROR"
      });
    } else if (
      currency === "fiat" &&
      data?.balance.fiat[data.currency] < amount!
    ) {
      return setNotification({
        message: "Insufficient balance to perform this transaction",
        title: "Error",
        status: "ERROR"
      });
    }

    const form = e.currentTarget as HTMLFormElement;
    const formInputs = form.elements;

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

    if (!isValid) {
      return setNotification({
        message: `Please fill out the form`,
        status: "ERROR",
        title: "Error"
      });
    }

    setPaymentDetails(formData);
    setShowWithdrawModal(true);
  };

  const withdrawCompleted = useCallback(() => {
    formRef!.current?.reset();
    setShowWithdrawModal(false);
  }, []);

  return (
    <>
      {showWithdrawModal && (
        <WithdrawIndex
          paymentDetails={paymentDetails}
          showModal={setShowWithdrawModal}
          withdrawCompleted={withdrawCompleted}
        />
      )}

      <div className="col-xl-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title size_16 lighter">Withdraw</h4>
          </div>

          <div className="card-body">
            <div className="row justify-content-center">
              <div className="col-xl-8">
                <form
                  ref={formRef}
                  onSubmit={proceedWithdrawal}
                  className={styles.form}>
                  <div
                    className={`${styles.form_group} form-group row align-items-center`}>
                    <div className="col-sm-4">
                      <label htmlFor="inputEmail3" className="col-form-label">
                        Select Currency
                        <br />
                        <small>Crypto / Fiat</small>
                      </label>
                    </div>

                    <div className="col-sm-8">
                      <div className="input-group mb-3">
                        <select
                          onChange={(
                            e: React.ChangeEvent<HTMLSelectElement>
                          ) => {
                            setCurrency(e.currentTarget.value as any);
                          }}
                          value={currency}
                          name="currency"
                          className="form-control"
                          required>
                          <option value="fiat">Fiat</option>
                          <option value="crypto">Crypto</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {currency === "crypto" && (
                    <div
                      className={`${styles.form_group} form-group row align-items-center`}>
                      <div className="col-sm-4">
                        <label className="mr-sm-2">
                          Choose Payment Channel
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <div className="input-group mb-3">
                          <select
                            name="channel"
                            id="method_changer"
                            required
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                              setPaymentChannel(e.currentTarget.value as any);
                            }}
                            className="form-control">
                            <option value="BTC">Bitcoin</option>
                            <option value="ETH">Ethereum</option>
                            <option value="USDT">Tether</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {currency === "crypto" ? (
                    <div
                      className={`${styles.form_group} form-group row align-items-center`}>
                      <div className="col-sm-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Amount
                          <br />
                          <small>Maximum amount withdrawable: 5BTC</small>
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <div className="input-group mb-3">
                          <div className="input-group-prepend">
                            <label
                              className={`${styles.dollar_input_label} input-group-text bg-primary`}>
                              <BsCurrencyBitcoin
                                style={{ color: "white" }}
                                size={18}
                              />
                            </label>
                          </div>
                          <input
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setAmount(e.currentTarget.value as any);
                            }}
                            value={amount}
                            type="number"
                            name="amount"
                            className="form-control text-right"
                            placeholder={paymentChannel}
                            required
                            step="any"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${styles.form_group} form-group row align-items-center`}>
                      <div className="col-sm-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Amount
                          <br />
                          <small>Maximum amount withdrawable: $50,000</small>
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <div className="input-group mb-3">
                          <div className="input-group-prepend">
                            <label className="input-group-text bg-primary">
                              <BiDollar style={{ color: "white" }} size={18} />
                            </label>
                          </div>
                          <input
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setAmount(e.currentTarget.value as any);
                            }}
                            value={amount}
                            type="number"
                            name="amount"
                            className="form-control text-right"
                            placeholder="USD"
                            required
                            step="any"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currency === "crypto" && (
                    <div
                      className={`${styles.form_group} form-group row align-items-center`}>
                      <div className="col-sm-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Wallet Address
                          <br />
                          <small>Enter your wallet address</small>
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <div className="input-group mb-3">
                          <input
                            type="number"
                            name="address"
                            className="form-control text-right"
                            placeholder={ETH_ADDRESS}
                            required
                            step="any"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currency === "fiat" && (
                    <div
                      className={`${styles.form_group} form-group row align-items-center`}>
                      <div className="col-sm-4">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Account Detail
                        </label>
                      </div>
                      <div className="col-sm-8">
                        <div className="input-group mb-3">
                          <input
                            type="number"
                            name="address"
                            className="form-control text-right"
                            placeholder={BANK_DETAIL}
                            required
                            step="any"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`${styles.form_group} form-group row align-items-center`}>
                    <div className="col-sm-4">
                      <label htmlFor="inputEmail3" className="col-form-label">
                        Additional Details
                        <br />
                        <small>Enter Additional Withdrawal Details</small>
                      </label>
                    </div>
                    <div className="col-sm-8">
                      <div className="input-group mb-3">
                        <textarea
                          name="detail"
                          className={`${styles.textarea} form-control`}
                          rows={4}
                          required
                          value={detail}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => {
                            setDetail(e.currentTarget.value as any);
                          }}
                          placeholder="Enter Additional Details"></textarea>
                      </div>
                    </div>
                  </div>

                  {currency === "crypto" && (
                    <div
                      className={`${styles.form_group} form-group row align-items-center`}>
                      <div className="col-sm-6">
                        <label htmlFor="inputEmail3" className="col-form-label">
                          Network Fee
                          <br />
                          <small>
                            Transactions on the Network are prioritized by fees
                          </small>
                        </label>
                      </div>
                      <div className="col-sm-6">
                        <h4
                          className={`${styles.network_fee} text-right size_16`}>
                          0.005
                        </h4>
                      </div>
                    </div>
                  )}

                  <div className={`${styles.btn_container} text-right`}>
                    <Button className={styles.proceed_btn} type="submit">
                      Proceed
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xl-12">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title size_16 lighter">
              Important Information
            </h4>
          </div>

          <div className="card-body">
            <div className="important-info">
              <ul className={styles.info_list}>
                <li className="size_15">
                  <FaCircle size={10} />
                  For security reasons, Top Metro Investment processes
                  withdrawals by review once a day. For more information in this
                  policy. Please see our wallet security page.
                </li>
                <li className="size_15">
                  <FaCircle size={10} />
                  Submit your withdrawals by 07:00 UTC +00 (about 11 hour) to be
                  included in the days batch
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexWithdrawal;
