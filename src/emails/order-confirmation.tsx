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
  total: number;
};

export function OrderConfirmationEmail({ customerName, orderId, total }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", padding: "20px" }}>
        <Container>
          <Heading style={{ color: "#000000" }}>
            Thank you for your order
          </Heading>
          <Text>Hi {customerName},</Text>
          <Text>Your order has been placed successfully.</Text>
          <Text style={{ margin: "4px 0" }}>
            <strong>Order ID:</strong> {orderId}
          </Text>
          <Text style={{ margin: "4px 0" }}>
            <strong>Total:</strong> ₹{total.toFixed(2)}
          </Text>
          <Text style={{ marginTop: "16px" }}>
            Thank you for shopping with VR Living Studio.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}