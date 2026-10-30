import { expect, withApp as test } from '../../config/fixtures';
import { Department, HttpStatus, OrderRejection, OrderStatus } from '../../constants/enums';
import { SearchBuilder } from '../../testdata/builders/SearchBuilder';
import { ProductBuilder } from '../../testdata/builders/ProductBuilder';
import { OrderBuilder } from '../../testdata/builders/OrderBuilder';
import type { CatalogDatabaseWorkflow } from '../../business/CatalogDatabaseWorkflow';
import type { ProductApiWorkflow } from '../../business/ProductApiWorkflow';
import type { IOrderRequest, IProduct } from '../../business/types';

const TEST_CASES = [
  {
    description: 'TC-040: should place an order from UI and persist it in API + DB',
    search: new SearchBuilder().headphones().build(),
    product: new ProductBuilder().headphones().build(),
  },
];

test.describe('Feature: Search then order across UI, API, and DB', () => {
  test.describe.configure({ mode: 'serial' });

  TEST_CASES.forEach(({ description, search, product }) => {
    test(description, async ({ storeSearch, productApi, catalogDb }) => {
      const stockBefore = catalogDb.getProduct(product.asin)?.stock ?? 0;
      let statusText = '';

      await test.step('Act: search in UI and add first result to cart', async () => {
        const result = await storeSearch.searchAndPlaceOrder(search);
        statusText = result.status;
      });

      await test.step('Assert: UI, API, and DB all show the order', async () => {
        expect(statusText).toMatch(/Order ORD-/);
        const apiProduct = await productApi.getProductByAsin(product.asin);
        expect('stock' in apiProduct.body ? apiProduct.body.stock : -1).toBe(stockBefore - 1);
        const dbProduct = catalogDb.getProduct(product.asin);
        expect(dbProduct?.stock).toBe(stockBefore - 1);
        expect(catalogDb.getOrders(product.asin).length).toBeGreaterThan(0);
      });

      await test.step('Cleanup: restore stock so the suite stays isolated', async () => {
        catalogDb.restoreStock(product.asin, stockBefore);
      });
    });
  });

  test('TC-041: should place a charger order and persist the catalog price', async ({
    storeSearch,
    productApi,
    catalogDb,
  }) => {
    const search = new SearchBuilder().charger().build();
    const product = new ProductBuilder().charger().build();
    const order = new OrderBuilder().charger().build();
    const untouched = [new ProductBuilder().headphones().build(), new ProductBuilder().notebook().build()];
    const stockBefore = catalogDb.getProduct(product.asin)?.stock ?? 0;
    const ordersBefore = catalogDb.getOrders(product.asin).length;
    const untouchedStock = snapshotStock(catalogDb, untouched);
    let statusText = '';

    try {
      await test.step('Act: search in UI and add the charger to cart', async () => {
        const result = await storeSearch.searchAndPlaceOrder(search);
        statusText = result.status;
      });

      await test.step('Assert: UI, API, and DB record the charger at its catalog price', async () => {
        await expectPlacedOrder(
          statusText,
          product,
          order,
          stockBefore,
          ordersBefore,
          productApi,
          catalogDb,
        );
        expect(catalogDb.getProduct(product.asin)?.department).toBe(Department.ELECTRONICS);
        expectUntouchedStock(catalogDb, untouchedStock);
      });
    } finally {
      catalogDb.restoreStock(product.asin, stockBefore);
    }
  });

  test('TC-042: should place a notebook order and leave the other products in stock', async ({
    storeSearch,
    productApi,
    catalogDb,
  }) => {
    const search = new SearchBuilder().notebook().build();
    const product = new ProductBuilder().notebook().build();
    const order = new OrderBuilder().notebook().build();
    const untouched = [new ProductBuilder().headphones().build(), new ProductBuilder().charger().build()];
    const stockBefore = catalogDb.getProduct(product.asin)?.stock ?? 0;
    const ordersBefore = catalogDb.getOrders(product.asin).length;
    const untouchedStock = snapshotStock(catalogDb, untouched);
    let statusText = '';

    try {
      await test.step('Act: search in UI and add the notebook to cart', async () => {
        const result = await storeSearch.searchAndPlaceOrder(search);
        statusText = result.status;
      });

      await test.step('Assert: UI, API, and DB record the notebook and keep other stock', async () => {
        await expectPlacedOrder(
          statusText,
          product,
          order,
          stockBefore,
          ordersBefore,
          productApi,
          catalogDb,
        );
        expect(catalogDb.getProduct(product.asin)?.department).toBe(Department.BOOKS);
        expectUntouchedStock(catalogDb, untouchedStock);
      });
    } finally {
      catalogDb.restoreStock(product.asin, stockBefore);
    }
  });

  test('TC-043: should keep stock and orders unchanged when the item is out of stock', async ({
    storeSearch,
    productApi,
    catalogDb,
  }) => {
    const search = new SearchBuilder().headphones().build();
    const product = new ProductBuilder().headphones().build();
    const stockBefore = catalogDb.getProduct(product.asin)?.stock ?? 0;
    const ordersBefore = catalogDb.getOrders(product.asin).length;
    const depletedStock = 0;
    let statusText = '';

    // Drain the catalog row first so the store rejects the cart action.
    catalogDb.restoreStock(product.asin, depletedStock);

    try {
      await test.step('Act: search in UI and add the depleted product to cart', async () => {
        const result = await storeSearch.searchAndPlaceOrder(search);
        statusText = result.status;
      });

      await test.step('Assert: UI shows the rejection and API + DB stay unchanged', async () => {
        expect(statusText.trim()).toBe(OrderRejection.OUT_OF_STOCK);
        const apiProduct = await productApi.getProductByAsin(product.asin);
        expect(apiProduct.status).toBe(HttpStatus.OK);
        expect('stock' in apiProduct.body ? apiProduct.body.stock : -1).toBe(depletedStock);
        expect(catalogDb.getProduct(product.asin)?.stock).toBe(depletedStock);
        expect(catalogDb.getOrders(product.asin)).toHaveLength(ordersBefore);
      });
    } finally {
      catalogDb.restoreStock(product.asin, stockBefore);
    }
  });
});

