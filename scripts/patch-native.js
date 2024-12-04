const fs = require("fs");
const path = require("path");

const androidFilePath = path.resolve(
  __dirname,
  "../node_modules/react-native-shared-element/android/src/main/java/com/ijzerenhein/sharedelement/RNSharedElementDrawable.java" // Replace with the actual path
);

if (fs.existsSync(androidFilePath)) {
  let content = fs.readFileSync(androidFilePath, "utf-8");

  const oldCode = `
    float borderColorRGB = (float) (style.borderColor & 0x00FFFFFF);
    float borderColorAlpha = (float) (style.borderColor >>> 24);
    drawable.setBorderStyle(style.borderStyle);
    for (int i = 0; i < 4; i++) {
      drawable.setBorderColor(i, borderColorRGB, borderColorAlpha);
      drawable.setBorderWidth(i, style.borderWidth);
    }
  `;

  const newCode = `
    drawable.setBorderStyle(style.borderStyle);
    for (int i = 0; i < 4; i++) {
      drawable.setBorderColor(i, style.borderColor);
      drawable.setBorderWidth(i, style.borderWidth);
    }
  `;

  if (content.includes("float borderColorRGB")) {
    content = content.replace(oldCode.trim(), newCode.trim());
    fs.writeFileSync(androidFilePath, content, "utf-8");
    console.log("Native Android code patched successfully!");
  } else {
    console.log("No matching code found to replace.");
  }
} else {
  console.log("File not found:", androidFilePath);
}
