// script.js

// Recupera carrinho do localStorage ou inicia vazio
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartSidebar = document.getElementById("cartSidebar");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const openCartMobile = document.getElementById("openCartMobile");
const cartCountMobile = document.getElementById("cartCountMobile");
const telefone = "5562982436674"; // seu WhatsApp

// Abrir/fechar carrinho
const openCartBtn = document.getElementById("openCart");
document.getElementById("closeCart").onclick = () => cartSidebar.classList.remove("active");

if(openCartBtn){
  openCartBtn.onclick = () => cartSidebar.classList.add("active");
}

if(openCartMobile){
  openCartMobile.onclick = () => cartSidebar.classList.add("active");
}

// Função adicionar produto
function addToCart(nome, preco) {
    const existingItem = cart.find(item => item.nome === nome);

    if (existingItem) {
        existingItem.quantidade += 1;
    } else {
        cart.push({ nome, preco, quantidade: 1 });
    }

    updateCart();

    // Abre automaticamente apenas no desktop
    if (window.innerWidth > 768) {
        cartSidebar.classList.add("active");
    }

    // Animação no botão do carrinho desktop
    if(openCartBtn){
        openCartBtn.classList.add("cart-bounce");
        setTimeout(() => openCartBtn.classList.remove("cart-bounce"), 400);
    }
}

// Atualizar carrinho sempre que houver mudanças
function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
        total += item.preco * item.quantidade;
        totalItems += item.quantidade;

        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${item.nome}</strong><br>
                R$ ${(item.preco * item.quantidade).toFixed(2)}
            </div>

            <div class="cart-controls">
                <button onclick="decreaseItem(${index})">−</button>
                <span>${item.quantidade}</span>
                <button onclick="increaseItem(${index})">+</button>
            </div>
        `;
        cartItems.appendChild(li);
    });

    cartTotal.innerText = "R$ " + total.toFixed(2);
    cartCount.innerText = totalItems;
    if(cartCountMobile) cartCountMobile.innerText = totalItems;

    // Salvar no localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Funções aumentar/diminuir quantidade dos itens no carrinho
function increaseItem(index) {
    cart[index].quantidade++;
    updateCart();
}

function decreaseItem(index) {
    if(cart[index].quantidade > 1){
        cart[index].quantidade--;
    } else {
        cart.splice(index,1);
    }
    updateCart();
}

// Finalizar pedido via WhatsApp ,redirecionando para o WhatsApp com a mensagem formatada 
// de acordo com os itens do carrinho.
document.getElementById("checkoutBtn").onclick = function () {
    if(cart.length === 0){
        alert("Seu carrinho está vazio!");
        return;
    }

    const btn = this;
    btn.innerText = "Enviando...";
    btn.disabled = true;

    let mensagem = " *Novo Pedido*\n\n";
    cart.forEach(item => {
        mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });

    const total = cart.reduce((acc,item)=>acc+item.preco*item.quantidade,0);
    mensagem += `\n  Total: R$ ${total.toFixed(2)}`;

    setTimeout(()=>{
        window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, "_blank");
        btn.innerText = "Finalizar Pedido";
        btn.disabled = false;
    }, 1000);
}

// Eventos dos botões "Pedir" com efeito visual
document.querySelectorAll('.menu-grid li .btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();

        const item = btn.closest('li');
        const nome = item.querySelector('h3').innerText;
        const precoText = item.querySelector('strong').innerText.replace('R$ ','').replace(',','.');
        const preco = parseFloat(precoText);

        // Efeito da imagem voando para o carrinho
        const img = item.querySelector('img');
        const clone = img.cloneNode(true);
        const rect = img.getBoundingClientRect();
        clone.style.position = "fixed";
        clone.style.left = rect.left + "px";
        clone.style.top = rect.top + "px";
        clone.style.width = "100px";
        clone.style.zIndex = 999;
        clone.style.transition = "all 0.7s ease";

        document.body.appendChild(clone);

        const cartRect = openCartBtn.getBoundingClientRect();
        setTimeout(() => {
            clone.style.left = cartRect.left + "px";
            clone.style.top = cartRect.top + "px";
            clone.style.opacity = 0;
            clone.style.transform = "scale(0.3)";
        }, 10);

        setTimeout(() => clone.remove(), 700);

        // Adiciona ao carrinho
        addToCart(nome, preco);
    });
});

// Menu versão mobile 
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("header nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
});

// Header muda ao scroll para melhorar a visibilidade e a experiência do usuário
// adicionando uma classe "scrolled" quando o usuário rola a página para baixo.
window.addEventListener("scroll", () => {
    document.querySelector("header").classList.toggle("scrolled", window.scrollY > 50);
});

// Inicializa carrinho ao carregar página
updateCart();

// Botão Limpar Tudo
const clearCartBtn = document.getElementById("clearCart");

if(clearCartBtn){
  clearCartBtn.addEventListener("click", () => {
      if(cart.length === 0) return;
      
      if(confirm("Deseja realmente limpar todo o carrinho?")){
          cart = [];
          updateCart();
          cartSidebar.classList.remove("active"); // opcional: fecha o carrinho
          localStorage.removeItem("cart");
      }
  });
}

// Fechar menu ao clicar fora (mobile)
document.addEventListener("click", (e) => {
    const isClickInsideMenu = nav.contains(e.target);
    const isClickOnButton = menuToggle.contains(e.target);

    if (!isClickInsideMenu && !isClickOnButton) {
        nav.classList.remove("active");
    }
});