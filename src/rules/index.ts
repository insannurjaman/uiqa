import type { Rule } from "../core/types.js";
import { imageMissingAltRule } from "./image-missing-alt.js";
import { interactiveMissingAccessibleLabelRule } from "./interactive-missing-accessible-label.js";
import { hardcodedHexColorRule } from "./hardcoded-hex-color.js";
import { inconsistentSpacingTokenRule } from "./inconsistent-spacing-token.js";
import { uxRules } from "./ux/index.js";

export const rules: Rule[] = [imageMissingAltRule, interactiveMissingAccessibleLabelRule, hardcodedHexColorRule, inconsistentSpacingTokenRule, ...uxRules];
