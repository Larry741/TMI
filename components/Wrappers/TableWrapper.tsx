import React, { ReactNode } from "react";
import styles from "./TableWrapper.module.scss";

interface Props {
  isLoading: boolean;
  children: JSX.Element;
  tableData: any;
  emptyString?: string;
  hasActionTab?: boolean;
  className?: string;
}

const TableWrapper = ({
  children,
  tableData,
  emptyString,
  isLoading,
  hasActionTab,
  className
}: Props) => {
  return (
    <div className={styles.scroll_wrapper}>
      <table
        className={`${hasActionTab ? styles.table_action : ""} ${className}`}>
        {tableData?.props?.children?.length === 0 && !isLoading ? (
          <>
            <tbody className="size_14">
              <>{children}</>
              <tr>
                <td colSpan={children.props.children.length}>
                  <div className="alert alert-danger text-center text-bold">
                    {" "}
                    {emptyString}
                  </div>
                </td>
              </tr>
            </tbody>
          </>
        ) : !isLoading ? (
          <>
            <tbody>
              <>{children}</>
              <>{tableData}</>
            </tbody>
          </>
        ) : (
          <tbody className={styles.loading_skeleton}>
            <>{children ? children : null}</>
            {tableData?.props?.children instanceof Array &&
            tableData?.props?.children.length > 0
              ? tableData?.props.children?.map((_: any, idx: number) => {
                  return (
                    <tr key={idx}>
                      <td colSpan={children.props.children.length}>
                        <div>
                          <span className="size_14">All</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : [1].map((_: any, idx: number) => {
                  return (
                    <tr key={idx}>
                      <td colSpan={children.props.children.length}>
                        <div>
                          <span className="size_14">All</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            {}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default React.memo(TableWrapper);
