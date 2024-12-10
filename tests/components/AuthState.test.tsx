import { render, screen } from "@testing-library/react";
import { mockAuthState } from "../utils";
import AuthStatus from "../../src/components/AuthStatus";

describe("AuthStatus", () => {
    it("should render the loading message while fetching the auth status", () => {
        mockAuthState({
            isLoading: true,
            isAuthenticated: false,
            user: undefined,
        });

        render(<AuthStatus />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it(" should render the login button if user is not authenticated", () => {
        mockAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: undefined,
        });

        render(<AuthStatus />);

        expect(
            screen.getByRole("button", { name: /log in/i })
        ).toBeInTheDocument();
    });
});
