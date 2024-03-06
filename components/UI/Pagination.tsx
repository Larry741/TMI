import { useMemo } from "react";
import styles from "./Pagination.module.scss";
import { getPagination } from "@/utils/getPagination";

interface Props {
  limit: number;
  page: number;
  count: number;
  httpGetNextPrev: (page: number, subLimit?: number) => void;
}

const Pagination = ({
  limit = 20,
  page = 1,
  count = 0,
  httpGetNextPrev = () => {}
}: Props) => {
  let totalPages = Math.ceil(count / limit);

  const p = page - 1;
  const lim = limit * p;
  const fromLimit = lim + 1;
  const items = useMemo(() => {
    return getPagination({ current: page, max: totalPages })?.items;
  }, [page, totalPages]);

  return (
    <div className={styles.pagination}>
      {totalPages ? (
        <span className="size_14">
          Showing {fromLimit} - {Math.min(limit * page, count)} of {count} items
        </span>
      ) : (
        <span className="size_14">Showing 0 - 0 of 0 items</span>
      )}

      <div className={styles.pages}>
        {items?.map((val, idx) => {
          if (count == 0) return;
          return (
            <button
              key={idx}
              disabled={page == val || val === "…"}
              className={`${styles.page} ${
                val == page && styles.activePage
              } size_14 bold`}
              onClick={() => {
                httpGetNextPrev(+val);
              }}>
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Pagination;
