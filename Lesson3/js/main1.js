function sendRequest(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status !== 200) {
                    reject();
                }
                const products = JSON.parse(xhr.responseText);
                resolve(products)
            }
        };
        xhr.send();
    } )
}

class ProductList {
    constructor(container) {
        this.container = container;
        this.items = [];
    }


    fetchItems() {
        return sendRequest('/goods')
            .then((items) => {
                this.items = items;
            });
    }

    render() {
        const $block = document.querySelector(this.container);
        this.items.forEach((product) => $block.insertAdjacentHTML('afterbegin', new ProductItem(product)
            .render()))
    };


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

    fetchItems() {
        return sendRequest('/cart')
            .then((items) => {
                this.addedItems = items;
            })
    }

    render() {
        const $block = document.querySelector('.cart-drop');
        if (this.addedItems.length === 0) {
            $block.innerHTML = `<p class="cart-empty">Корзина пуста</\p>`;
        } else {
            $block.innerHTML = '';
            for (const item of this.addedItems) {
                const addedItem = new CartItem(item);
                $block.insertAdjacentHTML('afterbegin', addedItem.render());
            }
            $block.insertAdjacentHTML('beforeend', `<p>Общая стоимость: <span class="total-price">
            ${this.totalPrice()}</span>&#8381;</p>`)
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
        const $block = document.querySelector(`.cart-item[data-id="${product.id}"]`);
        $block.querySelector('.cart-item__quantity').textContent = product.quantity;
        document.querySelector('.total-price').innerHTML = this.totalPrice();
    }

    removeItem(id) {
        let find = this.addedItems.find(product => product.id === id);
        if (find.quantity > 1) {
            find.quantity--;
            this.updateCart(find);
        } else {
            this.addedItems.splice(this.getRemovedItemIndex(id), 1);
            this.render();
            // if (this.addedItems.length === 0) {
            //     this.render();
            // }
            // document.querySelector(`.cart-item[data-id="${id}"]`).remove();
        }

    }

    getRemovedItemIndex(id) {
        return this.addedItems.findIndex(x => x.id === id)
    }

    init() {
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector('.cart-drop').classList.toggle('invisible')
        });

        document.querySelectorAll('.by-btn').forEach(el => {
            el.addEventListener('click', e => {
                this.addItems(+e.target.dataset.id, e.target.dataset.title, +e.target.dataset.price)
            })
        });

        document.querySelector('.cart-drop').addEventListener('click', el => {
            if (el.target.classList.contains('btn-reb')) {
            }
            this.removeItem(+el.target.dataset.id);
            console.log(el.target.classList);
        })
    }

    totalPrice() {
        return this.addedItems.reduce((sum, current) => sum + current.price * current.quantity, 0);
    }

}


class CartItem {
    constructor(product, image = 'http://via.placeholder.com/50x40') {
        this.id = product.id;
        this.title = product.title;
        this.price = product.price;
        this.quantity = product.quantity;
        this.image = image;
        this.quantity = product.quantity;
    }

    render() {
        return `
            <div class="cart-item" data-id="${this.id}">
                <img src="${this.image}" alt="img">
                <h5 class="cart-item__text">${this.title}</h5>
                <p class="cart-item__quantity">${this.quantity}</p>
                <p class="cart-item__price">${this.price} &#8381;</p>
                <button class="btn-rem" data-id="${this.id}">x</button>
            </div>`
    }
}

const list = new ProductList('.products');
list.fetchItems().then(() => {
    list.render();
});

const cart = new CartList();
cart.fetchItems().then(() => {
    cart.init();
    cart.render();
    console.log(cart.addedItems)
});




