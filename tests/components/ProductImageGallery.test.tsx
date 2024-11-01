import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
    const imageUrls = ["Url1", "Url2", "Url3"];

    it("should render nothing if given empty array", () => {
        const { container } = render(<ProductImageGallery imageUrls={[]} />);

        expect(container).toBeEmptyDOMElement();
    });

    it("should render a list of images", () => {
        render(<ProductImageGallery imageUrls={imageUrls} />);

        const images = screen.getAllByRole("img");

        expect(images).toHaveLength(3);
        imageUrls.forEach((url, i) => {
            expect(images[i]).toHaveAttribute("src", url);
        });
    });
});
