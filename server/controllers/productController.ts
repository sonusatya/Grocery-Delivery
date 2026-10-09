

import { Request, Response } from "express"
import { prisma } from "../config/prisma.js"


// Get /api/products/flash-deals

export const getFlashDeals = async (req:Request, res:Response) =>{
    const products = await prisma.product.findMany({
where: {stock: {gt: 0}},
orderBy : {originalPrice: "desc"}
    })

    const productsWithDiscount = products.map((p: any)=>{
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return {...p, discount}
    })
    res.json({products: productsWithDiscount.slice(0,8)})
}

// Get /api/products

export const getProducts = async (req:Request, res:Response) =>{
   const {category, search, minPrice, maxPrice, sort, page, limit} = req.query;

   const where: any = {};
   if(category && category !== "all") where.category = category as string;
   if(search) where.name = {contains: search as string, mode: "insensitive"};
   if(minPrice || maxPrice){
    where.price = {};
    if(minPrice && Number.isFinite(Number(minPrice))) where.price.gte = Number(minPrice)
        if(maxPrice && Number.isFinite(Number(maxPrice))) where.price.lte = Number(maxPrice)
   }

   const orderBy: any = {};
   if(sort === "price-low" || sort === "price_asc") orderBy.price = 'asc'
 else if(sort === "price-high" || sort === "price_dec") orderBy.price = 'desc'
 else if(sort === "rating") orderBy.rating = 'desc'
 else if(sort === "name") orderBy.name = 'asc'
 else orderBy.createdAt = 'desc'

 // Pagination is opt-in: only applied when the caller asks for it, so other
 // endpoints (search, related products, admin list) keep returning everything.
 const pageNum = Number(page);
 const limitNum = Number(limit);
 const paginate = (Number.isInteger(pageNum) && pageNum > 0) &&
                  (Number.isInteger(limitNum) && limitNum > 0);

 // When paginating, only count/return in-stock items so a page is never
 // partially empty — the client grid hides out-of-stock products anyway.
 // Non-paginated callers (admin list, search) still get everything.
 const pagedWhere = paginate ? {...where, stock: {gt: 0}} : where;

 const totalCount = paginate ? await prisma.product.count({where: pagedWhere}) : 0;

 const products = await prisma.product.findMany({
    where: pagedWhere,
    orderBy,
    ...(paginate ? {skip: (pageNum - 1) * limitNum, take: limitNum} : {}),
 })

const productsWithDiscount =  products.map((p: any)=>{
        const discount = p.originalPrice && p.price ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return {...p, discount}
    })
        res.json({
            products: productsWithDiscount,
            ...(paginate ? {pages: Math.max(1, Math.ceil(totalCount / limitNum)), total: totalCount} : {}),
        })
}

// Get /api/products/id

export const getProduct = async (req:Request, res:Response) =>{
          const product = await prisma.product.findUnique({where: {id: req.params.id as string}})

          if(!product){
            res.status(404).json({message: "product not found"})
            return;
            }

              const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

              res.json({product:{...product, discount}})

}

// Post /api/products

export const createProduct = async (req:Request, res:Response) =>{
    const product = await prisma.product.create({data: req.body})
    res.status(201).json({product})
}

// Put /api/products/ :id

export const updateProduct = async (req:Request, res:Response) =>{
    const product = await prisma.product.update({where: {id: req.params.id as string}, data: req.body})
    res.json({product})
}

// Delete /api/products/ :id

export const deleteProduct = async (req:Request, res:Response) =>{
     await prisma.product.update({
        where: {id: req.params.id as string},
        data: {stock: Number(0)}
    })
    res.json({message: "Product Updated"})
}
