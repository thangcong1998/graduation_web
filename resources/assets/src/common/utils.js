export function mapAttribute(data) {
  return {
    ...data,
    attributes:
      data.attributes?.reduce(
        (map, attr) => ({ ...map, [attr.id]: attr.pivot.value }),
        {}
      ) || {},
  };
}
export const numberWithCommas = (x) =>
  x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export function formatPhone(phone_number) {
  return "+84" + phone_number.substring(1);
}
export const convert = (e) => {
  if (e) {
    return e
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s/g, "-");
  }
  return "";
};
