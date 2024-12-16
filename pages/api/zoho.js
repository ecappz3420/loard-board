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
        const { reportName, criteria } = req.query;
        if (!reportName) {
          return res.status(400).json({ message: "Report Name Not Found" });
        }
        const records = await getRecords(
          access_token,
          reportName,
          criteria || "ID != null"
        );
        return res.status(200).json({ records });
      } catch (error) {
        return res.status(400).json({ message: "Error fetching record" });
      }
    } else if (req.method === "POST") {
      try {
        const body = await req.body;
        const { formData, formName } = body;
        if (!formName || !formData) {
          return res.status(400).json({
            message: "Missing 'Form Name' or 'Form Data' in request body",
          });
        }
        const response = await addRecord(access_token, formData, formName);
        return res.status(200).json({ response });
      } catch (error) {
        return res.status(400).json({ message: "Error adding records" });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "Error fetching access token" });
  }
}
