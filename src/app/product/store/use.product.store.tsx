import { create } from "zustand";
import { IGetAllProductsResponse } from "../../../core/product/domain/get.all.products";
import {
  IGetSingleProductRequest,
  IGetSingleProductResponse,
} from "../../../core/product/domain/get.single.product";

import { getPaginatedProductsUseCase } from "../../../core/product/application/pag.product.use.case";
import { productRepository } from "../../../core/product/infrastructure/product.repository";
import { IPagProductsResponse } from "../../../core/product/domain/pagination.product";
import { getSingleProductUseCase } from "../../../core/product/application/get.single.product.use.case";
import { getAllProductsUseCase } from "../../../core/product/application/get.all.products.use.case";

interface State {
  singleProduct: IGetSingleProductResponse | null;
  getSingleProduct: (body: IGetSingleProductRequest) => void;
  loadingProduct: boolean;
}

interface AllState {
  allProducts: IGetAllProductsResponse[] | null;
  loadingAllProducts: boolean;
  getAllProducts: () => void;

  paginatedProducts: IPagProductsResponse[] | null;
  loadingPaginatedProducts: boolean;
  getPaginatedProducts: (offset: number, limit: number) => void;
}

const getProductById = getSingleProductUseCase(productRepository);
const getAllProducts = getAllProductsUseCase(productRepository);
const getPaginatedProducts = getPaginatedProductsUseCase(productRepository);

export const useProductsStore = create<AllState>((set) => ({
  allProducts: null,
  loadingAllProducts: true,
  getAllProducts: async () => {
    set({ loadingAllProducts: true });
    try {
      const data = await getAllProducts();
      set({ allProducts: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingAllProducts: false });
    }
  },
  paginatedProducts: null,
  loadingPaginatedProducts: true,
  getPaginatedProducts: async (offset, limit) => {
    set({ loadingPaginatedProducts: true });
    try {
      const data = await getPaginatedProducts({ offset, limit });
      set({ paginatedProducts: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingPaginatedProducts: false });
    }
  },
}));

export const useProductStore = create<State>((set) => ({
  singleProduct: null,
  loadingProduct: true,
  getSingleProduct: async (body) => {
    set({ loadingProduct: true });
    try {
      const data = await getProductById(body);
      set({ singleProduct: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadingProduct: false });
    }
  },
}));
