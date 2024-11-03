import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("ExpandableText", () => {
    const limit = 255;
    const shortText = "Lorem";
    const longText = "a".repeat(limit + 1);
    const truncatedText = longText.substring(0, limit) + "...";

    it("should render the full text if less than 255 characters", () => {
        render(<ExpandableText text={shortText} />);

        expect(screen.getByText(shortText)).toBeInTheDocument();
    });

    it("should truncate text when it exceeds the limit", () => {
        render(<ExpandableText text={longText} />);

        expect(screen.getByText(truncatedText)).toBeInTheDocument();
        const button = screen.getByRole("button");
        expect(button).toHaveTextContent(/show more/i);
    });

    it("should expand text when Show More button is clicked", async () => {
        render(<ExpandableText text={longText} />);

        const button = screen.getByRole("button");
        const user = userEvent.setup();
        await user.click(button);

        expect(button).toHaveTextContent(/show less/i);
        expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("should collapse text when Show Less button is clicked", async () => {
        render(<ExpandableText text={longText} />);
        const showMoreButton = screen.getByRole("button", { name: /more/i });
        const user = userEvent.setup();
        await user.click(showMoreButton);

        const showLessButton = screen.getByRole("button", { name: /less/i });
        await user.click(showLessButton);

        expect(showLessButton).toHaveTextContent(/show more/i);
        expect(screen.getByText(truncatedText)).toBeInTheDocument();
    });
});
