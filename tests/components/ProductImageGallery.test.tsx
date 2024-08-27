import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
    it("should not be in the DOM id image array is empty", () => {
        const imageUrls: string[] = [];

        const { container } = render(
            <ProductImageGallery imageUrls={imageUrls} />
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("should render a list of images", () => {
        const imageUrls: string[] = ["url1", "url2", "url3"];

        render(<ProductImageGallery imageUrls={imageUrls} />);

        const images = screen.getAllByRole("img");
        expect(images).toHaveLength(3);

        imageUrls.forEach((url, i) => {
            expect(images[i]).toHaveAttribute("src", url);
        });
    });
});
