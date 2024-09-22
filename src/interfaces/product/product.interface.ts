import {ICategory} from "./category.interface";

export interface IProduct {
    uuid: string;
    name: string;
    description:string;
    price:number;
    category:ICategory
}
