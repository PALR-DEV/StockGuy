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
const tasks_1 = require("@angular-devkit/schematics/tasks");
const schematics_core_1 = require("../../schematics-core");
const project_1 = require("../../schematics-core/utility/project");
const standalone_1 = require("../../schematics-core/utility/standalone");
const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
function addImportToNgModule(options) {
    return (host) => {
        const modulePath = options.module;
        if (!modulePath) {
            return host;
        }
        if (!host.exists(modulePath)) {
            throw new Error('Specified module does not exist');
        }
        const text = host.read(modulePath);
        if (text === null) {
            throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
        }
        const sourceText = text.toString('utf-8');
        const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);
        const storeModuleReducers = options.minimal ? `{}` : `reducers`;
        const storeModuleConfig = options.minimal
            ? `{}`
            : `{
      metaReducers
    }`;
        const storeModuleSetup = `StoreModule.forRoot(${storeModuleReducers}, ${storeModuleConfig})`;
        const statePath = `/${options.path}/${options.statePath}`;
        const relativePath = (0, schematics_core_1.buildRelativePath)(modulePath, statePath);
        const [storeNgModuleImport] = (0, schematics_core_1.addImportToModule)(source, modulePath, storeModuleSetup, relativePath);
        let changes = [
            (0, schematics_core_1.insertImport)(source, modulePath, 'StoreModule', '@ngrx/store'),
            storeNgModuleImport,
        ];
        if (!options.minimal) {
            changes = changes.concat([
                (0, schematics_core_1.insertImport)(source, modulePath, 'reducers, metaReducers', relativePath),
            ]);
        }
        const recorder = host.beginUpdate(modulePath);
        for (const change of changes) {
            if (change instanceof schematics_core_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
        }
        host.commitUpdate(recorder);
        return host;
    };
}
function addNgRxStoreToPackageJson() {
    return (host, context) => {
        (0, schematics_core_1.addPackageToPackageJson)(host, 'dependencies', '@ngrx/store', schematics_core_1.platformVersion);
        context.addTask(new tasks_1.NodePackageInstallTask());
        return host;
    };
}
function addNgRxESLintPlugin() {
    return (host, context) => {
        const eslint = host.read('.eslintrc.json')?.toString('utf-8');
        if (eslint) {
            (0, schematics_core_1.addPackageToPackageJson)(host, 'devDependencies', '@ngrx/eslint-plugin', schematics_core_1.platformVersion);
            const installTaskId = context.addTask(new tasks_1.NodePackageInstallTask());
            context.addTask(new tasks_1.RunSchematicTask('@ngrx/eslint-plugin', 'ng-add', {}), [installTaskId]);
        }
        return host;
    };
}
function addStandaloneConfig(options) {
    return (host) => {
        const mainFile = (0, project_1.getProjectMainFile)(host, options);
        if (host.exists(mainFile)) {
            const storeProviderFn = 'provideStore';
            if ((0, standalone_1.callsProvidersFunction)(host, mainFile, storeProviderFn)) {
                // exit because the store config is already provided
                return host;
            }
            const storeProviderOptions = options.minimal
                ? []
                : [
                    ts.factory.createIdentifier('reducers'),
                    ts.factory.createIdentifier('{ metaReducers }'),
                ];
            const patchedConfigFile = (0, standalone_1.addFunctionalProvidersToStandaloneBootstrap)(host, mainFile, storeProviderFn, '@ngrx/store', storeProviderOptions);
            if (options.minimal) {
                // no need to add imports if it is minimal
                return host;
            }
            // insert reducers import into the patched file
            const configFileContent = host.read(patchedConfigFile);
            const source = ts.createSourceFile(patchedConfigFile, configFileContent?.toString('utf-8') || '', ts.ScriptTarget.Latest, true);
            const statePath = `/${options.path}/${options.statePath}`;
            const relativePath = (0, schematics_core_1.buildRelativePath)(`/${patchedConfigFile}`, statePath);
            const recorder = host.beginUpdate(patchedConfigFile);
            const change = (0, schematics_core_1.insertImport)(source, patchedConfigFile, 'reducers, metaReducers', relativePath);
            if (change instanceof schematics_core_1.InsertChange) {
                recorder.insertLeft(change.pos, change.toAdd);
            }
            host.commitUpdate(recorder);
            return host;
        }
        throw new schematics_1.SchematicsException(`Main file not found for a project ${options.project}`);
    };
}
function default_1(options) {
    return (host, context) => {
        const mainFile = (0, project_1.getProjectMainFile)(host, options);
        const isStandalone = (0, ng_ast_utils_1.isStandaloneApp)(host, mainFile);
        options.path = (0, schematics_core_1.getProjectPath)(host, options);
        const parsedPath = (0, schematics_core_1.parseName)(options.path, '');
        options.path = parsedPath.path;
        if (options.module && !isStandalone) {
            options.module = (0, schematics_core_1.findModuleFromOptions)(host, {
                name: '',
                module: options.module,
                path: options.path,
            });
        }
        if (options.stateInterface && options.stateInterface !== 'State') {
            options.stateInterface = schematics_core_1.stringUtils.classify(options.stateInterface);
        }
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.filter)(() => (options.minimal ? false : true)),
            (0, schematics_1.applyTemplates)({
                ...schematics_core_1.stringUtils,
                ...options,
            }),
            (0, schematics_1.move)(parsedPath.path),
        ]);
        const configOrModuleUpdate = isStandalone
            ? addStandaloneConfig(options)
            : addImportToNgModule(options);
        return (0, schematics_1.chain)([
            (0, schematics_1.branchAndMerge)((0, schematics_1.chain)([configOrModuleUpdate, (0, schematics_1.mergeWith)(templateSource)])),
            options && options.skipPackageJson ? (0, schematics_1.noop)() : addNgRxStoreToPackageJson(),
            options && options.skipESLintPlugin ? (0, schematics_1.noop)() : addNgRxESLintPlugin(),
        ])(host, context);
    };
}
//# sourceMappingURL=index.js.map