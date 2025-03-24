import fs from "fs";
import path from "path";

export default class FileSystem {
  read = async (filepath, filename) => {
    if (!filepath) throw new Error("Reading. You have not sent the file path");
    if (!filename) throw new Error("Reading. You have not sent the file name");

    const content = await fs.promises.readFile(path.join(filepath, filename));
    return content;
  };

  write = async (filepath, filename, content) => {
    if (!filepath) throw new Error("Writing. You have not sent the file path");
    if (!filename) throw new Error("Writing. You have not sent the file name");
    if (!content) throw new Error("Writing. You have not sent content");

    return await fs.promises.writeFile(path.join(filepath, filename), content);
  };

  delete = async (filepath, filename) => {
    if (!filepath)
      throw new Error("Elimination. You have not sent the file path");
    if (!filename)
      throw new Error("Elimination. You have not sent the file name");

    try {
      return await fs.promises.unlink(path.join(filepath, filename));
    } catch (error) {
      console.log("Elimination. File does not exist");
    }
  };
}
