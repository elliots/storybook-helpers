"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  getStorybookHelpers: () => getStorybookHelpers,
  setStorybookHelpersConfig: () => setStorybookHelpersConfig
});
module.exports = __toCommonJS(index_exports);

// src/spread.ts
var import_html = require("lit/html.js");
var import_directive = require("lit/directive.js");
var import_async_directive = require("lit/async-directive.js");
var SpreadPropsDirective = class extends import_async_directive.AsyncDirective {
  constructor() {
    super(...arguments);
    this.prevData = {};
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render(_spreadData) {
    return import_html.nothing;
  }
  update(part, [spreadData]) {
    if (this.element !== part.element) {
      this.element = part.element;
    }
    this.host = part.options?.host || this.element;
    this.apply(spreadData);
    this.groom(spreadData);
    this.prevData = { ...spreadData };
  }
  apply(data) {
    if (!data) return;
    const { prevData, element } = this;
    for (const key in data) {
      const value = data[key];
      if (value === prevData[key]) {
        continue;
      }
      safeSetProperty(element, key, value);
    }
  }
  groom(data) {
    const { prevData, element } = this;
    if (!prevData) return;
    for (const key in prevData) {
      if (!data || !(key in data) && element[key] === prevData[key]) {
        safeSetProperty(element, key, void 0);
      }
    }
  }
};
var spreadProps = (0, import_directive.directive)(SpreadPropsDirective);
var SpreadEventsDirective = class extends SpreadPropsDirective {
  constructor() {
    super(...arguments);
    this.eventData = {};
  }
  apply(data) {
    if (!data) return;
    for (const key in data) {
      const value = data[key];
      if (value === this.eventData[key]) {
        continue;
      }
      this.applyEvent(key, value);
    }
  }
  applyEvent(eventName, eventValue) {
    const { prevData, element } = this;
    this.eventData[eventName] = eventValue;
    const prevHandler = prevData[eventName];
    if (prevHandler) {
      element.removeEventListener(eventName, this, eventValue);
    }
    element.addEventListener(eventName, this, eventValue);
  }
  groom(data) {
    const { prevData, element } = this;
    if (!prevData) return;
    for (const key in prevData) {
      if (!data || !(key in data) && element[key] === prevData[key]) {
        this.groomEvent(key, prevData[key]);
      }
    }
  }
  groomEvent(eventName, eventValue) {
    const { element } = this;
    delete this.eventData[eventName];
    element.removeEventListener(eventName, this, eventValue);
  }
  handleEvent(event) {
    const value = this.eventData[event.type];
    if (typeof value === "function") {
      value.call(this.host, event);
    } else {
      value.handleEvent(event);
    }
  }
  disconnected() {
    const { eventData, element } = this;
    for (const key in eventData) {
      const name = key.slice(1);
      const value = eventData[key];
      element.removeEventListener(name, this, value);
    }
  }
  reconnected() {
    const { eventData, element } = this;
    for (const key in eventData) {
      const name = key.slice(1);
      const value = eventData[key];
      element.addEventListener(name, this, value);
    }
  }
};
var spreadEvents = (0, import_directive.directive)(SpreadEventsDirective);
var SpreadDirective = class extends SpreadEventsDirective {
  apply(data) {
    if (!data) return;
    const { prevData, element } = this;
    for (const key in data) {
      const value = data[key];
      if (value === prevData[key]) {
        continue;
      }
      const name = key.slice(1);
      switch (key[0]) {
        case "@":
          this.eventData[name] = value;
          this.applyEvent(name, value);
          break;
        case ".":
          safeSetProperty(element, name, value);
          break;
        case "?":
          if (value) {
            element.setAttribute(name, "");
          } else {
            element.removeAttribute(name);
          }
          break;
        default:
          if (value) {
            element.setAttribute(key, String(value));
          } else {
            element.removeAttribute(key);
          }
          break;
      }
    }
  }
  groom(data) {
    const { prevData, element } = this;
    if (!prevData) return;
    for (const key in prevData) {
      const name = key.slice(1);
      if (!data || !(key in data) && element[name] === prevData[key]) {
        switch (key[0]) {
          case "@":
            this.groomEvent(name, prevData[key]);
            break;
          case ".":
            safeSetProperty(element, name, void 0);
            break;
          case "?":
            element.removeAttribute(name);
            break;
          default:
            element.removeAttribute(key);
            break;
        }
      }
    }
  }
};
function safeSetProperty(element, name, value) {
  try {
    element[name] = value;
  } catch (error) {
    console.warn(
      `Could not set property "${name}" on ${element.tagName} because it has no "setter".`,
      error
    );
  }
}
var spread = (0, import_directive.directive)(SpreadDirective);

// src/html-templates.ts
var import_preview_api = require("storybook/preview-api");
var import_static_html = require("lit/static-html.js");
var import_unsafe_html = require("lit/directives/unsafe-html.js");

// node_modules/@wc-toolkit/cem-utilities/dist/index.js
var DOM_EVENTS = /* @__PURE__ */ new Set([
  "AnimationEvent",
  "BeforeUnloadEvent",
  "ClipboardEvent",
  "DragEvent",
  "Event",
  "FocusEvent",
  "HashChangeEvent",
  "InputEvent",
  "KeyboardEvent",
  "MessageEvent",
  "MouseEvent",
  "MutationObserver",
  "PageTransitionEvent",
  "PointerEvent",
  "PopStateEvent",
  "ProgressEvent",
  "StorageEvent",
  "TouchEvent",
  "TransitionEvent",
  "UIEvent",
  "WebGLContextEvent",
  "WheelEvent"
]);
var definitionExports = /* @__PURE__ */ new Map();
var components = [];
var manifest;
function getAllComponents(customElementsManifest, exclude = []) {
  if (areObjectsEqual(customElementsManifest, manifest)) {
    return components;
  }
  resetCache();
  manifest = customElementsManifest;
  getAllDefinitionExports(customElementsManifest);
  manifest.modules.forEach((module2) => {
    const ces = module2.declarations?.filter(
      (d) => d.customElement
    );
    if (ces?.length) {
      ces.forEach((ce) => {
        if (exclude?.includes(ce.name)) {
          return;
        }
        ce.modulePath = module2.path;
        ce.definitionPath = definitionExports.get(ce.name);
        if ("typeDefinitionPath" in module2 && module2.typeDefinitionPath) {
          ce.typeDefinitionPath = module2.typeDefinitionPath;
        }
        components.push(ce);
      });
    }
  });
  return components;
}
function resetCache() {
  components = [];
  manifest = void 0;
  definitionExports.clear();
}
function getComponentByTagName(customElementsManifest, tagName) {
  return getAllComponents(customElementsManifest).find(
    (c) => c?.tagName === tagName
  );
}
function getComponentPublicMethods(component) {
  const getParameter = (p) => p.name + getParamType(p) + getParamDefaultValue(p);
  const getParamType = (p) => p.type?.text ? `${p.optional ? "?" : ""}: ${p.type?.text}` : "";
  const getParamDefaultValue = (p) => p.default ? ` = ${p.default}` : "";
  return (
    // filter to return only public methods
    component?.members?.filter(
      (member) => member.kind === "method" && member.privacy !== "private" && member.privacy !== "protected" && !member.name.startsWith("#")
    )?.map((m) => {
      m.type = {
        text: `${m.name}(${m.parameters?.map((p) => getParameter(p)).join(", ") || ""}) => ${m.return?.type?.text || "void"}`
      };
      return m;
    })
  );
}
function getComponentEventsWithType(component, options3 = {}) {
  const events = component?.events?.map((e) => {
    const type = e[`${options3.customEventDetailTypePropName}`]?.text || e.type?.text;
    const eventType = options3.overrideCustomEventType ? type || "CustomEvent" : DOM_EVENTS.has(type) ? type : type && type !== "CustomEvent" ? `CustomEvent<${type}>` : "CustomEvent";
    return {
      ...e,
      type: {
        text: eventType
      }
    };
  });
  return events || [];
}
function getAllDefinitionExports(customElementsManifest) {
  customElementsManifest.modules.forEach((mod) => {
    const defExports = mod?.exports?.filter(
      (e) => e.kind === "custom-element-definition"
    );
    if (defExports?.length) {
      defExports.forEach((e) => {
        if (e.declaration.name) {
          definitionExports.set(e.declaration.name, mod.path);
        }
      });
    }
  });
}
function areObjectsEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null || typeof obj1 !== "object" || typeof obj2 !== "object") return false;
  if (Array.isArray(obj1) && Array.isArray(obj2)) {
    if (obj1.length !== obj2.length) return false;
    return obj1.every((item, index) => areObjectsEqual(item, obj2[index]));
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;
  if (!keys2.every((key) => key in obj1)) return false;
  return keys1.every((key) => {
    const val1 = obj1[key];
    const val2 = obj2[key];
    if (val1 === null && val2 === null) return true;
    if (val1 === null || val2 === null) return false;
    if (typeof val1 === "object" && typeof val2 === "object") {
      return areObjectsEqual(val1, val2);
    }
    return val1 === val2;
  });
}
function getMemberDescription(description, deprecated) {
  if (!deprecated) {
    return description || "";
  }
  const desc = description ? `- ${description}` : "";
  return typeof deprecated === "string" ? `@deprecated ${deprecated} ${desc}` : `@deprecated ${desc}`;
}
function removeQuotes(value) {
  return value.trim().replace(/^["'](.+(?=["']$))["']$/, "$1");
}

