import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
    it("should render user name", () => {
        const user: User = {
            name: "Arni",
            id: 1,
        };

        render(<UserAccount user={user} />);

        const nameDisplay = screen.getByText(user.name);
        expect(nameDisplay).toBeInTheDocument();
        expect(nameDisplay).toHaveTextContent(/arni/i);
    });

    it("should render edit button if user is admin", () => {
        const user: User = {
            name: "Arni",
            id: 1,
            isAdmin: true,
        };
        render(<UserAccount user={user} />);

        const editButton = screen.getByRole("button");
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveTextContent(/edit/i);
    });

    it("should not render edit button if user is not admin", () => {
        const user: User = {
            name: "Arni",
            id: 1,
        };
        render(<UserAccount user={user} />);

        const editButton = screen.queryByRole("button");
        expect(editButton).not.toBeInTheDocument();
    });
});
