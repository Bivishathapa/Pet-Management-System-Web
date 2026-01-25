import React from 'react';
import transparentLogo from '../assets/Transparent Logo .png';

/**
 * Pet Perfect wordmark + mascots (transparent PNG). Use in nav bars.
 */
export default function BrandLogo({
  onClick,
  className = '',
  imgClassName = 'h-9 sm:h-10 w-auto max-w-[200px] sm:max-w-[220px] object-contain object-left',
  alt = 'Pet Perfect — Pet Management',
  ariaLabel,
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || alt}
        className={`flex items-center shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5E7A64]/40 rounded-md ${className}`}
      >
        <img src={transparentLogo} alt="" className={imgClassName} aria-hidden />
      </button>
    );
  }
  return (
    <span className={`inline-flex items-center shrink-0 ${className}`}>
      <img src={transparentLogo} alt={alt} className={imgClassName} />
    </span>
  );
}