// src/cem-parser.ts
var options = {};
setTimeout(() => {
  options = globalThis?.__WC_STORYBOOK_HELPERS_CONFIG__ || {};
});
function getAttributesAndProperties(component, enabled = true) {
  const resets = {};
  const attrArgs = {};
  const propArgs = {};
  component?.members?.forEach((member) => {
    if (member.kind !== "field") {
      return;
    }
    const attribute = component.attributes?.find(
      (x) => member.name === x.fieldName
    );
    const propName = member.name;
    const args = attribute ? attrArgs : propArgs;
    resets[propName] = {
      name: propName,
      table: {
        disable: true
      }
    };
    if (member.privacy === "private" || member.privacy === "protected" || member.static) {
      return;
    }
    const name = attribute?.name || member.name;
    const type = options.typeRef ? member[`${options.typeRef}`]?.text || member?.type?.text : member?.type?.text;
    const propType = cleanUpType(type);
    const defaultValue = member.readonly ? void 0 : removeQuotes(member.default || "");
    const control = getControl(propType, attribute !== void 0);
    args[name] = {
      name,
      description: getDescription(
        member.description,
        propName,
        member.deprecated
      ),
      defaultValue: defaultValue ? defaultValue === "''" ? "" : control === "object" ? JSON.parse(formatToValidJson(defaultValue)) : defaultValue : void 0,
      control: enabled && !member.readonly ? {
        type: control
      } : false,
      table: {
        category: attribute ? "attributes" : "properties",
        defaultValue: {
          summary: defaultValue
        },
        type: {
          summary: type
        }
      }
    };
    const values = propType?.split("|");
    if (values && values?.length > 1) {
      args[name].options = values.map((x) => removeQuotes(x));
    }
  });
  return { resets, propArgs, attrArgs };
}
function getReactProperties(component, enabled = true) {
  const resets = {};
  const args = {};
  component?.members?.forEach((member) => {
    if (member.kind !== "field") {
      return;
    }
    resets[member.name] = {
      name: member.name,
      table: {
        disable: true
      }
    };
    if (member.privacy === "private" || member.privacy === "protected" || member.static) {
      return;
    }
    const type = options.typeRef ? member[`${options.typeRef}`]?.text || member?.type?.text : member?.type?.text;
    const propType = cleanUpType(type);
    const propName = `${member.name}`;
    const controlType = getControl(propType);
    args[propName] = {
      name: member.name,
      description: member.description,
      defaultValue: getDefaultValue(controlType, member.default),
      control: enabled && !member.readonly ? {
        type: controlType
      } : false,
      table: {
        category: "properties",
        defaultValue: {
          summary: removeQuotes(member.default || "")
        },
        type: {
          summary: type
        }
      }
    };
    const values = propType?.split("|");
    if (values && values?.length > 1) {
      args[propName].options = values.map((x) => removeQuotes(x));
    }
  });
  delete args["ref"];
  return { resets, args };
}
function getReactEvents(component) {
  const args = {};
  component?.events?.forEach((event) => {
    const eventName = `on${event.name}`;
    args[eventName] = {
      name: eventName,
      description: event.description,
      control: false,
      table: {
        category: "events"
      }
    };
  });
  return { args };
}
function getCssProperties(component, enabled = true) {
  const resets = {};
  const args = {};
  component?.cssProperties?.forEach((part) => {
    resets[part.name] = {
      name: part.name,
      table: {
        disable: true
      }
    };
  });
  component?.cssProperties?.forEach((property) => {
    args[property.name] = {
      name: property.name,
      description: property.description,
      defaultValue: property.default,
      control: enabled ? {
        type: property.name?.toLowerCase()?.includes("color") ? "color" : "text"
      } : false,
      table: {
        category: "css properties"
      }
    };
  });
  return { resets, args };
}
function getCssParts(component, enabled = true) {
  const resets = {};
  const args = {};
  component?.cssParts?.forEach((part) => {
    resets[part.name] = {
      name: part.name,
      table: {
        disable: true
      }
    };
    args[`${part.name}-part`] = {
      name: part.name,
      description: getDescription(
        part.description,
        enabled ? `${part.name}-part` : ""
      ),
      control: enabled ? "text" : false,
      table: {
        category: "css shadow parts"
      }
    };
  });
  return { resets, args };
}
function getCssStates(component, enabled = true) {
  const resets = {};
  const args = {};
  component?.cssStates?.forEach((state) => {
    resets[state.name] = {
      name: state.name,
      table: {
        disable: true
      }
    };
    args[`${state.name}-state`] = {
      name: state.name,
      description: getDescription(
        state.description,
        enabled ? `${state.name}-state` : ""
      ),
      control: enabled ? "text" : false,
      table: {
        category: "css states"
      }
    };
  });
  return { resets, args };
}
function getSlots(component, enabled = true) {
  const resets = {};
  const args = {};
  component?.slots?.forEach((slot) => {
    resets[slot.name] = {
      name: slot.name,
      table: {
        disable: true
      }
    };
    const slotName = slot.name || "default";
    args[`${slotName}-slot`] = {
      name: slotName,
      description: getDescription(
        slot.description,
        enabled ? `${slotName}-slot` : ""
      ),
      control: enabled ? "text" : false,
      table: {
        category: "slots"
      }
    };
  });
  return { resets, args };
}
function getEvents(component) {
  const args = {};
  const resets = {};
  component?.events?.forEach((event) => {
    resets[event.name] = {
      name: event.name,
      table: {
        disable: true
      }
    };
  });
  const events = getComponentEventsWithType(component);
  events?.forEach((event) => {
    args[`${event.name}-event`] = {
      name: event.name,
      description: event.description,
      control: false,
      table: {
        category: "events",
        type: {
          summary: event.type.text
        }
      }
    };
  });
  return { resets, args };
}
function getMethods(component) {
  const args = {};
  const methods = getComponentPublicMethods(component);
  methods?.forEach((method) => {
    args[`${method.name}-method`] = {
      name: method.name,
      description: method.description,
      control: false,
      table: {
        category: "methods",
        type: {
          summary: method.type.text
        }
      }
    };
  });
  return { args };
}
function getDefaultValue(controlType, defaultValue) {
  const initialValue = removeQuotes(defaultValue || "");
  return controlType === "boolean" ? initialValue === "true" : initialValue === "''" ? "" : initialValue;
}
function getControl(type, isAttribute = false) {
  if (!type) {
    return "text";
  }
  const lowerType = type.toLowerCase();
  const options3 = lowerType.split("|").map((x) => x.trim()).filter((x) => x !== "" && x !== "null" && x !== "undefined");
  if (isObject(lowerType) && !isAttribute) {
    return "object";
  }
  if (hasType(options3, "boolean")) {
    return "boolean";
  }
  if (hasType(options3, "number") && !hasType(options3, "string")) {
    return "number";
  }
  if (hasType(options3, "date")) {
    return "date";
  }
  return options3.length > 1 ? "select" : "text";
}
function isObject(type) {
  return type.includes("array") || type.includes("object") || type.includes("{") || type.includes("[") || type.includes("<");
}
function hasType(values = [], type) {
  return values?.find((value) => value === type) !== void 0;
}
function cleanUpType(type) {
  return !type ? "" : type.replace(" | undefined", "").replace(" | null", "").replace(" | void", "").replace(" | any", "").replace(" | unknown", "").replace(" | string & {}", "|").replace(" | (string & {})", "|").replace(" | string", "|").replace(" | number", "|").replace(" | boolean", "|").replace(" | object", "|").replace(" | Function", "|").replace(" | {}", "|").replace(" | []", "|");
}
function getDescription(description, argRef, deprecated) {
  let desc = getMemberDescription(description, deprecated);
  return options.hideArgRef || !argRef ? desc : desc += `


arg ref - \`${argRef}\``;
}
function formatToValidJson(input) {
  return input.replace(/'([^']+)'/g, '"$1"').replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":').replace(/,\s*(}|])/g, "$1");
}

