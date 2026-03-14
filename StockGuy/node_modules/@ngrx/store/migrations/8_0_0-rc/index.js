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
function replaceWithRuntimeChecks() {
    return (tree) => {
        // only add runtime checks when ngrx-store-freeze is used
        const _ = (0, schematics_core_1.visitTSSourceFiles)(tree, removeUsages) &&
            (0, schematics_core_1.visitTSSourceFiles)(tree, insertRuntimeChecks);
    };
}
function removeNgRxStoreFreezePackage() {
    return (tree) => {
        const pkgPath = '/package.json';
        const buffer = tree.read(pkgPath);
        if (buffer === null) {
            throw new schematics_1.SchematicsException('Could not read package.json');
        }
        const content = buffer.toString();
        const pkg = JSON.parse(content);
        if (pkg === null || typeof pkg !== 'object' || Array.isArray(pkg)) {
            throw new schematics_1.SchematicsException('Error reading package.json');
        }
        const dependencyCategories = ['dependencies', 'devDependencies'];
        dependencyCategories.forEach((category) => {
            if (pkg[category] && pkg[category]['ngrx-store-freeze']) {
                delete pkg[category]['ngrx-store-freeze'];
            }
        });
        tree.overwrite(pkgPath, JSON.stringify(pkg, null, 2));
        return tree;
    };
}
function default_1() {
    return (0, schematics_1.chain)([removeNgRxStoreFreezePackage(), replaceWithRuntimeChecks()]);
}
function removeUsages(sourceFile, tree, ngrxStoreFreezeIsUsed) {
    if (sourceFile.fileName.endsWith('.spec.ts') ||
        sourceFile.fileName.endsWith('.test.ts')) {
        return ngrxStoreFreezeIsUsed;
    }
    const importRemovements = findStoreFreezeImportsToRemove(sourceFile);
    if (importRemovements.length === 0) {
        return ngrxStoreFreezeIsUsed;
    }
    const usageReplacements = findStoreFreezeUsagesToRemove(sourceFile);
    const changes = [...importRemovements, ...usageReplacements];
    return (0, schematics_core_1.commitChanges)(tree, sourceFile.fileName, changes);
}
function insertRuntimeChecks(sourceFile, tree) {
    if (sourceFile.fileName.endsWith('.spec.ts') ||
        sourceFile.fileName.endsWith('.test.ts')) {
        return;
    }
    const changes = findRuntimeCHecksToInsert(sourceFile);
    return (0, schematics_core_1.commitChanges)(tree, sourceFile.fileName, changes);
}
function findStoreFreezeImportsToRemove(sourceFile) {
    const imports = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(({ moduleSpecifier }) => {
        return (moduleSpecifier.getText(sourceFile) === `'ngrx-store-freeze'` ||
            moduleSpecifier.getText(sourceFile) === `"ngrx-store-freeze"`);
    });
    const removements = imports.map((i) => new schematics_core_1.RemoveChange(sourceFile.fileName, i.getStart(sourceFile), i.getEnd()));
    return removements;
}
function findStoreFreezeUsagesToRemove(sourceFile) {
    const changes = [];
    ts.forEachChild(sourceFile, crawl);
    return changes;
    function crawl(node) {
        ts.forEachChild(node, crawl);
        if (!ts.isArrayLiteralExpression(node))
            return;
        const elements = node.elements.map((elem) => elem.getText(sourceFile));
        const elementsWithoutStoreFreeze = elements.filter((elemText) => elemText !== 'storeFreeze');
        if (elements.length !== elementsWithoutStoreFreeze.length) {
            changes.push(new schematics_core_1.RemoveChange(sourceFile.fileName, node.getStart(sourceFile), node.getEnd()));
            changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, node.getStart(sourceFile), `[${elementsWithoutStoreFreeze.join(', ')}]`));
        }
    }
}
function findRuntimeCHecksToInsert(sourceFile) {
    const changes = [];
    ts.forEachChild(sourceFile, crawl);
    return changes;
    function crawl(node) {
        ts.forEachChild(node, crawl);
        if (!ts.isCallExpression(node))
            return;
        const expression = node.expression;
        if (!(ts.isPropertyAccessExpression(expression) &&
            expression.expression.getText(sourceFile) === 'StoreModule' &&
            expression.name.getText(sourceFile) === 'forRoot')) {
            return;
        }
        const runtimeChecks = `runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true }`;
        // covers StoreModule.forRoot(ROOT_REDUCERS)
        if (node.arguments.length === 1) {
            changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, node.arguments[0].getEnd(), `, { ${runtimeChecks}}`));
        }
        else if (node.arguments.length === 2) {
            const storeConfig = node.arguments[1];
            if (ts.isObjectLiteralExpression(storeConfig)) {
                // covers StoreModule.forRoot(ROOT_REDUCERS, {})
                if (storeConfig.properties.length === 0) {
                    changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, storeConfig.getEnd() - 1, `${runtimeChecks} `));
                }
                else {
                    // covers StoreModule.forRoot(ROOT_REDUCERS, { metaReducers })
                    const lastProperty = storeConfig.properties[storeConfig.properties.length - 1];
                    changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, lastProperty.getEnd(), `, ${runtimeChecks}`));
                }
            }
        }
    }
}
//# sourceMappingURL=index.js.map