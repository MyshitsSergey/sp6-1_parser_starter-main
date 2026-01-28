// @todo: напишите здесь код парсера
const meta = {}
const pageLanguage = document.querySelector("html").getAttribute("lang"); //1.Язык страницы
meta.language = pageLanguage

const pageTitle = document.querySelector("title") //2.Название страницы
const titleText = pageTitle.textContent
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
    const content = element.getAttribute("content");
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
if(likeClass.nameClass === "active")
{
  product.isLiked = true
} else product.isLiked = false

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
  const discountPercent = Math.round((1 - newPrice / oldPrice) * 100)
product.price = +newPrice //7.Цена товара без скидки
product.old = +oldPrice
product.discount = +discountPrice//8.Размер скидки
product.discountPercent = discountPercent + "%"




//9.Валюта
//10.Свойства товара
//11.Полное описание, скрытое под сворачиваемым блоком


function parsePage() {
    return {
        meta: {},
        product: {},
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;