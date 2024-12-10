import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import { navigateTo } from "../utils";
import { db } from "../mocks/db";
import { Product } from "../../src/entities";

describe("ProductsDetailsPage", () => {
    let product: Product;

    beforeAll(() => {
        product = db.product.create();
    });

    afterAll(() => {
        db.product.delete({ where: { id: { equals: product.id } } });
    });

    it("should render product details", async () => {
        navigateTo("/products/" + product.id);

        await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

        expect(
            screen.getByRole("heading", { name: product.name })
        ).toBeInTheDocument();

        expect(screen.getByText("$" + product.price)).toBeInTheDocument();
    });
});
