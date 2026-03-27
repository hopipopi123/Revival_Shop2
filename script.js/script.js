
const burgerBtn = document.getElementById('burgerBtn');
const navMenu = document.getElementById('navMenu');

const overlay = document.createElement('div');
overlay.classList.add('overlay');
document.body.appendChild(overlay);

// Функция переключения меню
function toggleMenu() {
  burgerBtn.classList.toggle('active');
  navMenu.classList.toggle('active');
  overlay.classList.toggle('active');
  
  if (navMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Функция закрытия меню
function closeMenu() {
  if (navMenu.classList.contains('active')) {
    burgerBtn.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Функция плавной прокрутки к якорю
function scrollToAnchor(targetId, offset = 80) {
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// Обработчик кнопки бургера
burgerBtn.addEventListener('click', toggleMenu);

// Обработчик оверлея
overlay.addEventListener('click', closeMenu);

// Обработка всех ссылок в меню
const allLinks = document.querySelectorAll('.nav-menu a, .header-icons a, .nav-link, .anchor-link, .menu a');
allLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    // Проверяем, является ли ссылка якорем
    if (href && href.startsWith('#')) {
      e.preventDefault();
      
      // Закрываем меню
      closeMenu();
      
      // Прокручиваем к якорю
      scrollToAnchor(href, 80);
      
      // Обновляем URL без перезагрузки
      history.pushState(null, null, href);
    } else if (href && href !== '#' && !href.startsWith('http')) {
      // Для обычных внутренних ссылок (не якорей)
      closeMenu();
      // Даем время на закрытие меню, затем переходим
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    } else if (href && href.startsWith('http')) {
      // Для внешних ссылок
      closeMenu();
    }
  });
});

// Закрытие меню при изменении размера окна
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
    closeMenu();
  }
});

// Если на страницу зашли с якорем в URL
if (window.location.hash) {
  setTimeout(() => {
    scrollToAnchor(window.location.hash, 80);
  }, 100);
}



const track = document.getElementById('carouselTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

let currentIndex = 0;
let cardsToShow = 3;

// Получение всех карточек
const cards = Array.from(document.querySelectorAll('.review-card'));
const totalCards = cards.length;


function updateCardsToShow() {
  if (window.innerWidth <= 768) {
    cardsToShow = 1;
  } else if (window.innerWidth <= 1024) {
    cardsToShow = 2;
  } else {
    cardsToShow = 3;
  }
}

// Создание точек навигации
function createDots() {
  const totalDots = Math.ceil(totalCards / cardsToShow);
  dotsContainer.innerHTML = '';
  
  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === currentIndex) dot.classList.add('active');
    dot.addEventListener('click', () => {
      currentIndex = i;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  }
}

// Обновление карусели
function updateCarousel() {
  const gap = 25;
  const cardElement = cards[0];
  
  if (!cardElement) return;
  
  const cardWidthValue = cardElement.offsetWidth;
  const offset = currentIndex * (cardWidthValue + gap);
  track.style.transform = `translateX(-${offset}px)`;
  
  // Обновление активной точки
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    if (i === currentIndex) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
  
  // Обновление состояния кнопок
  const maxIndex = Math.ceil(totalCards / cardsToShow) - 1;
  
  if (prevBtn && nextBtn) {
    if (currentIndex === 0) {
      prevBtn.style.opacity = '0.5';
      prevBtn.style.cursor = 'not-allowed';
    } else {
      prevBtn.style.opacity = '1';
      prevBtn.style.cursor = 'pointer';
    }
    
    if (currentIndex === maxIndex) {
      nextBtn.style.opacity = '0.5';
      nextBtn.style.cursor = 'not-allowed';
    } else {
      nextBtn.style.opacity = '1';
      nextBtn.style.cursor = 'pointer';
    }
  }
}

// Следующий слайд
function nextSlide() {
  const maxIndex = Math.ceil(totalCards / cardsToShow) - 1;
  if (currentIndex < maxIndex) {
    currentIndex++;
    updateCarousel();
  }
}

// Предыдущий слайд
function prevSlide() {
  if (currentIndex > 0) {
    currentIndex--;
    updateCarousel();
  }
}

// Обработчики событий
if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);

// Адаптация при изменении размера окна
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    updateCardsToShow();
    createDots();
    
    const maxIndex = Math.ceil(totalCards / cardsToShow) - 1;
    if (currentIndex > maxIndex) {
      currentIndex = maxIndex;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    
    updateCarousel();
  }, 200);
});


updateCardsToShow();
createDots();
updateCarousel();

// Корзина
let cartItems = [];

// Загрузка из localStorage
const savedCart = localStorage.getItem('cart');
if (savedCart) {
  cartItems = JSON.parse(savedCart);
}

// Данные товаров
const products = [
  { id: 1, name: 'Венский стул XIX век', price: 24900, image: './изображения/orig (2).webp' },
  { id: 2, name: 'Комод "Шеваль"', price: 45500, image: './изображения/orig (1).webp' },
  { id: 3, name: 'Зеркало в резной раме', price: 18900, image: './изображения/6596680322.jpg' },
  { id: 4, name: 'Обеденный стол "Винтаж"', price: 67900, image: './изображения/6045039259.jpg' }
];

// Добавление в корзину
document.querySelectorAll('.cart-btn').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const product = products[index];
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
    updateCartCount();
  });
});

// Обновление счетчика корзины
function updateCartCount() {
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Обновление содержимого корзины
function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalSpan = document.getElementById('cartTotal');
  
  if (!cartItemsContainer) return;
  
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
    if (cartTotalSpan) cartTotalSpan.textContent = '0 ₽';
    return;
  }
  
  let total = 0;
  cartItemsContainer.innerHTML = cartItems.map(item => {
    total += item.price * item.quantity;
    return `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${item.price.toLocaleString()} ₽</div>
          <div class="cart-item-quantity">Количество: ${item.quantity}</div>
        </div>
      </div>
    `;
  }).join('');
  
  if (cartTotalSpan) {
    cartTotalSpan.textContent = total.toLocaleString() + ' ₽';
  }
}

// Очистка корзины
function clearCart() {
  cartItems = [];
  localStorage.setItem('cart', JSON.stringify(cartItems));
  updateCartUI();
  updateCartCount();
}

// Модальное окно
const cartModal = document.getElementById('cartModal');
const cartIcon = document.getElementById('cartIcon');
const closeCartBtn = document.getElementById('closeCartBtn');

if (cartIcon) {
  cartIcon.addEventListener('click', () => {
    updateCartUI();
    cartModal.classList.add('show');
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('show');
  });
}

cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove('show');
  }
});

// Оформление заказа
const checkoutBtn = document.getElementById('checkoutBtn');
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
      alert('Корзина пуста');
      return;
    }
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`Заказ оформлен! Сумма: ${total.toLocaleString()} ₽`);
    clearCart();
    cartModal.classList.remove('show');
  });
}

// Инициализация
updateCartCount();
updateCartUI();

