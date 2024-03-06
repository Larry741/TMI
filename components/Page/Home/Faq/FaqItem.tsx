import { useState } from "react";
import { FaqQuestion } from "./Faq";
import { IoIosArrowDown } from "react-icons/io";

import styles from "./FaqItem.module.scss";

interface Props {
  faq: FaqQuestion;
}

const FaqItem = ({ faq }: Props) => {
  const [showAnswer, setShowAnswer] = useState<boolean>();

  return (
    <div
      className={`${styles.dropdown_container} ${
        showAnswer
          ? styles.openList
          : showAnswer === false
          ? styles.closeList
          : ""
      }`}>
      <div className={`${styles.dropdown_btn} work-sans size_16-20 bold`}>
        <span className={`${styles.faq_title}`}>{faq.title}</span>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            setShowAnswer((prevState) => !prevState);
          }}>
          <IoIosArrowDown
            className={
              showAnswer
                ? styles.rotate_360
                : showAnswer === false
                ? styles.rotate_0
                : ""
            }
            size={20}
          />
        </button>
      </div>
      <div className={`${styles.faq_answer} work-sans size_15-16`}>
        {faq.answer}
      </div>
    </div>
  );
};

export default FaqItem;
