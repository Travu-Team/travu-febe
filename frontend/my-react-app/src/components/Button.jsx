function ButtonCustom({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  variant = 'primary', 
  ...rest 
}) {
  const base = "px-6 py-3 rounded text-white font-semibold w-full";
  const variants = {
    primary: "sm:h-12 md:h-14 px-6 py-3.5 bg-primary rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-xl font-semibold",
    secondary: "sm:h-12 md:h-14 px-6 py-3.5 bg-emerald-400 rounded inline-flex justify-center items-center gap-2.5 text-white text-xl font-semibold",
    third: "sm:h-12 md:h-14 px-6 py-3.5 bg-[#f9f9f9] rounded inline-flex justify-center items-center gap-2.5 text-[#3A59D1] text-xl font-semibold",
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

export default ButtonCustom;