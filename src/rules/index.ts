import type { Rule } from "../core/types.js";
import { imageMissingAltRule } from "./image-missing-alt.js";
import { hardcodedHexColorRule } from "./hardcoded-hex-color.js";

export const rules: Rule[] = [imageMissingAltRule, hardcodedHexColorRule];
