/**
 * Product Catalog Data
 * Contains all product information for the application
 */

// Product Class
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

// Product Catalog (Array Implementation)
const productCatalog = [
    // Best Sellers
    new Product(1, "Candy Pink", 9999.00, "best-sellers", "pics/b1.webp", 
        "A vibrant pink arrangement perfect for celebrations. This stunning bouquet features a mix of premium pink roses, peonies, and carnations, carefully arranged to create a breathtaking display of color and elegance.",
        ["pics/b1.webp", "pics/b2.webp", "pics/b3.webp"]),
    
    new Product(2, "Bright but Light", 2850.00, "best-sellers", "pics/b2.webp", 
        "A cheerful mix of bright flowers to light up any room. This arrangement combines sunflowers, daisies, and yellow roses to create a sunny, uplifting bouquet.",
        ["pics/b2.webp", "pics/b1.webp", "pics/b3.webp"]),
    
    new Product(3, "Berry Cheesecake", 6880.00, "best-sellers", "pics/b3.webp", 
        "Rich tones of berry and cream in an elegant display. This luxurious arrangement features deep burgundy roses, purple lisianthus, and white hydrangeas.",
        ["pics/b3.webp", "pics/b1.webp", "pics/b2.webp"]),
    
    new Product(4, "Dream Land", 3990.00, "best-sellers", "pics/b4.webp", 
        "Soft pastel blooms that evoke a dreamy atmosphere. Features lavender, pale pink roses, and white hydrangeas for a delicate and romantic arrangement.",
        ["pics/b4.webp", "pics/b1.webp", "pics/b2.webp"]),
    
    new Product(5, "Pinkish Belle", 5390.00, "best-sellers", "pics/b5.webp", 
        "Delicate pink flowers arranged with timeless elegance. A beautiful combination of pink peonies, roses, and carnations.",
        ["pics/b5.webp", "pics/b1.webp", "pics/b2.webp"]),

    new Product(6, "Normandiana Wreath", 6500.00, "best-sellers", "pics/b6.jpg", 
        "Normandiana Wreath in Pink and Gold is sure to bring a touch of elegance and sophistication to your space with this timelessly beautiful Normandiana Wreath! Perfectly crafted to bring festivity this Christmas season!",
        ["pics/b5.webp", "pics/b1.webp", "pics/b2.webp"]),

    // Fresh Flowers
    new Product(7, "Blooms Blush", 15999.00, "fresh", "pics/f1.jpg", 
        "A luxurious bouquet of premium fresh blooms featuring garden roses, ranunculus, and eucalyptus. Each stem is hand-selected for perfection.",
        ["pics/f1.jpg", "pics/f2.jpg", "pics/f3.jpg"]),
    
    new Product(8, "Blissful Roses", 6670.00, "fresh", "pics/f2.jpg", 
        "Classic roses arranged to perfection. This timeless bouquet features two dozen premium red roses, symbolizing deep love and affection.",
        ["pics/f2.jpg", "pics/f1.jpg", "pics/f3.jpg"]),
    
    new Product(9, "Rosette", 3490.00, "fresh", "pics/ff3.webp", 
        "A charming arrangement of roses and complementary flowers. Features pink and white roses with baby's breath for a classic look.",
        ["pics/ff3.webp", "pics/f1.jpg", "pics/f2.jpg"]),
    
    new Product(10, "Garden Delight", 4290.00, "fresh", "pics/Garden delight .jpeg", 
        "A beautiful mix of garden fresh flowers including lilies, chrysanthemums, and seasonal greens. Perfect for bringing a touch of nature indoors.",
        ["pics/f4.jpg", "pics/T2.jpg", "pics/G2.jpg"]),
    
    new Product(11, "White Elegance", 5590.00, "fresh", "pics/White elegance .jpg", 
        "Pure white flowers including lilies, roses, and orchids arranged for a sophisticated and clean look. Ideal for weddings and formal events.",
        ["pics/W1.jpeg", "pics/W2.jpeg", "pics/W1.jpeg"]),
    
    new Product(12, "Tropical Bliss", 3890.00, "fresh", "pics/Tropicalbliss.jpg", 
        "Exotic tropical flowers featuring birds of paradise, anthuriums, and tropical greens. Brings a vacation vibe to any space.",
        ["pics/F3.jpeg", "pics/T2.jpg", "pics/T1.jpeg"]),

    new Product(13, "Pastel Mixed", 4290.00, "fresh", "pics/T2.jpg", 
    " A symphony of pastels, a harmony of blooms with gentle gestures thats speaks volume",
        ["pics/f4.jpg", "pics/W2copy.jpeg", "pics/T2.jpg"]),
    
    new Product(14, "Vintage Peach Cream", 5590.00, "fresh", "pics/W1.jpeg", 
        " Where timeless beauty meets modern elegance. Love and light with every bloom.",
        ["pics/f5.webp", "pics/f6.webp", "pics/f1.jpg"]),
    
    new Product(15, "Golden Sunshine", 3890.00, "fresh", "pics/T1.jpeg", 
        "A radiant reminder of all things bright and beautiful.",
        ["pics/f6.webp", "pics/f4.jpg", "pics/ff3.webp"]),

    // Synthetic Flowers
    new Product(16, "Eterna", 349.00, "synthetic", "pics/s1.jpg", 
        "Lifelike synthetic flowers that last forever. These beautifully crafted roses maintain their vibrant color and delicate appearance year after year.",
        ["pics/s1.jpg", "pics/s2.jpg", "pics/s3.jpg"]),
    
    new Product(17, "Silken", 299.00, "synthetic", "pics/ff2.jpg", 
        "Silk flowers with remarkable realism. Our silk arrangements capture the delicate beauty of real flowers with incredible attention to detail.",
        ["pics/ff2.jpg", "pics/s1.jpg", "pics/s2.jpg"]),
    
    new Product(18, "Velvessa", 349.00, "synthetic", "pics/s2.jpg", 
        "Velvety textures that mimic real petals. These synthetic flowers have a soft, realistic feel that closely resembles fresh blooms.",
        ["pics/s2.jpg", "pics/s1.jpg", "pics/ff2.jpg"]),
    
    new Product(19, "Classic Roses", 399.00, "synthetic", "pics/s3.jpg", 
        "Timeless synthetic roses that never wilt. Available in various colors, these roses maintain their beauty forever with zero maintenance.",
        ["pics/s3.jpg", "pics/s4.jpg", "pics/s5.jpg"]),
    
    new Product(20, "Orchid Elegance", 449.00, "synthetic", "pics/s4.jpg", 
        "Lifelike synthetic orchids that capture the delicate beauty of real orchids. Perfect for office decor or home accents.",
        ["pics/s4.jpg", "pics/s3.jpg", "pics/s5.jpg"]),
    
    new Product(21, "Mixed Bloom", 499.00, "synthetic", "pics/s5.jpg", 
        "A beautiful arrangement of mixed synthetic flowers including peonies, roses, and hydrangeas. Looks incredibly realistic.",
        ["pics/s5.jpg", "pics/s3.jpg", "pics/s4.jpg"]),
    
    // Seasonal Flowers
    new Product(25, "Spring Tulips", 1999.00, "seasonal", "pics/spring1.webp", 
        "Fresh spring tulips in vibrant colors. Celebrate the arrival of spring with this cheerful bouquet of mixed tulips in shades of pink, yellow, and purple.",
        ["pics/spring1.webp", "pics/spring2.jpg", "pics/spring3.jpg"]),
    
    new Product(26, "Summer Sunflowers", 2499.00, "seasonal", "pics/summer1.jpg", 
        "Bright sunflowers to capture summer joy. These vibrant flowers bring the warmth and happiness of summer into any space.",
        ["pics/summer1.jpg", "pics/spring1.webp", "pics/fall.jpg"]),
    
    new Product(27, "Autumn Harvest", 2899.00, "seasonal", "pics/fall.jpg", 
        "Warm autumn colors featuring chrysanthemums, dahlias, and seasonal foliage. Perfect for fall celebrations and Thanksgiving.",
        ["pics/fall.jpg", "pics/spring1.webp", "pics/summer1.jpg"])
];