import { COLORS } from '@/lib/colors'

type Props = {
  type?: 'info' | 'success' | 'warning' | 'error'
  message: string
  onClose?: () => void
}

const palette: Record<NonNullable<Props['type']>, { bg: string; text: string; border: string }> = {
  info: { bg: COLORS.nonPhotoBlue, text: COLORS.berkeleyBlue, border: COLORS.cerulean },
  success: { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
  warning: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  error: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
}

export default function Banner({ type = 'info', message, onClose }: Props) {
  const p = palette[type]
  return (
    <div
      className="w-full rounded-lg px-3 py-2 flex items-start gap-3"
      style={{ background: p.bg, color: p.text, border: `1px solid ${p.border}` }}
    >
      <span style={{ fontWeight: 600, marginTop: 1 }}>{labelOf(type)}</span>
      <span className="flex-1">{message}</span>
      {onClose ? (
        <button onClick={onClose} className="text-sm underline" style={{ color: p.text }}>
          Kapat
        </button>
      ) : null}
    </div>
  )
}

function labelOf(type: NonNullable<Props['type']>) {
  switch (type) {
    case 'info':
      return 'Bilgi'
    case 'success':
      return 'Başarılı'
    case 'warning':
      return 'Uyarı'
    case 'error':
      return 'Hata'
  }
}

