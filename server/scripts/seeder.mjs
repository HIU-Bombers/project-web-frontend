import fs from "node:fs";
import path from "node:path";
import fetch from "node-fetch";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function postMealMasterData(sessionId) {
  const url = "http://localhost:9000/meals"; 

  const csvFilePath = path.join(__dirname, "meals.csv");

  const csvData = fs.readFileSync(csvFilePath, "utf8");

  const lines = csvData.trim().split("\n");
  const keys = lines[0].split(",");

  const records = lines.slice(1).map((line) => {
    const values = line.split(",");
    const record = {};
    keys.forEach((key, index) => {
      if (key === "meal_image") {
        // meal_image だけは画像ファイルを読み込んで Base64 エンコード
        const imageFileName = values[index];
        if (imageFileName) {
          const imagePath = path.join(__dirname, "meal_image", imageFileName);
          try {
            const imageBuffer = fs.readFileSync(imagePath);
            record[key] = imageBuffer.toString("base64");
          } catch (error) {
            console.error(`画像ファイルが読み込めません: ${imagePath}\n`, error);
          }
        }
      } else {
        // meal_image 以外
        if (values[index]) {
          record[key] = values[index];
        }
      }
    });
    return record;
  });

  // 1 レコードずつ POST する
  for (const [index, record] of records.entries()) {
    console.log(`=== ${index + 1} 件目のレコードを送信中 ===`);    

    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionId}`
        },
        body: JSON.stringify(record),
      });
      const responseBody = await response.text();
      console.log("HTTPステータス:", response.status);
      console.log("レスポンスボディ:", responseBody);
    } catch (error) {
      console.error("POST リクエストでエラーが発生しました:", error);
    }
    console.log("");
  }
}
