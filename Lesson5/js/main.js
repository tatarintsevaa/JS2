const app = new Vue({
    el: '#root',
    data: {
        imageCatalog: 'http://via.placeholder.com/150x120',
        cartImageCatalog: 'http://via.placeholder.com/50x40',
        items: [],
        filteredItems: [],
        query: '',
        cartItems: [],
        showCart: false,
    },
    methods: {
        handleFilter() {
            const regExp = new RegExp(this.query, 'i');
            this.filteredItems = this.items.filter(product => regExp.test(product.title));
        },
        handleAddItems(item) {
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
        handleRemoveItems(id) {
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
            });

        fetch('/cart')
            .then((result) => result.json())
            .then((data) => {
                this.cartItems = data;
            })
    }
});