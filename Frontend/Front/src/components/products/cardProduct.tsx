import ProductBadge from './productBadge';

interface CardProductProps {
  thumb_src: string;
  thumb_alt: string;
  title: string;
  description?: string; // Made optional as it's conditionally rendered
  price: number;
  color?: string; // Made optional as it's conditionally rendered
  colors?: string[]; // Made optional as it's conditionally rendered
  position: 'start' | 'center' | 'end'; // Use a union type for specific allowed values
}

export default function CardProduct({
  thumb_src,
  thumb_alt,
  title,
  description,
  price,
  color,
  colors,
  position,
}: CardProductProps) {
  // Use template literals for cleaner string concatenation
  const cardBodyClass = `card-body text-${position}`;

  return (
    <div className="card card-product border mb-5 shadow-xs border-radius-lg">
      {/* It's often better to use a more specific link if available,
          e.g., to a product detail page, instead of just "#" */}
      <a href="#">
        <div className="height-350">
          <img
            className="w-100 h-100 p-4 rounded-top"
            src={`${import.meta.env.BASE_URL}${thumb_src}`}
            alt={thumb_alt}
          />
        </div>
        <div className={cardBodyClass}>
          {/* Conditionally render elements only if their prop exists */}
          {color && <h6 className="text-md mb-1 text-body">{color}</h6>}

          {title && <h4 className="font-weight-bold">{title}</h4>}

          {description && <p className="text-body">{description}</p>}

          {colors && colors.length > 0 && ( // Also check if colors array is not empty
            <ProductBadge colors={colors} />
          )}

          {price && (
            <h4 className="mb-0 text-lg mt-1">
              ${price.toLocaleString()} {/* Formats price for locale */}
            </h4>
          )}

          {/* Show "Shop Now" only if description, colors, and color are all absent */}
          {!(description || colors || color) && (
            <a href="#" className="font-weight-normal text-body text-sm">
              Shop Now
            </a>
          )}
        </div>
      </a>
    </div>
  );
}