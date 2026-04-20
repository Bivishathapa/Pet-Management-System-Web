/**
 * Whether a vet/groomer shows as "Available" in listings and booking flows.
 * Prefer explicit profile status (Available | Busy); fall back to activeBookingCount when status is missing.
 */
export function isProfessionalAvailableForListing(professional) {
  const raw = professional?.status;
  if (raw != null && String(raw).trim() !== '') {
    const s = String(raw).trim().toLowerCase();
    if (s === 'available') return true;
    if (s === 'busy') return false;
  }
  if (typeof professional?.activeBookingCount === 'number') {
    return professional.activeBookingCount === 0;
  }
  return false;
}
