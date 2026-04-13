import { assets } from '../../constants/assets'

function Avatar({ src, alt, size = 56 }) {
  return (
    <img
      alt={alt}
      className="ruk-avatar"
      height={size}
      src={src || assets.avatars.arya}
      width={size}
    />
  )
}

export default Avatar
