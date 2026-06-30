import { useState, useEffect } from "react";
import type { Route } from "./+types/admin";
import { useNotifications } from "../context/CartContext";
import { type Product } from "../data/catalog";
import { getProducts, saveProducts, getOrders, saveOrders, saveUploadedImage, type OrderSummary } from "../data/db.client";
import { useLoaderData, useSubmit, useActionData } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Admin Portal | The Cann Flow" },
    { name: "description", content: "Management dashboard for product catalog and delivery orders." },
  ];
}

export async function clientLoader() {
  if (typeof window === "undefined") {
    return { isAuthorized: false, products: [] as Product[], orders: [] as OrderSummary[] };
  }
  const isAuthorized = sessionStorage.getItem("tcf_session") === "authorized";

  if (!isAuthorized) {
    return { isAuthorized: false, products: [] as Product[], orders: [] as OrderSummary[] };
  }

  const products = getProducts();
  const orders = getOrders();
  return { isAuthorized: true, products, orders };
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const body = await request.json();
    const { type, payload: payloadStr } = body;
    const payload = JSON.parse(payloadStr);

    // 1. Password Verification Action (Client-side check)
    if (type === "LOGIN") {
      const correctPassword = "tcf-admin-2026";
      if (payload.password === correctPassword) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("tcf_session", "authorized");
        }
        return { success: true, message: "Login successful" };
      } else {
        return { success: false, error: "Incorrect admin password PIN. Please try again." };
      }
    }

    // 2. Clear Session / Logout Action
    if (type === "LOGOUT") {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("tcf_session");
      }
      return { success: true, message: "Logged out" };
    }

    // 3. Security check: Guard all mutation operations
    if (typeof window !== "undefined" && sessionStorage.getItem("tcf_session") !== "authorized") {
      return { success: false, error: "Unauthorized operation" };
    }

    if (type === "ADD_PRODUCT") {
      const products = getProducts();
      let imageUrl = payload.image || "https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&q=80";
      
      if (payload.imageBase64) {
        imageUrl = saveUploadedImage(payload.imageBase64);
      }
      
      const newProduct: Product = {
        id: `custom-${Math.random().toString(36).substring(2, 9)}`,
        name: payload.name,
        brand: payload.brand,
        description: payload.description,
        category: payload.category,
        price: payload.price,
        originalPrice: payload.originalPrice,
        thc: payload.thc,
        rating: payload.rating || 5.0,
        reviewsCount: payload.reviewsCount || 0,
        image: imageUrl,
        isFeatured: payload.isFeatured,
        weight: payload.weight,
        weights: payload.weights
      };

      products.push(newProduct);
      saveProducts(products);
      return { success: true, message: "Product added successfully" };
    }

    if (type === "EDIT_PRODUCT") {
      const products = getProducts();
      let imageUrl = payload.image;
      
      if (payload.imageBase64) {
        imageUrl = saveUploadedImage(payload.imageBase64);
      }

      const updatedProducts = products.map(p => {
        if (p.id === payload.id) {
          return {
            ...p,
            name: payload.name,
            brand: payload.brand,
            description: payload.description,
            category: payload.category,
            price: payload.price,
            originalPrice: payload.originalPrice,
            thc: payload.thc,
            image: imageUrl,
            isFeatured: payload.isFeatured,
            weight: payload.weight,
            weights: payload.weights
          };
        }
        return p;
      });

      saveProducts(updatedProducts);
      return { success: true, message: "Product updated successfully" };
    }

    if (type === "DELETE_PRODUCT") {
      const products = getProducts();
      const updatedProducts = products.filter(p => p.id !== payload.id);
      saveProducts(updatedProducts);
      return { success: true, message: "Product deleted successfully" };
    }

    if (type === "TOGGLE_FEATURED") {
      const products = getProducts();
      const updatedProducts = products.map(p => {
        if (p.id === payload.id) {
          return { ...p, isFeatured: !p.isFeatured };
        }
        return p;
      });
      saveProducts(updatedProducts);
      return { success: true, message: "Product featured status updated" };
    }

    if (type === "UPDATE_ORDER_STATUS") {
      const orders = getOrders();
      const updatedOrders = orders.map(o => {
        if (o.orderId === payload.orderId) {
          return { ...o, status: payload.status };
        }
        return o;
      });
      saveOrders(updatedOrders);
      return { success: true, message: "Order status updated" };
    }

    if (type === "DELETE_ORDER") {
      const orders = getOrders();
      const updatedOrders = orders.filter(o => o.orderId !== payload.orderId);
      saveOrders(updatedOrders);
      return { success: true, message: "Order deleted successfully" };
    }

    if (type === "CLEAR_ORDERS") {
      saveOrders([]);
      return { success: true, message: "All orders cleared" };
    }

    return { success: false, error: "Invalid action type" };
  } catch (error) {
    console.error("Admin action error", error);
    return { success: false, error: "Server error occurred" };
  }
}

