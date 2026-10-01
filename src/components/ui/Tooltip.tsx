/**
 * LernexAI Proprietary — Native Soft-Edge Studio Tooltip Primitive
 * Zero external @radix-ui/react-tooltip dependency and zero border lines.
 */
import React, { useState } from 'react'

interface TooltipProps {
  content: string
  shortcut?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  children: React.ReactNode
}

export function Tooltip({ content, shortcut, side = 'top', children }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  const getPositionStyle = (): React.CSSProperties => {
    if (side === 'right') {
      return { left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' }
    }
    if (side === 'bottom') {
      return { top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' }
    }
    if (side === 'left') {
      return { right: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' }
    }
    return { bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' }
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            ...getPositionStyle(),
            zIndex: 9999,
            pointerEvents: 'none',
            background: '#111522',
            borderRadius: 11,
            padding: '6px 11px',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            whiteSpace: 'nowrap',
            boxShadow: '0 14px 32px rgba(0, 0, 0, 0.72)',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: '#F8FAFC' }}>{content}</span>
          {shortcut && (
            <span
              style={{
                fontSize: 9.5,
                fontFamily: 'var(--font-mono)',
                color: '#22D3EE',
                background: 'rgba(6, 182, 212, 0.16)',
                padding: '2px 6px',
                borderRadius: 6,
              }}
            >
              {shortcut}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