// src/html-templates.ts
var argObserver;
var lastTagName;
var options2 = {};
setTimeout(() => {
  options2 = globalThis?.__WC_STORYBOOK_HELPERS_CONFIG__ || {};
});
function getTemplate(component, args, slot, argTypes, excludeCategories, setComponentVariable) {
  if (!args) {
    return import_static_html.html`<${(0, import_static_html.unsafeStatic)(component.tagName)}></${(0, import_static_html.unsafeStatic)(component.tagName)}>`;
  }
  if (component?.tagName !== lastTagName) {
    argObserver = void 0;
    lastTagName = component?.tagName;
  }
  const { attrOperators, propOperators, additionalAttrs } = getTemplateOperators(component, args, argTypes);
  const operators = { ...attrOperators, ...propOperators, ...additionalAttrs };
  const slotsTemplate = getSlotsTemplate(component, args, excludeCategories);
  syncControls(component);
  return import_static_html.html`${getStyleTemplate(component, args, excludeCategories)}
<${(0, import_static_html.unsafeStatic)(component.tagName)} ${spread(operators)}>${slotsTemplate}${slot || ""}</${(0, import_static_html.unsafeStatic)(component.tagName)}>
${options2.setComponentVariable || setComponentVariable ? (0, import_unsafe_html.unsafeHTML)(
    "<script>\n  window.component = document.querySelector(" + component.tagName + ");\n</script>"
  ) : ""}
`;
}
function getStyleTemplate(component, args, excludeCategories) {
  const cssPropertiesTemplate = excludeCategory("cssProps", excludeCategories) ? "" : getCssPropTemplate(component, args) || "";
  const cssPartsTemplate = excludeCategory("cssParts", excludeCategories) ? "" : getCssPartsTemplate(component, args) || "";
  const cssStatesTemplate = excludeCategory("cssStates", excludeCategories) ? "" : getCssStatesTemplate(component, args) || "";
  const template = [cssPropertiesTemplate, cssPartsTemplate, cssStatesTemplate].filter((x) => x.length).join("\n\n");
  return `${cssPropertiesTemplate}${cssPartsTemplate}${cssStatesTemplate}`.replace(
    /\s+/g,
    ""
  ) !== "" ? (0, import_unsafe_html.unsafeHTML)(`<style>
${template}
</style>`) : "";
}
function excludeCategory(category, excludeCategories) {
  return !options2.categoryOrder?.includes(category) || excludeCategories?.includes(category) || false;
}
function getTemplateOperators(component, args, argTypes) {
  const { propArgs, attrArgs } = getAttributesAndProperties(component);
  const attrOperators = {};
  const propOperators = {};
  const additionalAttrs = {};
  Object.keys(attrArgs).forEach((key) => {
    const attr = attrArgs[key];
    const attrName = attr.name;
    const attrValue = args[key];
    const prop = attr.control.type === "boolean" ? `?${attrName}` : attrName;
    if (attrValue !== attrArgs[key].defaultValue || options2.renderDefaultValues) {
      attrOperators[prop] = attrValue === "false" ? false : attrValue;
    } else {
      attrOperators[prop] = void 0;
    }
  });
  Object.keys(args).filter((key) => propArgs[key]).forEach((key) => {
    if (key.startsWith("on")) {
      return;
    }
    const propValue = args[key];
    propOperators[`.${key}`] = propValue;
  });
  Object.keys(args).filter((x) => !Object.keys(argTypes || {}).includes(x)).forEach((key) => {
    if (!key.startsWith("on") && typeof args[key] !== "function") {
      additionalAttrs[key] = args[key];
    }
  });
  return { attrOperators, propOperators, additionalAttrs };
}
function getCssPropTemplate(component, args) {
  if (!component?.cssProperties?.length) {
    return;
  }
  const { args: cssProperties } = getCssProperties(component);
  const values = Object.keys(cssProperties).map((key) => {
    const isDefaultValue = args[key] === cssProperties[key].defaultValue;
    const cssName = cssProperties[key].name;
    const cssValue = args[key];
    return cssValue && (!isDefaultValue || isDefaultValue && options2.renderDefaultValues) ? `    ${cssName}: ${cssValue}` : null;
  }).filter((value) => value !== null).join(";\n");
  return values ? `  ${component.tagName} {
${values};
  }` : "";
}
function getCssPartsTemplate(component, args) {
  if (!component?.cssParts?.length) {
    return;
  }
  const { args: cssParts } = getCssParts(component);
  return `${Object.keys(cssParts).filter((key) => key.endsWith("-part")).map((key) => {
    const cssPartName = cssParts[key].name;
    const cssPartValue = args[key];
    return cssPartValue.replace(/\s+/g, "") !== "" ? `  ${component?.tagName}::part(${cssPartName}) {
${cssPartValue.split(`
`).map((part) => `    ${part}`).join("\n")}
  }` : null;
  }).filter((value) => value !== null).join("\n\n")}`;
}
function getCssStatesTemplate(component, args) {
  if (!component?.cssStates?.length) {
    return;
  }
  const { args: cssStates } = getCssStates(component);
  return `${Object.keys(cssStates).filter((key) => key.endsWith("-state")).map((key) => {
    const cssStateName = cssStates[key].name;
    const cssStateValue = args[key];
    return cssStateValue.replace(/\s+/g, "") !== "" ? `  ${component?.tagName}:state(${cssStateName}) {
${cssStateValue.split(`
`).map((state) => `    ${state}`).join("\n")}
  }` : null;
  }).filter((value) => value !== null).join("\n\n")}`;
}
function getSlotsTemplate(component, args, excludeCategories) {
  if (!component?.slots?.length || excludeCategory("slots", excludeCategories)) {
    return;
  }
  const { args: slots } = getSlots(component);
  const slotTemplates = `${Object.keys(slots).filter((key) => key.endsWith("-slot")).map((key) => {
    const slotName = key === "default-slot" ? null : key.slice(0, -5);
    const slotValue = args[key];
    if (!slotName && slotValue) {
      return `  ${slotValue}`;
    }
    let slotContent = "";
    const container = document.createElement("div");
    container.innerHTML = slotValue;
    for (const child of container.childNodes) {
      if (child.textContent?.trim() === "" || child.textContent === "\n") {
        slotContent += child.textContent;
        continue;
      }
      if (child instanceof Text) {
        slotContent += `  <span slot=${slotName}>${child.textContent}</span>`;
      } else if (child instanceof Element) {
        child.setAttribute("slot", slotName);
        slotContent += `  ${child.outerHTML}`;
      }
    }
    return slotContent;
  }).filter((value) => value !== null && value !== "").join("\n")}`;
  return slotTemplates.trim() ? (0, import_static_html.unsafeStatic)(`
${slotTemplates}
`) : "";
}
function syncControls(component) {
  setArgObserver(component);
  setTimeout(() => {
    const selectedComponent = document.querySelector(component.tagName);
    argObserver?.observe(selectedComponent, {
      attributes: true
    });
  });
}
function setArgObserver(component) {
  let isUpdating = false;
  const updateArgs = (0, import_preview_api.useArgs)()[1];
  const { attrArgs: attributes } = getAttributesAndProperties(component);
  if (argObserver) {
    return;
  }
  argObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class" && isUpdating) {
        return;
      }
      isUpdating = true;
      const attribute = attributes[`${mutation.attributeName}`];
      if (attribute?.control === "boolean" || attribute?.control?.type === "boolean") {
        updateArgs({
          [`${mutation.attributeName}`]: mutation.target?.hasAttribute(mutation.attributeName || "")
        });
      } else {
        updateArgs({
          [`${mutation.attributeName}`]: mutation.target.getAttribute(mutation.attributeName || "")
        });
      }
      isUpdating = false;
    });
  });
}

