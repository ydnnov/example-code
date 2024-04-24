<script setup lang="ts">
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import Button from 'primevue/button';
import '~/user-worker.js';
import { codeExecClient } from '~/client/code-exec.client.js';
import { useStorage } from '@vueuse/core';

let editor;
const editorEl = ref();
const codeExecSend = () => {
  codeExecClient.exec(editor.getValue());
};
const srcTabs = useStorage('codeexec-controls:src-tabs', {
  nextId: 2,
  currentId: 1,
  items: [{
    id: 1,
    code: '',
  }],
});
const getTabById = (id: number) => {
  const index = getTabIndexById(id);
  if (index >= 0) {
    return srcTabs.value.items[index];
  }
  return null;
};
const getTabIndexById = (id: number) => {
  return srcTabs.value.items.findIndex(x => x.id === srcTabs.value.currentId);
};
const getCurrentTab = () => getTabById(srcTabs.value.currentId);
const getCurrentTabIndex = () => getTabIndexById(srcTabs.value.currentId);
const updateEditorCodeFromCurrentTab = () => editor.getModel().setValue(getCurrentTab()?.code);
const selectTabByIndex = (index: number) => {
  const tab = srcTabs.value.items[index];
  srcTabs.value.currentId = tab.id;
  updateEditorCodeFromCurrentTab();
};
const selectTabById = (id: number) => {
  srcTabs.value.currentId = id;
  updateEditorCodeFromCurrentTab();
};
const addTab = () => {
  srcTabs.value.items.push({
    id: srcTabs.value.nextId,
    code: '',
  });
  selectTabById(srcTabs.value.nextId);
  srcTabs.value.nextId++;
  editor?.focus();
};
const selectTab = (tab) => {
  srcTabs.value.currentId = tab.id;
  if (!editor) {
    return;
  }
  updateEditorCodeFromCurrentTab();
  editor?.focus();
};
const closeCurrentTab = () => {
  if (srcTabs.value.items.length <= 1) {
    return;
  }
  const index = getCurrentTabIndex();
  if (index < 0) {
    return;
  }
  srcTabs.value.items.splice(index, 1);
  if (index >= srcTabs.value.items.length) {
    selectTabByIndex(index - 1);
  } else {
    selectTabByIndex(index);
  }
  editor?.focus();
};
onMounted(() => {
  if (!editorEl.value) return;

  ////////////////////////////////////////////////////////////////////////////////
//   monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//     target: monaco.languages.typescript.ScriptTarget.ES2016,
//     allowNonTsExtensions: true,
//     moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
//     module: monaco.languages.typescript.ModuleKind.CommonJS,
//     noEmit: true,
//     typeRoots: ['node_modules/@types'],
//   });
//
// // extra libraries
//   monaco.languages.typescript.typescriptDefaults.addExtraLib(
//       `export declare function next() : string`,
//       'node_modules/@types/external/index.d.ts');
//
//   monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
//     noSemanticValidation: false,
//     noSyntaxValidation: false,
//   });

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
import { ChildProcess } from 'child_process';
import { EventEmitter } from 'events';
import { Readable } from 'stream';
import { ReadStream } from 'fs';
import { Protocol } from './protocol';
import { Serializable, EvaluationArgument, PageFunction, PageFunctionOn, SmartHandle, ElementHandleForTag, BindingSource } from './structs';

type PageWaitForSelectorOptionsNotHidden = PageWaitForSelectorOptions & {
    state?: 'visible'|'attached';
};
type ElementHandleWaitForSelectorOptionsNotHidden = ElementHandleWaitForSelectorOptions & {
    state?: 'visible'|'attached';
};

export interface Page {

    evaluate<R, Arg>(pageFunction: PageFunction<Arg, R>, arg: Arg): Promise<R>;

    evaluate<R>(pageFunction: PageFunction<void, R>, arg?: any): Promise<R>;

    evaluateHandle<R, Arg>(pageFunction: PageFunction<Arg, R>, arg: Arg): Promise<SmartHandle<R>>;

    evaluateHandle<R>(pageFunction: PageFunction<void, R>, arg?: any): Promise<SmartHandle<R>>;

    addInitScript<Arg>(script: PageFunction<Arg, any> | { path?: string, content?: string }, arg?: Arg): Promise<void>;

    $<K extends keyof HTMLElementTagNameMap>(selector: K, options?: { strict: boolean }): Promise<ElementHandleForTag<K> | null>;

    $(selector: string, options?: { strict: boolean }): Promise<ElementHandle<SVGElement | HTMLElement> | null>;

    $$<K extends keyof HTMLElementTagNameMap>(selector: K): Promise<ElementHandleForTag<K>[]>;

    $$(selector: string): Promise<ElementHandle<SVGElement | HTMLElement>[]>;

    $eval<K extends keyof HTMLElementTagNameMap, R, Arg>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K], Arg, R>, arg: Arg): Promise<R>;

    $eval<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E, Arg, R>, arg: Arg): Promise<R>;

    $eval<K extends keyof HTMLElementTagNameMap, R>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K], void, R>, arg?: any): Promise<R>;

    $eval<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E, void, R>, arg?: any): Promise<R>;

    $$eval<K extends keyof HTMLElementTagNameMap, R, Arg>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K][], Arg, R>, arg: Arg): Promise<R>;

    $$eval<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E[], Arg, R>, arg: Arg): Promise<R>;

    $$eval<K extends keyof HTMLElementTagNameMap, R>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K][], void, R>, arg?: any): Promise<R>;

    $$eval<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E[], void, R>, arg?: any): Promise<R>;

    waitForFunction<R, Arg>(pageFunction: PageFunction<Arg, R>, arg: Arg, options?: PageWaitForFunctionOptions): Promise<SmartHandle<R>>;

    waitForFunction<R>(pageFunction: PageFunction<void, R>, arg?: any, options?: PageWaitForFunctionOptions): Promise<SmartHandle<R>>;

    waitForSelector<K extends keyof HTMLElementTagNameMap>(selector: K, options?: PageWaitForSelectorOptionsNotHidden): Promise<ElementHandleForTag<K>>;

    waitForSelector(selector: string, options?: PageWaitForSelectorOptionsNotHidden): Promise<ElementHandle<SVGElement | HTMLElement>>;

    waitForSelector<K extends keyof HTMLElementTagNameMap>(selector: K, options: PageWaitForSelectorOptions): Promise<ElementHandleForTag<K> | null>;

    waitForSelector(selector: string, options: PageWaitForSelectorOptions): Promise<null|ElementHandle<SVGElement | HTMLElement>>;

    exposeBinding(name: string, playwrightBinding: (source: BindingSource, arg: JSHandle) => any, options: { handle: true }): Promise<void>;

    exposeBinding(name: string, playwrightBinding: (source: BindingSource, ...args: any[]) => any, options?: { handle?: boolean }): Promise<void>;

    on(event: 'close', listener: (page: Page) => void): this;

    on(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    on(event: 'crash', listener: (page: Page) => void): this;

    on(event: 'dialog', listener: (dialog: Dialog) => void): this;

    on(event: 'domcontentloaded', listener: (page: Page) => void): this;

    on(event: 'download', listener: (download: Download) => void): this;

    on(event: 'filechooser', listener: (fileChooser: FileChooser) => void): this;

    on(event: 'frameattached', listener: (frame: Frame) => void): this;

    on(event: 'framedetached', listener: (frame: Frame) => void): this;

    on(event: 'framenavigated', listener: (frame: Frame) => void): this;

    on(event: 'load', listener: (page: Page) => void): this;

    on(event: 'pageerror', listener: (error: Error) => void): this;

    on(event: 'popup', listener: (page: Page) => void): this;

    on(event: 'request', listener: (request: Request) => void): this;

    on(event: 'requestfailed', listener: (request: Request) => void): this;

    on(event: 'requestfinished', listener: (request: Request) => void): this;

    on(event: 'response', listener: (response: Response) => void): this;

    on(event: 'websocket', listener: (webSocket: WebSocket) => void): this;

    on(event: 'worker', listener: (worker: Worker) => void): this;

    once(event: 'close', listener: (page: Page) => void): this;

    once(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    once(event: 'crash', listener: (page: Page) => void): this;

    once(event: 'dialog', listener: (dialog: Dialog) => void): this;

    once(event: 'domcontentloaded', listener: (page: Page) => void): this;

    once(event: 'download', listener: (download: Download) => void): this;

    once(event: 'filechooser', listener: (fileChooser: FileChooser) => void): this;

    once(event: 'frameattached', listener: (frame: Frame) => void): this;

    once(event: 'framedetached', listener: (frame: Frame) => void): this;

    once(event: 'framenavigated', listener: (frame: Frame) => void): this;

    once(event: 'load', listener: (page: Page) => void): this;

    once(event: 'pageerror', listener: (error: Error) => void): this;

    once(event: 'popup', listener: (page: Page) => void): this;

    once(event: 'request', listener: (request: Request) => void): this;

    once(event: 'requestfailed', listener: (request: Request) => void): this;

    once(event: 'requestfinished', listener: (request: Request) => void): this;

    once(event: 'response', listener: (response: Response) => void): this;

    once(event: 'websocket', listener: (webSocket: WebSocket) => void): this;

    once(event: 'worker', listener: (worker: Worker) => void): this;

    addListener(event: 'close', listener: (page: Page) => void): this;

    addListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    addListener(event: 'crash', listener: (page: Page) => void): this;

    addListener(event: 'dialog', listener: (dialog: Dialog) => void): this;

    addListener(event: 'domcontentloaded', listener: (page: Page) => void): this;

    addListener(event: 'download', listener: (download: Download) => void): this;

    addListener(event: 'filechooser', listener: (fileChooser: FileChooser) => void): this;

    addListener(event: 'frameattached', listener: (frame: Frame) => void): this;

    addListener(event: 'framedetached', listener: (frame: Frame) => void): this;

    addListener(event: 'framenavigated', listener: (frame: Frame) => void): this;

    addListener(event: 'load', listener: (page: Page) => void): this;

    addListener(event: 'pageerror', listener: (error: Error) => void): this;

    addListener(event: 'popup', listener: (page: Page) => void): this;

    addListener(event: 'request', listener: (request: Request) => void): this;

    addListener(event: 'requestfailed', listener: (request: Request) => void): this;

    addListener(event: 'requestfinished', listener: (request: Request) => void): this;

    addListener(event: 'response', listener: (response: Response) => void): this;

    addListener(event: 'websocket', listener: (webSocket: WebSocket) => void): this;

    addListener(event: 'worker', listener: (worker: Worker) => void): this;

    removeListener(event: 'close', listener: (page: Page) => void): this;

    removeListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    removeListener(event: 'crash', listener: (page: Page) => void): this;

    removeListener(event: 'dialog', listener: (dialog: Dialog) => void): this;

    removeListener(event: 'domcontentloaded', listener: (page: Page) => void): this;

    removeListener(event: 'download', listener: (download: Download) => void): this;

    removeListener(event: 'filechooser', listener: (fileChooser: FileChooser) => void): this;

    removeListener(event: 'frameattached', listener: (frame: Frame) => void): this;

    removeListener(event: 'framedetached', listener: (frame: Frame) => void): this;

    removeListener(event: 'framenavigated', listener: (frame: Frame) => void): this;

    removeListener(event: 'load', listener: (page: Page) => void): this;

    removeListener(event: 'pageerror', listener: (error: Error) => void): this;

    removeListener(event: 'popup', listener: (page: Page) => void): this;

    removeListener(event: 'request', listener: (request: Request) => void): this;

    removeListener(event: 'requestfailed', listener: (request: Request) => void): this;

    removeListener(event: 'requestfinished', listener: (request: Request) => void): this;

    removeListener(event: 'response', listener: (response: Response) => void): this;

    removeListener(event: 'websocket', listener: (webSocket: WebSocket) => void): this;

    removeListener(event: 'worker', listener: (worker: Worker) => void): this;

    off(event: 'close', listener: (page: Page) => void): this;

    off(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    off(event: 'crash', listener: (page: Page) => void): this;

    off(event: 'dialog', listener: (dialog: Dialog) => void): this;

    off(event: 'domcontentloaded', listener: (page: Page) => void): this;

    off(event: 'download', listener: (download: Download) => void): this;

    off(event: 'filechooser', listener: (fileChooser: FileChooser) => void): this;

    off(event: 'frameattached', listener: (frame: Frame) => void): this;

    off(event: 'framedetached', listener: (frame: Frame) => void): this;

    off(event: 'framenavigated', listener: (frame: Frame) => void): this;

    off(event: 'load', listener: (page: Page) => void): this;

    off(event: 'pageerror', listener: (error: Error) => void): this;

    off(event: 'popup', listener: (page: Page) => void): this;

    off(event: 'request', listener: (request: Request) => void): this;

    off(event: 'requestfailed', listener: (request: Request) => void): this;

    off(event: 'requestfinished', listener: (request: Request) => void): this;

    off(event: 'response', listener: (response: Response) => void): this;

    off(event: 'websocket', listener: (webSocket: WebSocket) => void): this;

    off(event: 'worker', listener: (worker: Worker) => void): this;

    prependListener(event: 'close', listener: (page: Page) => void): this;

    prependListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    prependListener(event: 'crash', listener: (page: Page) => void): this;

    prependListener(event: 'dialog', listener: (dialog: Dialog) => void): this;

    prependListener(event: 'domcontentloaded', listener: (page: Page) => void): this;

    prependListener(event: 'download', listener: (download: Download) => void): this;

    prependListener(event: 'filechooser', listener: (fileChooser: FileChooser) => void): this;

    prependListener(event: 'frameattached', listener: (frame: Frame) => void): this;

    prependListener(event: 'framedetached', listener: (frame: Frame) => void): this;

    prependListener(event: 'framenavigated', listener: (frame: Frame) => void): this;

    prependListener(event: 'load', listener: (page: Page) => void): this;

    prependListener(event: 'pageerror', listener: (error: Error) => void): this;

    prependListener(event: 'popup', listener: (page: Page) => void): this;

    prependListener(event: 'request', listener: (request: Request) => void): this;

    prependListener(event: 'requestfailed', listener: (request: Request) => void): this;

    prependListener(event: 'requestfinished', listener: (request: Request) => void): this;

    prependListener(event: 'response', listener: (response: Response) => void): this;

    prependListener(event: 'websocket', listener: (webSocket: WebSocket) => void): this;

    prependListener(event: 'worker', listener: (worker: Worker) => void): this;

    addLocatorHandler(locator: Locator, handler: Function): Promise<void>;

    addScriptTag(options?: {

        content?: string;

        path?: string;

        type?: string;

        url?: string;
    }): Promise<ElementHandle>;

    addStyleTag(options?: {

        content?: string;

        path?: string;

        url?: string;
    }): Promise<ElementHandle>;

    bringToFront(): Promise<void>;

    check(selector: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    click(selector: string, options?: {

        button?: "left"|"right"|"middle";

        clickCount?: number;

        delay?: number;

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    close(options?: {

        reason?: string;

        runBeforeUnload?: boolean;
    }): Promise<void>;

    content(): Promise<string>;

    context(): BrowserContext;

    dblclick(selector: string, options?: {

        button?: "left"|"right"|"middle";

        delay?: number;

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    dispatchEvent(selector: string, type: string, eventInit?: EvaluationArgument, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    dragAndDrop(source: string, target: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        sourcePosition?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        targetPosition?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    emulateMedia(options?: {

        colorScheme?: null|"light"|"dark"|"no-preference";

        forcedColors?: null|"active"|"none";

        media?: null|"screen"|"print";

        reducedMotion?: null|"reduce"|"no-preference";
    }): Promise<void>;

    exposeFunction(name: string, callback: Function): Promise<void>;

    fill(selector: string, value: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    focus(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    frame(frameSelector: string|{

        name?: string;

        url?: string|RegExp|((url: URL) => boolean);
    }): null|Frame;

    frameLocator(selector: string): FrameLocator;

    frames(): Array<Frame>;

    getAttribute(selector: string, name: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<null|string>;

    getByAltText(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByLabel(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByPlaceholder(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByRole(role: "alert"|"alertdialog"|"application"|"article"|"banner"|"blockquote"|"button"|"caption"|"cell"|"checkbox"|"code"|"columnheader"|"combobox"|"complementary"|"contentinfo"|"definition"|"deletion"|"dialog"|"directory"|"document"|"emphasis"|"feed"|"figure"|"form"|"generic"|"grid"|"gridcell"|"group"|"heading"|"img"|"insertion"|"link"|"list"|"listbox"|"listitem"|"log"|"main"|"marquee"|"math"|"meter"|"menu"|"menubar"|"menuitem"|"menuitemcheckbox"|"menuitemradio"|"navigation"|"none"|"note"|"option"|"paragraph"|"presentation"|"progressbar"|"radio"|"radiogroup"|"region"|"row"|"rowgroup"|"rowheader"|"scrollbar"|"search"|"searchbox"|"separator"|"slider"|"spinbutton"|"status"|"strong"|"subscript"|"superscript"|"switch"|"tab"|"table"|"tablist"|"tabpanel"|"term"|"textbox"|"time"|"timer"|"toolbar"|"tooltip"|"tree"|"treegrid"|"treeitem", options?: {

        checked?: boolean;

        disabled?: boolean;

        exact?: boolean;

        expanded?: boolean;

        includeHidden?: boolean;

        level?: number;

        name?: string|RegExp;

        pressed?: boolean;

        selected?: boolean;
    }): Locator;

    getByTestId(testId: string|RegExp): Locator;

    getByText(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByTitle(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    goBack(options?: {

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<null|Response>;

    goForward(options?: {

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<null|Response>;

    goto(url: string, options?: {

        referer?: string;

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<null|Response>;

    hover(selector: string, options?: {

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    innerHTML(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<string>;

    innerText(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<string>;

    inputValue(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<string>;

    isChecked(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isClosed(): boolean;

    isDisabled(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isEditable(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isEnabled(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isHidden(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isVisible(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    locator(selector: string, options?: {

        has?: Locator;

        hasNot?: Locator;

        hasNotText?: string|RegExp;

        hasText?: string|RegExp;
    }): Locator;

    mainFrame(): Frame;

    opener(): Promise<null|Page>;

    pause(): Promise<void>;

    pdf(options?: {

        displayHeaderFooter?: boolean;

        footerTemplate?: string;

        format?: string;

        headerTemplate?: string;

        height?: string|number;

        landscape?: boolean;

        margin?: {

            top?: string|number;

            right?: string|number;

            bottom?: string|number;

            left?: string|number;
        };

        outline?: boolean;

        pageRanges?: string;

        path?: string;

        preferCSSPageSize?: boolean;

        printBackground?: boolean;

        scale?: number;

        tagged?: boolean;

        width?: string|number;
    }): Promise<Buffer>;

    press(selector: string, key: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    reload(options?: {

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<null|Response>;

    route(url: string|RegExp|((url: URL) => boolean), handler: ((route: Route, request: Request) => Promise<any>|any), options?: {

        times?: number;
    }): Promise<void>;

    routeFromHAR(har: string, options?: {

        notFound?: "abort"|"fallback";

        update?: boolean;

        updateContent?: "embed"|"attach";

        updateMode?: "full"|"minimal";

        url?: string|RegExp;
    }): Promise<void>;

    screenshot(options?: PageScreenshotOptions): Promise<Buffer>;

    selectOption(selector: string, values: null|string|ElementHandle|ReadonlyArray<string>|{

        value?: string;

        label?: string;

        index?: number;
    }|ReadonlyArray<ElementHandle>|ReadonlyArray<{

        value?: string;

        label?: string;

        index?: number;
    }>, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<Array<string>>;

    setChecked(selector: string, checked: boolean, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    setContent(html: string, options?: {

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<void>;

    setDefaultNavigationTimeout(timeout: number): void;

    setDefaultTimeout(timeout: number): void;

    setExtraHTTPHeaders(headers: { [key: string]: string; }): Promise<void>;

    setInputFiles(selector: string, files: string|ReadonlyArray<string>|{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }|ReadonlyArray<{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }>, options?: {

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    setViewportSize(viewportSize: {

        width: number;

        height: number;
    }): Promise<void>;

    tap(selector: string, options?: {

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    textContent(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<null|string>;

    title(): Promise<string>;

    type(selector: string, text: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    uncheck(selector: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    unroute(url: string|RegExp|((url: URL) => boolean), handler?: ((route: Route, request: Request) => Promise<any>|any)): Promise<void>;

    unrouteAll(options?: {

        behavior?: "wait"|"ignoreErrors"|"default";
    }): Promise<void>;

    url(): string;

    video(): null|Video;

    viewportSize(): null|{

        width: number;

        height: number;
    };

    waitForEvent(event: 'close', optionsOrPredicate?: { predicate?: (page: Page) => boolean | Promise<boolean>, timeout?: number } | ((page: Page) => boolean | Promise<boolean>)): Promise<Page>;

    waitForEvent(event: 'console', optionsOrPredicate?: { predicate?: (consoleMessage: ConsoleMessage) => boolean | Promise<boolean>, timeout?: number } | ((consoleMessage: ConsoleMessage) => boolean | Promise<boolean>)): Promise<ConsoleMessage>;

    waitForEvent(event: 'crash', optionsOrPredicate?: { predicate?: (page: Page) => boolean | Promise<boolean>, timeout?: number } | ((page: Page) => boolean | Promise<boolean>)): Promise<Page>;

    waitForEvent(event: 'dialog', optionsOrPredicate?: { predicate?: (dialog: Dialog) => boolean | Promise<boolean>, timeout?: number } | ((dialog: Dialog) => boolean | Promise<boolean>)): Promise<Dialog>;

    waitForEvent(event: 'domcontentloaded', optionsOrPredicate?: { predicate?: (page: Page) => boolean | Promise<boolean>, timeout?: number } | ((page: Page) => boolean | Promise<boolean>)): Promise<Page>;

    waitForEvent(event: 'download', optionsOrPredicate?: { predicate?: (download: Download) => boolean | Promise<boolean>, timeout?: number } | ((download: Download) => boolean | Promise<boolean>)): Promise<Download>;

    waitForEvent(event: 'filechooser', optionsOrPredicate?: { predicate?: (fileChooser: FileChooser) => boolean | Promise<boolean>, timeout?: number } | ((fileChooser: FileChooser) => boolean | Promise<boolean>)): Promise<FileChooser>;

    waitForEvent(event: 'frameattached', optionsOrPredicate?: { predicate?: (frame: Frame) => boolean | Promise<boolean>, timeout?: number } | ((frame: Frame) => boolean | Promise<boolean>)): Promise<Frame>;

    waitForEvent(event: 'framedetached', optionsOrPredicate?: { predicate?: (frame: Frame) => boolean | Promise<boolean>, timeout?: number } | ((frame: Frame) => boolean | Promise<boolean>)): Promise<Frame>;

    waitForEvent(event: 'framenavigated', optionsOrPredicate?: { predicate?: (frame: Frame) => boolean | Promise<boolean>, timeout?: number } | ((frame: Frame) => boolean | Promise<boolean>)): Promise<Frame>;

    waitForEvent(event: 'load', optionsOrPredicate?: { predicate?: (page: Page) => boolean | Promise<boolean>, timeout?: number } | ((page: Page) => boolean | Promise<boolean>)): Promise<Page>;

    waitForEvent(event: 'pageerror', optionsOrPredicate?: { predicate?: (error: Error) => boolean | Promise<boolean>, timeout?: number } | ((error: Error) => boolean | Promise<boolean>)): Promise<Error>;

    waitForEvent(event: 'popup', optionsOrPredicate?: { predicate?: (page: Page) => boolean | Promise<boolean>, timeout?: number } | ((page: Page) => boolean | Promise<boolean>)): Promise<Page>;

    waitForEvent(event: 'request', optionsOrPredicate?: { predicate?: (request: Request) => boolean | Promise<boolean>, timeout?: number } | ((request: Request) => boolean | Promise<boolean>)): Promise<Request>;

    waitForEvent(event: 'requestfailed', optionsOrPredicate?: { predicate?: (request: Request) => boolean | Promise<boolean>, timeout?: number } | ((request: Request) => boolean | Promise<boolean>)): Promise<Request>;

    waitForEvent(event: 'requestfinished', optionsOrPredicate?: { predicate?: (request: Request) => boolean | Promise<boolean>, timeout?: number } | ((request: Request) => boolean | Promise<boolean>)): Promise<Request>;

    waitForEvent(event: 'response', optionsOrPredicate?: { predicate?: (response: Response) => boolean | Promise<boolean>, timeout?: number } | ((response: Response) => boolean | Promise<boolean>)): Promise<Response>;

    waitForEvent(event: 'websocket', optionsOrPredicate?: { predicate?: (webSocket: WebSocket) => boolean | Promise<boolean>, timeout?: number } | ((webSocket: WebSocket) => boolean | Promise<boolean>)): Promise<WebSocket>;

    waitForEvent(event: 'worker', optionsOrPredicate?: { predicate?: (worker: Worker) => boolean | Promise<boolean>, timeout?: number } | ((worker: Worker) => boolean | Promise<boolean>)): Promise<Worker>;

    waitForLoadState(state?: "load"|"domcontentloaded"|"networkidle", options?: {

        timeout?: number;
    }): Promise<void>;

    waitForNavigation(options?: {

        timeout?: number;

        url?: string|RegExp|((url: URL) => boolean);

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<null|Response>;

    waitForRequest(urlOrPredicate: string|RegExp|((request: Request) => boolean|Promise<boolean>), options?: {

        timeout?: number;
    }): Promise<Request>;

    waitForResponse(urlOrPredicate: string|RegExp|((response: Response) => boolean|Promise<boolean>), options?: {

        timeout?: number;
    }): Promise<Response>;

    waitForTimeout(timeout: number): Promise<void>;

    waitForURL(url: string|RegExp|((url: URL) => boolean), options?: {

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<void>;

    workers(): Array<Worker>;

    accessibility: Accessibility;

    coverage: Coverage;

    keyboard: Keyboard;

    mouse: Mouse;

    request: APIRequestContext;

    touchscreen: Touchscreen;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface Frame {

    evaluate<R, Arg>(pageFunction: PageFunction<Arg, R>, arg: Arg): Promise<R>;

    evaluate<R>(pageFunction: PageFunction<void, R>, arg?: any): Promise<R>;

    evaluateHandle<R, Arg>(pageFunction: PageFunction<Arg, R>, arg: Arg): Promise<SmartHandle<R>>;

    evaluateHandle<R>(pageFunction: PageFunction<void, R>, arg?: any): Promise<SmartHandle<R>>;

    $<K extends keyof HTMLElementTagNameMap>(selector: K, options?: { strict: boolean }): Promise<ElementHandleForTag<K> | null>;

    $(selector: string, options?: { strict: boolean }): Promise<ElementHandle<SVGElement | HTMLElement> | null>;

    $$<K extends keyof HTMLElementTagNameMap>(selector: K): Promise<ElementHandleForTag<K>[]>;

    $$(selector: string): Promise<ElementHandle<SVGElement | HTMLElement>[]>;

    $eval<K extends keyof HTMLElementTagNameMap, R, Arg>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K], Arg, R>, arg: Arg): Promise<R>;

    $eval<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E, Arg, R>, arg: Arg): Promise<R>;

    $eval<K extends keyof HTMLElementTagNameMap, R>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K], void, R>, arg?: any): Promise<R>;

    $eval<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E, void, R>, arg?: any): Promise<R>;

    $$eval<K extends keyof HTMLElementTagNameMap, R, Arg>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K][], Arg, R>, arg: Arg): Promise<R>;

    $$eval<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E[], Arg, R>, arg: Arg): Promise<R>;

    $$eval<K extends keyof HTMLElementTagNameMap, R>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K][], void, R>, arg?: any): Promise<R>;

    $$eval<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E[], void, R>, arg?: any): Promise<R>;

    waitForFunction<R, Arg>(pageFunction: PageFunction<Arg, R>, arg: Arg, options?: PageWaitForFunctionOptions): Promise<SmartHandle<R>>;

    waitForFunction<R>(pageFunction: PageFunction<void, R>, arg?: any, options?: PageWaitForFunctionOptions): Promise<SmartHandle<R>>;

    waitForSelector<K extends keyof HTMLElementTagNameMap>(selector: K, options?: PageWaitForSelectorOptionsNotHidden): Promise<ElementHandleForTag<K>>;

    waitForSelector(selector: string, options?: PageWaitForSelectorOptionsNotHidden): Promise<ElementHandle<SVGElement | HTMLElement>>;

    waitForSelector<K extends keyof HTMLElementTagNameMap>(selector: K, options: PageWaitForSelectorOptions): Promise<ElementHandleForTag<K> | null>;

    waitForSelector(selector: string, options: PageWaitForSelectorOptions): Promise<null|ElementHandle<SVGElement | HTMLElement>>;

    addScriptTag(options?: {

        content?: string;

        path?: string;

        type?: string;

        url?: string;
    }): Promise<ElementHandle>;

    addStyleTag(options?: {

        content?: string;

        path?: string;

        url?: string;
    }): Promise<ElementHandle>;

    check(selector: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    childFrames(): Array<Frame>;

    click(selector: string, options?: {

        button?: "left"|"right"|"middle";

        clickCount?: number;

        delay?: number;

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    content(): Promise<string>;

    dblclick(selector: string, options?: {

        button?: "left"|"right"|"middle";

        delay?: number;

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    dispatchEvent(selector: string, type: string, eventInit?: EvaluationArgument, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    dragAndDrop(source: string, target: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        sourcePosition?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        targetPosition?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    fill(selector: string, value: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    focus(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    frameElement(): Promise<ElementHandle>;

    frameLocator(selector: string): FrameLocator;

    getAttribute(selector: string, name: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<null|string>;

    getByAltText(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByLabel(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByPlaceholder(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByRole(role: "alert"|"alertdialog"|"application"|"article"|"banner"|"blockquote"|"button"|"caption"|"cell"|"checkbox"|"code"|"columnheader"|"combobox"|"complementary"|"contentinfo"|"definition"|"deletion"|"dialog"|"directory"|"document"|"emphasis"|"feed"|"figure"|"form"|"generic"|"grid"|"gridcell"|"group"|"heading"|"img"|"insertion"|"link"|"list"|"listbox"|"listitem"|"log"|"main"|"marquee"|"math"|"meter"|"menu"|"menubar"|"menuitem"|"menuitemcheckbox"|"menuitemradio"|"navigation"|"none"|"note"|"option"|"paragraph"|"presentation"|"progressbar"|"radio"|"radiogroup"|"region"|"row"|"rowgroup"|"rowheader"|"scrollbar"|"search"|"searchbox"|"separator"|"slider"|"spinbutton"|"status"|"strong"|"subscript"|"superscript"|"switch"|"tab"|"table"|"tablist"|"tabpanel"|"term"|"textbox"|"time"|"timer"|"toolbar"|"tooltip"|"tree"|"treegrid"|"treeitem", options?: {

        checked?: boolean;

        disabled?: boolean;

        exact?: boolean;

        expanded?: boolean;

        includeHidden?: boolean;

        level?: number;

        name?: string|RegExp;

        pressed?: boolean;

        selected?: boolean;
    }): Locator;

    getByTestId(testId: string|RegExp): Locator;

    getByText(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByTitle(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    goto(url: string, options?: {

        referer?: string;

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<null|Response>;

    hover(selector: string, options?: {

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    innerHTML(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<string>;

    innerText(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<string>;

    inputValue(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<string>;

    isChecked(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isDetached(): boolean;

    isDisabled(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isEditable(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isEnabled(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isHidden(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    isVisible(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<boolean>;

    locator(selector: string, options?: {

        has?: Locator;

        hasNot?: Locator;

        hasNotText?: string|RegExp;

        hasText?: string|RegExp;
    }): Locator;

    name(): string;

    page(): Page;

    parentFrame(): null|Frame;

    press(selector: string, key: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    selectOption(selector: string, values: null|string|ElementHandle|ReadonlyArray<string>|{

        value?: string;

        label?: string;

        index?: number;
    }|ReadonlyArray<ElementHandle>|ReadonlyArray<{

        value?: string;

        label?: string;

        index?: number;
    }>, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<Array<string>>;

    setChecked(selector: string, checked: boolean, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    setContent(html: string, options?: {

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<void>;

    setInputFiles(selector: string, files: string|ReadonlyArray<string>|{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }|ReadonlyArray<{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }>, options?: {

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    tap(selector: string, options?: {

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    textContent(selector: string, options?: {

        strict?: boolean;

        timeout?: number;
    }): Promise<null|string>;

    title(): Promise<string>;

    type(selector: string, text: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        strict?: boolean;

        timeout?: number;
    }): Promise<void>;

    uncheck(selector: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        strict?: boolean;

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    url(): string;

    waitForLoadState(state?: "load"|"domcontentloaded"|"networkidle", options?: {

        timeout?: number;
    }): Promise<void>;

    waitForNavigation(options?: {

        timeout?: number;

        url?: string|RegExp|((url: URL) => boolean);

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<null|Response>;

    waitForTimeout(timeout: number): Promise<void>;

    waitForURL(url: string|RegExp|((url: URL) => boolean), options?: {

        timeout?: number;

        waitUntil?: "load"|"domcontentloaded"|"networkidle"|"commit";
    }): Promise<void>;
}

export interface BrowserContext {

    exposeBinding(name: string, playwrightBinding: (source: BindingSource, arg: JSHandle) => any, options: { handle: true }): Promise<void>;

    exposeBinding(name: string, playwrightBinding: (source: BindingSource, ...args: any[]) => any, options?: { handle?: boolean }): Promise<void>;

    addInitScript<Arg>(script: PageFunction<Arg, any> | { path?: string, content?: string }, arg?: Arg): Promise<void>;

    on(event: 'backgroundpage', listener: (page: Page) => void): this;

    on(event: 'close', listener: (browserContext: BrowserContext) => void): this;

    on(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    on(event: 'dialog', listener: (dialog: Dialog) => void): this;

    on(event: 'page', listener: (page: Page) => void): this;

    on(event: 'request', listener: (request: Request) => void): this;

    on(event: 'requestfailed', listener: (request: Request) => void): this;

    on(event: 'requestfinished', listener: (request: Request) => void): this;

    on(event: 'response', listener: (response: Response) => void): this;

    on(event: 'serviceworker', listener: (worker: Worker) => void): this;

    on(event: 'weberror', listener: (webError: WebError) => void): this;

    once(event: 'backgroundpage', listener: (page: Page) => void): this;

    once(event: 'close', listener: (browserContext: BrowserContext) => void): this;

    once(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    once(event: 'dialog', listener: (dialog: Dialog) => void): this;

    once(event: 'page', listener: (page: Page) => void): this;

    once(event: 'request', listener: (request: Request) => void): this;

    once(event: 'requestfailed', listener: (request: Request) => void): this;

    once(event: 'requestfinished', listener: (request: Request) => void): this;

    once(event: 'response', listener: (response: Response) => void): this;

    once(event: 'serviceworker', listener: (worker: Worker) => void): this;

    once(event: 'weberror', listener: (webError: WebError) => void): this;

    addListener(event: 'backgroundpage', listener: (page: Page) => void): this;

    addListener(event: 'close', listener: (browserContext: BrowserContext) => void): this;

    addListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    addListener(event: 'dialog', listener: (dialog: Dialog) => void): this;

    addListener(event: 'page', listener: (page: Page) => void): this;

    addListener(event: 'request', listener: (request: Request) => void): this;

    addListener(event: 'requestfailed', listener: (request: Request) => void): this;

    addListener(event: 'requestfinished', listener: (request: Request) => void): this;

    addListener(event: 'response', listener: (response: Response) => void): this;

    addListener(event: 'serviceworker', listener: (worker: Worker) => void): this;

    addListener(event: 'weberror', listener: (webError: WebError) => void): this;

    removeListener(event: 'backgroundpage', listener: (page: Page) => void): this;

    removeListener(event: 'close', listener: (browserContext: BrowserContext) => void): this;

    removeListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    removeListener(event: 'dialog', listener: (dialog: Dialog) => void): this;

    removeListener(event: 'page', listener: (page: Page) => void): this;

    removeListener(event: 'request', listener: (request: Request) => void): this;

    removeListener(event: 'requestfailed', listener: (request: Request) => void): this;

    removeListener(event: 'requestfinished', listener: (request: Request) => void): this;

    removeListener(event: 'response', listener: (response: Response) => void): this;

    removeListener(event: 'serviceworker', listener: (worker: Worker) => void): this;

    removeListener(event: 'weberror', listener: (webError: WebError) => void): this;

    off(event: 'backgroundpage', listener: (page: Page) => void): this;

    off(event: 'close', listener: (browserContext: BrowserContext) => void): this;

    off(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    off(event: 'dialog', listener: (dialog: Dialog) => void): this;

    off(event: 'page', listener: (page: Page) => void): this;

    off(event: 'request', listener: (request: Request) => void): this;

    off(event: 'requestfailed', listener: (request: Request) => void): this;

    off(event: 'requestfinished', listener: (request: Request) => void): this;

    off(event: 'response', listener: (response: Response) => void): this;

    off(event: 'serviceworker', listener: (worker: Worker) => void): this;

    off(event: 'weberror', listener: (webError: WebError) => void): this;

    prependListener(event: 'backgroundpage', listener: (page: Page) => void): this;

    prependListener(event: 'close', listener: (browserContext: BrowserContext) => void): this;

    prependListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    prependListener(event: 'dialog', listener: (dialog: Dialog) => void): this;

    prependListener(event: 'page', listener: (page: Page) => void): this;

    prependListener(event: 'request', listener: (request: Request) => void): this;

    prependListener(event: 'requestfailed', listener: (request: Request) => void): this;

    prependListener(event: 'requestfinished', listener: (request: Request) => void): this;

    prependListener(event: 'response', listener: (response: Response) => void): this;

    prependListener(event: 'serviceworker', listener: (worker: Worker) => void): this;

    prependListener(event: 'weberror', listener: (webError: WebError) => void): this;

    addCookies(cookies: ReadonlyArray<{
        name: string;

        value: string;

        url?: string;

        domain?: string;

        path?: string;

        expires?: number;

        httpOnly?: boolean;

        secure?: boolean;

        sameSite?: "Strict"|"Lax"|"None";
    }>): Promise<void>;

    backgroundPages(): Array<Page>;

    browser(): null|Browser;

    clearCookies(options?: {

        domain?: string|RegExp;

        name?: string|RegExp;

        path?: string|RegExp;
    }): Promise<void>;

    clearPermissions(): Promise<void>;

    close(options?: {

        reason?: string;
    }): Promise<void>;

    cookies(urls?: string|ReadonlyArray<string>): Promise<Array<Cookie>>;

    exposeFunction(name: string, callback: Function): Promise<void>;

    grantPermissions(permissions: ReadonlyArray<string>, options?: {

        origin?: string;
    }): Promise<void>;

    newCDPSession(page: Page|Frame): Promise<CDPSession>;

    newPage(): Promise<Page>;

    pages(): Array<Page>;

    route(url: string|RegExp|((url: URL) => boolean), handler: ((route: Route, request: Request) => Promise<any>|any), options?: {

        times?: number;
    }): Promise<void>;

    routeFromHAR(har: string, options?: {

        notFound?: "abort"|"fallback";

        update?: boolean;

        updateContent?: "embed"|"attach";

        updateMode?: "full"|"minimal";

        url?: string|RegExp;
    }): Promise<void>;

    serviceWorkers(): Array<Worker>;

    setDefaultNavigationTimeout(timeout: number): void;

    setDefaultTimeout(timeout: number): void;

    setExtraHTTPHeaders(headers: { [key: string]: string; }): Promise<void>;

    setGeolocation(geolocation: null|{

        latitude: number;

        longitude: number;

        accuracy?: number;
    }): Promise<void>;

    setHTTPCredentials(httpCredentials: null|{
        username: string;

        password: string;
    }): Promise<void>;

    setOffline(offline: boolean): Promise<void>;

    storageState(options?: {

        path?: string;
    }): Promise<{
        cookies: Array<{
            name: string;

            value: string;

            domain: string;

            path: string;

            expires: number;

            httpOnly: boolean;

            secure: boolean;

            sameSite: "Strict"|"Lax"|"None";
        }>;

        origins: Array<{
            origin: string;

            localStorage: Array<{
                name: string;

                value: string;
            }>;
        }>;
    }>;

    unroute(url: string|RegExp|((url: URL) => boolean), handler?: ((route: Route, request: Request) => Promise<any>|any)): Promise<void>;

    unrouteAll(options?: {

        behavior?: "wait"|"ignoreErrors"|"default";
    }): Promise<void>;

    waitForEvent(event: 'backgroundpage', optionsOrPredicate?: { predicate?: (page: Page) => boolean | Promise<boolean>, timeout?: number } | ((page: Page) => boolean | Promise<boolean>)): Promise<Page>;

    waitForEvent(event: 'close', optionsOrPredicate?: { predicate?: (browserContext: BrowserContext) => boolean | Promise<boolean>, timeout?: number } | ((browserContext: BrowserContext) => boolean | Promise<boolean>)): Promise<BrowserContext>;

    waitForEvent(event: 'console', optionsOrPredicate?: { predicate?: (consoleMessage: ConsoleMessage) => boolean | Promise<boolean>, timeout?: number } | ((consoleMessage: ConsoleMessage) => boolean | Promise<boolean>)): Promise<ConsoleMessage>;

    waitForEvent(event: 'dialog', optionsOrPredicate?: { predicate?: (dialog: Dialog) => boolean | Promise<boolean>, timeout?: number } | ((dialog: Dialog) => boolean | Promise<boolean>)): Promise<Dialog>;

    waitForEvent(event: 'page', optionsOrPredicate?: { predicate?: (page: Page) => boolean | Promise<boolean>, timeout?: number } | ((page: Page) => boolean | Promise<boolean>)): Promise<Page>;

    waitForEvent(event: 'request', optionsOrPredicate?: { predicate?: (request: Request) => boolean | Promise<boolean>, timeout?: number } | ((request: Request) => boolean | Promise<boolean>)): Promise<Request>;

    waitForEvent(event: 'requestfailed', optionsOrPredicate?: { predicate?: (request: Request) => boolean | Promise<boolean>, timeout?: number } | ((request: Request) => boolean | Promise<boolean>)): Promise<Request>;

    waitForEvent(event: 'requestfinished', optionsOrPredicate?: { predicate?: (request: Request) => boolean | Promise<boolean>, timeout?: number } | ((request: Request) => boolean | Promise<boolean>)): Promise<Request>;

    waitForEvent(event: 'response', optionsOrPredicate?: { predicate?: (response: Response) => boolean | Promise<boolean>, timeout?: number } | ((response: Response) => boolean | Promise<boolean>)): Promise<Response>;

    waitForEvent(event: 'serviceworker', optionsOrPredicate?: { predicate?: (worker: Worker) => boolean | Promise<boolean>, timeout?: number } | ((worker: Worker) => boolean | Promise<boolean>)): Promise<Worker>;

    waitForEvent(event: 'weberror', optionsOrPredicate?: { predicate?: (webError: WebError) => boolean | Promise<boolean>, timeout?: number } | ((webError: WebError) => boolean | Promise<boolean>)): Promise<WebError>;

    request: APIRequestContext;

    tracing: Tracing;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface Worker {

    evaluate<R, Arg>(pageFunction: PageFunction<Arg, R>, arg: Arg): Promise<R>;

    evaluate<R>(pageFunction: PageFunction<void, R>, arg?: any): Promise<R>;

    evaluateHandle<R, Arg>(pageFunction: PageFunction<Arg, R>, arg: Arg): Promise<SmartHandle<R>>;

    evaluateHandle<R>(pageFunction: PageFunction<void, R>, arg?: any): Promise<SmartHandle<R>>;

    on(event: 'close', listener: (worker: Worker) => void): this;

    once(event: 'close', listener: (worker: Worker) => void): this;

    addListener(event: 'close', listener: (worker: Worker) => void): this;

    removeListener(event: 'close', listener: (worker: Worker) => void): this;

    off(event: 'close', listener: (worker: Worker) => void): this;

    prependListener(event: 'close', listener: (worker: Worker) => void): this;

    url(): string;
}

export interface JSHandle<T = any> {

    evaluate<R, Arg, O extends T = T>(pageFunction: PageFunctionOn<O, Arg, R>, arg: Arg): Promise<R>;

    evaluate<R, O extends T = T>(pageFunction: PageFunctionOn<O, void, R>, arg?: any): Promise<R>;

    evaluateHandle<R, Arg, O extends T = T>(pageFunction: PageFunctionOn<O, Arg, R>, arg: Arg): Promise<SmartHandle<R>>;

    evaluateHandle<R, O extends T = T>(pageFunction: PageFunctionOn<O, void, R>, arg?: any): Promise<SmartHandle<R>>;

    jsonValue(): Promise<T>;

    asElement(): T extends Node ? ElementHandle<T> : null;

    dispose(): Promise<void>;

    getProperties(): Promise<Map<string, JSHandle>>;

    getProperty(propertyName: string): Promise<JSHandle>;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface ElementHandle<T=Node> extends JSHandle<T> {

    $<K extends keyof HTMLElementTagNameMap>(selector: K, options?: { strict: boolean }): Promise<ElementHandleForTag<K> | null>;

    $(selector: string, options?: { strict: boolean }): Promise<ElementHandle<SVGElement | HTMLElement> | null>;

    $$<K extends keyof HTMLElementTagNameMap>(selector: K): Promise<ElementHandleForTag<K>[]>;

    $$(selector: string): Promise<ElementHandle<SVGElement | HTMLElement>[]>;

    $eval<K extends keyof HTMLElementTagNameMap, R, Arg>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K], Arg, R>, arg: Arg): Promise<R>;

    $eval<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E, Arg, R>, arg: Arg): Promise<R>;

    $eval<K extends keyof HTMLElementTagNameMap, R>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K], void, R>, arg?: any): Promise<R>;

    $eval<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E, void, R>, arg?: any): Promise<R>;

    $$eval<K extends keyof HTMLElementTagNameMap, R, Arg>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K][], Arg, R>, arg: Arg): Promise<R>;

    $$eval<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E[], Arg, R>, arg: Arg): Promise<R>;

    $$eval<K extends keyof HTMLElementTagNameMap, R>(selector: K, pageFunction: PageFunctionOn<HTMLElementTagNameMap[K][], void, R>, arg?: any): Promise<R>;

    $$eval<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(selector: string, pageFunction: PageFunctionOn<E[], void, R>, arg?: any): Promise<R>;

    waitForSelector<K extends keyof HTMLElementTagNameMap>(selector: K, options?: ElementHandleWaitForSelectorOptionsNotHidden): Promise<ElementHandleForTag<K>>;

    waitForSelector(selector: string, options?: ElementHandleWaitForSelectorOptionsNotHidden): Promise<ElementHandle<SVGElement | HTMLElement>>;

    waitForSelector<K extends keyof HTMLElementTagNameMap>(selector: K, options: ElementHandleWaitForSelectorOptions): Promise<ElementHandleForTag<K> | null>;

    waitForSelector(selector: string, options: ElementHandleWaitForSelectorOptions): Promise<null|ElementHandle<SVGElement | HTMLElement>>;

    boundingBox(): Promise<null|{

        x: number;

        y: number;

        width: number;

        height: number;
    }>;

    check(options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    click(options?: {

        button?: "left"|"right"|"middle";

        clickCount?: number;

        delay?: number;

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    contentFrame(): Promise<null|Frame>;

    dblclick(options?: {

        button?: "left"|"right"|"middle";

        delay?: number;

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    dispatchEvent(type: string, eventInit?: EvaluationArgument): Promise<void>;

    fill(value: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    focus(): Promise<void>;

    getAttribute(name: string): Promise<null|string>;

    hover(options?: {

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    innerHTML(): Promise<string>;

    innerText(): Promise<string>;

    inputValue(options?: {

        timeout?: number;
    }): Promise<string>;

    isChecked(): Promise<boolean>;

    isDisabled(): Promise<boolean>;

    isEditable(): Promise<boolean>;

    isEnabled(): Promise<boolean>;

    isHidden(): Promise<boolean>;

    isVisible(): Promise<boolean>;

    ownerFrame(): Promise<null|Frame>;

    press(key: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    screenshot(options?: {

        animations?: "disabled"|"allow";

        caret?: "hide"|"initial";

        mask?: Array<Locator>;

        maskColor?: string;

        omitBackground?: boolean;

        path?: string;

        quality?: number;

        scale?: "css"|"device";

        style?: string;

        timeout?: number;

        type?: "png"|"jpeg";
    }): Promise<Buffer>;

    scrollIntoViewIfNeeded(options?: {

        timeout?: number;
    }): Promise<void>;

    selectOption(values: null|string|ElementHandle|ReadonlyArray<string>|{

        value?: string;

        label?: string;

        index?: number;
    }|ReadonlyArray<ElementHandle>|ReadonlyArray<{

        value?: string;

        label?: string;

        index?: number;
    }>, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<Array<string>>;

    selectText(options?: {

        force?: boolean;

        timeout?: number;
    }): Promise<void>;

    setChecked(checked: boolean, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    setInputFiles(files: string|ReadonlyArray<string>|{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }|ReadonlyArray<{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }>, options?: {

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    tap(options?: {

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    textContent(): Promise<null|string>;

    type(text: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    uncheck(options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    waitForElementState(state: "visible"|"hidden"|"stable"|"enabled"|"disabled"|"editable", options?: {

        timeout?: number;
    }): Promise<void>;
}

export interface Locator {

    evaluate<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E, Arg, R>, arg: Arg, options?: {
        timeout?: number;
    }): Promise<R>;

    evaluate<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E, void, R>, options?: {
        timeout?: number;
    }): Promise<R>;

    evaluateHandle<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E, Arg, R>, arg: Arg): Promise<SmartHandle<R>>;

    evaluateHandle<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E, void, R>): Promise<SmartHandle<R>>;

    evaluateAll<R, Arg, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E[], Arg, R>, arg: Arg): Promise<R>;

    evaluateAll<R, E extends SVGElement | HTMLElement = SVGElement | HTMLElement>(pageFunction: PageFunctionOn<E[], void, R>): Promise<R>;

    elementHandle(options?: {
        timeout?: number;
    }): Promise<null|ElementHandle<SVGElement | HTMLElement>>;

    all(): Promise<Array<Locator>>;

    allInnerTexts(): Promise<Array<string>>;

    allTextContents(): Promise<Array<string>>;

    and(locator: Locator): Locator;

    blur(options?: {

        timeout?: number;
    }): Promise<void>;

    boundingBox(options?: {

        timeout?: number;
    }): Promise<null|{

        x: number;

        y: number;

        width: number;

        height: number;
    }>;

    check(options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    clear(options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    click(options?: {

        button?: "left"|"right"|"middle";

        clickCount?: number;

        delay?: number;

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    contentFrame(): FrameLocator;

    count(): Promise<number>;

    dblclick(options?: {

        button?: "left"|"right"|"middle";

        delay?: number;

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    dispatchEvent(type: string, eventInit?: EvaluationArgument, options?: {

        timeout?: number;
    }): Promise<void>;

    dragTo(target: Locator, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        sourcePosition?: {
            x: number;

            y: number;
        };

        targetPosition?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    elementHandles(): Promise<Array<ElementHandle>>;

    fill(value: string, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    filter(options?: {

        has?: Locator;

        hasNot?: Locator;

        hasNotText?: string|RegExp;

        hasText?: string|RegExp;
    }): Locator;

    first(): Locator;

    focus(options?: {

        timeout?: number;
    }): Promise<void>;

    frameLocator(selector: string): FrameLocator;

    getAttribute(name: string, options?: {

        timeout?: number;
    }): Promise<null|string>;

    getByAltText(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByLabel(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByPlaceholder(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByRole(role: "alert"|"alertdialog"|"application"|"article"|"banner"|"blockquote"|"button"|"caption"|"cell"|"checkbox"|"code"|"columnheader"|"combobox"|"complementary"|"contentinfo"|"definition"|"deletion"|"dialog"|"directory"|"document"|"emphasis"|"feed"|"figure"|"form"|"generic"|"grid"|"gridcell"|"group"|"heading"|"img"|"insertion"|"link"|"list"|"listbox"|"listitem"|"log"|"main"|"marquee"|"math"|"meter"|"menu"|"menubar"|"menuitem"|"menuitemcheckbox"|"menuitemradio"|"navigation"|"none"|"note"|"option"|"paragraph"|"presentation"|"progressbar"|"radio"|"radiogroup"|"region"|"row"|"rowgroup"|"rowheader"|"scrollbar"|"search"|"searchbox"|"separator"|"slider"|"spinbutton"|"status"|"strong"|"subscript"|"superscript"|"switch"|"tab"|"table"|"tablist"|"tabpanel"|"term"|"textbox"|"time"|"timer"|"toolbar"|"tooltip"|"tree"|"treegrid"|"treeitem", options?: {

        checked?: boolean;

        disabled?: boolean;

        exact?: boolean;

        expanded?: boolean;

        includeHidden?: boolean;

        level?: number;

        name?: string|RegExp;

        pressed?: boolean;

        selected?: boolean;
    }): Locator;

    getByTestId(testId: string|RegExp): Locator;

    getByText(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByTitle(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    highlight(): Promise<void>;

    hover(options?: {

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    innerHTML(options?: {

        timeout?: number;
    }): Promise<string>;

    innerText(options?: {

        timeout?: number;
    }): Promise<string>;

    inputValue(options?: {

        timeout?: number;
    }): Promise<string>;

    isChecked(options?: {

        timeout?: number;
    }): Promise<boolean>;

    isDisabled(options?: {

        timeout?: number;
    }): Promise<boolean>;

    isEditable(options?: {

        timeout?: number;
    }): Promise<boolean>;

    isEnabled(options?: {

        timeout?: number;
    }): Promise<boolean>;

    isHidden(options?: {

        timeout?: number;
    }): Promise<boolean>;

    isVisible(options?: {

        timeout?: number;
    }): Promise<boolean>;

    last(): Locator;

    locator(selectorOrLocator: string|Locator, options?: {

        has?: Locator;

        hasNot?: Locator;

        hasNotText?: string|RegExp;

        hasText?: string|RegExp;
    }): Locator;

    nth(index: number): Locator;

    or(locator: Locator): Locator;

    page(): Page;

    press(key: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    pressSequentially(text: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    screenshot(options?: LocatorScreenshotOptions): Promise<Buffer>;

    scrollIntoViewIfNeeded(options?: {

        timeout?: number;
    }): Promise<void>;

    selectOption(values: null|string|ElementHandle|ReadonlyArray<string>|{

        value?: string;

        label?: string;

        index?: number;
    }|ReadonlyArray<ElementHandle>|ReadonlyArray<{

        value?: string;

        label?: string;

        index?: number;
    }>, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<Array<string>>;

    selectText(options?: {

        force?: boolean;

        timeout?: number;
    }): Promise<void>;

    setChecked(checked: boolean, options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    setInputFiles(files: string|ReadonlyArray<string>|{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }|ReadonlyArray<{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }>, options?: {

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    tap(options?: {

        force?: boolean;

        modifiers?: Array<"Alt"|"Control"|"Meta"|"Shift">;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    textContent(options?: {

        timeout?: number;
    }): Promise<null|string>;

    type(text: string, options?: {

        delay?: number;

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;

    uncheck(options?: {

        force?: boolean;

        noWaitAfter?: boolean;

        position?: {
            x: number;

            y: number;
        };

        timeout?: number;

        trial?: boolean;
    }): Promise<void>;

    waitFor(options?: {

        state?: "attached"|"detached"|"visible"|"hidden";

        timeout?: number;
    }): Promise<void>;
}

export interface BrowserType<Unused = {}> {

    connectOverCDP(endpointURL: string, options?: ConnectOverCDPOptions): Promise<Browser>;

    connectOverCDP(options: ConnectOverCDPOptions & { wsEndpoint?: string }): Promise<Browser>;

    connect(wsEndpoint: string, options?: ConnectOptions): Promise<Browser>;

    connect(options: ConnectOptions & { wsEndpoint?: string }): Promise<Browser>;

    executablePath(): string;

    launch(options?: LaunchOptions): Promise<Browser>;

    launchPersistentContext(userDataDir: string, options?: {

        acceptDownloads?: boolean;

        args?: Array<string>;

        baseURL?: string;

        bypassCSP?: boolean;

        channel?: string;

        chromiumSandbox?: boolean;

        colorScheme?: null|"light"|"dark"|"no-preference";

        deviceScaleFactor?: number;

        devtools?: boolean;

        downloadsPath?: string;

        env?: { [key: string]: string|number|boolean; };

        executablePath?: string;

        extraHTTPHeaders?: { [key: string]: string; };

        firefoxUserPrefs?: { [key: string]: string|number|boolean; };

        forcedColors?: null|"active"|"none";

        geolocation?: {

            latitude: number;

            longitude: number;

            accuracy?: number;
        };

        handleSIGHUP?: boolean;

        handleSIGINT?: boolean;

        handleSIGTERM?: boolean;

        hasTouch?: boolean;

        headless?: boolean;

        httpCredentials?: {
            username: string;

            password: string;

            origin?: string;
        };

        ignoreDefaultArgs?: boolean|Array<string>;

        ignoreHTTPSErrors?: boolean;

        isMobile?: boolean;

        javaScriptEnabled?: boolean;

        locale?: string;

        logger?: Logger;

        offline?: boolean;

        permissions?: Array<string>;

        proxy?: {

            server: string;

            bypass?: string;

            username?: string;

            password?: string;
        };

        recordHar?: {

            omitContent?: boolean;

            content?: "omit"|"embed"|"attach";

            path: string;

            mode?: "full"|"minimal";

            urlFilter?: string|RegExp;
        };

        recordVideo?: {

            dir: string;

            size?: {

                width: number;

                height: number;
            };
        };

        reducedMotion?: null|"reduce"|"no-preference";

        screen?: {

            width: number;

            height: number;
        };

        serviceWorkers?: "allow"|"block";

        slowMo?: number;

        strictSelectors?: boolean;

        timeout?: number;

        timezoneId?: string;

        tracesDir?: string;

        userAgent?: string;

        videoSize?: {

            width: number;

            height: number;
        };

        videosPath?: string;

        viewport?: null|{

            width: number;

            height: number;
        };
    }): Promise<BrowserContext>;

    launchServer(options?: {

        args?: Array<string>;

        channel?: string;

        chromiumSandbox?: boolean;

        devtools?: boolean;

        downloadsPath?: string;

        env?: { [key: string]: string|number|boolean; };

        executablePath?: string;

        firefoxUserPrefs?: { [key: string]: string|number|boolean; };

        handleSIGHUP?: boolean;

        handleSIGINT?: boolean;

        handleSIGTERM?: boolean;

        headless?: boolean;

        ignoreDefaultArgs?: boolean|Array<string>;

        logger?: Logger;

        port?: number;

        proxy?: {

            server: string;

            bypass?: string;

            username?: string;

            password?: string;
        };

        timeout?: number;

        tracesDir?: string;

        wsPath?: string;
    }): Promise<BrowserServer>;

    name(): string;
}

export interface CDPSession {
    on: <T extends keyof Protocol.Events | symbol>(event: T, listener: (payload: T extends symbol ? any : Protocol.Events[T extends keyof Protocol.Events ? T : never]) => void) => this;
    addListener: <T extends keyof Protocol.Events | symbol>(event: T, listener: (payload: T extends symbol ? any : Protocol.Events[T extends keyof Protocol.Events ? T : never]) => void) => this;
    off: <T extends keyof Protocol.Events | symbol>(event: T, listener: (payload: T extends symbol ? any : Protocol.Events[T extends keyof Protocol.Events ? T : never]) => void) => this;
    removeListener: <T extends keyof Protocol.Events | symbol>(event: T, listener: (payload: T extends symbol ? any : Protocol.Events[T extends keyof Protocol.Events ? T : never]) => void) => this;
    once: <T extends keyof Protocol.Events | symbol>(event: T, listener: (payload: T extends symbol ? any : Protocol.Events[T extends keyof Protocol.Events ? T : never]) => void) => this;

    send<T extends keyof Protocol.CommandParameters>(
        method: T,
        params?: Protocol.CommandParameters[T]
    ): Promise<Protocol.CommandReturnValues[T]>;

    detach(): Promise<void>;
}

type DeviceDescriptor = {
    viewport: ViewportSize;
    userAgent: string;
    deviceScaleFactor: number;
    isMobile: boolean;
    hasTouch: boolean;
    defaultBrowserType: 'chromium' | 'firefox' | 'webkit';
};

export namespace errors {

    class TimeoutError extends Error {
    }

}

export interface Accessibility {

    snapshot(options?: AccessibilitySnapshotOptions): Promise<null|AccessibilityNode>;

}

type AccessibilityNode = {
    role: string;
    name: string;
    value?: string|number;
    description?: string;
    keyshortcuts?: string;
    roledescription?: string;
    valuetext?: string;
    disabled?: boolean;
    expanded?: boolean;
    focused?: boolean;
    modal?: boolean;
    multiline?: boolean;
    multiselectable?: boolean;
    readonly?: boolean;
    required?: boolean;
    selected?: boolean;
    checked?: boolean|"mixed";
    pressed?: boolean|"mixed";
    level?: number;
    valuemin?: number;
    valuemax?: number;
    autocomplete?: string;
    haspopup?: string;
    invalid?: string;
    orientation?: string;
    children?: AccessibilityNode[];
}

export const devices: Devices;

type ElectronType = typeof import('electron');

export interface ElectronApplication {

    evaluate<R, Arg>(pageFunction: PageFunctionOn<ElectronType, Arg, R>, arg: Arg): Promise<R>;

    evaluate<R>(pageFunction: PageFunctionOn<ElectronType, void, R>, arg?: any): Promise<R>;

    evaluateHandle<R, Arg>(pageFunction: PageFunctionOn<ElectronType, Arg, R>, arg: Arg): Promise<SmartHandle<R>>;

    evaluateHandle<R>(pageFunction: PageFunctionOn<ElectronType, void, R>, arg?: any): Promise<SmartHandle<R>>;

    on(event: 'close', listener: () => void): this;

    on(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    on(event: 'window', listener: (page: Page) => void): this;

    once(event: 'close', listener: () => void): this;

    once(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    once(event: 'window', listener: (page: Page) => void): this;

    addListener(event: 'close', listener: () => void): this;

    addListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    addListener(event: 'window', listener: (page: Page) => void): this;

    removeListener(event: 'close', listener: () => void): this;

    removeListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    removeListener(event: 'window', listener: (page: Page) => void): this;

    off(event: 'close', listener: () => void): this;

    off(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    off(event: 'window', listener: (page: Page) => void): this;

    prependListener(event: 'close', listener: () => void): this;

    prependListener(event: 'console', listener: (consoleMessage: ConsoleMessage) => void): this;

    prependListener(event: 'window', listener: (page: Page) => void): this;

    browserWindow(page: Page): Promise<JSHandle>;

    close(): Promise<void>;

    context(): BrowserContext;

    firstWindow(options?: {

        timeout?: number;
    }): Promise<Page>;

    process(): ChildProcess;

    waitForEvent(event: 'close', optionsOrPredicate?: { predicate?: () => boolean | Promise<boolean>, timeout?: number } | (() => boolean | Promise<boolean>)): Promise<void>;

    waitForEvent(event: 'console', optionsOrPredicate?: { predicate?: (consoleMessage: ConsoleMessage) => boolean | Promise<boolean>, timeout?: number } | ((consoleMessage: ConsoleMessage) => boolean | Promise<boolean>)): Promise<ConsoleMessage>;

    waitForEvent(event: 'window', optionsOrPredicate?: { predicate?: (page: Page) => boolean | Promise<boolean>, timeout?: number } | ((page: Page) => boolean | Promise<boolean>)): Promise<Page>;

    windows(): Array<Page>;

    [Symbol.asyncDispose](): Promise<void>;
}

export type AndroidElementInfo = {
    clazz: string;
    desc: string;
    res: string;
    pkg: string;
    text: string;
    bounds: { x: number, y: number, width: number, height: number };
    checkable: boolean;
    checked: boolean;
    clickable: boolean;
    enabled: boolean;
    focusable: boolean;
    focused: boolean;
    longClickable: boolean;
    scrollable: boolean;
    selected: boolean;
};

export type AndroidSelector = {
    checkable?: boolean,
    checked?: boolean,
    clazz?: string | RegExp,
    clickable?: boolean,
    depth?: number,
    desc?: string | RegExp,
    enabled?: boolean,
    focusable?: boolean,
    focused?: boolean,
    hasChild?: { selector: AndroidSelector },
    hasDescendant?: { selector: AndroidSelector, maxDepth?: number },
    longClickable?: boolean,
    pkg?: string | RegExp,
    res?: string | RegExp,
    scrollable?: boolean,
    selected?: boolean,
    text?: string | RegExp,
};

export type AndroidKey =
    'Unknown' |
    'SoftLeft' | 'SoftRight' |
    'Home' |
    'Back' |
    'Call' | 'EndCall' |
    '0' |  '1' |  '2' |  '3' |  '4' |  '5' |  '6' |  '7' |  '8' |  '9' |
    'Star' | 'Pound' | '*' | '#' |
    'DialUp' | 'DialDown' | 'DialLeft' | 'DialRight' | 'DialCenter' |
    'VolumeUp' | 'VolumeDown' |
    'Power' |
    'Camera' |
    'Clear' |
    'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' |
    'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' |
    'Comma' | ',' |
    'Period' | '.' |
    'AltLeft' | 'AltRight' |
    'ShiftLeft' | 'ShiftRight' |
    'Tab' | '\\t' |
    'Space' | ' ' |
    'Sym' |
    'Explorer' |
    'Envelop' |
    'Enter' | '\\n' |
    'Del' |
    'Grave' |
    'Minus' | '-' |
    'Equals' | '=' |
    'LeftBracket' | '(' |
    'RightBracket' | ')' |
    'Backslash' | '\\\\' |
    'Semicolon' | ';' |
    'Slash' | '/' |
    'At' | '@' |
    'Num' |
    'HeadsetHook' |
    'Focus' |
    'Plus' | '+' |
    'Menu' |
    'Notification' |
    'Search' |
    'RecentApps' |
    'AppSwitch' |
    'Assist' |
    'Cut' |
    'Copy' |
    'Paste';

export const _electron: Electron;
export const _android: Android;

export {};

export interface Android {

    connect(wsEndpoint: string, options?: {

        headers?: { [key: string]: string; };

        slowMo?: number;

        timeout?: number;
    }): Promise<AndroidDevice>;

    devices(options?: {

        host?: string;

        omitDriverInstall?: boolean;

        port?: number;
    }): Promise<Array<AndroidDevice>>;

    launchServer(options?: {

        adbHost?: string;

        adbPort?: number;

        deviceSerialNumber?: string;

        omitDriverInstall?: boolean;

        port?: number;

        wsPath?: string;
    }): Promise<BrowserServer>;

    setDefaultTimeout(timeout: number): void;
}

export interface AndroidDevice {

    on(event: 'close', listener: (androidDevice: AndroidDevice) => void): this;

    on(event: 'webview', listener: (androidWebView: AndroidWebView) => void): this;

    once(event: 'close', listener: (androidDevice: AndroidDevice) => void): this;

    once(event: 'webview', listener: (androidWebView: AndroidWebView) => void): this;

    addListener(event: 'close', listener: (androidDevice: AndroidDevice) => void): this;

    addListener(event: 'webview', listener: (androidWebView: AndroidWebView) => void): this;

    removeListener(event: 'close', listener: (androidDevice: AndroidDevice) => void): this;

    removeListener(event: 'webview', listener: (androidWebView: AndroidWebView) => void): this;

    off(event: 'close', listener: (androidDevice: AndroidDevice) => void): this;

    off(event: 'webview', listener: (androidWebView: AndroidWebView) => void): this;

    prependListener(event: 'close', listener: (androidDevice: AndroidDevice) => void): this;

    prependListener(event: 'webview', listener: (androidWebView: AndroidWebView) => void): this;

    close(): Promise<void>;

    drag(selector: AndroidSelector, dest: {
        x: number;

        y: number;
    }, options?: {

        speed?: number;

        timeout?: number;
    }): Promise<void>;

    fill(selector: AndroidSelector, text: string, options?: {

        timeout?: number;
    }): Promise<void>;

    fling(selector: AndroidSelector, direction: "down"|"up"|"left"|"right", options?: {

        speed?: number;

        timeout?: number;
    }): Promise<void>;

    info(selector: AndroidSelector): Promise<AndroidElementInfo>;

    installApk(file: string|Buffer, options?: {

        args?: Array<string>;
    }): Promise<void>;

    launchBrowser(options?: {

        acceptDownloads?: boolean;

        args?: Array<string>;

        baseURL?: string;

        bypassCSP?: boolean;

        colorScheme?: null|"light"|"dark"|"no-preference";

        command?: string;

        deviceScaleFactor?: number;

        extraHTTPHeaders?: { [key: string]: string; };

        forcedColors?: null|"active"|"none";

        geolocation?: {

            latitude: number;

            longitude: number;

            accuracy?: number;
        };

        hasTouch?: boolean;

        httpCredentials?: {
            username: string;

            password: string;

            origin?: string;
        };

        ignoreHTTPSErrors?: boolean;

        isMobile?: boolean;

        javaScriptEnabled?: boolean;

        locale?: string;

        logger?: Logger;

        offline?: boolean;

        permissions?: Array<string>;

        proxy?: {

            server: string;

            bypass?: string;

            username?: string;

            password?: string;
        };

        recordHar?: {

            omitContent?: boolean;

            content?: "omit"|"embed"|"attach";

            path: string;

            mode?: "full"|"minimal";

            urlFilter?: string|RegExp;
        };

        recordVideo?: {

            dir: string;

            size?: {

                width: number;

                height: number;
            };
        };

        reducedMotion?: null|"reduce"|"no-preference";

        screen?: {

            width: number;

            height: number;
        };

        serviceWorkers?: "allow"|"block";

        strictSelectors?: boolean;

        timezoneId?: string;

        userAgent?: string;

        videoSize?: {

            width: number;

            height: number;
        };

        videosPath?: string;

        viewport?: null|{

            width: number;

            height: number;
        };
    }): Promise<BrowserContext>;

    longTap(selector: AndroidSelector, options?: {

        timeout?: number;
    }): Promise<void>;

    model(): string;

    open(command: string): Promise<AndroidSocket>;

    pinchClose(selector: AndroidSelector, percent: number, options?: {

        speed?: number;

        timeout?: number;
    }): Promise<void>;

    pinchOpen(selector: AndroidSelector, percent: number, options?: {

        speed?: number;

        timeout?: number;
    }): Promise<void>;

    press(selector: AndroidSelector, key: AndroidKey, options?: {

        timeout?: number;
    }): Promise<void>;

    push(file: string|Buffer, path: string, options?: {

        mode?: number;
    }): Promise<void>;

    screenshot(options?: {

        path?: string;
    }): Promise<Buffer>;

    scroll(selector: AndroidSelector, direction: "down"|"up"|"left"|"right", percent: number, options?: {

        speed?: number;

        timeout?: number;
    }): Promise<void>;

    serial(): string;

    setDefaultTimeout(timeout: number): void;

    shell(command: string): Promise<Buffer>;

    swipe(selector: AndroidSelector, direction: "down"|"up"|"left"|"right", percent: number, options?: {

        speed?: number;

        timeout?: number;
    }): Promise<void>;

    tap(selector: AndroidSelector, options?: {

        duration?: number;

        timeout?: number;
    }): Promise<void>;

    wait(selector: AndroidSelector, options?: {

        state?: "gone";

        timeout?: number;
    }): Promise<void>;

    waitForEvent(event: 'close', optionsOrPredicate?: { predicate?: (androidDevice: AndroidDevice) => boolean | Promise<boolean>, timeout?: number } | ((androidDevice: AndroidDevice) => boolean | Promise<boolean>)): Promise<AndroidDevice>;

    waitForEvent(event: 'webview', optionsOrPredicate?: { predicate?: (androidWebView: AndroidWebView) => boolean | Promise<boolean>, timeout?: number } | ((androidWebView: AndroidWebView) => boolean | Promise<boolean>)): Promise<AndroidWebView>;

    webView(selector: {

        pkg?: string;

        socketName?: string;
    }, options?: {

        timeout?: number;
    }): Promise<AndroidWebView>;

    webViews(): Array<AndroidWebView>;

    input: AndroidInput;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface AndroidInput {

    drag(from: {
        x: number;

        y: number;
    }, to: {
        x: number;

        y: number;
    }, steps: number): Promise<void>;

    press(key: AndroidKey): Promise<void>;

    swipe(from: {
        x: number;

        y: number;
    }, segments: ReadonlyArray<{
        x: number;

        y: number;
    }>, steps: number): Promise<void>;

    tap(point: {
        x: number;

        y: number;
    }): Promise<void>;

    type(text: string): Promise<void>;
}

export interface AndroidSocket {

    on(event: 'close', listener: () => void): this;

    on(event: 'data', listener: (buffer: Buffer) => void): this;

    once(event: 'close', listener: () => void): this;

    once(event: 'data', listener: (buffer: Buffer) => void): this;

    addListener(event: 'close', listener: () => void): this;

    addListener(event: 'data', listener: (buffer: Buffer) => void): this;

    removeListener(event: 'close', listener: () => void): this;

    removeListener(event: 'data', listener: (buffer: Buffer) => void): this;

    off(event: 'close', listener: () => void): this;

    off(event: 'data', listener: (buffer: Buffer) => void): this;

    prependListener(event: 'close', listener: () => void): this;

    prependListener(event: 'data', listener: (buffer: Buffer) => void): this;

    close(): Promise<void>;

    write(data: Buffer): Promise<void>;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface AndroidWebView {

    on(event: 'close', listener: () => void): this;

    once(event: 'close', listener: () => void): this;

    addListener(event: 'close', listener: () => void): this;

    removeListener(event: 'close', listener: () => void): this;

    off(event: 'close', listener: () => void): this;

    prependListener(event: 'close', listener: () => void): this;

    page(): Promise<Page>;

    pid(): number;

    pkg(): string;
}

export interface APIRequest {

    newContext(options?: {

        baseURL?: string;

        extraHTTPHeaders?: { [key: string]: string; };

        httpCredentials?: {
            username: string;

            password: string;

            origin?: string;
        };

        ignoreHTTPSErrors?: boolean;

        proxy?: {

            server: string;

            bypass?: string;

            username?: string;

            password?: string;
        };

        storageState?: string|{
            cookies: Array<{
                name: string;

                value: string;

                domain: string;

                path: string;

                expires: number;

                httpOnly: boolean;

                secure: boolean;

                sameSite: "Strict"|"Lax"|"None";
            }>;

            origins: Array<{
                origin: string;

                localStorage: Array<{
                    name: string;

                    value: string;
                }>;
            }>;
        };

        timeout?: number;

        userAgent?: string;
    }): Promise<APIRequestContext>;
}

export interface APIRequestContext {

    delete(url: string, options?: {

        data?: string|Buffer|Serializable;

        failOnStatusCode?: boolean;

        form?: { [key: string]: string|number|boolean; };

        headers?: { [key: string]: string; };

        ignoreHTTPSErrors?: boolean;

        maxRedirects?: number;

        multipart?: { [key: string]: string|number|boolean|ReadStream|{

                name: string;

                mimeType: string;

                buffer: Buffer;
            }; };

        params?: { [key: string]: string|number|boolean; };

        timeout?: number;
    }): Promise<APIResponse>;

    dispose(): Promise<void>;

    fetch(urlOrRequest: string|Request, options?: {

        data?: string|Buffer|Serializable;

        failOnStatusCode?: boolean;

        form?: { [key: string]: string|number|boolean; };

        headers?: { [key: string]: string; };

        ignoreHTTPSErrors?: boolean;

        maxRedirects?: number;

        method?: string;

        multipart?: { [key: string]: string|number|boolean|ReadStream|{

                name: string;

                mimeType: string;

                buffer: Buffer;
            }; };

        params?: { [key: string]: string|number|boolean; };

        timeout?: number;
    }): Promise<APIResponse>;

    get(url: string, options?: {

        data?: string|Buffer|Serializable;

        failOnStatusCode?: boolean;

        form?: { [key: string]: string|number|boolean; };

        headers?: { [key: string]: string; };

        ignoreHTTPSErrors?: boolean;

        maxRedirects?: number;

        multipart?: { [key: string]: string|number|boolean|ReadStream|{

                name: string;

                mimeType: string;

                buffer: Buffer;
            }; };

        params?: { [key: string]: string|number|boolean; };

        timeout?: number;
    }): Promise<APIResponse>;

    head(url: string, options?: {

        data?: string|Buffer|Serializable;

        failOnStatusCode?: boolean;

        form?: { [key: string]: string|number|boolean; };

        headers?: { [key: string]: string; };

        ignoreHTTPSErrors?: boolean;

        maxRedirects?: number;

        multipart?: { [key: string]: string|number|boolean|ReadStream|{

                name: string;

                mimeType: string;

                buffer: Buffer;
            }; };

        params?: { [key: string]: string|number|boolean; };

        timeout?: number;
    }): Promise<APIResponse>;

    patch(url: string, options?: {

        data?: string|Buffer|Serializable;

        failOnStatusCode?: boolean;

        form?: { [key: string]: string|number|boolean; };

        headers?: { [key: string]: string; };

        ignoreHTTPSErrors?: boolean;

        maxRedirects?: number;

        multipart?: { [key: string]: string|number|boolean|ReadStream|{

                name: string;

                mimeType: string;

                buffer: Buffer;
            }; };

        params?: { [key: string]: string|number|boolean; };

        timeout?: number;
    }): Promise<APIResponse>;

    post(url: string, options?: {

        data?: string|Buffer|Serializable;

        failOnStatusCode?: boolean;

        form?: { [key: string]: string|number|boolean; };

        headers?: { [key: string]: string; };

        ignoreHTTPSErrors?: boolean;

        maxRedirects?: number;

        multipart?: { [key: string]: string|number|boolean|ReadStream|{

                name: string;

                mimeType: string;

                buffer: Buffer;
            }; };

        params?: { [key: string]: string|number|boolean; };

        timeout?: number;
    }): Promise<APIResponse>;

    put(url: string, options?: {

        data?: string|Buffer|Serializable;

        failOnStatusCode?: boolean;

        form?: { [key: string]: string|number|boolean; };

        headers?: { [key: string]: string; };

        ignoreHTTPSErrors?: boolean;

        maxRedirects?: number;

        multipart?: { [key: string]: string|number|boolean|ReadStream|{

                name: string;

                mimeType: string;

                buffer: Buffer;
            }; };

        params?: { [key: string]: string|number|boolean; };

        timeout?: number;
    }): Promise<APIResponse>;

    storageState(options?: {

        path?: string;
    }): Promise<{
        cookies: Array<{
            name: string;

            value: string;

            domain: string;

            path: string;

            expires: number;

            httpOnly: boolean;

            secure: boolean;

            sameSite: "Strict"|"Lax"|"None";
        }>;

        origins: Array<{
            origin: string;

            localStorage: Array<{
                name: string;

                value: string;
            }>;
        }>;
    }>;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface APIResponse {

    body(): Promise<Buffer>;

    dispose(): Promise<void>;

    headers(): { [key: string]: string; };

    headersArray(): Array<{

        name: string;

        value: string;
    }>;

    json(): Promise<Serializable>;

    ok(): boolean;

    status(): number;

    statusText(): string;

    text(): Promise<string>;

    url(): string;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface Browser extends EventEmitter {

    on(event: 'disconnected', listener: (browser: Browser) => void): this;

    once(event: 'disconnected', listener: (browser: Browser) => void): this;

    addListener(event: 'disconnected', listener: (browser: Browser) => void): this;

    removeListener(event: 'disconnected', listener: (browser: Browser) => void): this;

    off(event: 'disconnected', listener: (browser: Browser) => void): this;

    prependListener(event: 'disconnected', listener: (browser: Browser) => void): this;

    browserType(): BrowserType;

    close(options?: {

        reason?: string;
    }): Promise<void>;

    contexts(): Array<BrowserContext>;

    isConnected(): boolean;

    newBrowserCDPSession(): Promise<CDPSession>;

    newContext(options?: BrowserContextOptions): Promise<BrowserContext>;

    newPage(options?: {

        acceptDownloads?: boolean;

        baseURL?: string;

        bypassCSP?: boolean;

        colorScheme?: null|"light"|"dark"|"no-preference";

        deviceScaleFactor?: number;

        extraHTTPHeaders?: { [key: string]: string; };

        forcedColors?: null|"active"|"none";

        geolocation?: {

            latitude: number;

            longitude: number;

            accuracy?: number;
        };

        hasTouch?: boolean;

        httpCredentials?: {
            username: string;

            password: string;

            origin?: string;
        };

        ignoreHTTPSErrors?: boolean;

        isMobile?: boolean;

        javaScriptEnabled?: boolean;

        locale?: string;

        logger?: Logger;

        offline?: boolean;

        permissions?: Array<string>;

        proxy?: {

            server: string;

            bypass?: string;

            username?: string;

            password?: string;
        };

        recordHar?: {

            omitContent?: boolean;

            content?: "omit"|"embed"|"attach";

            path: string;

            mode?: "full"|"minimal";

            urlFilter?: string|RegExp;
        };

        recordVideo?: {

            dir: string;

            size?: {

                width: number;

                height: number;
            };
        };

        reducedMotion?: null|"reduce"|"no-preference";

        screen?: {

            width: number;

            height: number;
        };

        serviceWorkers?: "allow"|"block";

        storageState?: string|{

            cookies: Array<{
                name: string;

                value: string;

                domain: string;

                path: string;

                expires: number;

                httpOnly: boolean;

                secure: boolean;

                sameSite: "Strict"|"Lax"|"None";
            }>;

            origins: Array<{
                origin: string;

                localStorage: Array<{
                    name: string;

                    value: string;
                }>;
            }>;
        };

        strictSelectors?: boolean;

        timezoneId?: string;

        userAgent?: string;

        videoSize?: {

            width: number;

            height: number;
        };

        videosPath?: string;

        viewport?: null|{

            width: number;

            height: number;
        };
    }): Promise<Page>;

    startTracing(page?: Page, options?: {

        categories?: Array<string>;

        path?: string;

        screenshots?: boolean;
    }): Promise<void>;

    stopTracing(): Promise<Buffer>;

    version(): string;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface BrowserServer {

    on(event: 'close', listener: () => void): this;

    once(event: 'close', listener: () => void): this;

    addListener(event: 'close', listener: () => void): this;

    removeListener(event: 'close', listener: () => void): this;

    off(event: 'close', listener: () => void): this;

    prependListener(event: 'close', listener: () => void): this;

    close(): Promise<void>;

    kill(): Promise<void>;

    process(): ChildProcess;

    wsEndpoint(): string;

    [Symbol.asyncDispose](): Promise<void>;
}

export interface ConsoleMessage {

    args(): Array<JSHandle>;

    location(): {

        url: string;

        lineNumber: number;

        columnNumber: number;
    };

    page(): null|Page;

    text(): string;

    type(): string;
}

export interface Coverage {

    startCSSCoverage(options?: {

        resetOnNavigation?: boolean;
    }): Promise<void>;

    startJSCoverage(options?: {

        reportAnonymousScripts?: boolean;

        resetOnNavigation?: boolean;
    }): Promise<void>;

    stopCSSCoverage(): Promise<Array<{

        url: string;

        text?: string;

        ranges: Array<{

            start: number;

            end: number;
        }>;
    }>>;

    stopJSCoverage(): Promise<Array<{

        url: string;

        scriptId: string;

        source?: string;

        functions: Array<{
            functionName: string;

            isBlockCoverage: boolean;

            ranges: Array<{
                count: number;

                startOffset: number;

                endOffset: number;
            }>;
        }>;
    }>>;
}

export interface Dialog {

    accept(promptText?: string): Promise<void>;

    defaultValue(): string;

    dismiss(): Promise<void>;

    message(): string;

    page(): null|Page;

    type(): string;
}

export interface Download {

    cancel(): Promise<void>;

    createReadStream(): Promise<Readable>;

    delete(): Promise<void>;

    failure(): Promise<null|string>;

    page(): Page;

    path(): Promise<string>;

    saveAs(path: string): Promise<void>;

    suggestedFilename(): string;

    url(): string;
}

export interface Electron {

    launch(options?: {

        acceptDownloads?: boolean;

        args?: Array<string>;

        bypassCSP?: boolean;

        colorScheme?: null|"light"|"dark"|"no-preference";

        cwd?: string;

        env?: { [key: string]: string; };

        executablePath?: string;

        extraHTTPHeaders?: { [key: string]: string; };

        geolocation?: {

            latitude: number;

            longitude: number;

            accuracy?: number;
        };

        httpCredentials?: {
            username: string;

            password: string;

            origin?: string;
        };

        ignoreHTTPSErrors?: boolean;

        locale?: string;

        offline?: boolean;

        recordHar?: {

            omitContent?: boolean;

            content?: "omit"|"embed"|"attach";

            path: string;

            mode?: "full"|"minimal";

            urlFilter?: string|RegExp;
        };

        recordVideo?: {

            dir: string;

            size?: {

                width: number;

                height: number;
            };
        };

        timeout?: number;

        timezoneId?: string;

        tracesDir?: string;
    }): Promise<ElectronApplication>;
}

export interface FileChooser {

    element(): ElementHandle;

    isMultiple(): boolean;

    page(): Page;

    setFiles(files: string|ReadonlyArray<string>|{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }|ReadonlyArray<{

        name: string;

        mimeType: string;

        buffer: Buffer;
    }>, options?: {

        noWaitAfter?: boolean;

        timeout?: number;
    }): Promise<void>;
}

export interface FrameLocator {

    first(): FrameLocator;

    frameLocator(selector: string): FrameLocator;

    getByAltText(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByLabel(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByPlaceholder(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByRole(role: "alert"|"alertdialog"|"application"|"article"|"banner"|"blockquote"|"button"|"caption"|"cell"|"checkbox"|"code"|"columnheader"|"combobox"|"complementary"|"contentinfo"|"definition"|"deletion"|"dialog"|"directory"|"document"|"emphasis"|"feed"|"figure"|"form"|"generic"|"grid"|"gridcell"|"group"|"heading"|"img"|"insertion"|"link"|"list"|"listbox"|"listitem"|"log"|"main"|"marquee"|"math"|"meter"|"menu"|"menubar"|"menuitem"|"menuitemcheckbox"|"menuitemradio"|"navigation"|"none"|"note"|"option"|"paragraph"|"presentation"|"progressbar"|"radio"|"radiogroup"|"region"|"row"|"rowgroup"|"rowheader"|"scrollbar"|"search"|"searchbox"|"separator"|"slider"|"spinbutton"|"status"|"strong"|"subscript"|"superscript"|"switch"|"tab"|"table"|"tablist"|"tabpanel"|"term"|"textbox"|"time"|"timer"|"toolbar"|"tooltip"|"tree"|"treegrid"|"treeitem", options?: {

        checked?: boolean;

        disabled?: boolean;

        exact?: boolean;

        expanded?: boolean;

        includeHidden?: boolean;

        level?: number;

        name?: string|RegExp;

        pressed?: boolean;

        selected?: boolean;
    }): Locator;

    getByTestId(testId: string|RegExp): Locator;

    getByText(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    getByTitle(text: string|RegExp, options?: {

        exact?: boolean;
    }): Locator;

    last(): FrameLocator;

    locator(selectorOrLocator: string|Locator, options?: {

        has?: Locator;

        hasNot?: Locator;

        hasNotText?: string|RegExp;

        hasText?: string|RegExp;
    }): Locator;

    nth(index: number): FrameLocator;

    owner(): Locator;
}

export interface Keyboard {

    down(key: string): Promise<void>;

    insertText(text: string): Promise<void>;

    press(key: string, options?: {

        delay?: number;
    }): Promise<void>;

    type(text: string, options?: {

        delay?: number;
    }): Promise<void>;

    up(key: string): Promise<void>;
}

export interface Logger {

    isEnabled(name: string, severity: "verbose"|"info"|"warning"|"error"): boolean;

    log(name: string, severity: "verbose"|"info"|"warning"|"error", message: string|Error, args: ReadonlyArray<Object>, hints: {

        color?: string;
    }): void;
}

export interface Mouse {

    click(x: number, y: number, options?: {

        button?: "left"|"right"|"middle";

        clickCount?: number;

        delay?: number;
    }): Promise<void>;

    dblclick(x: number, y: number, options?: {

        button?: "left"|"right"|"middle";

        delay?: number;
    }): Promise<void>;

    down(options?: {

        button?: "left"|"right"|"middle";

        clickCount?: number;
    }): Promise<void>;

    move(x: number, y: number, options?: {

        steps?: number;
    }): Promise<void>;

    up(options?: {

        button?: "left"|"right"|"middle";

        clickCount?: number;
    }): Promise<void>;

    wheel(deltaX: number, deltaY: number): Promise<void>;
}

export const chromium: BrowserType;

export const firefox: BrowserType;

export const request: APIRequest;

export const selectors: Selectors;

export const webkit: BrowserType;

export interface Request {

    allHeaders(): Promise<{ [key: string]: string; }>;

    failure(): null|{

        errorText: string;
    };

    frame(): Frame;

    headers(): { [key: string]: string; };

    headersArray(): Promise<Array<{

        name: string;

        value: string;
    }>>;

    headerValue(name: string): Promise<null|string>;

    isNavigationRequest(): boolean;

    method(): string;

    postData(): null|string;

    postDataBuffer(): null|Buffer;

    postDataJSON(): null|Serializable;

    redirectedFrom(): null|Request;

    redirectedTo(): null|Request;

    resourceType(): string;

    response(): Promise<null|Response>;

    serviceWorker(): null|Worker;

    sizes(): Promise<{

        requestBodySize: number;

        requestHeadersSize: number;

        responseBodySize: number;

        responseHeadersSize: number;
    }>;

    timing(): {

        startTime: number;

        domainLookupStart: number;

        domainLookupEnd: number;

        connectStart: number;

        secureConnectionStart: number;

        connectEnd: number;

        requestStart: number;

        responseStart: number;

        responseEnd: number;
    };

    url(): string;
}

export interface Response {

    allHeaders(): Promise<{ [key: string]: string; }>;

    body(): Promise<Buffer>;

    finished(): Promise<null|Error>;

    frame(): Frame;

    fromServiceWorker(): boolean;

    headers(): { [key: string]: string; };

    headersArray(): Promise<Array<{

        name: string;

        value: string;
    }>>;

    headerValue(name: string): Promise<null|string>;

    headerValues(name: string): Promise<Array<string>>;

    json(): Promise<Serializable>;

    ok(): boolean;

    request(): Request;

    securityDetails(): Promise<null|{

        issuer?: string;

        protocol?: string;

        subjectName?: string;

        validFrom?: number;

        validTo?: number;
    }>;

    serverAddr(): Promise<null|{

        ipAddress: string;

        port: number;
    }>;

    status(): number;

    statusText(): string;

    text(): Promise<string>;

    url(): string;
}

export interface Route {

    abort(errorCode?: string): Promise<void>;

    continue(options?: {

        headers?: { [key: string]: string; };

        method?: string;

        postData?: string|Buffer|Serializable;

        url?: string;
    }): Promise<void>;

    fallback(options?: {

        headers?: { [key: string]: string; };

        method?: string;

        postData?: string|Buffer|Serializable;

        url?: string;
    }): Promise<void>;

    fetch(options?: {

        headers?: { [key: string]: string; };

        maxRedirects?: number;

        method?: string;

        postData?: string|Buffer|Serializable;

        timeout?: number;

        url?: string;
    }): Promise<APIResponse>;

    fulfill(options?: {

        body?: string|Buffer;

        contentType?: string;

        headers?: { [key: string]: string; };

        json?: Serializable;

        path?: string;

        response?: APIResponse;

        status?: number;
    }): Promise<void>;

    request(): Request;
}

export interface Selectors {

    register(name: string, script: Function|string|{

        path?: string;

        content?: string;
    }, options?: {

        contentScript?: boolean;
    }): Promise<void>;

    setTestIdAttribute(attributeName: string): void;
}

export interface Touchscreen {

    tap(x: number, y: number): Promise<void>;
}

export interface Tracing {

    start(options?: {

        name?: string;

        screenshots?: boolean;

        snapshots?: boolean;

        sources?: boolean;

        title?: string;
    }): Promise<void>;

    startChunk(options?: {

        name?: string;

        title?: string;
    }): Promise<void>;

    stop(options?: {

        path?: string;
    }): Promise<void>;

    stopChunk(options?: {

        path?: string;
    }): Promise<void>;
}

export interface Video {

    delete(): Promise<void>;

    path(): Promise<string>;

    saveAs(path: string): Promise<void>;
}

export interface WebError {

    error(): Error;

    page(): null|Page;
}

export interface WebSocket {

    on(event: 'close', listener: (webSocket: WebSocket) => void): this;

    on(event: 'framereceived', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    on(event: 'framesent', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    on(event: 'socketerror', listener: (string: string) => void): this;

    once(event: 'close', listener: (webSocket: WebSocket) => void): this;

    once(event: 'framereceived', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    once(event: 'framesent', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    once(event: 'socketerror', listener: (string: string) => void): this;

    addListener(event: 'close', listener: (webSocket: WebSocket) => void): this;

    addListener(event: 'framereceived', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    addListener(event: 'framesent', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    addListener(event: 'socketerror', listener: (string: string) => void): this;

    removeListener(event: 'close', listener: (webSocket: WebSocket) => void): this;

    removeListener(event: 'framereceived', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    removeListener(event: 'framesent', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    removeListener(event: 'socketerror', listener: (string: string) => void): this;

    off(event: 'close', listener: (webSocket: WebSocket) => void): this;

    off(event: 'framereceived', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    off(event: 'framesent', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    off(event: 'socketerror', listener: (string: string) => void): this;

    prependListener(event: 'close', listener: (webSocket: WebSocket) => void): this;

    prependListener(event: 'framereceived', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    prependListener(event: 'framesent', listener: (data: {

        payload: string|Buffer;
    }) => void): this;

    prependListener(event: 'socketerror', listener: (string: string) => void): this;

    isClosed(): boolean;

    url(): string;

    waitForEvent(event: 'close', optionsOrPredicate?: { predicate?: (webSocket: WebSocket) => boolean | Promise<boolean>, timeout?: number } | ((webSocket: WebSocket) => boolean | Promise<boolean>)): Promise<WebSocket>;

    waitForEvent(event: 'framereceived', optionsOrPredicate?: { predicate?: (data: {

            payload: string|Buffer;
        }) => boolean | Promise<boolean>, timeout?: number } | ((data: {

        payload: string|Buffer;
    }) => boolean | Promise<boolean>)): Promise<{

        payload: string|Buffer;
    }>;

    waitForEvent(event: 'framesent', optionsOrPredicate?: { predicate?: (data: {

            payload: string|Buffer;
        }) => boolean | Promise<boolean>, timeout?: number } | ((data: {

        payload: string|Buffer;
    }) => boolean | Promise<boolean>)): Promise<{

        payload: string|Buffer;
    }>;

    waitForEvent(event: 'socketerror', optionsOrPredicate?: { predicate?: (string: string) => boolean | Promise<boolean>, timeout?: number } | ((string: string) => boolean | Promise<boolean>)): Promise<string>;

}

export interface BrowserContextOptions {

    acceptDownloads?: boolean;

    baseURL?: string;

    bypassCSP?: boolean;

    colorScheme?: null|"light"|"dark"|"no-preference";

    deviceScaleFactor?: number;

    extraHTTPHeaders?: { [key: string]: string; };

    forcedColors?: null|"active"|"none";

    geolocation?: Geolocation;

    hasTouch?: boolean;

    httpCredentials?: HTTPCredentials;

    ignoreHTTPSErrors?: boolean;

    isMobile?: boolean;

    javaScriptEnabled?: boolean;

    locale?: string;

    logger?: Logger;

    offline?: boolean;

    permissions?: Array<string>;

    proxy?: {

        server: string;

        bypass?: string;

        username?: string;

        password?: string;
    };

    recordHar?: {

        omitContent?: boolean;

        content?: "omit"|"embed"|"attach";

        path: string;

        mode?: "full"|"minimal";

        urlFilter?: string|RegExp;
    };

    recordVideo?: {

        dir: string;

        size?: {

            width: number;

            height: number;
        };
    };

    reducedMotion?: null|"reduce"|"no-preference";

    screen?: {

        width: number;

        height: number;
    };

    serviceWorkers?: "allow"|"block";

    storageState?: string|{

        cookies: Array<{
            name: string;

            value: string;

            domain: string;

            path: string;

            expires: number;

            httpOnly: boolean;

            secure: boolean;

            sameSite: "Strict"|"Lax"|"None";
        }>;

        origins: Array<{
            origin: string;

            localStorage: Array<{
                name: string;

                value: string;
            }>;
        }>;
    };

    strictSelectors?: boolean;

    timezoneId?: string;

    userAgent?: string;

    videoSize?: {

        width: number;

        height: number;
    };

    videosPath?: string;

    viewport?: null|ViewportSize;
}

export interface ViewportSize {

    width: number;

    height: number;
}

export interface HTTPCredentials {
    username: string;

    password: string;

    origin?: string;
}

export interface Geolocation {

    latitude: number;

    longitude: number;

    accuracy?: number;
}

interface AccessibilitySnapshotOptions {

    interestingOnly?: boolean;

    root?: ElementHandle;
}

export interface LaunchOptions {

    args?: Array<string>;

    channel?: string;

    chromiumSandbox?: boolean;

    devtools?: boolean;

    downloadsPath?: string;

    env?: { [key: string]: string|number|boolean; };

    executablePath?: string;

    firefoxUserPrefs?: { [key: string]: string|number|boolean; };

    handleSIGHUP?: boolean;

    handleSIGINT?: boolean;

    handleSIGTERM?: boolean;

    headless?: boolean;

    ignoreDefaultArgs?: boolean|Array<string>;

    logger?: Logger;

    proxy?: {

        server: string;

        bypass?: string;

        username?: string;

        password?: string;
    };

    slowMo?: number;

    timeout?: number;

    tracesDir?: string;
}

export interface ConnectOverCDPOptions {

    endpointURL?: string;

    headers?: { [key: string]: string; };

    logger?: Logger;

    slowMo?: number;

    timeout?: number;
}

export interface ConnectOptions {

    exposeNetwork?: string;

    headers?: { [key: string]: string; };

    logger?: Logger;

    slowMo?: number;

    timeout?: number;
}

export interface LocatorScreenshotOptions {

    animations?: "disabled"|"allow";

    caret?: "hide"|"initial";

    mask?: Array<Locator>;

    maskColor?: string;

    omitBackground?: boolean;

    path?: string;

    quality?: number;

    scale?: "css"|"device";

    style?: string;

    timeout?: number;

    type?: "png"|"jpeg";
}

interface ElementHandleWaitForSelectorOptions {

    state?: "attached"|"detached"|"visible"|"hidden";

    strict?: boolean;

    timeout?: number;
}

export interface Cookie {
    name: string;

    value: string;

    domain: string;

    path: string;

    expires: number;

    httpOnly: boolean;

    secure: boolean;

    sameSite: "Strict"|"Lax"|"None";
}

interface PageWaitForSelectorOptions {

    state?: "attached"|"detached"|"visible"|"hidden";

    strict?: boolean;

    timeout?: number;
}

interface PageWaitForFunctionOptions {

    polling?: number|"raf";

    timeout?: number;
}

export interface PageScreenshotOptions {

    animations?: "disabled"|"allow";

    caret?: "hide"|"initial";

    clip?: {

        x: number;

        y: number;

        width: number;

        height: number;
    };

    fullPage?: boolean;

    mask?: Array<Locator>;

    maskColor?: string;

    omitBackground?: boolean;

    path?: string;

    quality?: number;

    scale?: "css"|"device";

    style?: string;

    timeout?: number;

    type?: "png"|"jpeg";
}

type Devices = {
    "Blackberry PlayBook": DeviceDescriptor;
    "Blackberry PlayBook landscape": DeviceDescriptor;
    "BlackBerry Z30": DeviceDescriptor;
    "BlackBerry Z30 landscape": DeviceDescriptor;
    "Galaxy Note 3": DeviceDescriptor;
    "Galaxy Note 3 landscape": DeviceDescriptor;
    "Galaxy Note II": DeviceDescriptor;
    "Galaxy Note II landscape": DeviceDescriptor;
    "Galaxy S III": DeviceDescriptor;
    "Galaxy S III landscape": DeviceDescriptor;
    "Galaxy S5": DeviceDescriptor;
    "Galaxy S5 landscape": DeviceDescriptor;
    "Galaxy S8": DeviceDescriptor;
    "Galaxy S8 landscape": DeviceDescriptor;
    "Galaxy S9+": DeviceDescriptor;
    "Galaxy S9+ landscape": DeviceDescriptor;
    "Galaxy Tab S4": DeviceDescriptor;
    "Galaxy Tab S4 landscape": DeviceDescriptor;
    "iPad (gen 5)": DeviceDescriptor;
    "iPad (gen 5) landscape": DeviceDescriptor;
    "iPad (gen 6)": DeviceDescriptor;
    "iPad (gen 6) landscape": DeviceDescriptor;
    "iPad (gen 7)": DeviceDescriptor;
    "iPad (gen 7) landscape": DeviceDescriptor;
    "iPad Mini": DeviceDescriptor;
    "iPad Mini landscape": DeviceDescriptor;
    "iPad Pro 11": DeviceDescriptor;
    "iPad Pro 11 landscape": DeviceDescriptor;
    "iPhone 6": DeviceDescriptor;
    "iPhone 6 landscape": DeviceDescriptor;
    "iPhone 6 Plus": DeviceDescriptor;
    "iPhone 6 Plus landscape": DeviceDescriptor;
    "iPhone 7": DeviceDescriptor;
    "iPhone 7 landscape": DeviceDescriptor;
    "iPhone 7 Plus": DeviceDescriptor;
    "iPhone 7 Plus landscape": DeviceDescriptor;
    "iPhone 8": DeviceDescriptor;
    "iPhone 8 landscape": DeviceDescriptor;
    "iPhone 8 Plus": DeviceDescriptor;
    "iPhone 8 Plus landscape": DeviceDescriptor;
    "iPhone SE": DeviceDescriptor;
    "iPhone SE landscape": DeviceDescriptor;
    "iPhone X": DeviceDescriptor;
    "iPhone X landscape": DeviceDescriptor;
    "iPhone XR": DeviceDescriptor;
    "iPhone XR landscape": DeviceDescriptor;
    "iPhone 11": DeviceDescriptor;
    "iPhone 11 landscape": DeviceDescriptor;
    "iPhone 11 Pro": DeviceDescriptor;
    "iPhone 11 Pro landscape": DeviceDescriptor;
    "iPhone 11 Pro Max": DeviceDescriptor;
    "iPhone 11 Pro Max landscape": DeviceDescriptor;
    "iPhone 12": DeviceDescriptor;
    "iPhone 12 landscape": DeviceDescriptor;
    "iPhone 12 Pro": DeviceDescriptor;
    "iPhone 12 Pro landscape": DeviceDescriptor;
    "iPhone 12 Pro Max": DeviceDescriptor;
    "iPhone 12 Pro Max landscape": DeviceDescriptor;
    "iPhone 12 Mini": DeviceDescriptor;
    "iPhone 12 Mini landscape": DeviceDescriptor;
    "iPhone 13": DeviceDescriptor;
    "iPhone 13 landscape": DeviceDescriptor;
    "iPhone 13 Pro": DeviceDescriptor;
    "iPhone 13 Pro landscape": DeviceDescriptor;
    "iPhone 13 Pro Max": DeviceDescriptor;
    "iPhone 13 Pro Max landscape": DeviceDescriptor;
    "iPhone 13 Mini": DeviceDescriptor;
    "iPhone 13 Mini landscape": DeviceDescriptor;
    "iPhone 14": DeviceDescriptor;
    "iPhone 14 landscape": DeviceDescriptor;
    "iPhone 14 Plus": DeviceDescriptor;
    "iPhone 14 Plus landscape": DeviceDescriptor;
    "iPhone 14 Pro": DeviceDescriptor;
    "iPhone 14 Pro landscape": DeviceDescriptor;
    "iPhone 14 Pro Max": DeviceDescriptor;
    "iPhone 14 Pro Max landscape": DeviceDescriptor;
    "Kindle Fire HDX": DeviceDescriptor;
    "Kindle Fire HDX landscape": DeviceDescriptor;
    "LG Optimus L70": DeviceDescriptor;
    "LG Optimus L70 landscape": DeviceDescriptor;
    "Microsoft Lumia 550": DeviceDescriptor;
    "Microsoft Lumia 550 landscape": DeviceDescriptor;
    "Microsoft Lumia 950": DeviceDescriptor;
    "Microsoft Lumia 950 landscape": DeviceDescriptor;
    "Nexus 10": DeviceDescriptor;
    "Nexus 10 landscape": DeviceDescriptor;
    "Nexus 4": DeviceDescriptor;
    "Nexus 4 landscape": DeviceDescriptor;
    "Nexus 5": DeviceDescriptor;
    "Nexus 5 landscape": DeviceDescriptor;
    "Nexus 5X": DeviceDescriptor;
    "Nexus 5X landscape": DeviceDescriptor;
    "Nexus 6": DeviceDescriptor;
    "Nexus 6 landscape": DeviceDescriptor;
    "Nexus 6P": DeviceDescriptor;
    "Nexus 6P landscape": DeviceDescriptor;
    "Nexus 7": DeviceDescriptor;
    "Nexus 7 landscape": DeviceDescriptor;
    "Nokia Lumia 520": DeviceDescriptor;
    "Nokia Lumia 520 landscape": DeviceDescriptor;
    "Nokia N9": DeviceDescriptor;
    "Nokia N9 landscape": DeviceDescriptor;
    "Pixel 2": DeviceDescriptor;
    "Pixel 2 landscape": DeviceDescriptor;
    "Pixel 2 XL": DeviceDescriptor;
    "Pixel 2 XL landscape": DeviceDescriptor;
    "Pixel 3": DeviceDescriptor;
    "Pixel 3 landscape": DeviceDescriptor;
    "Pixel 4": DeviceDescriptor;
    "Pixel 4 landscape": DeviceDescriptor;
    "Pixel 4a (5G)": DeviceDescriptor;
    "Pixel 4a (5G) landscape": DeviceDescriptor;
    "Pixel 5": DeviceDescriptor;
    "Pixel 5 landscape": DeviceDescriptor;
    "Pixel 7": DeviceDescriptor;
    "Pixel 7 landscape": DeviceDescriptor;
    "Moto G4": DeviceDescriptor;
    "Moto G4 landscape": DeviceDescriptor;
    "Desktop Chrome HiDPI": DeviceDescriptor;
    "Desktop Edge HiDPI": DeviceDescriptor;
    "Desktop Firefox HiDPI": DeviceDescriptor;
    "Desktop Safari": DeviceDescriptor;
    "Desktop Chrome": DeviceDescriptor;
    "Desktop Edge": DeviceDescriptor;
    "Desktop Firefox": DeviceDescriptor;
    [key: string]: DeviceDescriptor;
}

export interface ChromiumBrowserContext extends BrowserContext { }
export interface ChromiumBrowser extends Browser { }
export interface FirefoxBrowser extends Browser { }
export interface WebKitBrowser extends Browser { }
export interface ChromiumCoverage extends Coverage { }
      `
      ,
      'file:///node_modules/@types/playwright/index.d.ts'
  );

  // monaco.languages.typescript.typescriptDefaults.addExtraLib(
  //     'export declare function add(a: number, b: number): number',
  //     'file:///node_modules/@types/math/index.d.ts'
  // );

  const model = monaco.editor.createModel(
      `import * as playwright from 'playwright';\n`,
      'typescript',
      monaco.Uri.parse('file:///main.tsx')
  );
  ////////////////////////////////////////////////////////////////////////////////

  editor = monaco.editor.create(editorEl.value, {
    // value: getCurrentTab()?.code,
    language: 'typescript',
    automaticLayout: true,
    model,
  });

  editor.focus();

  editor.getModel()?.onDidChangeContent((e) => {
    const tab = getCurrentTab();
    if (tab) {
      tab.code = editor.getValue();
    }
  });

  editor.onKeyDown(e => {
    if (e.ctrlKey && e.code === 'Enter') {
      codeExecSend();
      e.stopPropagation();
    }
  });
});
</script>

<template>
  <div>
    <div style="display: flex; flex-wrap: wrap; margin: 3px 0 0 0;">
      <div v-for="(tab, i) in srcTabs.items" :key="tab.id" class="tab-button-wrapper">
        <Button
            :label="`Tab ${i + 1}`"
            class="tab-button"
            :severity="tab.id === srcTabs.currentId ? 'success' : 'secondary'"
            @click="selectTab(tab)"
        />
      </div>
      <div class="tab-button-wrapper">
        <Button icon="pi pi-plus" class="tab-button" @click="addTab" />
      </div>
      <div style="flex-grow: 1"></div>
      <Button
          class="close-tab-button icon-button"
          icon="pi pi-times"
          severity="danger"
          @click="closeCurrentTab"
      />
    </div>
    <div style="width: 100%; height: calc(100vh - 150px);">
      <div ref="editorEl" style="width: 100%; height: 100%;"></div>
    </div>
    <Button label="Execute (Ctrl+Enter)" @click="codeExecSend"></Button>
  </div>
</template>

<style lang="scss">
.tab-button-wrapper {
  margin: 0 3px 3px 0;
}

.tab-button.p-button {
  height: 32px;
  padding: 0 10px;
  font-size: 75%;

  span {
    font-weight: normal;
  }
}

.icon-button {
  width: 32px !important;
  height: 32px !important;
}

.close-tab-button {
  margin: 0 15px 3px 0 !important;
}

.monaco-editor, .overflow-guard {
  width: 100% !important;
}
</style>
