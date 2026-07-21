import { INITIAL_PRODUCTS, type Product } from "./catalog";
import { supabase } from "./supabase";

export interface OrderSummary {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  zone: string;
  items: { name: string; qty: number; weight: string; variant?: string; price: number }[];
  subtotal: number;
  happyHourDiscount: number;
  loyaltyDiscount: number;
  referralDiscount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  timestamp: string;
  status?: string;
  notes?: string;
  orderType?: string;
}

// 1. Fetch Products (Dynamic client load + Seeding if table is empty)
export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .range(0, 9999)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching products from Supabase", error);
      return INITIAL_PRODUCTS;
    }

    // Seed products table if empty
    if (!data || data.length === 0) {
      console.log("Supabase products table is empty. Seeding INITIAL_PRODUCTS...");
      const seedData = INITIAL_PRODUCTS.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand,
        description: p.description,
        category: p.category,
        price: p.price,
        original_price: p.originalPrice || null,
        thc: p.thc,
        rating: p.rating,
        reviews_count: p.reviewsCount,
        image: p.image,
        is_featured: p.isFeatured,
        weight: p.weight,
        weights: p.weights || [],
        variants: p.variants || []
      }));

      const { error: seedError } = await supabase.from("products").insert(seedData);
      if (seedError) {
        console.error("Error seeding products to Supabase", seedError);
      } else {
        console.log("Seeding successful.");
      }
      return INITIAL_PRODUCTS;
    }

    return data.map((p: any) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      description: p.description || "",
      category: p.category,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : undefined,
      thc: p.thc || "",
      rating: Number(p.rating),
      reviewsCount: p.reviews_count || 0,
      image: p.image || "",
      isFeatured: p.is_featured || false,
      weight: p.weight,
      weights: p.weights || [],
      variants: p.variants || []
    }));
  } catch (err) {
    console.error("Unexpected error fetching products", err);
    return INITIAL_PRODUCTS;
  }
}

// 2. Add New Product
export async function addProduct(product: Omit<Product, "id">): Promise<void> {
  const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const insertPayload: any = {
    id,
    name: product.name,
    brand: product.brand,
    description: product.description,
    category: product.category,
    price: product.price,
    original_price: product.originalPrice || null,
    thc: product.thc,
    rating: product.rating,
    reviews_count: product.reviewsCount,
    image: product.image,
    is_featured: product.isFeatured,
    weight: product.weight,
    weights: product.weights || [],
    variants: product.variants || []
  };

  const { error } = await supabase.from("products").insert(insertPayload);
  if (error) {
    console.warn("Error inserting product into Supabase, attempting fallback without array fields", error);
    delete insertPayload.weights;
    delete insertPayload.variants;
    const { error: retryError } = await supabase.from("products").insert(insertPayload);
    if (retryError) {
      console.error("Error adding product to Supabase", retryError);
      throw new Error(`Failed to add product: ${retryError.message}`);
    }
  }
}

// 3. Edit Existing Product
export async function editProduct(product: Product): Promise<void> {
  const updatePayload: any = {
    name: product.name,
    brand: product.brand,
    description: product.description,
    category: product.category,
    price: product.price,
    original_price: product.originalPrice || null,
    thc: product.thc,
    image: product.image,
    is_featured: product.isFeatured,
    weight: product.weight,
    weights: product.weights || [],
    variants: product.variants || []
  };

  const { error } = await supabase
    .from("products")
    .update(updatePayload)
    .eq("id", product.id);
  if (error) {
    console.warn("Error updating product in Supabase, trying without array fields", error);
    delete updatePayload.weights;
    delete updatePayload.variants;
    const { error: retryError } = await supabase
      .from("products")
      .update(updatePayload)
      .eq("id", product.id);
    if (retryError) {
      console.error("Error updating product in Supabase", retryError);
      throw new Error(`Failed to update product: ${retryError.message}`);
    }
  }
}

