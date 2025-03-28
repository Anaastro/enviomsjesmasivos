export const convertDate = (timestamp: string) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const differenceInSeconds = currentTimestamp - +timestamp;

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;

  const days = Math.floor(differenceInSeconds / secondsInDay);
  const hours = Math.floor(
    (differenceInSeconds % secondsInDay) / secondsInHour
  );
  const minutes = Math.floor(
    (differenceInSeconds % secondsInHour) / secondsInMinute
  );
  const seconds = differenceInSeconds % secondsInMinute;
  let response = "Hace ";

  if (days > 0) response += `${days}d `;
  if (hours > 0) response += `${hours}h `;
  if (minutes > 0) response += `${minutes}m `;
  if (seconds > 0) response += `${seconds}s`;

  return response;
};

export const generateCode = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const extractPhone = (url: string) => {
  const regex = /https?:\/\/wa.me\/(\d+)\?/;
  const match = regex.test(url);

  if (match) {
    const numeroTelefono = RegExp.$1;
    return numeroTelefono;
  }
  return null;
};
