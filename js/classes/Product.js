/**
 * Product Class
 * Represents a product in the catalog with all its properties
 */
class Product {
    constructor(id, name, price, category, image, description, additionalImages = [], rating = 0, reviews = []) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
        this.description = description;
        this.additionalImages = additionalImages;
        this.rating = rating;
        this.reviews = reviews;
    }
}