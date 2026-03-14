"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const ts = __importStar(require("typescript"));
const schematics_1 = require("@angular-devkit/schematics");
const schematics_core_1 = require("../../schematics-core");
function updateGetMockStore() {
    return (tree) => {
        (0, schematics_core_1.visitTSSourceFiles)(tree, (sourceFile) => {
            const imports = sourceFile.statements
                .filter(ts.isImportDeclaration)
                .filter((importDeclaration) => importDeclaration.moduleSpecifier.getText(sourceFile) ===
                "'@ngrx/store'" ||
                importDeclaration.moduleSpecifier.getText(sourceFile) ===
                    '"@ngrx/store"')
                .flatMap((importDeclaration) => {
                return importDeclaration.importClause?.namedBindings ?? [];
            })
                .flatMap((binding) => ts.isNamedImports(binding) ? binding.elements : [])
                .filter((element) => element.name.getText(sourceFile) === 'getMockStore');
            if (!imports.length)
                return;
            const changes = [];
            imports.forEach((binding) => {
                changes.push(new schematics_core_1.RemoveChange(sourceFile.fileName, binding.pos, binding.end));
                changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, binding.pos, 'createMockStore'));
            });
            ts.forEachChild(sourceFile, crawl);
            return (0, schematics_core_1.commitChanges)(tree, sourceFile.fileName, changes);
            function crawl(node) {
                ts.forEachChild(node, crawl);
                if (!ts.isCallExpression(node))
                    return;
                if (!ts.isIdentifier(node.expression))
                    return;
                if (node.expression.text !== 'getMockStore')
                    return;
                changes.push(new schematics_core_1.RemoveChange(sourceFile.fileName, node.expression.pos, node.expression.end));
                changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, node.expression.pos, 'createMockStore'));
            }
        });
    };
}
function default_1() {
    return (0, schematics_1.chain)([updateGetMockStore]);
}
//# sourceMappingURL=index.js.map