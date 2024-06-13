const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n.charAt(0).toUpperCase())
    .join("");
};

export default getInitials;
