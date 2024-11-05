import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";
import { http, HttpResponse } from "msw";
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

    it("should render an error for invalid produtId", async () => {
        render(<ProductDetail productId={0} />);

        const message = await screen.findByText(/invalid/i);
        expect(message).toBeInTheDocument();
    });
});
