import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true, description: true }
  });
}

export async function listProducts(query) {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 12));
  const where = {
    isActive: true,
    ...(query.category ? { category: { slug: query.category } } : {}),
    ...(query.search ? { name: { contains: String(query.search), mode: "insensitive" } } : {})
  };
  const [items, total] = await prisma.$transaction([
    prisma.product.findMany({
      where, skip: (page - 1) * limit, take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, slug: true, description: true,
        imageUrl: true, price: true, category: { select: { name: true, slug: true } },
        _count: { select: { stocks: true } }
      }
    }),
    prisma.product.count({ where })
  ]);
  return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getProductBySlug(slug) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    select: {
      id: true, name: true, slug: true, description: true, imageUrl: true,
      price: true, category: { select: { name: true, slug: true } },
      _count: { select: { stocks: true } }
    }
  });
  if (!product) throw new AppError("Produk tidak ditemukan", 404, "PRODUCT_NOT_FOUND");
  return product;
}

export async function createProduct(data) {
  return prisma.product.create({ data });
}

export async function updateProduct(id, data) {
  const product = await prisma.product.update({ where: { id }, data });
  return product;
}


export async function deleteProduct(id) {
  // Soft delete keeps historical order references intact.
  return prisma.product.update({
    where: { id },
    data: { isActive: false },
    select: { id: true, name: true, isActive: true }
  });
}

export async function getAdminDashboard() {
  const [users, products, orders, pendingOrders, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true }
    })
  ]);
  return {
    users,
    activeProducts: products,
    orders,
    pendingOrders,
    paidRevenue: revenue._sum.amount ?? "0"
  };
}
