const ItemComponent = {
    props: ['product', 'imageCatalog'],
    template: `<div class="product-item" >
                <img :src="imageCatalog" alt="photo">
                <div class="product-item__text">
                    <h3>{{product.title}}</h3>
                    <p>{{product.price}} &#8381;</p>
                    <button @click="$parent.$parent.handleBuyClick(product)" class="by-btn">Купить</button>
                </div>
            </div>`,

};

const ItemListComponent = {
    props: ['items'],
    data() {
        return {
            imageCatalog: 'http://via.placeholder.com/150x120',
        }
    },
    template: `<div class="products">
                <product 
                      v-for="item in items" 
                      :key="item.id" 
                      :product="item" 
                      :imageCatalog="imageCatalog"
                      >
                </product>
             </div>`,

    components: {
        'product': ItemComponent,
    }
};

const CartItemComponent = {
    props: ['cartItem', 'cartImageCatalog'],
    template: `<div class="cart-item" >
                    <img :src="cartImageCatalog" alt="img">
                    <h5 class="cart-item__text">{{cartItem.title}}</h5>
                    <p class="cart-item__quantity">{{cartItem.quantity}}</p>
                    <p class="cart-item__price">{{cartItem.price}} &#8381;</p>
                    <button class="btn-rem" @click="$parent.$parent.handleRemoveClick(cartItem.id)">x</button>
                </div>`,
};


const CartComponent = {
    props: ['items'],
    data() {
        return {
            cartImageCatalog: 'http://via.placeholder.com/50x40',
            showCart: false,
        }
    },
    template: `<div class="cart">
            <button class="btn-cart" type="button" @click="showCart = !showCart">Корзина</button>
            <div class="cart-drop" v-show="showCart" >
                <cart-item-component v-for="item in items" 
                                     :cartItem="item"
                                     :key="item.id" 
                                     :cartImageCatalog="cartImageCatalog">
                </cart-item-component>
                <div class="cart-empty" v-if="!items.length">Корзина пуста</div>
                <p v-else>Общая стоимость: <span class="total-price" >{{$parent.totalPrice}}</span>&#8381;</p>
            </div>
        </div>`,
    components: {
        'cart-item-component': CartItemComponent,
    }
};

const SearchComponent = {
    data() {
        return {
            query: '',
        }
    },
    template: `<div class="search">
                <input type="text" v-model="query" placeholder="Поиск" class="query">
                <button class="search-btn" @click="$parent.handleFilter(query)"><i class="fas fa-search"></i></button>
               </div>`,
};

const ErrorComponent = {
    data() {
        return {
            text: '',
        }
    },

    methods: {
        setInvis() {
            this.text = '';
        },

        errorText(error) {
            this.text = error;
        },
    },

    computed: {
        invisible() {
            return this.text === '';
        }
    },

    template: `<div class="error" v-if="!invisible">
                <p>{{text}}</p> 
                <button class="btn-rem" @click="setInvis">X</button>
             </div>`
};

const app = new Vue({
    el: '#root',
    data: {
        items: [],
        filteredItems: [],
        cartItems: [],
    },
    methods: {
        handleFilter(searchText) {
            const regExp = new RegExp(searchText, 'i');
            this.filteredItems = this.items.filter(product => regExp.test(product.title));
        },
        handleBuyClick(item) {
            let find = this.cartItems.find(product => product.id === +item.id);
            if (find) {
                fetch(`/cart/${find.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({quantity: ++find.quantity}),
                    headers: {
                        'Content-type': 'application/json',
                    },
                })
                    .catch((error) => console.log(error))
            } else {
                fetch('/cart', {
                    method: 'POST',
                    body: JSON.stringify({id: +item.id, title: item.title, price: +item.price, quantity: 1}),
                    headers: {
                        'Content-type': 'application/json',
                    },
                })
                    .then(() => {
                        this.cartItems.push({...item, quantity: 1});
                    })
                    .catch((error) => console.log(error))
            }
        },
        handleRemoveClick(id) {
            let find = this.cartItems.find(product => product.id === id);
            if (find.quantity > 1) {
                fetch(`/cart/${find.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({quantity: --find.quantity}),
                    headers: {
                        'Content-type': 'application/json',
                    },
                })
                    .catch((error) => console.log(error))
            } else {
                fetch(`/cart/${id}`, {
                    method: 'DELETE',
                })
                    .then(() => {
                        const index = this.cartItems.findIndex(x => x.id === id);
                        this.cartItems.splice(index, 1);
                    })
                    .catch((error) => console.log(error))
            }
        }
    },
    computed: {
        totalPrice() {
            return this.cartItems.reduce((sum, current) => sum + current.price * current.quantity, 0);
        }
    },
    mounted() {
        fetch('/goods')
            .then((result) => result.json())
            .then((data) => {
                this.items = data;
                this.filteredItems = data;
            })
            .catch((error) => {
                this.$refs.error.errorText(error);
            });

        fetch('/cart')
            .then((result) => result.json())
            .then((data) => {
                this.cartItems = data;
            })
            .catch((error) => {
                this.$refs.error.errorText(error);
            });
        console.log(this);
    },

    components: {
        'item-list-component': ItemListComponent,
        'cart-component': CartComponent,
        'search-component': SearchComponent,
        'error-component': ErrorComponent,
    }
});