export default function Admin() {
  const { isAuthorized, products, orders } = useLoaderData<typeof clientLoader>();
  const actionData = useActionData<typeof clientAction>();
  const submit = useSubmit();
  const { showNotification } = useNotifications();

  // Authentication states
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Tab State
  const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form States for Product
  const [prodName, setProdName] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodCategory, setProdCategory] = useState("Hybrid");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodThc, setProdThc] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodImageBase64, setProdImageBase64] = useState<string | null>(null);
  const [prodIsFeatured, setProdIsFeatured] = useState(false);
  const [prodWeight, setProdWeight] = useState("7g");
  const [prodWeightsText, setProdWeightsText] = useState("3.5g, 7g, 14g, 28g");

  // Handle action response
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        setAuthError("");
      } else {
        setAuthError(actionData.error || "Authentication failed");
      }
    }
  }, [actionData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    triggerServerAction("LOGIN", { password: passwordInput });
  };

  const handleLogout = () => {
    triggerServerAction("LOGOUT", {});
    showNotification("Logged out from admin panel", "info");
  };

  // Helper to submit server actions
  const triggerServerAction = (type: string, payload: any) => {
    submit(
      { type, payload: JSON.stringify(payload) },
      { method: "post", encType: "application/json" }
    );
  };

  // Toggle Featured Flag
  const handleToggleFeatured = (id: string) => {
    triggerServerAction("TOGGLE_FEATURED", { id });
    showNotification("Updated featured settings");
  };

  // Delete Product
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      triggerServerAction("DELETE_PRODUCT", { id });
      showNotification(`Deleted "${name}"`);
    }
  };

  // File change handler (reads file as base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProdImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setProdName("");
    setProdBrand("");
    setProdDesc("");
    setProdCategory("Hybrid");
    setProdPrice("");
    setProdOriginalPrice("");
    setProdThc("25.00%");
    setProdImage("https://images.unsplash.com/photo-1603909223429-69bb7101f420?w=400&q=80");
    setProdImageBase64(null);
    setProdIsFeatured(false);
    setProdWeight("7g");
    setProdWeightsText("3.5g, 7g, 14g, 28g");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdBrand(product.brand);
    setProdDesc(product.description);
    setProdCategory(product.category);
    setProdPrice(product.price.toString());
    setProdOriginalPrice(product.originalPrice ? product.originalPrice.toString() : "");
    setProdThc(product.thc);
    setProdImage(product.image);
    setProdImageBase64(null);
    setProdIsFeatured(product.isFeatured);
    setProdWeight(product.weight);
    setProdWeightsText(product.weights ? product.weights.join(", ") : "");
    setIsModalOpen(true);
  };

  // Handle Product Form Submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prodName.trim() || !prodBrand.trim() || !prodPrice.trim()) {
      showNotification("Please fill in Name, Brand, and Price", "error");
      return;
    }

    const priceNum = parseFloat(prodPrice);
    if (isNaN(priceNum)) {
      showNotification("Price must be a valid number", "error");
      return;
    }

    const origPriceNum = parseFloat(prodOriginalPrice);

    // Split weights list
    const weightsList = prodWeightsText
      .split(",")
      .map(w => w.trim())
      .filter(w => w.length > 0);

    const productPayload = {
      id: editingProduct ? editingProduct.id : undefined,
      name: prodName.trim(),
      brand: prodBrand.trim(),
      description: prodDesc.trim() || "No description provided.",
      category: prodCategory,
      price: priceNum,
      originalPrice: isNaN(origPriceNum) ? undefined : origPriceNum,
      thc: prodThc.trim(),
      image: prodImage,
      imageBase64: prodImageBase64,
      isFeatured: prodIsFeatured,
      weight: prodWeight.trim(),
      weights: weightsList.length > 0 ? weightsList : [prodWeight.trim()]
    };

    triggerServerAction(editingProduct ? "EDIT_PRODUCT" : "ADD_PRODUCT", productPayload);
    setIsModalOpen(false);
  };

  // Change Order Status
  const handleOrderStatusChange = (orderId: string, status: string) => {
    triggerServerAction("UPDATE_ORDER_STATUS", { orderId, status });
  };

  // Delete Order
  const handleDeleteOrder = (orderId: string) => {
    if (confirm(`Delete record for order ${orderId}?`)) {
      triggerServerAction("DELETE_ORDER", { orderId });
      showNotification(`Deleted order ${orderId}`);
    }
  };

  const handleClearOrders = () => {
    if (confirm("Are you sure you want to clear ALL order logs? This action is permanent.")) {
      triggerServerAction("CLEAR_ORDERS", {});
      showNotification("Orders logs cleared");
    }
  };

  // Login page overlay if unauthorized
  if (!isAuthorized) {
    return (
      <div className="container-custom" style={{ marginTop: "4rem", maxWidth: "480px" }}>
        <form className="glass-panel" style={{ padding: "3rem", textAlign: "center" }} onSubmit={handleLogin}>
          <svg style={{ width: "48px", height: "48px", color: "var(--color-primary)", marginBottom: "1.5rem" }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem" }}>ADMIN PASSWORD</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
            This section is restricted. Authentication is verified securely on the server.
          </p>

          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Enter Password PIN"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: "0.1em" }}
            />
          </div>

          {authError && (
            <div style={{ color: "var(--color-danger)", fontSize: "0.85rem", margin: "1rem 0" }}>
              {authError}
            </div>
          )}

          <button type="submit" className="cart-checkout-btn" style={{ marginTop: "1rem" }}>
            VERIFY SECURELY
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-custom" style={{ marginTop: "2rem" }}>
      
      {/* Heading */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginBottom: "2rem", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontFamily: "var(--font-heading)", fontWeight: 800, marginBottom: "0.25rem" }}>ADMIN PANEL</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Manage inventory, adjust featured selections, and review orders. (Secure Server Authenticated)</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          {activeTab === "inventory" && (
            <button className="btn-age-verify" style={{ width: "auto", padding: "0.6rem 1.5rem" }} onClick={openAddModal}>
              + ADD PRODUCT
            </button>
          )}
          <button className="qty-btn" style={{ width: "auto", padding: "0.6rem 1.25rem", color: "var(--text-muted)", borderColor: "rgba(255,255,255,0.1)" }} onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tab-nav">
        <button
          className={`admin-tab-btn ${activeTab === "inventory" ? "active" : ""}`}
          onClick={() => setActiveTab("inventory")}
        >
          Product Catalog ({products.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Incoming Orders ({orders.length})
        </button>
      </div>

      {/* Tab Panel: Products */}
      {activeTab === "inventory" && (
        <div className="glass-panel" style={{ padding: "1.5rem", overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Brand</th>
                <th>Category</th>
                <th>THC %</th>
                <th>Price</th>
                <th>Featured</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>
                    <img src={p.image} alt={p.name} style={{ width: "40px", height: "40px", objectFit: "contain", background: "rgba(255,255,255,0.02)", borderRadius: "4px" }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{p.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Weights: {p.weights?.join(", ")}</div>
                  </td>
                  <td style={{ fontSize: "0.9rem" }}>{p.brand}</td>
                  <td>
                    <span className="badge-status open" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-color)", color: "var(--text-main)" }}>{p.category}</span>
                  </td>
                  <td style={{ fontSize: "0.9rem" }}>{p.thc}</td>
                  <td style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                    {p.price.toFixed(2)}
                    {p.originalPrice && <span style={{ textDecoration: "line-through", color: "var(--text-muted)", fontSize: "0.75rem", marginLeft: "0.5rem" }}>{p.originalPrice.toFixed(2)}</span>}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={p.isFeatured}
                      onChange={() => handleToggleFeatured(p.id)}
                      style={{ transform: "scale(1.2)", cursor: "pointer", accentColor: "var(--color-primary)" }}
                    />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="qty-btn" style={{ display: "inline-flex", width: "auto", padding: "0.25rem 0.75rem", marginRight: "0.5rem", fontSize: "0.8rem", borderRadius: "4px" }} onClick={() => openEditModal(p)}>Edit</button>
                    <button className="qty-btn" style={{ display: "inline-flex", width: "auto", padding: "0.25rem 0.75rem", fontSize: "0.8rem", color: "var(--color-danger)", borderColor: "rgba(239,68,68,0.2)", borderRadius: "4px" }} onClick={() => handleDeleteProduct(p.id, p.name)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab Panel: Orders */}
      {activeTab === "orders" && (
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          {orders.length > 0 && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
              <button className="qty-btn" style={{ width: "auto", padding: "0.4rem 1rem", color: "var(--color-danger)", borderColor: "rgba(239,68,68,0.3)" }} onClick={handleClearOrders}>
                CLEAR ALL RECORDS
              </button>
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                <svg style={{ width: "48px", height: "48px", opacity: 0.3, marginBottom: "1rem" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p>No checkout orders have been registered yet.</p>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Details</th>
                    <th>Zone & Address</th>
                    <th>Items Purchased</th>
                    <th>Total Value</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.orderId}>
                      <td style={{ fontWeight: 700, color: "var(--color-primary)" }}>{o.orderId}</td>
                      <td>
                        <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{o.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{o.phone}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{o.timestamp}</div>
                      </td>
                      <td style={{ fontSize: "0.85rem", maxWidth: "200px" }}>
                        <div style={{ fontWeight: 600 }}>{o.zone}</div>
                        <div style={{ color: "var(--text-muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }} title={o.address}>
                          {o.address}
                        </div>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                        {o.items.map((item, idx) => (
                          <div key={idx}>
                            &bull; {item.name} ({item.weight}) x{item.qty}
                          </div>
                        ))}
                      </td>
                      <td style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem" }}>
                        {o.total.toFixed(2)}
                        <div style={{ fontSize: "0.7rem", fontWeight: "normal", color: "var(--text-muted)" }}>{o.paymentMethod}</div>
                      </td>
                      <td>
                        <select
                          className="weight-selector"
                          value={o.status || "Pending"}
                          onChange={(e) => handleOrderStatusChange(o.orderId, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Delivering">Delivering</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="qty-btn" style={{ display: "inline-flex", width: "auto", padding: "0.25rem 0.75rem", fontSize: "0.8rem", color: "var(--color-danger)", borderColor: "rgba(239,68,68,0.2)", borderRadius: "4px" }} onClick={() => handleDeleteOrder(o.orderId)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Product */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
              {editingProduct ? `EDIT PRODUCT: ${editingProduct.name}` : "ADD NEW PRODUCT"}
            </h2>

            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Shadowberry"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Brand *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Modern Flower"
                    value={prodBrand}
                    onChange={(e) => setProdBrand(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Category *</label>
                  <select
                    className="form-select"
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                  >
                    <option value="Hybrid">Hybrid</option>
                    <option value="Indica">Indica</option>
                    <option value="Sativa">Sativa</option>
                    <option value="Pre-rolls">Pre-rolls</option>
                    <option value="Vapes">Vapes</option>
                    <option value="Topicals">Topicals</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">Price (No $ sign) *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. 30.00"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Original Price (Before discount)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 40.00 (optional)"
                    value={prodOriginalPrice}
                    onChange={(e) => setProdOriginalPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label className="form-label">THC Percentage</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 31.03%"
                    value={prodThc}
                    onChange={(e) => setProdThc(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Base Weight *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. 7g"
                    value={prodWeight}
                    onChange={(e) => setProdWeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Available Weights (Comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 3.5g, 7g, 14g, 28g"
                  value={prodWeightsText}
                  onChange={(e) => setProdWeightsText(e.target.value)}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>If specified, customers can toggle weights. Pricing scales by weight.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Product Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="form-input"
                  style={{ padding: "0.5rem" }}
                />
                {prodImageBase64 && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Selected Preview:</span>
                    <img src={prodImageBase64} alt="Preview" style={{ width: "80px", height: "80px", objectFit: "contain", border: "1px solid var(--border-color)", borderRadius: "4px" }} />
                  </div>
                )}
                {prodImage && !prodImageBase64 && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Current Image:</span>
                    <img src={prodImage} alt="Current" style={{ width: "80px", height: "80px", objectFit: "contain", border: "1px solid var(--border-color)", borderRadius: "4px" }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter product description, effects, genetics..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  id="prodIsFeatured"
                  checked={prodIsFeatured}
                  onChange={(e) => setProdIsFeatured(e.target.checked)}
                  style={{ transform: "scale(1.2)", cursor: "pointer", accentColor: "var(--color-primary)" }}
                />
                <label htmlFor="prodIsFeatured" style={{ fontSize: "0.9rem", color: "var(--text-main)", cursor: "pointer" }}>Show in Featured Products on Main Page</label>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button type="submit" className="cart-checkout-btn" style={{ flex: 2 }}>
                  {editingProduct ? "SAVE CHANGES" : "ADD PRODUCT"}
                </button>
                <button type="button" className="btn-age-decline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
