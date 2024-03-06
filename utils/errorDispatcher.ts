import { NextApiResponse } from "next";
import { disconnectDb } from "./mongo";

const errorDispatcher = async (
  res: NextApiResponse,
  status: number,
  msg: string
) => {
  // await disconnectDb();
  return res.status(status).json({
    success: false,
    error: msg
  });
};
export default errorDispatcher;
