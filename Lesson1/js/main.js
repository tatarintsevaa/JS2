const products = [
    { title: 'Компьютерная мышь', price: 400 },
    { title: 'Жесткий диск SSD 1Tb', price: 10000 },
    { title: 'Материнская плата', price: 4000 },
    { title: 'Видео-карта', price: 15000 },
];

// сократил запись, убрав {} и return
/**
 * Возвращает строку со структурой HTML продукта
 * @param title Название проукта
 * @param price цена продукта
 * @param image фото продукта
 * @returns {string} Строка со HTML структурой
 */
const renderProduct = ({title, price}, image = 'http://via.placeholder.com/150x120') =>
    `<div class="product-item">
        <img src="${image}" alt="photo">
        <div class="product-item__text">
            <h3>${title}</h3>
            <p>${price} &#8381;</p>
            <button class="by-btn">Купить</button>
        </div>
     </div>`;
//запятые, потому что метод map возвращает массив. На выходе получется массив разметки каждого товара с запятыми.


// Можно так
// const renderProducts = list => {
//     const productList = list.map(item => renderProduct(item.title, item.price));
//     productList.forEach(function(item, index) {
//         document.querySelector('.products').insertAdjacentHTML('afterbegin', productList[index])
//     });
// };


// Но так лучше
/**
 * Рендерит товары
 * @param list массив с объектами товаров
 */
const renderProducts = list => {
        const item = document.querySelector('.products');
        list.forEach((product) => item.insertAdjacentHTML('afterbegin', renderProduct(product)))};

renderProducts(products);
