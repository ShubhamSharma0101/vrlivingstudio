import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
} from "@react-email/components";

type Props = {
  orderId: string;
  customerEmail: string;
  total: number;
};

export function AdminOrderAlertEmail({
  orderId,
  customerEmail,
  total,
}: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9fafb", padding: "20px" }}>
        <Container style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "40px", maxWidth: "600px" }}>
          
          {/* Admin Alert Badge */}
          <span style={{ 
            backgroundColor: "#fef3c7", 
            color: "#d97706", 
            padding: "4px 12px", 
            borderRadius: "9999px", 
            fontSize: "12px", 
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: "0.05em"
          }}>
            Store Notification
          </span>

          <Heading style={{ color: "#111827", fontSize: "24px", fontWeight: "bold", marginTop: "16px", marginBottom: "24px" }}>
            New Order Received 💰
          </Heading>

          <Text style={{ fontSize: "16px", color: "#4b5563", marginBottom: "24px" }}>
            Great news! A new transaction has successfully cleared on VR Living Studio. Here are the order details:
          </Text>

          {/* Metric Grid/Container */}
          <div style={{ borderLeft: "4px solid #000000", paddingLeft: "16px", margin: "24px 0" }}>
            <Text style={{ margin: "6px 0", fontSize: "15px", color: "#374151" }}>
              <strong>Order ID:</strong> {orderId}
            </Text>
            <Text style={{ margin: "6px 0", fontSize: "15px", color: "#374151" }}>
              <strong>Customer Email:</strong> {customerEmail}
            </Text>
            <Text style={{ margin: "6px 0", fontSize: "18px", color: "#111827" }}>
              <strong>Revenue:</strong> <span style={{ fontWeight: "700" }}>₹{total.toFixed(2)}</span>
            </Text>
          </div>

          <Text style={{ fontSize: "14px", color: "#9ca3af", marginTop: "32px", borderTop: "1px solid #f3f4f6", paddingTop: "16px" }}>
            Log into your database dashboard or admin control panel to manage shipment processing.
          </Text>
          
        </Container>
      </Body>
    </Html>
  );
}