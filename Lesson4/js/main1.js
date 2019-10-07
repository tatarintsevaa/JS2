// function sendRequest(url) {
//     return new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', url);
//
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if (xhr.status !== 200) {
//                     reject();
//                 }
//                 const products = JSON.parse(xhr.responseText);
//                 resolve(products)
//             }
//         };
//         xhr.send();
//     })
// }

// function sendRequest(url) {
//     return fetch(url).then(response => response.json())
// }

class ProductList {
    constructor(container) {
        this.container = container;
        this.items = [];
        this.filtredItems = [];
    }


    fetchItems() {
        return fetch('/goods')
            .then(response => response.json())
            .then((items) => {
                this.items = items;
                this.filtredItems = items;
            });
    }

    render() {
        const $block = document.querySelector(this.container);
        $block.innerHTML = '';
        this.filtredItems.forEach((product) => $block.insertAdjacentHTML('afterbegin', new ProductItem(product)
            .render()))
    };

    filter(queryText) {
        const regExp = new RegExp(queryText, 'i');
        this.filtredItems = this.items.filter(product => regExp.test(product.title));
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

    fetchItems() {
        return fetch('/cart')
            .then(response => response.json())
            .then((items) => {
                this.addedItems = items;
            })
            .catch(error => console.log(error));
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

    addItems(item) {
        let find = this.addedItems.find(product => product.id === +item.id);
        if (find) {
            fetch(`/cart/${find.id}`, {
                method: 'PATCH',
                body: JSON.stringify({quantity: find.quantity}),
                headers: {
                    'Content-type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    find.quantity++;
                    this.updateCart(find);
                    console.log(data);
                })

        } else {
            fetch('/cart', {
                method: 'POST',
                body: JSON.stringify({id: +item.id, title: item.title, price: +item.price, quantity: 1}),
                headers: {
                    'Content-type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((item) => {
                    this.addedItems.push({id: +item.id, title: item.title, price: +item.price, quantity: 1});
                    this.render();
                })
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
            fetch(`/cart/${find.id}`, {
                method: 'PATCH',
                body: JSON.stringify({quantity: find.quantity--}),
                headers: {
                    'Content-type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then(() => {
                    this.updateCart(find);
                })
        } else {
            fetch(`/cart/${id}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(() => {
                    const index = this.addedItems.findIndex(x => x.id === id);
                    this.addedItems.splice(index, 1);
                    this.render();
                });
        }
    }


    init() {
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector('.cart-drop').classList.toggle('invisible')
        });

        document.querySelectorAll('.by-btn').forEach(el => {
            el.addEventListener('click', e => {
                // this.addItems(+e.target.dataset.id, e.target.dataset.title, +e.target.dataset.price)
                this.addItems(e.target.dataset)
                // console.log(e.target.dataset);
            })
        });

        document.querySelector('.cart-drop').addEventListener('click', el => {
            if (el.target.classList.contains('btn-reb')) {
            }
            this.removeItem(+el.target.dataset.id);
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
});

// document.querySelector('.query').addEventListener('input', evt => {
//     const queryText = document.querySelector('.query').value;
//     list.filter(queryText);
//     list.render();
// });

// по нажаитю на кнопку думаю правильней
document.querySelector('.search-btn').addEventListener('click', evt => {
    const queryText = document.querySelector('.query').value;
    list.filter(queryText);
    list.render();
});






