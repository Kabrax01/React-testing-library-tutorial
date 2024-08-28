import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
    const limit = 255;
    const longText = "a.".repeat(limit + 1);
    const truncatedText = longText.substring(0, limit) + "...";

    it("should render whole text if shorter than 255 characters and no button visible", () => {
        const textProp = "Text below the limit";

        render(<ExpandableText text={textProp} />);

        const text = screen.getByText(textProp);
        const button = screen.queryByRole("button");

        expect(text).toBeInTheDocument();
        expect(text).toHaveTextContent(textProp);
        expect(button).not.toBeInTheDocument();
    });

    it("should render truncated text and button if longer than 255 characters", () => {
        render(<ExpandableText text={longText} />);

        const text = screen.getByText(truncatedText);
        const button = screen.getByRole("button");

        expect(text).toBeInTheDocument();
        expect(button).toHaveTextContent(/more/i);
    });

    it("should expand text when Show More button is clicked", async () => {
        render(<ExpandableText text={longText} />);

        const user = userEvent.setup();
        const button = screen.getByRole("button");

        await user.click(button);

        expect(screen.getByText(longText)).toBeInTheDocument();
        expect(button).toHaveTextContent(/less/i);
    });

    it("should collapse text when Show Less button is clicked", async () => {
        render(<ExpandableText text={longText} />);

        const user = userEvent.setup();
        const showMoreButton = screen.getByRole("button", { name: /more/i });
        await user.click(showMoreButton);

        const showLessButton = screen.getByRole("button", { name: /less/i });
        await user.click(showLessButton);

        expect(screen.getByText(truncatedText)).toBeInTheDocument();
        expect(showLessButton).toHaveTextContent(/more/i);
    });
});
