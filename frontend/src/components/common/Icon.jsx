import hotel from '../../assets/icons/hotel.svg'
import users from '../../assets/icons/users.svg'
import money from '../../assets/icons/money.svg'
import chart from '../../assets/icons/chart.svg'
import check from '../../assets/icons/check.svg'
import trending from '../../assets/icons/trending.svg'
import lock from '../../assets/icons/lock.svg'
import shield from '../../assets/icons/shield.svg'
import flash from '../../assets/icons/flash.svg'
import activity from '../../assets/icons/activity.svg'
import user from '../../assets/icons/user.svg'
import email from '../../assets/icons/email.svg'
import phone from '../../assets/icons/phone.svg'
import location from '../../assets/icons/location.svg'
import creditCard from '../../assets/icons/credit-card.svg'
import pkg from '../../assets/icons/package.svg'
import lightning from '../../assets/icons/lightning.svg'
import rocket from '../../assets/icons/rocket.svg'
import wrench from '../../assets/icons/wrench.svg'
import checkCircle from '../../assets/icons/check-circle.svg'
import running from '../../assets/icons/running.svg'
import home from '../../assets/icons/home.svg'
import edit from '../../assets/icons/edit.svg'
import './Icon.css'

const iconMap = {
  hotel,
  users,
  money,
  chart,
  check,
  trending,
  lock,
  shield,
  flash,
  activity,
  user,
  email,
  phone,
  location,
  'credit-card': creditCard,
  package: pkg,
  lightning,
  rocket,
  wrench,
  'check-circle': checkCircle,
  running,
  home,
  edit,
}

export default function Icon({ name, size = 24, className = '' }) {
  const iconSrc = iconMap[name]
  
  if (!iconSrc) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <img
      src={iconSrc}
      alt={name}
      className={`icon ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
