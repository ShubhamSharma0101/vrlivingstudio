import {
  Truck,
  ShieldCheck,
  Headphones,
  RefreshCcw,
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description:
      "Premium delivery experience on eligible orders.",
  },

  {
    icon: ShieldCheck,
    title: "Secure Payments",
    description:
      "Safe and encrypted checkout powered by Razorpay.",
  },

  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description:
      "Simple and customer-friendly return experience.",
  },

  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Always here to assist your shopping journey.",
  },
];

export function TrustSection() {
  return (
    <section className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
            Why Choose Us
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Premium Living,
            Trusted Experience
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {features.map(
            (feature) => {
              const Icon =
                feature.icon;

              return (
                <div
                  key={
                    feature.title
                  }
                  className="rounded-[32px] border border-neutral-200 bg-[#faf8f5] p-8 transition hover:-translate-y-2 hover:shadow-xl"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-semibold">
                    {
                      feature.title
                    }
                  </h3>

                  <p className="mt-3 text-neutral-600">
                    {
                      feature.description
                    }
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
}