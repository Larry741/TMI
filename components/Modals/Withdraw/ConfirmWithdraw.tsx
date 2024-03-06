import { Dispatch, useState, useContext } from "react";
import { IoClose } from "react-icons/io5";
import Button from "@/components/UI/Button";
import useHttp from "@/hooks/use-Http";
import { useDispatch } from "react-redux";
import NotificationContext from "@/context/notification";
import ModalBody from "../ModalBodyCard";
import Image from "next/legacy/image";
import { exclamationIcon, moneyBag } from "@/helpers/image-imports";

import styles from "../ModalBodyCard.module.scss";

interface Props {
  showModal: Dispatch<boolean>;
  paymentDetails: any;
  setWithdrawSuccessfull: Dispatch<boolean>;
}

const ConfirmWithdraw = ({
  showModal,
  paymentDetails,
  setWithdrawSuccessfull
}: Props) => {
  const { httpIsLoading, sendRequest } = useHttp();
  const { setNotification } = useContext(NotificationContext);

  const httpCompleteWithdrawal = async () => {
    const { error, message, status } = await sendRequest(
      "POST",
      "transactions/withdrawal",
      {
        ...paymentDetails,
        status: "pending"
      },
      "JSON"
    );
    if (error) {
      return setNotification({
        message: message,
        status: "ERROR",
        title: "Error"
      });
    }

    setWithdrawSuccessfull(true);
  };

  return (
    <ModalBody gap={30}>
      <div className={styles.header}>
        <div className={styles.header_icon}>
          <span className={styles.check_icon}>
            <Image
              src={exclamationIcon}
              width="20"
              height={"20"}
              alt="Return"
            />
          </span>
          <span className="size_18 bold">Confirm Withdrawal</span>
        </div>

        <button className={styles.close} onClick={() => showModal(false)}>
          <IoClose color="white" size={28} />
        </button>
      </div>

      <Image alt="Copy" src={moneyBag} objectFit={"contain"} />

      <span
        style={{ lineHeight: "1.5", display: "block", textAlign: "center" }}
        className="size_16">
        You&apos;re about to initiate a withdrawal of{" "}
        <span className={`${styles.colored_text} size_16 bold`}>
          {paymentDetails.currency === "fiat" && "$"}
          {Number(paymentDetails.amount).toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          })}
          {paymentDetails.currency === "crypto" && paymentDetails.channel}
        </span>{" "}
      </span>

      <Button
        disabled={httpIsLoading}
        showLoader={httpIsLoading}
        onClick={httpCompleteWithdrawal}>
        Withdraw
      </Button>
    </ModalBody>
  );
};

export default ConfirmWithdraw;
