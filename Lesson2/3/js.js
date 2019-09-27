/*
### Маленький (50 рублей, 20 калорий).
### Большой (100 рублей, 40 калорий).
### Гамбургер может быть с одним из нескольких видов начинок (обязательно):
### С сыром (+10 рублей, +20 калорий).
### С салатом (+20 рублей, +5 калорий).
### С картофелем (+15 рублей, +10 калорий).
### Дополнительно гамбургер можно посыпать приправой
(+15 рублей, +0 калорий) и полить майонезом (+20 рублей, +5 калорий). ### 3Напишите программу,
рассчитывающую стоимость и калорийность гамбургера. Можно использовать примерную архитектуру класса из методички,
 но можно использовать и свою.
 */

class BurgerList {
    constructor(container = '.burgers') {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this._fetchProducts();
        this._render();
    }

    _fetchProducts() {
        this.goods = [
            {
                name: 'small',
                price: 50,
                calories: 20,
                img: 'http://www.calorizator.ru/sites/default/files/imagecache/product_512/product/hamburger.jpg"'
            },
            {
                name: 'big',
                price: 100,
                calories: 40,
                img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAUp1Pi_W82H2Q20PzJuwRwxPsEQc3wCVo_vr_X4z5iqDgcTbRsw'
            },
        ]
    }

    _render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObject = new BurgerItem(product);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render())
        }
    }
}

class BurgerItem {
    render() {
        return `<div class="burgers__item">
        <label><img src="${this.img}" 
             width="200px" height="200px" alt="burger">
        <p>Цена: <span class="price">${this.price}</span> \u20bd</p>
        <p>Калории: <span class="calories">${this.calories}</span></p>
        <input type="checkbox" class="burgers__checkbox" data-name="${this.name}" data-price="${this.price}"
               data-calories="${this.calories}"></label>
    </div>`;
    }

    constructor(product) {
        this.name = product.name;
        this.price = product.price;
        this.calories = product.calories;
        this.img = product.img;
    }
}

class OptionList {
    constructor(container = '.options') {
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this._fetchProducts();
        this._render();
    }

    _fetchProducts() {
        this.goods = [
            {name: 'cheese', price: 10, calories: 20, title: 'Сыр'},
            {name: 'salad', price: 20, calories: 5, title: 'Салат'},
            {name: 'free', price: 15, calories: 10, title: 'Картошка'},
            {name: 'mayonnaise', price: 20, calories: 5, title: 'Майонез'},
            {name: 'spice', price: 15, calories: 0, title: 'Специи'},
        ]

    }

    _render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObject = new OptionItem(product);
            this.allProducts.push(productObject);
            block.insertAdjacentHTML('beforeend', productObject.render())
        }
    }
}

class OptionItem {
    render() {
        return `<label><input type="checkbox" class="options__checkbox" data-name="${this.name}" data-price="${this.price}"
    data-calories="${this.calories}">${this.title} <p>Цена: ${this.price} &#8381;</p> </label>`;
    }

    constructor(product) {
        this.name = product.name;
        this.price = product.price;
        this.calories = product.calories;
        this.img = product.img;
        this.title = product.title;
    }
}

const burgerList = new BurgerList();
const optionList = new OptionList();

const cart = {
    burgerTotal: [],
    cartPrice: null,
    cartCalories: null,
    init() {
        this.cartPrice = document.querySelector('#cart-price');
        this.cartCalories = document.querySelector('#cart-calories');
        this.render();
    },
    render() {
        this.cartPrice.textContent = this.getBurgerPrice();
        this.cartCalories.textContent = this.getBurgerCalories();
    },
    add(burgerName, burgerPrice, burgerCalories) {
        this.burgerTotal.push({name: burgerName, price: burgerPrice, calories: burgerCalories});
        this.render()
    },
    dell(burgerName) {
        this.burgerTotal.splice(this.getDellIndex(burgerName), 1);
        this.render();
    },
    getBurgerPrice() {
        return this.burgerTotal.reduce((sum, current) => sum + current.price, 0);
    },
    getBurgerCalories() {
        return this.burgerTotal.reduce((sum, current) => sum + current.calories, 0);
    },
    getDellIndex(burgerName) {
        return this.burgerTotal.findIndex(x => x.name === burgerName)
    }

};

window.onload = () => cart.init();

document.querySelectorAll('.burgers__checkbox').forEach(el => {
    el.addEventListener('change', e => {
        if (el.checked === true) {
            cart.add(e.target.dataset.name, +e.target.dataset.price, +e.target.dataset.calories);
        } else {
            cart.dell(e.target.dataset.name);
        }
    })
});

document.querySelectorAll('.options__checkbox').forEach(el => {
    el.addEventListener('change', e => {
        if (el.checked === true) {
            cart.add(e.target.dataset.name, +e.target.dataset.price, +e.target.dataset.calories);
        } else {
            cart.dell(e.target.dataset.name);
        }
    })
});


