import * as i0 from '@angular/core';
import { ValueProvider, ExistingProvider, FactoryProvider } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MemoizedSelector, MemoizedSelectorWithProps, Store, Action, ActionsSubject, ReducerManager, ActionReducer } from '@ngrx/store';

declare class MockState<T> extends BehaviorSubject<T> {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<MockState<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MockState<any>>;
}

interface MockSelector {
    selector: string | MemoizedSelector<any, any> | MemoizedSelectorWithProps<any, any, any>;
    value: any;
}

type OnlyMemoized<T, Result> = T extends string | MemoizedSelector<any, any> ? MemoizedSelector<any, Result> : T extends MemoizedSelectorWithProps<any, any, any> ? MemoizedSelectorWithProps<any, any, Result> : never;
type Memoized<Result> = MemoizedSelector<any, Result> | MemoizedSelectorWithProps<any, any, Result>;
declare class MockStore<T = object> extends Store<T> {
    private state$;
    private initialState;
    private readonly selectors;
    readonly scannedActions$: Observable<Action>;
    private lastState?;
    constructor(state$: MockState<T>, actionsObserver: ActionsSubject, reducerManager: ReducerManager, initialState: T, mockSelectors?: MockSelector[]);
    setState(nextState: T): void;
    overrideSelector<Selector extends Memoized<Result>, Value extends Result, Result = Selector extends MemoizedSelector<any, infer T> ? T : Selector extends MemoizedSelectorWithProps<any, any, infer U> ? U : Value>(selector: Selector | string, value: Value): OnlyMemoized<typeof selector, Result>;
    resetSelectors(): void;
    select(selector: any, prop?: any): Observable<any>;
    addReducer(): void;
    removeReducer(): void;
    /**
     * Refreshes the existing state.
     */
    refreshState(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockStore<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MockStore<any>>;
}

declare class MockReducerManager extends BehaviorSubject<ActionReducer<any, any>> {
    constructor();
    addFeature(feature: any): void;
    addFeatures(feature: any): void;
    removeFeature(feature: any): void;
    removeFeatures(features: any): void;
    addReducer(key: any, reducer: any): void;
    addReducers(reducers: any): void;
    removeReducer(featureKey: any): void;
    removeReducers(featureKeys: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MockReducerManager, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MockReducerManager>;
}

interface MockStoreConfig<T> {
    initialState?: T;
    selectors?: MockSelector[];
}
/**
 * @description
 * Creates mock store providers.
 *
 * @param config `MockStoreConfig<T>` to provide the values for `INITIAL_STATE` and `MOCK_SELECTORS` tokens.
 * By default, `initialState` and `selectors` are not defined.
 * @returns Mock store providers that can be used with both `TestBed.configureTestingModule` and `Injector.create`.
 *
 * @usageNotes
 *
 * **With `TestBed.configureTestingModule`**
 *
 * ```typescript
 * describe('Books Component', () => {
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     TestBed.configureTestingModule({
 *       providers: [
 *         provideMockStore({
 *           initialState: { books: { entities: [] } },
 *           selectors: [
 *             { selector: selectAllBooks, value: ['Book 1', 'Book 2'] },
 *             { selector: selectVisibleBooks, value: ['Book 1'] },
 *           ],
 *         }),
 *       ],
 *     });
 *
 *     store = TestBed.inject(MockStore);
 *   });
 * });
 * ```
 *
 * **With `Injector.create`**
 *
 * ```typescript
 * describe('Counter Component', () => {
 *   let injector: Injector;
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     injector = Injector.create({
 *       providers: [
 *         provideMockStore({ initialState: { counter: 0 } }),
 *       ],
 *     });
 *     store = injector.get(MockStore);
 *   });
 * });
 * ```
 */
declare function provideMockStore<T = any>(config?: MockStoreConfig<T>): (ValueProvider | ExistingProvider | FactoryProvider)[];
/**
 * @description
 * Creates mock store with all necessary dependencies outside of the `TestBed`.
 *
 * @param config `MockStoreConfig<T>` to provide the values for `INITIAL_STATE` and `MOCK_SELECTORS` tokens.
 * By default, `initialState` and `selectors` are not defined.
 * @returns `MockStore<T>`
 *
 * @usageNotes
 *
 * ```typescript
 * describe('Books Effects', () => {
 *   let store: MockStore;
 *
 *   beforeEach(() => {
 *     store = createMockStore({
 *       initialState: { books: { entities: ['Book 1', 'Book 2', 'Book 3'] } },
 *       selectors: [
 *         { selector: selectAllBooks, value: ['Book 1', 'Book 2'] },
 *         { selector: selectVisibleBooks, value: ['Book 1'] },
 *       ],
 *     });
 *   });
 * });
 * ```
 */
declare function createMockStore<T>(config?: MockStoreConfig<T>): MockStore<T>;

export { MockReducerManager, MockState, MockStore, createMockStore, provideMockStore };
export type { MockSelector, MockStoreConfig };
