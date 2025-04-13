/**
 * Generates a tracking URL based on the carrier and tracking number
 */
export function getTrackingUrl(carrier: string, trackingNumber: string): string {
    // Default to a Google search if carrier is unknown
    const baseUrl = `https://www.google.com/search?q=${encodeURIComponent(`${carrier} tracking ${trackingNumber}`)}`
  
    // Add specific carrier URLs
    if (carrier) {
      const normalizedCarrier = carrier.toLowerCase().trim()
  
      if (normalizedCarrier.includes("usps")) {
        return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`
      }
  
      if (normalizedCarrier.includes("ups")) {
        return `https://www.ups.com/track?tracknum=${trackingNumber}`
      }
  
      if (normalizedCarrier.includes("fedex")) {
        return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
      }
  
      if (normalizedCarrier.includes("dhl")) {
        return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`
      }
    }
  
    return baseUrl
  }
  