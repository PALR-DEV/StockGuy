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
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const schematics_core_1 = require("../../schematics-core");
const META_REDUCERS = 'META_REDUCERS';
function updateMetaReducersToken() {
    return (tree, context) => {
        (0, schematics_core_1.visitTSSourceFiles)(tree, (sourceFile) => {
            const createChange = (node) => (0, schematics_core_1.createReplaceChange)(sourceFile, node, META_REDUCERS, 'USER_PROVIDED_META_REDUCERS');
            const changes = [];
            changes.push(...findMetaReducersImportStatements(sourceFile, createChange, context.logger));
            changes.push(...findMetaReducersAssignment(sourceFile, createChange));
            return (0, schematics_core_1.commitChanges)(tree, sourceFile.fileName, changes);
        });
    };
}
function default_1() {
    return (0, schematics_1.chain)([updateMetaReducersToken()]);
}
function findMetaReducersImportStatements(sourceFile, createChange, logger) {
    let canRunSchematics = false;
    const metaReducerImports = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(isNgRxStoreImport)
        .filter((p) => {
        canRunSchematics = Boolean(p.importClause &&
            p.importClause.namedBindings &&
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            p.importClause.namedBindings.elements);
        return canRunSchematics;
    })
        .map((p) => 
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    p.importClause.namedBindings.elements.filter(isMetaReducersImportSpecifier))
        .reduce((imports, curr) => imports.concat(curr), []);
    const changes = metaReducerImports.map(createChange);
    if (!canRunSchematics && changes.length === 0) {
        logger.info(core_1.tags.stripIndent `
      NgRx 8 Migration: Unable to run the schematics to rename \`META_REDUCERS\` to \`USER_PROVIDED_META_REDUCERS\`
      in file '${sourceFile.fileName}'.

      For more info see https://ngrx.io/guide/migration/v8#meta_reducers-token.
    `);
    }
    return changes;
    function isNgRxStoreImport(importDeclaration) {
        return (importDeclaration.moduleSpecifier.getText(sourceFile) === "'@ngrx/store'");
    }
    function isMetaReducersImportSpecifier(importSpecifier) {
        const isImport = () => importSpecifier.name.text === META_REDUCERS;
        const isRenamedImport = () => importSpecifier.propertyName &&
            importSpecifier.propertyName.text === META_REDUCERS;
        return (ts.isImportSpecifier(importSpecifier) && (isImport() || isRenamedImport()));
    }
}
function findMetaReducersAssignment(sourceFile, createChange) {
    const changes = [];
    ts.forEachChild(sourceFile, (node) => findMetaReducers(node, changes));
    return changes;
    function findMetaReducers(node, changes) {
        if (ts.isPropertyAssignment(node) &&
            node.initializer.getText(sourceFile) === META_REDUCERS) {
            changes.push(createChange(node.initializer));
        }
        ts.forEachChild(node, (childNode) => findMetaReducers(childNode, changes));
    }
}
//# sourceMappingURL=index.js.map