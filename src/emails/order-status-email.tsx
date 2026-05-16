import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
} from "@react-email/components";

type Props = {
  customerName: string;
  orderId: string;
  status: string;
};

// Helper function to turn raw DB enums into human-readable text
const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
  };
  return statusMap[status.toUpperCase()] || status;
};

export function OrderStatusEmail({ customerName, orderId, status }: Props) {
  const readableStatus = formatStatus(status);

  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#fafafa", padding: "24px" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "8px", padding: "32px", maxWidth: "600px" }}>
          <Heading style={{ color: "#000000", fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
            Order Update
          </Heading>

          <Text style={{ fontSize: "16px", color: "#333333", lineHeight: "1.5" }}>
            Hi {customerName},
          </Text>

          <Text style={{ fontSize: "16px", color: "#333333", lineHeight: "1.5" }}>
            The status of your order has been updated.
          </Text>

          <div style={{ backgroundColor: "#f3f4f6", padding: "16px", borderRadius: "6px", margin: "20px 0" }}>
            <Text style={{ margin: "4px 0", fontSize: "15px", color: "#555555" }}>
              <strong>Order ID:</strong> {orderId}
            </Text>
            <Text style={{ margin: "4px 0", fontSize: "15px", color: "#555555" }}>
              <strong>New Status:</strong>{" "}
              <span style={{ 
                backgroundColor: readableStatus === "Delivered" ? "#d1fae5" : "#e0f2fe", 
                color: readableStatus === "Delivered" ? "#065f46" : "#0369a1", 
                padding: "2px 8px", 
                borderRadius: "4px", 
                fontSize: "13px", 
                fontWeight: "600" 
              }}>
                {readableStatus}
              </span>
            </Text>
          </div>

          <Text style={{ fontSize: "14px", color: "#666666", marginTop: "24px" }}>
            Thank you for shopping with VR Living Studio.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}