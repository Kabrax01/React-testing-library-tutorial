import {
    render,
    screen,
    waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Product } from "../../src/entities";

describe("ProductForm", () => {
    let category: Category;

    const renderComponent = (product?: Product) => {
        render(<ProductForm product={product} onSubmit={vi.fn()} />, {
            wrapper: AllProviders,
        });

        return {
            waitForFormToLoad: () => screen.findByRole("form"),
            getInputs: () => {
                return {
                    nameInput: screen.getByPlaceholderText(/name/i),
                    priceInput: screen.getByPlaceholderText(/price/i),
                    categoryInput: screen.getByRole("combobox", {
                        name: /category/i,
                    }),
                };
            },
        };
    };

    beforeAll(() => (category = db.category.create()));
    afterAll(() =>
        db.category.delete({ where: { id: { equals: category.id } } })
    );

    it("should render form fields", async () => {
        const { waitForFormToLoad, getInputs } = renderComponent();

        await waitForFormToLoad();
        const { nameInput, priceInput, categoryInput } = getInputs();
        // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

        expect(nameInput).toBeInTheDocument();
        expect(priceInput).toBeInTheDocument();
        expect(categoryInput).toBeInTheDocument();
    });

    it("should populate form fields when editing a product", async () => {
        const product: Product = {
            id: 1,
            name: "Bread",
            price: 10,
            categoryId: category.id,
        };

        const { waitForFormToLoad, getInputs } = renderComponent(product);

        await waitForFormToLoad();
        const { nameInput, priceInput, categoryInput } = getInputs();

        expect(nameInput).toHaveValue(product.name);
        expect(priceInput).toHaveValue(product.price.toString());
        expect(categoryInput).toHaveTextContent(category.name);
    });
});