function snapshotStock(
  catalogDb: CatalogDatabaseWorkflow,
  products: IProduct[],
): Array<{ asin: string; stock: number }> {
  return products.map((item) => ({
    asin: item.asin,
    stock: catalogDb.getProduct(item.asin)?.stock ?? 0,
  }));
}

async function expectPlacedOrder(
  statusText: string,
  product: IProduct,
  order: IOrderRequest,
  stockBefore: number,
  ordersBefore: number,
  productApi: ProductApiWorkflow,
  catalogDb: CatalogDatabaseWorkflow,
): Promise<void> {
  expect(statusText).toMatch(new RegExp(`Order ORD-\\d+ placed for ${product.asin}`));
  const apiProduct = await productApi.getProductByAsin(product.asin);
  expect(apiProduct.status).toBe(HttpStatus.OK);
  expect('stock' in apiProduct.body ? apiProduct.body.stock : -1).toBe(stockBefore - 1);
  expect(catalogDb.getProduct(product.asin)?.stock).toBe(stockBefore - 1);

  const orders = catalogDb.getOrders(product.asin);
  expect(orders).toHaveLength(ordersBefore + 1);
  const placedOrder = orders[orders.length - 1];
  expect(placedOrder.asin).toBe(order.asin);
  expect(placedOrder.quantity).toBe(order.quantity);
  expect(placedOrder.total).toBe(Number((product.price * order.quantity).toFixed(2)));
  expect(placedOrder.status).toBe(OrderStatus.PLACED);
}

function expectUntouchedStock(
  catalogDb: CatalogDatabaseWorkflow,
  untouchedStock: Array<{ asin: string; stock: number }>,
): void {
  for (const item of untouchedStock) {
    expect(catalogDb.getProduct(item.asin)?.stock).toBe(item.stock);
  }
}
