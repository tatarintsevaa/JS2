class ProductList {
    constructor() {
        this.items = [];
    }

    fetchItems() {
        this.items = [
            {title: 'Компьютерная мышь', price: 400},
            {title: 'Жесткий диск SSD 1Tb', price: 10000},
            {title: 'Материнская плата', price: 4000},
            {title: 'Видео-карта', price: 15000},
        ];
    }

    render() {
        const block = document.querySelector('.products');
        this.items.forEach((product) => block.insertAdjacentHTML('afterbegin', new ProductItem(product)
            .render()))
    };
}

class ProductItem {
    constructor(product, image = 'http://via.placeholder.com/150x120') {
        this.title = product.title;
        this.price = product.price;
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

const list = new ProductList();
list.fetchItems();
list.render();



