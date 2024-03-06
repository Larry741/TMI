import { disconnect } from "process";
import { dbConnect } from "./mongo";
import { NextApiResponse, NextApiRequest } from "next";
import { NextHandler } from "next-connect";
import Cors from "cors";
const nc = require("next-connect");
const helmet = require("helmet");

const cors = Cors({
  origin: "*",
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"]
});

export default function handler() {
  return nc({
    async onError(
      err: any,
      req: NextApiRequest,
      res: NextApiResponse,
      next: NextHandler
    ) {
      console.log(err);
      // disconnect();
      res.status(500).json({ error: "Server Error" });
    },
    async onNoMatch(
      req: NextApiRequest,
      res: NextApiResponse,
      next: NextHandler
    ) {
      // disconnect();
      res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  })
    .use(helmet())
    .use(cors)
    .use(
      async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
        await dbConnect();
        next();
      }
    );
}
