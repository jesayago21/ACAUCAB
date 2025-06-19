import ProductFeatureImg from './productFeatureImg';
import ProductFeatureDetails from './productFeatureDetails';

// Define a more robust type for featuresDetails.
// Record<string, string> is a plain object like { key: "value" }, which is common for props.
// [string, string][] is an array of key-value tuples, useful if order matters or keys can be duplicated.
// Choose the one that best reflects how ProductFeatureDetails expects its prop.
interface ProductOverviewProps {
  title?: string; // Made optional, as you're checking for its existence
  images: {
    src: string;
    alt: string;
  }[];
  full_description?: string; // Made optional, as you're checking for its existence
  featuresDetails: Record<string, string> | [string, string][]; // Using Record or tuple array
}

export default function ProductOverview({
  title,
  images,
  full_description,
  featuresDetails,
}: ProductOverviewProps) {

  // Define a default description if full_description is not provided or empty
  const defaultProductDescription = "Society has put up so many boundaries, so many limitations on what’s right and wrong that it’s almost impossible to get a pure thought out. It’s like a little kid, a little boy, looking at colors, and no one told him what colors are good, before somebody tells you you shouldn’t like pink because that’s for girls, or you’d instantly become a gay two-year-old.";

  return (
    <div className="card card-product card-plain">
      <div className="row">
        <div className="col-12 col-lg-7 mx-auto text-center">
          {/* Conditional rendering: Render title only if it's not empty */}
          {title && title.length > 0 &&
            <h2 className="mb-3">{title}</h2>
          }
          {/* Conditional rendering: Render full_description only if it's not empty */}
          {full_description && full_description.length > 0 &&
            <p className="mb-5">{full_description}</p>
          }
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-12 col-lg-6 pe-5">
          <div className="row">
            <h4 className="mb-3">Product Description</h4>
            {/* Use the provided full_description or the default one */}
            <p className="mb-5">
              {(full_description && full_description.length > 0) ? full_description : defaultProductDescription}
            </p>
            {/* Ensure featuresDetails is not empty before passing to ProductFeatureDetails */}
            {(Array.isArray(featuresDetails) && featuresDetails.length > 0) || (typeof featuresDetails === 'object' && Object.keys(featuresDetails).length > 0) ? (
              <ProductFeatureDetails
                featuresDetails={
                  Array.isArray(featuresDetails)
                    ? new Map(featuresDetails)
                    : new Map(Object.entries(featuresDetails))
                }
              />
            ) : null}
          </div>
        </div>
        <div className="col-12 col-lg-6">
          {/* Ensure images array is not empty before passing to ProductFeatureImg */}
          {images && images.length > 0 ? (
            <ProductFeatureImg images={images} />
          ) : null}
        </div>
      </div>
    </div>
  );
}