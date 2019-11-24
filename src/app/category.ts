import { Adapter } from './adapter';
import { Injectable } from '@angular/core';

export class Category {
    constructor(public id:number, public name:string, public subCategories: Category[]){

    }
}

@Injectable({
    providedIn: 'root'
})
export class CategoryAdapter implements Adapter<Category>{
    adapt(item: any):Category {
        let categoryItem = new Category(item.id, item.name, []);
        if (Array.isArray(item.subcategory)) {
            for (let subcategory of item.subcategory.filter(category => category.name != "")) {
                categoryItem.subCategories.push(new Category(subcategory.id, subcategory.name, []))
            }
        }
        
        return categoryItem;
    }
}