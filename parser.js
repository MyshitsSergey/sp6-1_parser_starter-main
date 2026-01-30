// @todo: напишите здесь код парсера
const meta = {}
const pageLanguage = document.querySelector("html").getAttribute("lang"); //1.Язык страницы
meta.language = pageLanguage

const pageTitle = document.querySelector("title") //2.Название страницы
const titleText = pageTitle.textContent

// const [titleTextpartName] = titleText.split("—"); // Берем только первую часть
// meta.title = titleTextpartName;

const [titleTextpartName, titleTextpartDiscrip] = titleText.split("—");
meta.title = titleTextpartName.trim() //Сохр в meta Название страницы

const keywordsMeta = document.querySelector('meta[name="keywords"]')//3.Ключевые слова из мета-тега
const keywordsText = keywordsMeta.getAttribute("content")
const keywordsTextarray = keywordsText.split(",").map((item)=>item.trim())
meta.keywords = []
//Добовляем в meta слова
keywordsTextarray.forEach((item)=>{
    meta.keywords.push(item)
})

const descriptionMeta = document.querySelector('meta[name="description"]')//4.Описание из мета-тега
const descriptionText = descriptionMeta.getAttribute("content")
meta.description = descriptionText//Добовляем в meta слова

meta.opengraph = {}
const opengraph = {};
// Находим ВСЕ мета-теги с property начинающимся на "og:"
const ogElements = document.querySelectorAll('meta[property^="og:"]');

// Обрабатываем каждый найденный тег
ogElements.forEach(element => {
    // Получаем полное свойство (например, "og:title")
    const property = element.getAttribute("property");
    // Получаем значение
    const content = element.getAttribute("content").split("—")[0].trim()
    // Убираем префикс "og:" и используем как ключ объекта
    const key = property.replace(/^og:/, '');
    // Добавляем в объект
    opengraph[key] = content;
});

// Добавляем в meta объект
meta.opengraph = opengraph;

//------------------------------------------------------------- */
const product = {}

const productId = document.querySelector(".product").getAttribute("data-id") //1.Идентификатор товара в data-атрибуте 
product.id = productId

const images = []//2.Массив фотографий
const imagesOnpage = document.querySelector("main").querySelector("nav")
const imagesText = imagesOnpage.querySelectorAll("img")
imagesText.forEach((element) => {
  const imagesTextObj = {
    preview: element.getAttribute("src"),
    full: element.getAttribute("data-src"),
    alt: element.getAttribute("alt")
  }
  images.push(imagesTextObj)
})
product.images = images

const likeClass = document.querySelector(".like") //3.Статус лайка
// if(likeClass.nameClass === "active")  <---------------------------------------------
// {
//   product.isLiked = true
// } else product.isLiked = false
product.isLiked = likeClass && likeClass.classList.contains("active");

const nameProduct = document.querySelector(".title").textContent //4.Название товара 
product.name = nameProduct

const tags = {}
product.tags = tags
const tagsList = document.querySelector(".tags") //5.Массивы бирок, категорий и скидок
const category = []
const discount = []
const label = []
const tagsArr = tagsList.querySelectorAll("span")
tagsArr.forEach((element) => {
  const className = element.className
  const text = element.textContent
  if(className === "green"){
    category.push(text)
  } else if(className === "blue")
  {
    label.push(text)
  } else if(className === "red"){
    discount.push(text)
  }
})
tags.category = category
tags.label = label
tags.discount = discount

const price = document.querySelector(".price").textContent //6.Цена товара с учётом скидки
const priceNumber = price.match(/\d+[\.,]?\d*/g)
  const newPrice = priceNumber[0]
  const oldPrice = priceNumber[priceNumber.length-1]
  const discountPrice = oldPrice - newPrice

product.price = +newPrice //Цена товара с учётом скидки
product.oldPrice = +oldPrice;  //7.Цена товара без скидки
product.discount = +discountPrice  


product.discountPercent = discountCalc (newPrice, oldPrice) //8.Размер скидки

function discountCalc (newPrice, oldPrice) {
  const discountPercent = ((1 - newPrice / oldPrice) * 100).toFixed(2)
  if(discountPercent > 0) {
    return discountPercent + "%"
  } else return "0%"
} 

//9.Валюта
product.currency = currencyList(price)

function currencyList(price){
  const priceStr = String(price)
  if(priceStr.includes("$")){return "USD"} else 
    if(priceStr.includes("€")){return "EUR"} else 
      if(priceStr.includes("₽") || (priceStr.includes("руб"))){return "RUB"} else return "UNKNOWN"
}

