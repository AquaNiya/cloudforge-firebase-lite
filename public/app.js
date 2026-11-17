import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const form = document.querySelector("#productForm");
const productList = document.querySelector("#productList");
const productCount = document.querySelector("#productCount");
const formMessage = document.querySelector("#formMessage");
const connectionStatus = document.querySelector("#connectionStatus");

function setStatus(text, kind) {
  connectionStatus.textContent = text;
  connectionStatus.className = `status status-${kind}`;
}

function showMessage(text, kind = "success") {
  formMessage.textContent = text;
  formMessage.className = `message ${kind}`;
}

function renderProducts(products, removeProduct) {
  productCount.textContent = `${products.length} product${products.length === 1 ? "" : "s"}`;
  productList.replaceChildren();

  if (products.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty";
    empty.textContent = "No products yet. Add the first one above.";
    productList.append(empty);
    return;
  }

  for (const product of products) {
    const item = document.createElement("article");
    item.className = "product";
    item.innerHTML = `
      <div>
        <h3></h3>
        <p></p>
      </div>
      <div>
        <div class="price">₹${Number(product.price).toFixed(2)}</div>
        <p>Stock: ${product.stock}</p>
      </div>
    `;
    item.querySelector("h3").textContent = product.name;
    item.querySelector("p").textContent = product.description || "No description";
    item.addEventListener("dblclick", () => removeProduct(product.id));
    productList.append(item);
  }
}

if (!firebaseConfig || firebaseConfig.apiKey.startsWith("PASTE_")) {
  setStatus("Config required", "warn");
  renderProducts([
    { id: "demo-1", name: "Demo keyboard", description: "Add firebase-config.js to enable Firestore.", price: 2499, stock: 12 }
  ], () => showMessage("Connect Firebase first.", "error"));
  form.addEventListener("submit", event => {
    event.preventDefault();
    showMessage("First configure Firebase in public/firebase-config.js.", "error");
  });
} else {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  signInAnonymously(auth)
    .then(() => {
      setStatus("Connected to Firebase", "ok");
      const productsQuery = query(collection(db, "products"), orderBy("createdAt", "desc"));
      onSnapshot(productsQuery, snapshot => {
        const products = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
        renderProducts(products, async id => {
          await deleteDoc(doc(db, "products", id));
          showMessage("Product deleted.");
        });
      }, error => {
        setStatus("Firestore error", "error");
        showMessage(error.message, "error");
      });
    })
    .catch(error => {
      setStatus("Authentication error", "error");
      showMessage(error.message, "error");
    });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const data = new FormData(form);
    const product = {
      name: data.get("name").trim(),
      description: data.get("description").trim(),
      price: Number(data.get("price")),
      stock: Number(data.get("stock")),
      createdAt: serverTimestamp()
    };

    if (!product.name || product.price < 0 || product.stock < 0) {
      showMessage("Name required; price and stock cannot be negative.", "error");
      return;
    }

    try {
      await addDoc(collection(db, "products"), product);
      form.reset();
      showMessage("Product added to Firestore.");
    } catch (error) {
      showMessage(error.message, "error");
    }
  });
}
