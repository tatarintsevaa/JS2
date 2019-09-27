/*
ответ на 1ый вопрос.
Должны быть родительские классы Item и List от которых будут наследоваться классы товаров, товаров корзины и списков
 тоовара и корзины.
 У товаров должны быть методы добавления товара( в списке товаров) в корзину по клику.У товаров в корзине -
 удаления/изменения количества и метод подсчета общей стоимости.
 */

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

    /**
     * Метод суммы товаров
     * @returns {number} Возвращает сумму всех товаров
     */
    totalPrice() {
        return this.items.reduce((sum, current) => sum + current.price ,0);
    }
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

class CartList {

}

class CartItem {
    constructor(product, img = 'http://via.placeholder.com/50x40') {
        this.title = product.title;
        this.price = product.price;
    }
    render() {
        return `<div class="cart-drop invisible">
            <div class="cart-item">
                <img src="" alt="img">
                <h5 class="cart-item__text">fjjhjhjhjj</h5>
                <p class="cart-item__quantity">qeada</p>
                <p class="cart-item__price">11111</p>
                <button class="btn-remove">X</button>
            </div>
        </div>`
    }
}

const list = new ProductList();
list.fetchItems();
list.render();
console.log(list.totalPrice());



