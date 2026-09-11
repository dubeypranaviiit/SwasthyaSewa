export const parseSlotDateTime = (slotDate, slotTime) => {
  if (!slotDate || !slotTime) return null

  try {
    const delimiter = slotDate.includes('-') ? '-' : slotDate.includes('_') ? '_' : '/'
    const parts = slotDate.split(delimiter)
    if (parts.length !== 3) return null

    let day, month, year
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10)
      month = parseInt(parts[1], 10) - 1
      day = parseInt(parts[2], 10)
    } else {
      day = parseInt(parts[0], 10)
      month = parseInt(parts[1], 10) - 1
      year = parseInt(parts[2], 10)
    }

    const timeMatch = slotTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
    if (!timeMatch) return null

    let hours = parseInt(timeMatch[1], 10)
    const minutes = parseInt(timeMatch[2], 10)
    const meridian = timeMatch[3] ? timeMatch[3].toUpperCase() : null

    if (meridian === 'PM' && hours < 12) {
      hours += 12
    } else if (meridian === 'AM' && hours === 12) {
      hours = 0
    }

    return new Date(year, month, day, hours, minutes, 0, 0)
  } catch (err) {
    console.error('Error parsing slot datetime:', err)
    return null
  }
}

export const isSlotTimeReached = (slotDate, slotTime, bufferMinutes = 5) => {
  const slotDateTime = parseSlotDateTime(slotDate, slotTime)
  if (!slotDateTime) return false

  const permissibleTime = slotDateTime.getTime() - bufferMinutes * 60 * 1000
  return Date.now() >= permissibleTime
}

export const getTimeUntilSlot = (slotDate, slotTime) => {
  const slotDateTime = parseSlotDateTime(slotDate, slotTime)
  if (!slotDateTime) return ''

  const diffMs = slotDateTime.getTime() - Date.now()
  if (diffMs <= 0) return 'Slot time reached'

  const totalMinutes = Math.floor(diffMs / (1000 * 60))
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `In ${days} day${days > 1 ? 's' : ''}`
  }
  if (hours > 0) {
    return `In ${hours}h ${mins}m`
  }
  return `In ${mins} minute${mins !== 1 ? 's' : ''}`
}