// 4. Toggle Product Featured Flag
export async function toggleFeaturedProduct(id: string, isFeatured: boolean): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({ is_featured: isFeatured })
    .eq("id", id);
  if (error) {
    console.error("Error toggling featured status in Supabase", error);
    throw error;
  }
}

// 5. Delete Product
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Error deleting product from Supabase", error);
    throw error;
  }
}

// 6. Fetch Orders
export async function getOrders(): Promise<OrderSummary[]> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders from Supabase", error);
      return [];
    }

    return (data || []).map((o: any) => ({
      orderId: o.order_id,
      name: o.name,
      phone: o.phone,
      address: o.address,
      zone: o.zone,
      items: Array.isArray(o.items) ? o.items : [],
      subtotal: Number(o.subtotal),
      happyHourDiscount: Number(o.happy_hour_discount),
      loyaltyDiscount: Number(o.loyalty_discount),
      referralDiscount: Number(o.referral_discount),
      deliveryFee: Number(o.delivery_fee),
      total: Number(o.total),
      paymentMethod: o.payment_method,
      timestamp: o.timestamp,
      status: o.status,
      notes: o.notes || undefined,
      orderType: o.order_type || undefined
    }));
  } catch (err) {
    console.error("Unexpected error fetching orders", err);
    return [];
  }
}

// 7. Save Single Order (Checkout submission)
export async function saveOrder(order: OrderSummary): Promise<void> {
  const insertData: any = {
    order_id: order.orderId,
    name: order.name,
    phone: order.phone,
    address: order.address,
    zone: order.zone,
    items: order.items,
    subtotal: order.subtotal,
    happy_hour_discount: order.happyHourDiscount,
    loyalty_discount: order.loyaltyDiscount,
    referral_discount: order.referralDiscount,
    delivery_fee: order.deliveryFee,
    total: order.total,
    payment_method: order.paymentMethod,
    timestamp: order.timestamp,
    status: order.status || "Pending",
    notes: order.notes || null
  };

  if (order.orderType) {
    insertData.order_type = order.orderType;
  }

  const { error } = await supabase.from("orders").insert(insertData);
  if (error) {
    console.warn("Supabase insert warning (trying without order_type if schema is strict):", error.message);
    delete insertData.order_type;
    const { error: retryError } = await supabase.from("orders").insert(insertData);
    if (retryError) {
      console.error("Error saving order to Supabase", retryError);
      throw retryError;
    }
  }
}

// 8. Update Order Status
export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("order_id", orderId);
  if (error) {
    console.error("Error updating order status in Supabase", error);
    throw error;
  }
}

// 9. Delete Order Record
export async function deleteOrder(orderId: string): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("order_id", orderId);
  if (error) {
    console.error("Error deleting order from Supabase", error);
    throw error;
  }
}

// 10. Clear All Orders
export async function clearOrders(): Promise<void> {
  const { error } = await supabase.from("orders").delete().neq("order_id", "");
  if (error) {
    console.error("Error clearing orders from Supabase", error);
    throw error;
  }
}

// 11. Upload Product Image to Storage Bucket
export async function saveUploadedImage(base64String: string): Promise<string> {
  try {
    // Parse base64
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64String;
    }
    const mimeType = matches[1];
    const base64Data = matches[2];

    // Convert base64 to binary array
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Generate a random file extension mapping
    let extension = "png";
    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) {
      extension = "jpg";
    } else if (mimeType.includes("webp")) {
      extension = "webp";
    } else if (mimeType.includes("gif")) {
      extension = "gif";
    }

    const filename = `img-${Date.now()}-${Math.floor(Math.random() * 1000)}.${extension}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filename, blob, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false
      });

    if (error) {
      console.warn("Error uploading image to Supabase Storage, using direct base64 fallback", error);
      return base64String;
    }

    // Get Public URL
    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(filename);

    return publicUrlData.publicUrl || base64String;
  } catch (err) {
    console.warn("Storage upload exception, using direct base64 fallback", err);
    return base64String;
  }
}
