import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
    const renderComponent = () => {
        const onChange = vi.fn();
        render(<SearchBox onChange={onChange} />);

        return {
            input: screen.getByPlaceholderText(/search/i),
            user: userEvent.setup(),
            onChange,
        };
    };

    it("should render a searchbox for searching", () => {
        const { input } = renderComponent();

        expect(input).toBeInTheDocument();
    });

    it("should call onChange when Enter is pressed", async () => {
        const { user, input, onChange } = renderComponent();

        const searchTerm = "SearchTerm";
        await user.type(input, searchTerm + "{enter}");

        expect(onChange).toHaveBeenCalledWith(searchTerm);
    });

    it("should call not call onChange if input field is empty", async () => {
        const { user, input, onChange } = renderComponent();

        await user.type(input, "enter");

        expect(onChange).not.toHaveBeenCalled();
    });
});
