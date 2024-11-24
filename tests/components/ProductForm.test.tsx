import { render, screen } from "@testing-library/react";
import ProductForm from "../../src/components/ProductForm";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { Category, Product } from "../../src/entities";
import userEvent from "@testing-library/user-event";

describe("ProductForm", () => {
    let category: Category;

    const renderComponent = (product?: Product) => {
        render(<ProductForm product={product} onSubmit={vi.fn()} />, {
            wrapper: AllProviders,
        });

        return {
            expectErrorToBeInTheDocument: (errorMessage: RegExp) => {
                const error = screen.getByRole("alert");
                expect(error).toBeInTheDocument();
                expect(error).toHaveTextContent(errorMessage);
            },

            waitForFormToLoad: async () => {
                await screen.findByRole("form");

                const nameInput = screen.getByPlaceholderText(/name/i);
                const priceInput = screen.getByPlaceholderText(/price/i);
                const categoryInput = screen.getByRole("combobox", {
                    name: /category/i,
                });
                const submitButton = screen.getByRole("button");

                type FormData = {
                    [K in keyof Product]: any;
                };

                const validData: FormData = {
                    id: 1,
                    name: "a",
                    price: 1,
                    categoryId: 1,
                };

                const fill = async (product: FormData) => {
                    const user = userEvent.setup();

                    if (product.name !== undefined)
                        await user.type(nameInput, product.name);

                    if (product.price !== undefined)
                        await user.type(priceInput, product.price.toString());

                    await user.click(categoryInput);
                    const options = screen.getAllByRole("option");
                    await user.click(options[0]);
                    await user.click(submitButton);
                };

                return {
                    nameInput,
                    priceInput,
                    categoryInput,
                    submitButton,
                    fill,
                    validData,
                };
            },
        };
    };

    beforeAll(() => (category = db.category.create()));
    afterAll(() =>
        db.category.delete({ where: { id: { equals: category.id } } })
    );

    it("should render form fields", async () => {
        const { waitForFormToLoad } = renderComponent();

        const { nameInput, priceInput, categoryInput } =
            await waitForFormToLoad();
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

        const { waitForFormToLoad } = renderComponent(product);

        const { nameInput, priceInput, categoryInput } =
            await waitForFormToLoad();

        expect(nameInput).toHaveValue(product.name);
        expect(priceInput).toHaveValue(product.price.toString());
        expect(categoryInput).toHaveTextContent(category.name);
    });

    it("should put focus on the name field", async () => {
        const { waitForFormToLoad } = renderComponent();

        const { nameInput } = await waitForFormToLoad();
        expect(nameInput).toHaveFocus();
    });

    it.each([
        {
            scenario: "missing",
            errorMessage: /required/i,
        },
        {
            scenario: "longer than 255 characters",
            name: "a".repeat(256),
            errorMessage: /255/i,
        },
    ])(
        "should display an error if name is $scenario",
        async ({ name, errorMessage }) => {
            const { waitForFormToLoad, expectErrorToBeInTheDocument } =
                renderComponent();

            const form = await waitForFormToLoad();
            await form.fill({ ...form.validData, name });

            expectErrorToBeInTheDocument(errorMessage);
        }
    );

    it.each([
        {
            scenario: "missing",
            errorMessage: /required/i,
        },
        {
            scenario: "0",
            price: 0,
            errorMessage: /1/,
        },
        {
            scenario: "negative",
            price: -1,
            errorMessage: /1/,
        },
        {
            scenario: "not a number",
            price: "a",
            errorMessage: /required/i,
        },
    ])(
        "should display an error if price is $scenario",
        async ({ price, errorMessage }) => {
            const { waitForFormToLoad, expectErrorToBeInTheDocument } =
                renderComponent();

            const form = await waitForFormToLoad();
            await form.fill({ ...form.validData, price });

            expectErrorToBeInTheDocument(errorMessage);
        }
    );
});
