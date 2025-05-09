function Button({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  variant = 'primary', 
  ...rest 
}) {
  const base = "px-6 py-3 rounded text-white font-semibold";
  const variants = {
    primary: "sm:h-12 md:h-14 px-6 py-3.5 bg-blue-700 rounded inline-flex justify-center items-center gap-2.5 text-white text-xl font-semibold",
    secondary: "sm:h-12 md:h-14 px-6 py-3.5 bg-emerald-400 rounded inline-flex justify-center items-center gap-2.5 text-white text-xl font-semibold",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;