export interface WhatsAppOrderDetails {
  productName: string;
  sku: string;
  price: number;
  quantity: number;
  currencySymbol?: string;
  size?: string | null;
  colour?: string | null;
  variant?: string | null;
  productUrl?: string;
  whatsappNumber?: string;
}

export function generateWhatsAppOrderUrl({
  productName,
  sku,
  price,
  quantity,
  currencySymbol = '₹',
  size,
  colour,
  variant,
  productUrl,
  whatsappNumber = '919744744960'
}: WhatsAppOrderDetails): string {
  // Clean phone number (remove spaces, +, hyphens)
  const cleanNumber = whatsappNumber.replace(/\D/g, '');

  const lines: string[] = [
    'Hello! I am interested in ordering the following product:',
    '',
    `Product: ${productName}`,
    `Product ID: ${sku}`,
    `Price: ${currencySymbol}${price.toLocaleString('en-IN')}`,
    `Quantity: ${quantity}`
  ];

  if (size && size.trim()) {
    lines.push(`Size: ${size.trim()}`);
  }

  if (colour && colour.trim()) {
    lines.push(`Colour: ${colour.trim()}`);
  }

  if (variant && variant.trim()) {
    lines.push(`Variant: ${variant.trim()}`);
  }

  if (productUrl && productUrl.trim()) {
    lines.push(`Product Link: ${productUrl.trim()}`);
  }

  lines.push('');
  lines.push('Please confirm availability and the next steps to place my order.');

  const message = lines.join('\n');
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}
