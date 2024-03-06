import { Dispatch } from "react";
import Image from "next/legacy/image";
import { IoClose } from "react-icons/io5";
import Button from "../../UI/Button";
import ModalBody from "../ModalBodyCard";

import styles from "../ModalBodyCard.module.scss";
import { moneyBag, checkIcon, exclamationIcon } from "@/helpers/image-imports";
import { TiTick } from "react-icons/ti";

interface Props {
  showModal: Dispatch<boolean>;
  investType: string;
}

const InvestmentSuccessfull = ({ showModal, investType }: Props) => {
  return (
    <ModalBody>
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
          <span className="size_18 bold">All Done</span>
        </div>

        <button className={styles.close} onClick={() => showModal(false)}>
          <IoClose color="white" size={28} />
        </button>
      </div>
      <div className={styles.background_tick}>
        <TiTick size={84} />
      </div>
      <span
        style={{ display: "block", textAlign: "center" }}
        className={`size_16`}>
        You have successfully subscribed to{" "}
        <span className={styles.colored_text}>{investType}</span> investment
        plan.
      </span>
      <Button
        disabled={false}
        showLoader={false}
        onClick={() => {
          showModal(false);
        }}>
        Done
      </Button>
    </ModalBody>
  );
};

export default InvestmentSuccessfull;
