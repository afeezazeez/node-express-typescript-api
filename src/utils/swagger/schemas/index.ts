import * as authSchema from "./auth.schema";
import * as productSchema from "./product.schema"
export const schemas = {
    ...authSchema,
    ...productSchema
}