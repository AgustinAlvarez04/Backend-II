import moment from "moment";
import path from "path";

export const generateNumber = (startNumber, endNumber) => {
  if (startNumber > endNumber) {
    throw new Error(
      "The starting number cannot be greater than the final number"
    );
  }
  return Math.floor(
    Math.random() * (endNumber - startNumber + 1) + startNumber
  );
};

export const generateNameForFile = (filename) => {
  if (!filename || filename.indexOf(".") === -1) {
    throw new Error("Invalid name, try again");
  }

  const randomNumber = generateNumber(1000, 9999);
  const dateTime = moment().format("DDMMYYYY_HHmmss");
  const extension = path.extname(filename);

  return `file_${randomNumber}_${dateTime}${extension}`;
};
