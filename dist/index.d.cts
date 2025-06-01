import { TemplateResult } from 'lit';

type ArgTypes = {
    [key: string]: ArgSettings;
};
type ArgSettings = {
    /** The name of the property. */
    name: string;
    type?: ArgSettingsType;
    defaultValue?: string | boolean | number | object;
    /** Sets a Markdown description for the property. */
    description?: string;
    table?: Table;
    control?: Control | ControlOptions | boolean;
    options?: string[];
};
type ArgSettingsType = {
    /** Sets a type for the property. */
    name?: string;
    /** Sets the property as optional or required. */
    required?: boolean;
};
type Table = {
    type?: TableType;
    defaultValue?: TableDefaultValue;
    /** Removes control from table. */
    disable?: boolean;
    /** Assigns control to control group */
    category?: "attributes" | "css properties" | "css shadow parts" | "css states" | "events" | "properties" | "methods" | "slots";
    /** Assigns the argTypes to a specific subcategory */
    subcategory?: string;
};
type TableType = {
    /** Provide a short version of the type. */
    summary?: string;
    /** Provides an extended version of the type. */
    detail?: string;
};
type TableDefaultValue = {
    /** Provide a short version of the default value. */
    summary?: string;
    /** Provides a longer version of the default value. */
    detail?: string;
};
type Control = {
    type: ControlOptions;
    min?: number;
    max?: number;
    step?: number;
    accept?: string;
};
type ControlOptions = "text" | "radio" | "select" | "boolean" | "number" | "color" | "date" | "object" | "file" | "inline-radio" | "check" | "inline-check" | "multi-select" | null;

type Categories = "attributes" | "cssParts" | "cssProps" | "cssStates" | "events" | "methods" | "properties" | "slots";
type Options = {
    /** hides the `arg ref` label on each control */
    hideArgRef?: boolean;
    /** sets the custom type reference in the Custom Elements Manifest */
    typeRef?: string;
    /** Adds a <script> tag where a `component` variable will reference the story's component */
    setComponentVariable?: boolean;
    /** renders default values for attributes and CSS properties */
    renderDefaultValues?: boolean;
    /** Category order */
    categoryOrder?: Array<Categories>;
};
type StoryOptions = {
    /** Categories to exclude from these stories */
    excludeCategories?: Array<Categories>;
    /** Adds a <script> tag where a `component` variable will reference the story's component */
    setComponentVariable?: boolean;
};
type StoryHelpers<T> = {
    args: Partial<T>;
    argTypes: ArgTypes;
    reactArgs: Record<string, unknown>;
    reactArgTypes: ArgTypes;
    events: string[];
    styleTemplate: (args?: Record<string, unknown>) => TemplateResult | "";
    template: (args?: Partial<T>, slot?: TemplateResult) => TemplateResult;
};

/**
 * sets the global config for the Storybook helpers
 * @param options
 */
declare function setStorybookHelpersConfig(options: Options): void;
/**
 * Gets Storybook helpers for a given component
 * @param tagName the tag name referenced in the Custom Elements Manifest
 * @returns An object containing the argTypes, reactArgTypes, events, styleTemplate, and template
 */
declare function getStorybookHelpers<T>(tagName: string, options?: StoryOptions): StoryHelpers<T>;

export { type Categories, type Options, type StoryHelpers, type StoryOptions, getStorybookHelpers, setStorybookHelpersConfig };
