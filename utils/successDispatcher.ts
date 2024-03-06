import { NextApiResponse } from "next";
import { disconnectDb } from "./mongo";

const successDispatcher = (
  res: NextApiResponse,
  status: number,
  message: string,
  data: any
) => {
  // await disconnectDb();

  return res.status(status).json({
    success: true,
    message: message,
    data: data
  });
};

export default successDispatcher;
