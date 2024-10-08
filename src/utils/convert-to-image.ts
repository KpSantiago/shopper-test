import fs from "fs";
import path from "path";
import { env } from "../env";

export function convertToImage(base64: string) {
    const base64String = base64.split(";base64,");

    const type = base64String[0].split("/")[1];

    const uniqueName = "measure_image_" + new Date().getTime();
    const fileName = `${uniqueName}.${type}`;

    if (env.NODE_ENV != "test") {
        fs.writeFile(path.join(__dirname, `./images/${fileName}`), base64String.pop()!, { encoding: "base64" }, (err) => {
            if (err) {
                console.log(err)
            }
        })
    }

    return fileName;
}