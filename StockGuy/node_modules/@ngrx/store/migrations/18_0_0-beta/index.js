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
exports.migrateStoreTypedAction = migrateStoreTypedAction;
exports.migrateStoreTypedActionReferences = migrateStoreTypedActionReferences;
exports.default = default_1;
const ts = __importStar(require("typescript"));
const schematics_1 = require("@angular-devkit/schematics");
const schematics_core_1 = require("../../schematics-core");
const change_1 = require("../../schematics-core/utility/change");
const storeModelsPath = '@ngrx/store/src/models';
const filesWithChanges = [];
function migrateStoreTypedAction() {
    return (tree, ctx) => {
        (0, schematics_core_1.visitTSSourceFiles)(tree, (sourceFile) => {
            const changes = [];
            const importDeclarations = new Array();
            getImportDeclarations(sourceFile, importDeclarations);
            const storeModelsImportsAndDeclaration = importDeclarations
                .map((storeModelsImportDeclaration) => {
                const storeModelsImports = getStoreModelsNamedBindings(storeModelsImportDeclaration);
                if (storeModelsImports) {
                    return { storeModelsImports, storeModelsImportDeclaration };
                }
                else {
                    return undefined;
                }
            })
                .find(Boolean);
            if (!storeModelsImportsAndDeclaration) {
                return;
            }
            const { storeModelsImports, storeModelsImportDeclaration } = storeModelsImportsAndDeclaration;
            const storeImportDeclaration = importDeclarations.find((node) => node.moduleSpecifier.getText().includes('@ngrx/store') &&
                !node.moduleSpecifier.getText().includes('@ngrx/store/'));
            const otherStoreModelImports = storeModelsImports.elements
                .filter((element) => element.name.getText() !== 'TypedAction')
                .map((element) => element.name.getText())
                .join(', ');
            // Remove `TypedAction` from @ngrx/store/src/models and leave the other imports
            if (otherStoreModelImports) {
                changes.push((0, schematics_core_1.createReplaceChange)(sourceFile, storeModelsImportDeclaration, storeModelsImportDeclaration.getText(), `import { ${otherStoreModelImports} } from '${storeModelsPath}';`));
            }
            // Remove complete import because it's empty
            else {
                changes.push((0, change_1.createRemoveChange)(sourceFile, storeModelsImportDeclaration, storeModelsImportDeclaration.getStart(), storeModelsImportDeclaration.getEnd() + 1));
            }
            let importAppendedInExistingDeclaration = false;
            if (storeImportDeclaration?.importClause?.namedBindings) {
                const bindings = storeImportDeclaration.importClause.namedBindings;
                if (ts.isNamedImports(bindings)) {
                    // Add import to existing @ngrx/operators
                    const updatedImports = new Set([
                        ...bindings.elements.map((element) => element.name.getText()),
                        'Action',
                    ]);
                    const importStatement = `import { ${[...updatedImports].join(', ')} } from '@ngrx/store';`;
                    changes.push((0, schematics_core_1.createReplaceChange)(sourceFile, storeImportDeclaration, storeImportDeclaration.getText(), importStatement));
                    importAppendedInExistingDeclaration = true;
                }
            }
            if (!importAppendedInExistingDeclaration) {
                // Add new @ngrx/operators import line
                const importStatement = `import { Action } from '@ngrx/store';`;
                changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, storeModelsImportDeclaration.getEnd() + 1, `${importStatement}\n`));
            }
            (0, schematics_core_1.commitChanges)(tree, sourceFile.fileName, changes);
            if (changes.length) {
                filesWithChanges.push(sourceFile.fileName);
                ctx.logger.info(`[@ngrx/store] ${sourceFile.fileName}: Replaced TypedAction to Action`);
            }
        });
    };
}
function migrateStoreTypedActionReferences() {
    return (tree, _ctx) => {
        (0, schematics_core_1.visitTSSourceFiles)(tree, (sourceFile) => {
            if (!filesWithChanges.includes(sourceFile.fileName)) {
                return;
            }
            const changes = [];
            const typedActionIdentifiers = new Array();
            getTypedActionUsages(sourceFile, typedActionIdentifiers);
            typedActionIdentifiers.forEach((identifier) => {
                changes.push((0, schematics_core_1.createReplaceChange)(sourceFile, identifier, identifier.getText(), 'Action'));
            });
            (0, schematics_core_1.commitChanges)(tree, sourceFile.fileName, changes);
        });
    };
}
function getImportDeclarations(node, imports) {
    if (ts.isImportDeclaration(node)) {
        imports.push(node);
    }
    ts.forEachChild(node, (childNode) => getImportDeclarations(childNode, imports));
}
function getTypedActionUsages(node, nodeIdentifiers) {
    if (ts.isIdentifier(node) && node.getText() === 'TypedAction') {
        nodeIdentifiers.push(node);
    }
    ts.forEachChild(node, (childNode) => getTypedActionUsages(childNode, nodeIdentifiers));
}
function getStoreModelsNamedBindings(node) {
    const namedBindings = node?.importClause?.namedBindings;
    if (node.moduleSpecifier.getText().includes(storeModelsPath) &&
        namedBindings &&
        ts.isNamedImports(namedBindings)) {
        return namedBindings;
    }
    return null;
}
function default_1() {
    return (0, schematics_1.chain)([
        migrateStoreTypedAction(),
        migrateStoreTypedActionReferences(),
    ]);
}
//# sourceMappingURL=index.js.map