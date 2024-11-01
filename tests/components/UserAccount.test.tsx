import { render, screen } from "@testing-library/react";
import { it, expect, describe } from "vitest";
import UserAccount from "../../src/components/UserAccount";

describe("UserAccount", () => {
    const user = {
        id: 1,
        name: "Arni",
        isAdmin: false,
    };

    const admin = {
        id: 1,
        name: "Arni",
        isAdmin: true,
    };

    it("should render user name", () => {
        render(<UserAccount user={user} />);

        expect(screen.getByText(user.name)).toBeInTheDocument();
    });

    it("should render edit button when user is admin", () => {
        render(<UserAccount user={admin} />);

        const button = screen.getByRole("button");

        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(/edit/i);
    });

    it("should not render login button when user is not an admin", () => {
        render(<UserAccount user={user} />);

        const button = screen.queryByRole("button");

        expect(button).not.toBeInTheDocument();
    });
});
