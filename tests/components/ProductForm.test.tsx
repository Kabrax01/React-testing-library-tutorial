import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";

describe("ProductForm", () => {
    let category: Category;

    beforeAll(() => (category = db.category.create()));
    afterAll(() =>
        db.category.delete({ where: { id: { equals: category.id } } })
    );

    it("should render form fields", async () => {
        render(<ProductForm onSubmit={vi.fn()} />, { wrapper: AllProviders });

        // await screen.findByRole("form");
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

        const input = screen.getByPlaceholderText(/name/i);
        const priceField = screen.getByPlaceholderText(/price/i);
        const combobox = screen.getByRole("combobox", { name: /category/i });

        expect(input).toBeInTheDocument();
        expect(priceField).toBeInTheDocument();
        expect(combobox).toBeInTheDocument();
    });

    it("should populate form fields when editing a product", async () => {
        const product: Product = {
            id: 1,
            name: "Bread",
            price: 10,
            categoryId: category.id,
        };

        render(<ProductForm product={product} onSubmit={vi.fn()} />, {
            wrapper: AllProviders,
        });

        // await screen.findByRole("form");
        await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

        const input = screen.getByPlaceholderText(/name/i);
        const priceField = screen.getByPlaceholderText(/price/i);
        const combobox = screen.getByRole("combobox", { name: /category/i });

        expect(input).toHaveValue(product.name);
        expect(priceField).toHaveValue(product.price.toString());
        expect(combobox).toHaveTextContent(category.name);
    });
});
