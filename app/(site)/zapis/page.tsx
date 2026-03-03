import { getBookingPage, getSettings } from '@/lib/content'
import { ZapisClient } from './ZapisClient'

export default async function ZapisPage() {
  const [booking, settings] = await Promise.all([getBookingPage(), getSettings()])

  return (
    <ZapisClient
      booking={booking}
      whatsapp={settings?.contacts?.whatsapp || '79035698984'}
      telegram={settings?.contacts?.telegram || 'svet_psv_uz'}
      calendlyUrl={process.env.NEXT_PUBLIC_CALENDLY_URL || ''}
    />
  )
}
