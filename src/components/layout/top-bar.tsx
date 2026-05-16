import {
  Mail,
  Phone,
  Truck,
} from "lucide-react";

export function TopBar() {
  return (
    <div className="border-b bg-black text-white">
      <div className="container mx-auto flex h-10 items-center justify-between px-4 text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />

            <span>
              +91 98765 43210
            </span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Mail className="h-4 w-4" />

            <span>
              support@vrlivingstudio.com
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <Truck className="h-4 w-4" />

          <span>
            Free Shipping on Orders Above ₹999
          </span>
        </div>
      </div>
    </div>
  );
}