import sass from "sass";
import {promisify} from "util";
import {writeFile} from "fs";
const sassRenderPromise = promisify(sass.render);
const writeFilePromise = promisify(writeFile);

async function main() {
  const styleResult = await sassRenderPromise({
    file: `${process.cwd()}/ac-styles.scss`,
    outFile: `${process.cwd()}/ac-styles.css`,
  });
  //console.log(styleResult.css.toString());
  await writeFilePromise("ac-styles.css", styleResult.css, "utf8");
}

main();
