import { NextResponse } from "next/server";
import {
  addRecord,
  getRecords,
  refreshAccessToken,
} from "../controllers/tms.app";

export default async function handler(req, res) {
  try {
    const access_token = await refreshAccessToken();
    if (req.method === "GET") {
      try {
        const { searchParams } = new URL(req.url);
        const reportName = searchParams.get("reportName");
        const criteria = searchParams.get("criteria");
        if (!reportName) {
          res.status(400).json({ message: "Report Name Not Found" });
        }
        const records = await getRecords(
          access_token,
          reportName,
          criteria || "ID != null"
        );
        res.status(200).json({ records });
      } catch (error) {
        res.status(400).json({ message: "Error fetching record" });
      }
    } else if (req.method === "POST") {
      try {
        const body = await req.json();
        const { formData, formName } = body;
        if ((!formName, !formData)) {
          res
            .status(400)
            .json({
              message: "Missing 'Form Name' or 'Form Data' in request body",
            });
        }
        const response = await addRecord(access_token, formData, formName);
        res.status(200).json({ response });
      } catch (error) {
        res.status(400).json({ message: "Error adding records" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching access token" });
  }
}
