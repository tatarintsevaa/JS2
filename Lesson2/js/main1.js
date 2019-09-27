class ProductList {


}

class ProductItem {
    constructor(title, price, image = 'http://via.placeholder.com/150x120') {
        this.title = title;
        this.price = price;
        this.image = image;
    }
    render() {
        return `<div class="product-item">
        <img src="${this.image}" alt="photo">
        <div class="product-item__text">
            <h3>${this.title}</h3>
            <p>${this.price} &#8381;</p>
            <button class="by-btn">Купить</button>
        </div>
     </div>`
    }
}

