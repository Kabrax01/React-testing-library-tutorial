import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { http, HttpResponse, delay } from "msw";
import { server } from "../mocks/server";
import { db } from "../mocks/db";

describe("ProductDetail", () => {
    let product: { id: number; name: string; price: number };

    beforeAll(() => {
        product = db.product.create();
    });

    afterAll(() => {
        db.product.delete({ where: { id: { equals: product.id } } });
    });

    it("should render the product details", async () => {
        render(<ProductDetail productId={product.id} />);

        expect(
            await screen.findByText(new RegExp(product.name))
        ).toBeInTheDocument();
        expect(
            await screen.findByText(new RegExp(product.price.toString()))
        ).toBeInTheDocument();
    });

    it("should render message when product not found", async () => {
        server.use(http.get("/products/:id", () => HttpResponse.json(null)));

        render(<ProductDetail productId={1} />);

        const message = await screen.findByText(/not found/i);
        expect(message).toBeInTheDocument();
    });

    it("should render an error for invalid productId", async () => {
        render(<ProductDetail productId={0} />);

        const message = await screen.findByText(/invalid/i);
        expect(message).toBeInTheDocument();
    });

    it("should render an error message when error occurs", async () => {
        server.use(http.get("/products/:id", () => HttpResponse.error()));

        render(<ProductDetail productId={product.id} />);

        expect(await screen.findByText(/error/i)).toBeInTheDocument();
    });

    it("should render an loading indicator when data is being fetched", async () => {
        server.use(
            http.get("/products/:id", async () => {
                await delay();
                return HttpResponse.json([]);
            })
        );

        render(<ProductDetail productId={product.id} />);

        expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    });

    it("should remove the loading indicator when data fetching ends", async () => {
        render(<ProductDetail productId={product.id} />);

        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    });

    it("should remove loading indicator when data fetching fails", async () => {
        server.use(http.get("/product/:id", () => HttpResponse.error()));

        render(<ProductDetail productId={product.id} />);

        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    });
});
