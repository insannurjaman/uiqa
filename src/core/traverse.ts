import traverseModule from "@babel/traverse";
import type { TraverseOptions } from "@babel/traverse";
import type { Node } from "@babel/types";

type TraverseFn = (parent: Node, opts: TraverseOptions) => void;

export const traverse = ((traverseModule as unknown as { default?: TraverseFn }).default ?? traverseModule) as TraverseFn;