// src/storybook-helpers.ts
var userOptions = globalThis?.__WC_STORYBOOK_HELPERS_CONFIG__ || {};
var defaultOptions = {
  typeRef: "parsedType",
  categoryOrder: [
    "attributes",
    "properties",
    "slots",
    "cssProps",
    "cssParts",
    "cssStates",
    "methods",
    "events"
  ]
};
function setStorybookHelpersConfig(options3) {
  options3 = { ...defaultOptions, ...options3 };
  globalThis.__WC_STORYBOOK_HELPERS_CONFIG__ = options3;
  userOptions = options3;
}
function getStorybookHelpers(tagName, options3) {
  userOptions = globalThis?.__WC_STORYBOOK_HELPERS_CONFIG__ || {};
  const cem = getManifest();
  const component = getComponent(cem, tagName);
  const eventNames = component?.events?.map((event) => event.name) || [];
  const argTypes = getArgTypes(component, options3?.excludeCategories || []);
  const helpers = {
    args: getArgs(argTypes),
    argTypes,
    reactArgs: getReactArgs(component),
    reactArgTypes: getReactProps(component),
    events: eventNames,
    styleTemplate: (args) => getStyleTemplate(component, args, options3?.excludeCategories || []),
    template: (args, slot) => getTemplate(
      component,
      args,
      slot,
      argTypes,
      options3?.excludeCategories || [],
      options3?.setComponentVariable
    )
  };
  return helpers;
}
function getManifest() {
  const cem = window.__STORYBOOK_CUSTOM_ELEMENTS_MANIFEST__;
  if (!cem) {
    throw new Error(
      `Custom Elements Manifest not found. Be sure to follow the pre-install steps in this guide:
https://www.npmjs.com/package/wc-storybook-helpers#before-you-install`
    );
  }
  return cem;
}
function getComponent(cem, tagName) {
  const component = getComponentByTagName(cem, tagName);
  if (!component) {
    throw new Error(
      `A component with the tag name "${tagName}" was not found in the Custom Elements Manifest. If it's missing in the CEM, it's often the result of a missing "@tag" or "@tagName" tag in the component's JSDoc.
Additional information can be found here:
https://custom-elements-manifest.open-wc.org/analyzer/getting-started/#supported-jsdoc`
    );
  }
  return component;
}
function getArgTypes(component, excludeCategories) {
  const cssProps = getCssProperties(component);
  const cssParts = getCssParts(component);
  const slots = getSlots(component);
  const attrsAndProps = getAttributesAndProperties(component);
  const events = getEvents(component);
  const cssStates = getCssStates(component);
  const methods = getMethods(component);
  const args = {
    attributes: attrsAndProps.attrArgs,
    cssParts: cssParts.args,
    cssProps: cssProps.args,
    cssStates: cssStates.args,
    events: events.args,
    methods: methods.args,
    properties: attrsAndProps.propArgs,
    slots: slots.args
  };
  const argTypes = {};
  Object.assign(
    argTypes,
    cssProps.resets,
    cssParts.resets,
    slots.resets,
    attrsAndProps.resets,
    events.resets,
    cssStates.resets,
    methods.resets
  );
  userOptions.categoryOrder?.forEach((category) => {
    if (excludeCategories?.includes(category)) return;
    Object.assign(argTypes, args[category]);
  });
  return argTypes;
}
function getArgs(argTypes) {
  const args = {};
  for (const [key, value] of Object.entries(argTypes)) {
    if (value?.control) {
      args[key] = getDefaultValue2(value.defaultValue) || "";
    }
  }
  return args;
}
function getDefaultValue2(value) {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
}
function getReactProps(component, excludeCategories) {
  const cssProps = getCssProperties(component);
  const cssParts = getCssParts(component);
  const slots = getSlots(component);
  const attrsAndProps = getReactProperties(component);
  const events = getReactEvents(component);
  const cssStates = getCssStates(component);
  const methods = getMethods(component);
  const options3 = globalThis?.__WC_STORYBOOK_HELPERS_CONFIG__ || {};
  const args = {
    cssParts: cssParts.args,
    cssProps: cssProps.args,
    cssStates: cssStates.args,
    events: events.args,
    methods: methods.args,
    properties: attrsAndProps.args,
    slots: slots.args
  };
  let argTypes = {
    ...cssProps.resets,
    ...cssParts.resets,
    ...slots.resets,
    ...attrsAndProps.resets,
    ...events.resets,
    ...cssStates.resets,
    ...methods.resets
  };
  options3.categoryOrder?.forEach(
    (category) => {
      if (excludeCategories?.includes(category)) return;
      argTypes = { ...argTypes, ...args[category] || {} };
    }
  );
  return argTypes;
}
function getReactArgs(component) {
  const args = getArgs(getReactProps(component));
  const events = Object.entries(getReactEvents(component)).map(([key]) => {
    return {
      [key]: () => {
      }
    };
  }).reduce((acc, value) => ({ ...acc, ...value }), {});
  return { ...args, ...events };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStorybookHelpers,
  setStorybookHelpersConfig
});
