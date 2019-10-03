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
            {id: 1, title: 'Компьютерная мышь', price: 400, quantity: 1},
            {id: 2, title: 'Жесткий диск SSD 1Tb', price: 10000, quantity: 1},
            {id: 3, title: 'Материнская плата', price: 4000, quantity: 1},
            {id: 4, title: 'Видео-карта', price: 15000, quantity: 1},
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
        return this.items.reduce((sum, current) => sum + current.price, 0);
    }

}

class ProductItem {
    constructor(product, image = 'http://via.placeholder.com/150x120') {
        this.id = product.id;
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
            <button class="by-btn" data-id="${this.id}" data-price="${this.price}" data-title="${this.title}">Купить</button>
        </div>
     </div>`
    }
}

class CartList {
    constructor() {
        this.addedItems = [];
    }

    render() {
        const block = document.querySelector('.cart-drop');
        block.innerHTML = '';
        for (const item of this.addedItems) {
            const addedItem = new CartItem(item);
            block.insertAdjacentHTML('beforeend', addedItem.render());
        }


    }

    addItems(id, title, price) {
        let find = this.addedItems.find(product => product.id === id);
        if (find) {
            find.quantity++;
            // console.log(find);
            this.updateCart(find);
        } else {
            this.addedItems.push({id: id, title: title, price: price, quantity: 1});
            this.render();
        }

    }

    updateCart(product) {
        const block = document.querySelector(`.cart-item[data-id="${product.id}"]`);
        block.querySelector('.cart-item__quantity').textContent = product.quantity;
    }

    removeItem(id) {
        let find = this.addedItems.find(product => product.id === id);
        if (find.quantity > 1) {
            find.quantity--
            this.updateCart(find);
        } else {
            this.addedItems.splice(this.getRemovedItemIndex(id));
            this.render();
        }

    }

    getRemovedItemIndex(id) {
        return this.addedItems.findIndex(x => x.id === id)
    }

    init() {
        document.querySelectorAll('.by-btn').forEach(el => {
            el.addEventListener('click', e => {
                this.addItems(e.target.dataset.id, e.target.dataset.title, e.target.dataset.price)
            })
        });

        document.querySelector('.cart-drop').addEventListener('click', el => {
            if (el.target.classList.contains('btn-reb')) {
            }
            this.removeItem(el.target.dataset.id);
            console.log(el.target.classList);
        })
    }

}


class CartItem {
    constructor(product, image = 'http://via.placeholder.com/50x40') {
        this.id = product.id;
        this.title = product.title;
        this.price = product.price;
        this.quantity = product.quantity;
        this.image = image;
        //this.quantity = quantity;
    }

    render() {
        return `
            <div class="cart-item" data-id="${this.id}">
                <img src="${this.image}" alt="img">
                <h5 class="cart-item__text">${this.title}</h5>
                <p class="cart-item__quantity">${this.quantity}</p>
                <p class="cart-item__price">${this.price}</p>
                <button class="btn-rem" data-id="${this.id}">x</button>
            </div>`
    }


}

const list = new ProductList();
list.fetchItems();
list.render();
const cart = new CartList();
window.onload = () => cart.init();


console.log(list.totalPrice());

