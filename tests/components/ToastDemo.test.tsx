import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
    it("should render button with text", () => {
        render(
            <>
                <ToastDemo />
                <Toaster />
            </>
        );

        const button = screen.getByText(/toast/i);

        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/show toast/i);
    });

    it("should show toast popup when the button is clicked", async () => {
        render(
            <>
                <ToastDemo />
                <Toaster />
            </>
        );

        const button = screen.getByText(/toast/i);
        const user = userEvent.setup();

        await user.click(button);
        const popup = await screen.findByText(/success/i);

        expect(popup).toBeInTheDocument();
    });
});
