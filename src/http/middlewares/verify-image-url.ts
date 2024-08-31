import dayjs from "dayjs";
import fs from "fs";
import path from "path";
import { prisma } from "../../lib/prisma";

export async function verifyImageURL(): Promise<void> {
    const startDateOfThisMonth = dayjs(new Date()).startOf("M").toISOString();
    const measures = await prisma.measure.findMany({
        where: {
            measure_datetime: {
                lt: startDateOfThisMonth
            },
            image_url: {
                contains: "measure_image_",
            }
        }
    });

    measures.forEach(async (m) => {
        const image = m.image_url.split("/images/")[1];
        
        await prisma.measure.update({
            data: {
                image_url: "invalid_url"
            },
            where: {
                measure_uuid: m.measure_uuid
            }
        })

        fs.unlinkSync(path.join(__dirname, `./images/${image}`));
    })
}