//10.Свойства товара

const propertiesList = document.querySelector(".properties")
const propertiesArr = propertiesList.querySelectorAll("li")
const properties = {}

propertiesArr.forEach((element) => {
  const list = element.querySelectorAll("span")
  if(list.length >= 2) {
    const key = list[0].textContent.trim()
    const value = list[1].textContent.trim()
    properties[key] = value
  }
})
product.properties = properties

//11.Полное описание, скрытое под сворачиваемым блоком

// const descriptionElement = document.querySelector(".description");
// product.description = descriptionElement.innerHTML.trim(); // или просто innerHTML

const descriptionElement = document.querySelector(".description");
const clone = descriptionElement.cloneNode(true);

const h3 = clone.querySelector("h3");
if (h3) h3.removeAttribute("class");

product.description = clone.innerHTML.trim();


//----------------------------------------------------------------------------------------------
const suggested = []
/*Массив дополнительных товаров.
Здесь нужно получить все карточки и перебрать их в цикле, чтобы сформировать массив.
Для каждого элемента соберите следующую информацию:
-ссылка на изображение,
-название товара,
-цена,
-валюта,
-описание.*/

const suggestedSelector = document.querySelector(".suggested").querySelector(".items")
const suggestedArr = suggestedSelector.querySelectorAll("article")

suggestedArr.forEach((element) => {
  const simbolPrice = element.querySelector("b").textContent
  
  const suggestedInfo = {
    name: element.querySelector("h3").textContent,
    description: element.querySelector("p").textContent,
    image: element.querySelector("img").getAttribute("src"),
    price: element.querySelector("b").textContent.match(/\d+[\.,]?\d*/g).join(""),
    currency:  currencyList(simbolPrice)
  } 
  suggested.push(suggestedInfo)
})


//--------------------------------------------------------------------------------------------------
/*Массив обзоров
Получите всё аналогично предыдущему блоку. В цикле переберите карточки, чтобы сформировать массив.
Для каждого элемента извлеките:
-рейтинг — количество заполненных звезд;
-заголовок обзора;
-описание;
-автор — объект должен содержать аватар и имя;
-дата обзора — отформатируйте её в формате DD.MM.YYYY.*/

// const reviewsSelector = document.querySelector(".reviews").querySelectorAll("article")
// let ratingStats = {} // Объект для статистики



// reviewsSelector.forEach((article) => {
//   // querySelector вернет первый найденный элемент .rating
//   const ratingElement = article.querySelector(".rating")
//   // Если нашли элемент .rating
//   if (ratingElement) {
//     // Считаем заполненные звезды
//     const filledStars = ratingElement.querySelectorAll(".filled").length //length возвращает количество элементов в NodeList
//     ratingStats = {rating:filledStars }
//   }


//   const ratingElementAuthor = article.querySelector(".author")
//   const autorImg = ratingElementAuthor.querySelector("img").getAttribute("src")
//   const autorName = ratingElementAuthor.querySelector("span").textContent

//   //автор — объект должен содержать аватар и имя;
//   const author = {
//     avatar: autorImg,
//     name: autorName
//   }

//   const dateNumber = ratingElementAuthor.querySelector("i").textContent
//   const [day, month, year] = dateNumber.split("/")
//   const date = new Date (year, month - 1, day)

//   const title = article.querySelector(".title").textContent

//   const description = article.querySelector("p").textContent

//   ratingStats.autor = author
//   ratingStats.date = date
//   ratingStats.title = title
//   ratingStats.description = description
  
//   reviews.push(ratingStats)
  
// })


const reviews = [];

const reviewsSelector = document.querySelector(".reviews").querySelectorAll("article");

reviewsSelector.forEach((article) => {
  const ratingElement = article.querySelector(".rating");
  const rating = ratingElement
    ? ratingElement.querySelectorAll(".filled").length
    : 0;

  const authorBlock = article.querySelector(".author");
  const author = {
    avatar: authorBlock.querySelector("img").getAttribute("src"),
    name: authorBlock.querySelector("span").textContent
  };

  const dateText = authorBlock.querySelector("i").textContent;
  const [day, month, year] = dateText.split("/");
  const date = `${day.padStart(2, "0")}.${month.padStart(2, "0")}.${year}`;

  const title = article.querySelector(".title").textContent;
  const description = article.querySelector("p").textContent;

  reviews.push({
    rating,
    title,
    description,
    author,
    date
  });
});








function parsePage() {
    return {
        meta: meta,
        product: product,
        suggested: suggested,
        reviews: reviews
    };
}

window.parsePage = parsePage;