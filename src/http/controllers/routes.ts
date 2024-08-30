import { FastifyInstance } from "fastify";
import { createMeasure } from "./create-measure";
import { confirmMeasureValue } from "./confirm-measure-value";
import { fetchCustomerMeasures } from "./fetch-customer-measures";

export async function measuresRoutes(app: FastifyInstance) {
    app.post("/upload", createMeasure);
    app.patch("/confirm", confirmMeasureValue);
    app.get("/:customer_code/list",  fetchCustomerMeasures)

}