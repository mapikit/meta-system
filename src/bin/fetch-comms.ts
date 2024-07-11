import path from "path";
import { execSync } from "child_process";
import fs from 'fs-extra';

const boilerplate = async () => {
  // Get the global npm root directory
  const globalNodeModulesPath = execSync("npm root -g", {
    encoding: "utf-8",
  }).trim();

  // Assuming your package name is 'meta-system'
  const packageName = "meta-system";

  // Construct the global package path
  const packageDir = path.join(globalNodeModulesPath, packageName);

  const sourcePath = path.join(packageDir, "template/addons");
  const destinationPath = process.cwd();

  transferFolder(sourcePath, destinationPath);
};

boilerplate();

export { boilerplate }


async function transferFolder(sourceFolder, destinationPath) {
    try {
        // Ensure the source folder exists
        const sourceFolderPath = path.resolve(sourceFolder);
        const sourceFolderExists = await fs.pathExists(sourceFolderPath);

        if (!sourceFolderExists) {
            throw new Error(`Source folder '${sourceFolder}' does not exist.`);
        }

        // Ensure the destination path exists, create it if not
        const destinationFolderPath = path.resolve(destinationPath);
        await fs.ensureDir(destinationFolderPath);

        // Copy the entire folder and its contents to the destination
        await fs.copy(sourceFolderPath, destinationFolderPath, {
            overwrite: true,  // Overwrite existing files
            errorOnExist: false  // Don't throw error if destination exists
        });

        console.log(`Successfully transferred '${sourceFolder}' to '${destinationPath}'.`);
    } catch (error) {
        console.error(`Error transferring folder: ${error.message}`);
    }
}