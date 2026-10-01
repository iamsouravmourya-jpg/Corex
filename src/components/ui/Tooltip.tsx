/**
 * LernexAI Proprietary — Native Studio Tooltip Primitive
 * Zero external @radix-ui/react-tooltip dependency.
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
      return { left: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
    }
    if (side === 'bottom') {
      return { top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }
    }
    if (side === 'left') {
      return { right: 'calc(100% + 8px)', top: '50%', transform: 'translateY(-50%)' }
    }
    return { bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)' }
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
            background: '#0D0F17',
            border: '1px solid #1A1E2A',
            borderRadius: '0.5rem',
            padding: '5px 9px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            boxShadow: '0 10px 24px rgba(8, 9, 14, 0.85)',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: '#F8FAFC' }}>{content}</span>
          {shortcut && (
            <span
              style={{
                fontSize: 9.5,
                fontFamily: 'var(--font-mono)',
                color: '#06B6D4',
                background: 'rgba(6, 182, 212, 0.14)',
                padding: '1px 5px',
                borderRadius: 4,
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
